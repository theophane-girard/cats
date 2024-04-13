import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from "@angular/core";
import { MultiPageForm, PageForm, toForm } from "app/core/form.utils";
import { OrderForm } from "../order-shell.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { distinctUntilChanged, filter } from "rxjs";

@Component({
  standalone: true,
  template: `
    <h1>My Cart</h1>
    <form [formGroup]="formGroup">
      <input
        type="text"
        pInputText
        required
        formControlName="cat"
        name="name"
        placeholder="Fill Name"
      />
    </form>
  `,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CartComponent extends PageForm<
  OrderForm,
  'cart'
  > {
  formKey: "cart" = "cart";
  formGroup: toForm<OrderForm['cart']> = new FormGroup({
    cat: new FormControl(''),
  });
}


