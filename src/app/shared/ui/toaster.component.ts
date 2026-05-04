import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideAngularModule, CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-angular';
import { ToastService, ToastTipo } from '../../core/services/toast.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <div
      class="fixed top-6 right-6 z-50 flex flex-col gap-3 w-[min(360px,calc(100vw-3rem))] pointer-events-none"
      aria-live="polite"
    >
      @for (toast of toaster.toasts(); track toast.id) {
        <div
          class="pointer-events-auto bg-paper dark:bg-paper-dark hairline-border shadow-soft px-4 py-3 flex items-start gap-3 animate-slide-in-right"
          [class.border-l-2]="true"
          [style.border-left-color]="border(toast.tipo)"
        >
          <lucide-icon
            [name]="icon(toast.tipo)"
            class="w-4 h-4 mt-0.5 flex-shrink-0"
            [style.color]="border(toast.tipo)"
          ></lucide-icon>
          <p class="flex-1 text-sm leading-relaxed text-ink dark:text-ink-dark">
            {{ toast.mensaje }}
          </p>
          <button
            type="button"
            class="text-ink-soft hover:text-ink dark:text-ink-dark-soft dark:hover:text-ink-dark focus-ring"
            (click)="toaster.dismiss(toast.id)"
            aria-label="Cerrar"
          >
            <lucide-icon [name]="icons.X" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      }
    </div>
  `
})
export class ToasterComponent {
  readonly toaster = inject(ToastService);
  readonly icons = { CheckCircle2, XCircle, AlertTriangle, Info, X };

  icon(tipo: ToastTipo) {
    switch (tipo) {
      case 'success': return CheckCircle2;
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  }

  border(tipo: ToastTipo): string {
    switch (tipo) {
      case 'success': return '#5A7A4A';
      case 'error': return '#A8392E';
      case 'warning': return '#B88A2A';
      default: return '#C04A1A';
    }
  }
}
