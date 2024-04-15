import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormGroup, ReactiveFormsModule, ValidatorFn } from "@angular/forms";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MultiPageForm, ToForm } from "app/core/form.utils";

export type AddressForm= {
    street: string;
    postalCode: number;
  }

export type OrderForm = {
  cart: {
    cats: string[];
  };
  shipping: {
    isSame: boolean
    billingAddress: AddressForm
    deliveryAddress: AddressForm
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <button [routerLink]="['', 'order', 'cart']">Cart</button>
    <button [routerLink]="['', 'order', 'shipping']">Shipping</button>
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
      <router-outlet />
      <button type="submit" [disabled]="formGroup.invalid">Submit</button>
    </form>
  `,
  imports: [RouterOutlet, RouterLink, ReactiveFormsModule],
  providers: [
    {
      provide: MultiPageForm,
      useExisting: OrderShellComponent,
    },
  ],
})
export default class OrderShellComponent {
  formGroup = new FormGroup(
    {},
    {
      validators: [this.hasControls()],
    },
  );

  test = this.formGroup.valueChanges.subscribe(console.log);

  onSubmit() {
    throw new Error('Method not implemented.');
  }

  hasControls(): ValidatorFn {
    return (form: ToForm<OrderForm>) => {

      if (!form.controls.cart) {
        return {cart: "Missing Cart"}
      }

      if (!form.controls.shipping) {
        return {shipping: "Missing Address"}
      }
      return null
    }
  }
}
