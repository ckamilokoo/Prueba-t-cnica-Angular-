import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Plus, Pencil, Trash2, Search, RefreshCw, X, AlertTriangle } from 'lucide-angular';
import { ContactosService } from '../../../core/services/contactos.service';
import { ToastService } from '../../../core/services/toast.service';
import { SessionService } from '../../../core/services/session.service';
import { HasPerfilDirective } from '../../../core/directives/has-perfil.directive';
import { RutChilenoPipe } from '../../../core/pipes/rut-chileno.pipe';
import { ContactoListItem } from '../../../shared/models/contacto.model';
import { EmptyStateComponent } from '../../../shared/ui/empty-state.component';

@Component({
  selector: 'app-lista',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    RouterLink,
    LucideAngularModule,
    HasPerfilDirective,
    RutChilenoPipe,
    EmptyStateComponent
  ],
  template: `
    <section class="animate-fade-in">
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div class="max-w-xl">
          <p class="label-mono text-terracota mb-3">directorio</p>
          <h1 class="display-xl mb-3 leading-[0.95]">
            Contactos
            <em class="not-italic text-ink-soft dark:text-ink-dark-soft">·</em>
            <span class="font-mono text-[0.5em] align-middle text-ink-soft dark:text-ink-dark-soft">
              {{ totalFiltrado() }} / {{ total() }}
            </span>
          </h1>
          <p class="text-ink-soft dark:text-ink-dark-soft leading-relaxed">
            Administra el directorio compartido. Los permisos disponibles dependen de tu perfil.
          </p>
        </div>

        <div class="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            (click)="recargar()"
            class="p-2.5 hairline-border hover:bg-paper-deep dark:hover:bg-stone-dark text-ink-soft hover:text-ink dark:text-ink-dark-soft dark:hover:text-ink-dark transition-colors focus-ring"
            title="Recargar"
            [disabled]="cargando()"
          >
            <lucide-icon
              [name]="icons.RefreshCw"
              class="w-4 h-4"
              [class.animate-spin]="cargando()"
            ></lucide-icon>
          </button>

          <a
            *appHasPerfil="['1', '2']"
            routerLink="/contactos/nuevo"
            class="inline-flex items-center gap-2 bg-terracota text-paper px-5 py-2.5 hover:bg-terracota-deep transition-colors focus-ring"
          >
            <lucide-icon [name]="icons.Plus" class="w-4 h-4"></lucide-icon>
            <span class="text-sm tracking-wide">Nuevo contacto</span>
          </a>
        </div>
      </header>

      <div class="relative mb-6">
        <lucide-icon
          [name]="icons.Search"
          class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft dark:text-ink-dark-soft pointer-events-none"
        ></lucide-icon>
        <input
          type="text"
          [(ngModel)]="busquedaModel"
          (ngModelChange)="busqueda.set($event)"
          placeholder="Buscar por nombre o RUT…"
          class="w-full bg-paper dark:bg-paper-dark hairline-border px-10 py-3 text-ink dark:text-ink-dark placeholder:text-ink-soft/50 focus-ring focus:border-terracota"
        />
        @if (busqueda()) {
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink dark:text-ink-dark-soft dark:hover:text-ink-dark focus-ring"
            (click)="limpiarBusqueda()"
            aria-label="Limpiar búsqueda"
          >
            <lucide-icon [name]="icons.X" class="w-4 h-4"></lucide-icon>
          </button>
        }
      </div>

      @if (cargando() && total() === 0) {
        <div class="space-y-px">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="hairline bg-paper-deep/40 dark:bg-stone-dark/30 h-16 animate-pulse"></div>
          }
        </div>
      } @else if (totalFiltrado() === 0 && busqueda()) {
        <app-empty-state
          [titulo]="'Sin coincidencias'"
          [mensaje]="'Probá con otro nombre o RUT.'"
        ></app-empty-state>
      } @else if (total() === 0) {
        <app-empty-state
          [titulo]="'Tu directorio está silencioso'"
          [mensaje]="'Aún no hay contactos. Si tu perfil lo permite, agrega el primero.'"
          [cta]="puedeCrear()"
        >
          <a
            routerLink="/contactos/nuevo"
            class="inline-flex items-center gap-2 bg-terracota text-paper px-5 py-2.5 hover:bg-terracota-deep transition-colors focus-ring"
          >
            <lucide-icon [name]="icons.Plus" class="w-4 h-4"></lucide-icon>
            <span class="text-sm tracking-wide">Crear contacto</span>
          </a>
        </app-empty-state>
      } @else {
        <div class="overflow-x-auto hairline-border bg-paper dark:bg-paper-dark">
          <table class="w-full border-collapse">
            <thead>
              <tr class="hairline">
                <th class="text-left py-3 px-5 label-mono text-ink-soft dark:text-ink-dark-soft font-normal">id</th>
                <th class="text-left py-3 px-5 label-mono text-ink-soft dark:text-ink-dark-soft font-normal">contacto</th>
                <th class="text-left py-3 px-5 label-mono text-ink-soft dark:text-ink-dark-soft font-normal">rut</th>
                <th class="text-right py-3 px-5 label-mono text-ink-soft dark:text-ink-dark-soft font-normal">acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (c of contactosFiltrados(); track c.idContacto) {
                <tr [class]="filaClases(c)">
                  <td class="py-4 px-5 font-mono text-xs text-ink-soft dark:text-ink-dark-soft tabular-nums">
                    {{ c.idContacto }}
                  </td>
                  <td class="py-4 px-5">
                    <div class="flex items-center gap-3.5">
                      <span class="w-1 h-1 rounded-full bg-terracota flex-shrink-0" aria-hidden="true"></span>
                      <span class="text-sm text-ink dark:text-ink-dark">{{ c.nombreContacto }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-5 font-mono text-sm text-ink-soft dark:text-ink-dark-soft tabular-nums">
                    {{ c.rutContacto | rutChileno }}
                  </td>
                  <td class="py-4 px-5">
                    @if (confirmandoDelete() === c.idContacto) {
                      <div class="flex items-center justify-end gap-2 animate-slide-in-right">
                        <span class="flex items-center gap-1.5 text-xs text-error mr-2">
                          <lucide-icon [name]="icons.AlertTriangle" class="w-3.5 h-3.5"></lucide-icon>
                          ¿Eliminar?
                        </span>
                        <button
                          type="button"
                          class="px-3 py-1.5 text-xs hairline-border hover:bg-paper-deep dark:hover:bg-stone-dark transition-colors focus-ring"
                          (click)="cancelarDelete()"
                        >
                          cancelar
                        </button>
                        <button
                          type="button"
                          class="px-3 py-1.5 text-xs bg-error text-paper hover:opacity-90 transition-opacity focus-ring"
                          (click)="confirmarDelete(c)"
                          [disabled]="eliminando() === c.idContacto"
                        >
                          {{ eliminando() === c.idContacto ? 'eliminando…' : 'sí, eliminar' }}
                        </button>
                      </div>
                    } @else {
                      <div class="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <a
                          *appHasPerfil="['1', '2']"
                          [routerLink]="['/contactos', c.idContacto, 'editar']"
                          class="p-2 hover:bg-paper-deep dark:hover:bg-stone-dark text-ink-soft hover:text-ink dark:text-ink-dark-soft dark:hover:text-ink-dark transition-colors focus-ring"
                          [title]="'Editar ' + c.nombreContacto"
                        >
                          <lucide-icon [name]="icons.Pencil" class="w-4 h-4"></lucide-icon>
                        </a>
                        <button
                          *appHasPerfil="'1'"
                          type="button"
                          class="p-2 hover:bg-error/10 text-ink-soft hover:text-error dark:text-ink-dark-soft transition-colors focus-ring"
                          [title]="'Eliminar ' + c.nombreContacto"
                          (click)="solicitarDelete(c.idContacto)"
                        >
                          <lucide-icon [name]="icons.Trash2" class="w-4 h-4"></lucide-icon>
                        </button>
                      </div>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `
})
export class ListaComponent implements OnInit {
  private contactos = inject(ContactosService);
  private toast = inject(ToastService);
  private session = inject(SessionService);
  private router = inject(Router);

