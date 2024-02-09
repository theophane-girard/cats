import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FormDirective } from 'app/core/form.utils';
import { ButtonModule } from 'primeng/button';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { CreateCatForm } from 'app/cats/models/cats.type';
import { CatService } from 'app/cats/data-access/cat.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    FormsModule,
    FormDirective,
    InputTextModule,
    ButtonModule,
    CalendarModule,
  ],
  template: `
    <form
      #form="ngForm"
      (valueChanges)="formValues.set($event)"
      (ngSubmit)="onSubmit()"
    >
      <section>
        <input
          type="text"
          pInputText
          required
          [ngModel]="formValues().name"
          name="name"
          placeholder="Fill Name"
        />
        <input
          type="text"
          pInputText
          required
          [ngModel]="formValues().description"
          name="description"
          placeholder="Fill Description"
        />
        <input
          type="text"
          pInputText
          required
          [ngModel]="formValues().breed"
          name="breed"
          placeholder="Fill Breed"
        />
        <input
          type="text"
          pInputText
          required
          [ngModel]="formValues().birthday"
          name="birthday"
          placeholder="Fill Birthday"
        />
      </section>
      <p-button label="Create" type="submit" [disabled]="form.invalid" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CreateComponent {
  private readonly catService = inject(CatService);
  private readonly router = inject(Router);
  protected readonly formValues = signal<CreateCatForm>({
    breed: undefined,
    birthday: '2024-02-11',
    name: undefined,
    description: undefined,
  });

  protected onSubmit() {
    this.catService
      .create(this.formValues())
      .pipe(switchMap(() => this.router.navigate([''])))
      .subscribe();
  }
}

export default CreateComponent;
