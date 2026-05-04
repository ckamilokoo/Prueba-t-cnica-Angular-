import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  signal
} from '@angular/core';
import { Perfil } from '../../shared/models/usuario.model';
import { SessionService } from '../services/session.service';

@Directive({
  selector: '[appHasPerfil]',
  standalone: true
})
export class HasPerfilDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly session = inject(SessionService);
  private readonly permitidos = signal<Perfil[]>([]);

  @Input() set appHasPerfil(value: Perfil | Perfil[]) {
    this.permitidos.set(Array.isArray(value) ? value : [value]);
  }

  constructor() {
    effect(() => {
      const allowed = this.permitidos();
      const perfil = this.session.perfil();
      this.viewContainer.clear();
      if (perfil && allowed.includes(perfil)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
