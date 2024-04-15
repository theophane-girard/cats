import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AddressForm } from '../order-shell.component';
import { ReusableFormComponent, provideParentControlContainer, ToForm } from 'app/core/form.utils';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-address-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset [formGroupName]="controlKey()">
      <legend>{{ label() }}</legend>
      <input
        type="text"
        pInput
        required
        formControlName="street"
        name="name"
        placeholder="Street"
      />
      <p-inputNumber
        inputId="integeronly"
        required
        min="10000"
        max="99999"
        formControlName="postalCode"
        placeholder="Fill postal code"
      />
    </fieldset>
  `,
  styles: `
    fieldset {
      display: flex;
      flex-direction: column;
    }
  `,
  viewProviders: [provideParentControlContainer()],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
  ],
})
export class AddressFormComponent extends ReusableFormComponent<AddressForm> {
  formGroup: ToForm<AddressForm> = new FormGroup({
    postalCode: new FormControl(null),
    street: new FormControl(''),
  });
}
