import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { PageForm } from 'app/core/form.utils';
import { OrderForm } from '../order-shell.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import FormArrayComponent, {
  AddControlFactory,
} from '../ui/form-array.component';

@Component({
  standalone: true,
  template: `
    <h1>My Cart</h1>
    <form [formGroup]="formGroup">
      <app-form-array controlKey="cats" label="Cats">
        <ng-template #control let-control>
          <input
            type="text"
            pInputText
            required
            [formControl]="control"
            name="name"
            placeholder="Fill Name"
          />
        </ng-template>
      </app-form-array>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormArrayComponent],
  providers: [
    {
      provide: AddControlFactory,
      useFactory: () => () => new FormControl(''),
    },
  ],
})
export default class CartComponent extends PageForm<OrderForm, 'cart'> {
  formKey: 'cart' = 'cart';
  override formGroup: FormGroup = new FormGroup({});
}
