import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from './shared/ui/toaster.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToasterComponent],
  template: `
    <router-outlet />
    <app-toaster />
  `
})
export class AppComponent {
  private theme = inject(ThemeService);
}
