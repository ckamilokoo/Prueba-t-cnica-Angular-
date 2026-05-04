# Cordillera · Gestión de Contactos

Prueba técnica · Angular 18 · Login + CRUD Contactos con perfiles RBAC.

---

## 📄 Enunciado de la prueba

El documento con el enunciado completo (cuestionario SQL Server + requisitos Angular) está en:

```
docs/Prueba técnica Angular 18.docx
```

---

## ⚡ Cómo correr

```bash
cd contactos-app
npm install     # solo la primera vez
ng serve --open
```

App disponible en `http://localhost:4200`.

### Build de producción

```bash
ng build
```

Salida en `dist/contactos-app/`.

---

## 🔑 Credenciales de prueba

| Usuario | Clave | Perfil | Permisos |
|---------|-------|--------|----------|
| `admin` | `123` | 1 — Administrador | Crear · Editar · Eliminar |
| `crea` | `123` | 2 — Editor | Crear · Editar |
| `consulta` | `123` | 3 — Solo lectura | Solo ver |

---

## 🏛️ Arquitectura

```
src/app/
├── core/                    # Infraestructura compartida
│   ├── services/
│   │   ├── base-api.service.ts        # ABSTRACT — herencia (extends)
│   │   ├── auth.service.ts            # extends BaseApiService
│   │   ├── contactos.service.ts       # extends BaseApiService
│   │   ├── session.service.ts         # localStorage + signals
│   │   ├── token.service.ts           # genera token local (cliente)
│   │   ├── toast.service.ts
│   │   └── theme.service.ts
│   ├── guards/
│   │   ├── auth.guard.ts              # CanActivateFn (funcional)
│   │   └── role.guard.ts              # CanActivateFn con data.perfiles
│   ├── interceptors/
│   │   └── auth.interceptor.ts        # HttpInterceptorFn (Bearer)
│   ├── directives/
│   │   └── has-perfil.directive.ts    # *appHasPerfil="['1','2']"
│   └── pipes/
│       └── rut-chileno.pipe.ts
├── shared/
│   ├── models/                        # Tipos TS
│   └── ui/                            # Componentes presentacionales
├── layout/
│   └── shell.component.ts             # Header global con logout/theme
└── features/
    ├── login/
    └── contactos/
        ├── lista/
        └── form/                      # nuevo + editar (reusa)
```

---

## ✅ Cumplimiento de requisitos

| Requisito | Implementación |
|-----------|----------------|
| Angular 18 con routing | `app.routes.ts` con lazy loading |
| Standalone components | default Angular 18 |
| Reactive Forms | Login + Form contacto |
| AuthGuard | `core/guards/auth.guard.ts` (CanActivateFn) |
| HttpInterceptor | `core/interceptors/auth.interceptor.ts` (HttpInterceptorFn) inyecta `Authorization: Bearer <token>` |
| Sesión en localStorage | `SessionService` con `token + idUsuario + perfil + nombre + apellido + emitidoEn + expiraEn` |
| Token generado en Angular | `TokenService.generar()` produce JWT-like (header.payload.signature) tras login OK |
| Servicios separados | `AuthService` y `ContactosService` independientes |
| **Herencia (extends)** | `BaseApiService` (abstract) + `AuthService extends BaseApiService` + `ContactosService extends BaseApiService` |
| Permisos por perfil | Directiva `*appHasPerfil`, `RoleGuard` y matriz: |

### Matriz de permisos

| Acción | Perfil 1 | Perfil 2 | Perfil 3 |
|--------|----------|----------|----------|
| Ver lista | ✓ | ✓ | ✓ |
| Botón Nuevo | ✓ | ✓ | ✗ |
| Botón Editar | ✓ | ✓ | ✗ |
| Botón Eliminar | ✓ | ✗ | ✗ |
| Ruta `/contactos/nuevo` | ✓ | ✓ | bloqueado por RoleGuard |
| Ruta `/contactos/:id/editar` | ✓ | ✓ | bloqueado por RoleGuard |

---

## 🎨 Sistema de Diseño · MUJI × Cordillera

Dirección visual: minimalismo cálido latinoamericano (Kenya Hara × territorio chileno).

### Tokens (Tailwind config)

| Token | Light | Dark |
|-------|-------|------|
| `paper` | `#F5F1E8` (papel sin blanquear) | `#14110D` |
| `ink` | `#1A1815` (tinta café) | `#F0EAD8` |
| `terracota` | `#C04A1A` (tierra cordillera) | mismo |
| `stone` | `#9CA3A6` | `#3A352D` |

