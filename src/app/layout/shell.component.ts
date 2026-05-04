import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LucideAngularModule, LogOut, Sun, Moon, Mountain } from 'lucide-angular';
import { AuthService } from '../core/services/auth.service';
import { SessionService } from '../core/services/session.service';
import { ThemeService } from '../core/services/theme.service';
import { Perfil } from '../shared/models/usuario.model';
import { PerfilBadgeComponent } from '../shared/ui/perfil-badge.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, LucideAngularModule, PerfilBadgeComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-paper dark:bg-paper-dark transition-colors duration-300">
      <header class="hairline bg-paper dark:bg-paper-dark sticky top-0 z-30 backdrop-blur">
        <div class="max-w-6xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <button
            type="button"
            class="flex items-center gap-3 focus-ring -ml-1 px-1"
            (click)="irHome()"
          >
            <lucide-icon
              [name]="icons.Mountain"
              class="w-5 h-5 text-terracota"
            ></lucide-icon>
            <div class="leading-none text-left">
              <div class="font-display text-xl tracking-tightest">Cordillera</div>
              <div class="label-mono text-ink-soft dark:text-ink-dark-soft mt-0.5">
                gestión de contactos
              </div>
            </div>
          </button>

          <div class="flex items-center gap-3 sm:gap-5">
            @if (perfil(); as p) {
              <app-perfil-badge [perfil]="p" class="hidden sm:inline-flex"></app-perfil-badge>
            }

            <div class="flex items-center gap-3">
              <span class="font-display italic text-terracota text-lg tracking-tightest leading-none select-none" aria-hidden="true">
                {{ iniciales() }}
              </span>
              <div class="leading-tight hidden md:block">
                <div class="text-sm text-ink dark:text-ink-dark">{{ nombreCompleto() }}</div>
                <div class="font-mono text-[10px] text-ink-soft dark:text-ink-dark-soft uppercase tracking-widest">
                  id {{ idUsuario() }}
                </div>
              </div>
            </div>

            <div class="w-px h-6 bg-stone-light dark:bg-stone-dark"></div>

            <button
              type="button"
              class="p-2 hover:bg-paper-deep dark:hover:bg-stone-dark text-ink-soft hover:text-ink dark:text-ink-dark-soft dark:hover:text-ink-dark focus-ring transition-colors"
              [title]="theme.theme() === 'dark' ? 'Modo claro' : 'Modo oscuro'"
              (click)="toggleTheme($event)"
            >
              <lucide-icon
                [name]="theme.theme() === 'dark' ? icons.Sun : icons.Moon"
                class="w-4 h-4"
              ></lucide-icon>
            </button>

            <button
              type="button"
              class="p-2 hover:bg-paper-deep dark:hover:bg-stone-dark text-ink-soft hover:text-terracota focus-ring transition-colors"
              title="Cerrar sesión"
              (click)="cerrarSesion()"
            >
              <lucide-icon [name]="icons.LogOut" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 max-w-6xl w-full mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <router-outlet />
      </main>

      <footer class="hairline-top py-6">
        <div class="max-w-6xl mx-auto px-6 lg:px-10 flex items-center justify-between flex-wrap gap-2">
          <p class="font-mono text-[10px] uppercase tracking-widest text-ink-soft dark:text-ink-dark-soft">
            Cordillera · prueba técnica · Angular 18
          </p>
          <p class="font-mono text-[10px] uppercase tracking-widest text-ink-soft dark:text-ink-dark-soft">
            sesión activa
          </p>
        </div>
      </footer>
    </div>
  `
})
export class ShellComponent {
  private auth = inject(AuthService);
  private session = inject(SessionService);
  private router = inject(Router);
  readonly theme = inject(ThemeService);
  readonly icons = { LogOut, Sun, Moon, Mountain };

  readonly perfil = computed<Perfil | null>(() => this.session.perfil());
  readonly idUsuario = computed(() => this.session.idUsuario());
  readonly nombreCompleto = computed(() => this.session.nombreCompleto());
  readonly iniciales = computed(() => this.session.iniciales());

  toggleTheme(event: MouseEvent) {
    document.documentElement.style.setProperty('--vt-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--vt-y', `${event.clientY}px`);
    this.theme.toggle();
  }

  irHome() {
    this.router.navigate(['/contactos']);
  }

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
