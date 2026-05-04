import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-cordillera-bg',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.aria-hidden]="true"
      class="absolute inset-x-0 bottom-0 w-full pointer-events-none select-none"
      [class.opacity-[0.08]]="opacity === 'soft'"
      [class.opacity-[0.14]]="opacity === 'medium'"
      [class.opacity-[0.22]]="opacity === 'strong'"
      viewBox="0 0 1440 360"
      preserveAspectRatio="xMidYEnd slice"
      fill="none"
    >
      <defs>
        <linearGradient id="ridgeFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.5" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="1" />
        </linearGradient>
      </defs>

      <path
        d="M0 280 L70 240 L130 270 L210 200 L260 230 L340 170 L410 220 L480 180 L560 230 L640 190 L720 240 L800 200 L880 250 L960 210 L1040 250 L1120 200 L1200 240 L1280 200 L1360 240 L1440 220 L1440 360 L0 360 Z"
        fill="currentColor"
        fill-opacity="0.4"
      />
      <path
        d="M0 320 L80 290 L160 310 L240 270 L320 300 L400 260 L480 290 L560 270 L640 300 L720 280 L800 310 L880 280 L960 300 L1040 280 L1120 310 L1200 280 L1280 300 L1360 280 L1440 300 L1440 360 L0 360 Z"
        fill="currentColor"
        fill-opacity="0.7"
      />
      <path
        d="M0 350 L120 340 L240 350 L360 335 L480 345 L600 330 L720 340 L840 325 L960 340 L1080 330 L1200 345 L1320 335 L1440 350 L1440 360 L0 360 Z"
        fill="currentColor"
        fill-opacity="1"
      />
    </svg>
  `,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        inset: 0;
        color: var(--cordillera-color, #1A1815);
        overflow: hidden;
      }
    `
  ]
})
export class CordilleraBgComponent {
  @Input() opacity: 'soft' | 'medium' | 'strong' = 'soft';
}
