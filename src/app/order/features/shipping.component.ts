import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { PageForm, toForm } from 'app/core/form.utils';
import { OrderForm } from '../order-shell.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { AddressFormComponent } from '../ui/address-form.component';
import { filter, tap } from 'rxjs';

@Component({
  standalone: true,
  template: ` <h1>Shipping</h1>
    <form [formGroup]="formGroup">
      <input type="checkbox" formControlName="isSame" />
      <app-address-form controlKey="billingAddress" label="Billing Address" />
      <app-address-form controlKey="deliveryAddress" label="Delivery Address" />
    </form>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    AddressFormComponent,
  ],
})
export default class ShippingComponent
  extends PageForm<OrderForm, 'shipping'>
  implements AfterViewInit
{
  override formKey: 'shipping' = 'shipping';
  override formGroup: FormGroup = new FormGroup({
    isSame: new FormControl(true),
  });
  isSameChange$ = this.form.controls.isSame.valueChanges.pipe(
    tap((val) => {
      if (val) {
        this.onSameAddressChecked();
        return;
      }
      this.onSameAddressUnchecked();
    }),
  );

  get form() {
    return this.formGroup as toForm<OrderForm['shipping']>;
  }

  ngAfterViewInit(): void {
    this.onSameAddressChecked();
    this.isSameChange$.subscribe();
    this.form.controls.billingAddress.valueChanges.pipe(
      filter(() => !!this.form.controls.isSame.value),
      tap(val => this.form.controls.deliveryAddress.patchValue(val))
    ).subscribe()
  }

  onSameAddressChecked() {
    this.form.controls['deliveryAddress'].disable();
    this.form.controls.deliveryAddress.setValue(
      this.form.controls.billingAddress.getRawValue(),
    );
  }
  onSameAddressUnchecked() {
    this.form.controls['deliveryAddress'].enable();
    this.form.controls.deliveryAddress.reset();
  }
}
