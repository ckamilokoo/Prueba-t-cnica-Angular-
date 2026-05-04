import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Save, Loader2 } from 'lucide-angular';
import { ContactosService } from '../../../core/services/contactos.service';
import { ToastService } from '../../../core/services/toast.service';
import { ContactoDetalle } from '../../../shared/models/contacto.model';

@Component({
  selector: 'app-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule],
  template: `
    <section class="max-w-2xl mx-auto animate-fade-in">
      <a
        routerLink="/contactos"
        class="inline-flex items-center gap-2 text-ink-soft dark:text-ink-dark-soft hover:text-terracota transition-colors mb-8 focus-ring"
      >
        <lucide-icon [name]="icons.ArrowLeft" class="w-4 h-4"></lucide-icon>
        <span class="label-mono">volver al directorio</span>
      </a>

      <header class="mb-10">
        <p class="label-mono text-terracota mb-3">{{ esEdicion() ? 'editar' : 'nuevo' }}</p>
        <h1 class="display-xl mb-3 leading-[0.95]">
          @if (esEdicion()) {
            <span>Editar contacto</span>
          } @else {
            <span>Crear <em class="not-italic text-terracota">contacto</em></span>
          }
        </h1>
        <p class="text-ink-soft dark:text-ink-dark-soft leading-relaxed">
          @if (esEdicion()) {
            Modifica los datos del contacto. El RUT no es editable después de crearlo.
          } @else {
            Completa la información para registrar un nuevo contacto en el directorio.
          }
        </p>
      </header>

      @if (cargandoDetalle()) {
        <div class="space-y-3">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="h-14 bg-paper-deep/40 dark:bg-stone-dark/30 animate-pulse"></div>
          }
        </div>
      } @else {
        <form
          [formGroup]="form"
          (ngSubmit)="enviar()"
          class="bg-paper dark:bg-paper-dark hairline-border p-7 space-y-6"
          novalidate
        >
          <div class="grid sm:grid-cols-2 gap-5">
            <label class="block">
              <span class="label-mono text-ink-soft dark:text-ink-dark-soft mb-2 block">rut</span>
              <input
                type="text"
                formControlName="rutContacto"
                placeholder="12.345.678-9"
                [readOnly]="esEdicion()"
                [class.bg-paper-deep]="esEdicion()"
                [class.cursor-not-allowed]="esEdicion()"
                class="w-full bg-paper dark:bg-paper-dark hairline-border px-4 py-3 font-mono text-sm focus-ring focus:border-terracota"
              />
              @if (esEdicion()) {
                <span class="block mt-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-soft dark:text-ink-dark-soft">
                  el rut no se modifica
                </span>
              }
              @if (mostrarError('rutContacto')) {
                <span class="block mt-1.5 text-xs text-error">RUT requerido</span>
              }
            </label>

            <label class="block">
              <span class="label-mono text-ink-soft dark:text-ink-dark-soft mb-2 block">abreviación</span>
              <input
                type="text"
                formControlName="abreviacion"
                placeholder="JJ"
                maxlength="20"
                class="w-full bg-paper dark:bg-paper-dark hairline-border px-4 py-3 text-sm focus-ring focus:border-terracota"
              />
              @if (mostrarError('abreviacion')) {
                <span class="block mt-1.5 text-xs text-error">Abreviación requerida</span>
              }
            </label>
          </div>

          <label class="block">
            <span class="label-mono text-ink-soft dark:text-ink-dark-soft mb-2 block">nombre completo</span>
            <input
              type="text"
              formControlName="nombreContacto"
              placeholder="Juan José Pérez"
              class="w-full bg-paper dark:bg-paper-dark hairline-border px-4 py-3 text-sm focus-ring focus:border-terracota"
            />
            @if (mostrarError('nombreContacto')) {
              <span class="block mt-1.5 text-xs text-error">Nombre requerido</span>
            }
          </label>

          <div class="grid sm:grid-cols-2 gap-5">
            <label class="block">
              <span class="label-mono text-ink-soft dark:text-ink-dark-soft mb-2 block">teléfono</span>
              <input
                type="tel"
                formControlName="telefono"
                placeholder="912345678"
                class="w-full bg-paper dark:bg-paper-dark hairline-border px-4 py-3 font-mono text-sm focus-ring focus:border-terracota"
              />
              @if (mostrarError('telefono')) {
                <span class="block mt-1.5 text-xs text-error">Teléfono requerido</span>
              }
            </label>

            <label class="block">
              <span class="label-mono text-ink-soft dark:text-ink-dark-soft mb-2 block">email</span>
              <input
                type="email"
                formControlName="email"
                placeholder="contacto@ejemplo.cl"
                class="w-full bg-paper dark:bg-paper-dark hairline-border px-4 py-3 text-sm focus-ring focus:border-terracota"
              />
              @if (mostrarError('email')) {
                <span class="block mt-1.5 text-xs text-error">
                  @if (form.controls.email.errors?.['email']) {
                    Email no válido
                  } @else {
                    Email requerido
                  }
                </span>
              }
            </label>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 hairline-top">
            <a
              routerLink="/contactos"
              class="px-5 py-3 text-sm hairline-border hover:bg-paper-deep dark:hover:bg-stone-dark transition-colors focus-ring"
            >
              Cancelar
            </a>
            <button
              type="submit"
              [disabled]="guardando()"
              class="inline-flex items-center gap-2 bg-terracota text-paper px-5 py-3 hover:bg-terracota-deep transition-colors focus-ring disabled:opacity-50"
            >
              @if (guardando()) {
                <lucide-icon [name]="icons.Loader2" class="w-4 h-4 animate-spin"></lucide-icon>
                <span class="text-sm tracking-wide">Guardando…</span>
              } @else {
                <lucide-icon [name]="icons.Save" class="w-4 h-4"></lucide-icon>
                <span class="text-sm tracking-wide">{{ esEdicion() ? 'Guardar cambios' : 'Crear contacto' }}</span>
              }
            </button>
          </div>
        </form>
      }
    </section>
  `
})
export class FormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private contactos = inject(ContactosService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly icons = { ArrowLeft, Save, Loader2 };
  readonly idContacto = signal<string | null>(null);
  readonly cargandoDetalle = signal(false);
  readonly guardando = signal(false);
  readonly esEdicion = computed(() => this.idContacto() !== null);

  readonly form = this.fb.nonNullable.group({
    rutContacto: ['', [Validators.required, Validators.minLength(6)]],
    nombreContacto: ['', [Validators.required, Validators.minLength(2)]],
    abreviacion: ['', [Validators.required, Validators.minLength(1)]],
    telefono: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idContacto.set(id);
      this.cargarDetalle(id);
    }
  }

  private cargarDetalle(id: string) {
    this.cargandoDetalle.set(true);
    this.contactos.detalle(id).subscribe({
      next: (detalle) => {
        this.cargandoDetalle.set(false);
        if (!detalle) {
          this.toast.error('Contacto no encontrado');
          this.router.navigate(['/contactos']);
          return;
        }
        this.poblarForm(detalle);
      },
      error: () => {
        this.cargandoDetalle.set(false);
        this.toast.error('No se pudo cargar el contacto');
        this.router.navigate(['/contactos']);
      }
    });
  }

  private poblarForm(detalle: ContactoDetalle) {
    this.form.patchValue({
      rutContacto: detalle.rutContacto,
      nombreContacto: detalle.nombreContacto,
      abreviacion: detalle.abreviacion,
      telefono: detalle.telefono,
      email: detalle.email
    });
  }

  mostrarError(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.dirty || c.touched);
  }

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    const valor = this.form.getRawValue();

    if (this.esEdicion()) {
      this.contactos
        .actualizar({
          idContacto: this.idContacto()!,
          nombreContacto: valor.nombreContacto,
          abreviacion: valor.abreviacion,
          telefono: valor.telefono,
          email: valor.email
        })
        .subscribe({
          next: (ok) => this.completar(ok, 'actualizado'),
          error: () => this.fallar()
        });
    } else {
      this.contactos
        .crear({
          rutContacto: valor.rutContacto,
          nombreContacto: valor.nombreContacto,
          abreviacion: valor.abreviacion,
          telefono: valor.telefono,
          email: valor.email
        })
        .subscribe({
          next: (ok) => this.completar(ok, 'creado'),
          error: () => this.fallar()
        });
    }
  }

  private completar(ok: boolean, accion: 'creado' | 'actualizado') {
    this.guardando.set(false);
    if (ok) {
      this.toast.success(`Contacto ${accion} con éxito`);
      this.router.navigate(['/contactos']);
    } else {
      this.toast.error(`No se pudo ${accion === 'creado' ? 'crear' : 'actualizar'} el contacto`);
    }
  }

  private fallar() {
    this.guardando.set(false);
    this.toast.error('Error de comunicación con el servidor');
  }
}
