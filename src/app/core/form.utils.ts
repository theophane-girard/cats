import { Directive, inject, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { distinctUntilChanged, filter, map } from 'rxjs';

@Directive({
  selector: 'form',
  standalone: true,
})
export class FormDirective {
  private ngForm = inject(NgForm, { self: true });
  @Output() valueChanges = this.formGroup.valueChanges.pipe(
    filter(() => this.formGroup.dirty),
    distinctUntilChanged(
      (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
    ),
  );
  @Output() statusChanges = this.formGroup.statusChanges.pipe(
    filter(() => this.formGroup.dirty),
    distinctUntilChanged(),
  );
  @Output() formChanges = this.valueChanges.pipe(map(() => this.formGroup));
  private get formGroup() {
    return this.ngForm.form;
  }
}
