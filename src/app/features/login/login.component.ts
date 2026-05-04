import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LucideAngularModule, ArrowRight, Loader2, User, Lock, Mountain } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="relative min-h-screen flex flex-col bg-paper dark:bg-paper-dark overflow-hidden">
      <!-- Video background: light theme -->
      <video
        class="absolute inset-0 w-full h-full object-cover pointer-events-none select-none dark:hidden"
        src="cordillera-light.mp4"
        autoplay
        loop
        [muted]="true"
        playsinline
        aria-hidden="true"
      ></video>
      <!-- Video background: dark theme -->
      <video
        class="absolute inset-0 w-full h-full object-cover pointer-events-none select-none hidden dark:block"
        src="cordillera-dark.mp4"
        autoplay
        loop
        [muted]="true"
        playsinline
        aria-hidden="true"
      ></video>

      <header class="relative z-10 px-6 lg:px-10 py-6 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <lucide-icon [name]="icons.Mountain" class="w-5 h-5 text-terracota"></lucide-icon>
          <span class="font-display text-lg tracking-tightest">Cordillera</span>
        </div>
        <span class="font-mono text-[10px] uppercase tracking-widest text-ink-soft dark:text-ink-dark-soft">
          v 1.0 · prueba técnica
        </span>
      </header>

      <main class="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        <div class="w-full max-w-md animate-slide-up">
          <div class="mb-10">
            <p class="label-mono text-terracota mb-4">acceso</p>
            <h1 class="display-xl mb-4 leading-[0.95]">
              Bienvenido <em class="not-italic text-terracota">de vuelta</em>.
            </h1>
            <p class="text-ink-soft dark:text-ink-dark-soft leading-relaxed max-w-sm">
              Ingresa tus credenciales para administrar tu directorio de contactos.
            </p>
          </div>

          <form
            [formGroup]="form"
            (ngSubmit)="enviar()"
            class="space-y-5 bg-paper/80 dark:bg-paper-dark/80 backdrop-blur-sm hairline-border p-7"
            novalidate
          >
            <label class="block">
              <span class="label-mono text-ink-soft dark:text-ink-dark-soft mb-2 block">usuario</span>
              <div class="relative">
                <lucide-icon
                  [name]="icons.User"
                  class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft dark:text-ink-dark-soft pointer-events-none"
                ></lucide-icon>
                <input
                  type="text"
                  formControlName="usuario"
                  autocomplete="username"
                  placeholder="admin / crea / consulta"
                  class="w-full bg-paper dark:bg-paper-dark hairline-border px-10 py-3 text-ink dark:text-ink-dark placeholder:text-ink-soft/50 focus-ring focus:border-terracota"
                />
              </div>
              @if (mostrarError('usuario')) {
                <span class="block mt-1.5 text-xs text-error">Usuario requerido</span>
              }
            </label>

            <label class="block">
              <span class="label-mono text-ink-soft dark:text-ink-dark-soft mb-2 block">clave</span>
              <div class="relative">
                <lucide-icon
                  [name]="icons.Lock"
                  class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft dark:text-ink-dark-soft pointer-events-none"
                ></lucide-icon>
                <input
                  type="password"
                  formControlName="clave"
                  autocomplete="current-password"
                  placeholder="• • •"
                  class="w-full bg-paper dark:bg-paper-dark hairline-border px-10 py-3 text-ink dark:text-ink-dark placeholder:text-ink-soft/50 focus-ring focus:border-terracota"
                />
              </div>
              @if (mostrarError('clave')) {
                <span class="block mt-1.5 text-xs text-error">Clave requerida</span>
              }
            </label>

            <button
              type="submit"
              [disabled]="cargando()"
              class="w-full bg-ink dark:bg-ink-dark text-paper dark:text-paper-dark py-3 px-5 hover:bg-terracota dark:hover:bg-terracota dark:hover:text-paper transition-colors flex items-center justify-center gap-2 focus-ring disabled:opacity-50"
            >
              @if (cargando()) {
                <lucide-icon [name]="icons.Loader2" class="w-4 h-4 animate-spin"></lucide-icon>
                <span class="text-sm tracking-wide">Verificando…</span>
              } @else {
                <span class="text-sm tracking-wide">Entrar</span>
                <lucide-icon [name]="icons.ArrowRight" class="w-4 h-4"></lucide-icon>
              }
            </button>
          </form>

          <div class="mt-8 hairline-border bg-paper-deep/50 dark:bg-stone-dark/30 p-4">
            <p class="label-mono text-ink-soft dark:text-ink-dark-soft mb-2">credenciales de prueba</p>
            <ul class="space-y-1.5 font-mono text-xs">
              <li class="flex justify-between">
                <span class="text-ink dark:text-ink-dark">admin · 123</span>
                <span class="text-terracota">perfil 1 · admin</span>
              </li>
              <li class="flex justify-between">
                <span class="text-ink dark:text-ink-dark">crea · 123</span>
                <span class="text-terracota">perfil 2 · editor</span>
              </li>
              <li class="flex justify-between">
                <span class="text-ink dark:text-ink-dark">consulta · 123</span>
                <span class="text-terracota">perfil 3 · solo lectura</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly icons = { ArrowRight, Loader2, User, Lock, Mountain };
  readonly cargando = signal(false);

  readonly form = this.fb.nonNullable.group({
    usuario: ['', [Validators.required]],
    clave: ['', [Validators.required]]
  });

  mostrarError(campo: 'usuario' | 'clave'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.dirty || c.touched);
  }

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    const { usuario, clave } = this.form.getRawValue();
    this.auth.login({ usuario, clave }).subscribe({
      next: (sesion) => {
        this.cargando.set(false);
        this.toast.success(`Bienvenido, ${sesion.nombre} ${sesion.apellido}`);
        const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/contactos';
        this.router.navigateByUrl(redirect);
      },
      error: (err: Error) => {
        this.cargando.set(false);
        const msg = err?.message || 'No se pudo iniciar sesión';
        this.toast.error(msg);
      }
    });
  }
}
