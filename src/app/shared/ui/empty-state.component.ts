import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
      <svg
        class="w-32 h-32 text-stone-light dark:text-stone-dark mb-8"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="78" stroke="currentColor" stroke-width="0.5" />
        <path
          d="M30 150 L60 130 L80 140 L110 110 L140 130 L170 115"
          stroke="currentColor"
          stroke-width="0.8"
          fill="none"
        />
        <path
          d="M40 165 L70 150 L100 160 L130 145 L160 155"
          stroke="currentColor"
          stroke-width="0.5"
          fill="none"
          opacity="0.5"
        />
        <circle cx="100" cy="80" r="3" fill="currentColor" />
      </svg>
      <h3 class="display-lg mb-3">{{ titulo() }}</h3>
      <p class="text-ink-soft dark:text-ink-dark-soft max-w-md leading-relaxed">
        {{ mensaje() }}
      </p>
      @if (cta()) {
        <div class="mt-8">
          <ng-content></ng-content>
        </div>
      }
    </div>
  `
})
export class EmptyStateComponent {
  readonly titulo = input<string>('Sin resultados');
  readonly mensaje = input<string>('No hay nada que mostrar por ahora.');
  readonly cta = input<boolean>(false);
}
