import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MultiPageForm, toForm } from "app/core/form.utils";
import CartComponent from "./features/cart.component";

export type AddressForm= {
    street: string;
    postalCode: number;
  }

export type OrderForm = {
  cart: {
    cat: string;
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
    <button [routerLink]="['', 'order','cart']">Cart</button>
    <button [routerLink]="['', 'order','shipping']">Shipping</button>
    <router-outlet />
  `,
  imports: [RouterOutlet, RouterLink],
  providers: [
    {
      provide: MultiPageForm,
      useExisting: OrderShellComponent,
    },
  ],
})
export default class OrderShellComponent {
  formGroup = new FormGroup({});

  test = this.formGroup.valueChanges.subscribe(console.log);
}