  readonly icons = { Plus, Pencil, Trash2, Search, RefreshCw, X, AlertTriangle };

  readonly listado = signal<ContactoListItem[]>([]);
  readonly cargando = signal(false);
  readonly busqueda = signal('');
  busquedaModel = '';
  readonly confirmandoDelete = signal<string | null>(null);
  readonly eliminando = signal<string | null>(null);

  readonly total = computed(() => this.listado().length);
  readonly contactosFiltrados = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    if (!q) return this.listado();
    return this.listado().filter(
      (c) =>
        c.nombreContacto.toLowerCase().includes(q) ||
        c.rutContacto.toLowerCase().includes(q) ||
        c.idContacto.includes(q)
    );
  });
  readonly totalFiltrado = computed(() => this.contactosFiltrados().length);
  readonly puedeCrear = computed(() => {
    const p = this.session.perfil();
    return p === '1' || p === '2';
  });

  ngOnInit() {
    this.recargar();
  }

  filaClases(c: ContactoListItem): string {
    const base =
      'hairline hover:bg-paper-deep/40 dark:hover:bg-stone-dark/30 transition-colors group';
    return this.confirmandoDelete() === c.idContacto
      ? `${base} bg-terracota-tint dark:bg-terracota/10`
      : base;
  }

  recargar() {
    this.cargando.set(true);
    this.contactos.listar().subscribe({
      next: (lista) => {
        this.listado.set(lista ?? []);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.toast.error('No se pudo cargar el directorio');
      }
    });
  }

  limpiarBusqueda() {
    this.busqueda.set('');
    this.busquedaModel = '';
  }

  solicitarDelete(idContacto: string) {
    this.confirmandoDelete.set(idContacto);
  }

  cancelarDelete() {
    this.confirmandoDelete.set(null);
  }

  confirmarDelete(c: ContactoListItem) {
    this.eliminando.set(c.idContacto);
    this.contactos.eliminar(c.idContacto).subscribe({
      next: (ok) => {
        this.eliminando.set(null);
        this.confirmandoDelete.set(null);
        if (ok) {
          this.listado.update((arr) => arr.filter((x) => x.idContacto !== c.idContacto));
          this.toast.success(`Contacto "${c.nombreContacto}" eliminado`);
        } else {
          this.toast.warning('El contacto ya no existía o no pudo eliminarse');
          this.recargar();
        }
      },
      error: () => {
        this.eliminando.set(null);
        this.confirmandoDelete.set(null);
        this.toast.error('Error al eliminar');
      }
    });
  }
}
