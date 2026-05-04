import { Injectable, effect, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'cordillera.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.read());

  constructor() {
    effect(() => {
      const t = this.theme();
      const apply = () => {
        document.documentElement.classList.toggle('dark', t === 'dark');
        localStorage.setItem(STORAGE_KEY, t);
      };

      const doc = document as Document & { startViewTransition?: (fn: () => void) => void };
      if (!doc.startViewTransition) {
        apply();
        return;
      }

      doc.startViewTransition(apply);
    });
  }

  toggle() {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private read(): Theme {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === 'light' || stored === 'dark') return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }
}