### Tipografía

- **Display:** Newsreader (serif con itálica) — headlines
- **Body:** Inter — texto general
- **Mono:** IBM Plex Mono — IDs, RUT, teléfonos, labels

### Detalles firma

- Silueta de cordillera SVG en background del Login (opacity 0.08)
- RUT formateado chileno (`12.345.678-9`) via pipe `rutChileno`
- Avatar con iniciales + paleta tierra (hash determinístico)
- Confirmación de Delete inline (slide-out, no modal de browser)
- Modo oscuro con persistencia en localStorage
- Empty state ilustrado con cordillera minimalista
- Microinteracciones: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quart estilo Apple)

---

## 🌐 API · Notas importantes

La API entregada tiene comportamientos no-estándar manejados explícitamente:

| Comportamiento | Manejo |
|---------------|--------|
| Login fallido devuelve HTTP 200 con `idUsuario:"0"` | `AuthService` valida `idUsuario !== '0'` y lanza error |
| Crear/Update/Delete devuelven `"1"`/`"0"`/`""` (string) | `ContactosService.parseFlag()` convierte a boolean |
| Detalle devuelve array de 1 elemento | `.pipe(map(arr => arr[0] ?? null))` |
| Crear no devuelve idContacto generado | Se re-lista tras crear |
| Update **no** acepta `rutContacto` | Form de edición tiene RUT como `readonly` |
| Delete por POST (no DELETE) | Convención respetada en service |
| Lista no filtra por usuario (pool global) | Comportamiento de servidor; la app solo invoca |

### CORS

API responde `Access-Control-Allow-Origin: *` con preflight para POST y GET con `Authorization`. Localhost:4200 funciona sin proxy.

### Token

La API **no entrega token**. Se genera localmente tras login exitoso:

```
header(b64) . payload(b64) . signature(b64)
```

Payload: `{ sub, perfil, iat, jti }`. **No es JWT real** — la API ignora el header `Authorization`. Cumple el requisito de prueba: persistir en localStorage, viajar en header via interceptor, servir como llave de sesión.

TTL configurable en `environment.ts` (`tokenTtlMinutes`, default 60). La sesión expira automáticamente en cliente.

---

## 🧪 Cómo probar

1. Levantar app: `ng serve --open`
2. Probar login con cada credencial de la tabla.
3. En lista de contactos, validar visibilidad de botones:
   - **admin** → ve botón "Nuevo", Editar (lápiz) y Eliminar (basura)
   - **crea** → ve "Nuevo" y Editar; **no** ve Eliminar
   - **consulta** → solo lee tabla; sin botones de acción
4. Intentar acceder manualmente a `/contactos/nuevo` con perfil 3 → redirige y muestra toast.
5. Crear contacto, editar, eliminar (con perfil 1).
6. Toggle de modo oscuro persiste tras refresh.
7. Cerrar sesión limpia localStorage y redirige a `/login`.

---

## 📦 Stack

- Angular 18 (standalone, signals, control flow `@if/@for`)
- TypeScript strict
- Tailwind CSS v3 + tokens custom
- Lucide Icons (Angular)
- RxJS para HTTP
- Reactive Forms

Sin dependencias UI tipo Material/PrimeNG — todo el chrome es propio para evitar look genérico.

---

## 🚧 Decisiones técnicas

- **Standalone components:** sin NgModules, default Angular 18.
- **Signals nativos:** `SessionService` y `ToastService` exponen state como signals — re-renders automáticos sin manual subscribe.
- **Funcional > class-based:** guards y interceptors usan `CanActivateFn` y `HttpInterceptorFn`.
- **Lazy loading:** cada feature (login, lista, form) carga su chunk al navegar.
- **`OnPush` en componentes presentacionales** + signals = performance default.
- **No NgRx:** state local en signals + servicios injectables.

---

## 🔒 Seguridad

- Token en localStorage es vulnerable a XSS — aceptable para prueba; en producción se usaría `HttpOnly` cookie via backend real.
- AuthGuard valida sesión + expiración antes de cada ruta protegida.
- RoleGuard valida perfil antes de rutas con escritura.
- Directiva `*appHasPerfil` esconde UI; lógica de servidor sería el último gate (la API actual no valida perfil — limitación entregada).
