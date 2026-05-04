import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule, Shield, Pencil, Eye } from 'lucide-angular';
import { PERFIL_NOMBRES, Perfil } from '../../shared/models/usuario.model';

@Component({
  selector: 'app-perfil-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <span
      class="inline-flex items-center gap-1.5 px-2 py-1 hairline-border bg-paper dark:bg-paper-dark"
      [title]="'Perfil ' + perfil() + ' · ' + nombre()"
    >
      <lucide-icon [name]="icono()" class="w-3.5 h-3.5 text-terracota"></lucide-icon>
      <span class="font-mono text-[10px] uppercase tracking-widest text-ink-soft dark:text-ink-dark-soft">
        {{ nombre() }}
      </span>
    </span>
  `
})
export class PerfilBadgeComponent {
  readonly perfil = input.required<Perfil>();
  readonly icons = { Shield, Pencil, Eye };
  readonly nombre = computed(() => PERFIL_NOMBRES[this.perfil()] ?? '—');
  readonly icono = computed(() => {
    const map: Record<Perfil, typeof Shield> = {
      '1': Shield,
      '2': Pencil,
      '3': Eye
    };
    return map[this.perfil()] ?? Shield;
  });
}
