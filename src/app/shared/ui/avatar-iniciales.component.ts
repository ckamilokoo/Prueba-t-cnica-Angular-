import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-avatar-iniciales',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center justify-center font-display text-ink dark:text-paper select-none"
      [style.background-color]="bg()"
      [style.width.px]="size()"
      [style.height.px]="size()"
      [style.font-size.px]="fontSize()"
    >
      {{ inicialesCalc() }}
    </span>
  `
})
export class AvatarInicialesComponent {
  readonly nombre = input<string>('');
  readonly size = input<number>(36);

  readonly inicialesCalc = computed(() => {
    const partes = (this.nombre() ?? '').trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return '·';
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  });

  readonly fontSize = computed(() => Math.round(this.size() * 0.42));

  readonly bg = computed(() => {
    const palette = ['#F4DDD0', '#E8DDC4', '#D4D0C8', '#E1D4C2', '#EBE6D9', '#DCD0B8'];
    const str = this.nombre() ?? '';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return palette[Math.abs(hash) % palette.length];
  });
}
