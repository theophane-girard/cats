import {
  Directive,
  inject,
  input,
  OnDestroy,
  OnInit,
  Output,
  Provider,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  NgForm,
} from '@angular/forms';
import { distinctUntilChanged, filter, map } from 'rxjs';

export const provideParentControlContainer = (): Provider => ({
  provide: ControlContainer,
  useFactory: () => inject(ControlContainer, { skipSelf: true }),
});

@Directive({
  standalone: true,
})
export abstract class ReusableFormComponent<T extends object>
  implements OnInit, OnDestroy
{
  parentContainer = inject(ControlContainer);
  abstract formGroup: toForm<T>;

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  controlKey = input.required<string>();
  label = input.required<string>();

  ngOnInit(): void {
    this.parentFormGroup.addControl(this.controlKey(), this.formGroup);
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKey());
  }
}

export type toForm<T extends object> = FormGroup<{
  [K in keyof T]: T[K] extends Date
    ? FormControl<T[K]>
    : T[K] extends object
      ? toForm<T[K]>
      : FormControl<T[K]>;
}>;

@Directive({
  selector: 'form',
  standalone: true,
})
export class FormDirective<T extends object> {
  private ngForm = inject(NgForm, { self: true });
  @Output() valueChanges = this.formGroup.valueChanges.pipe(
    filter(() => this.formGroup.dirty),
  );
  @Output() statusChanges = this.formGroup.statusChanges.pipe(
    filter(() => this.formGroup.dirty),
    distinctUntilChanged(),
  );
  @Output() formChanges = this.valueChanges.pipe(map(() => this.formGroup));
  public get formGroup(): toForm<T> {
    return this.ngForm.form;
  }
}

@Directive()
export abstract class MultiPageForm<T extends object = {}> {
  abstract formGroup: toForm<T>;
}

@Directive()
export abstract class PageForm<
  TParent extends Record<string, object>,
  TKey extends keyof TParent,
> implements OnInit
{
  abstract formGroup: toForm<TParent[TKey]>;
  abstract formKey: TKey;
  formProvider = inject(MultiPageForm<TParent>);

  get valueChange$() {
    return this.formGroup?.valueChanges;
  }

  get parentFormGroup() {
    return this.formProvider.formGroup;
  }

  ngOnInit(): void {
    this.valueChange$
      .pipe(
        filter(() => this.formGroup.dirty),
      )
      .subscribe((value) =>
        this.parentFormGroup.patchValue({ [this.formKey]: value } as any, {
          emitEvent: false,
        }),
      );
    if (!this.parentFormGroup.controls[String(this.formKey)]) {
      this.parentFormGroup.addControl(
        String(this.formKey),
        this.formGroup as any,
      );
      return;
    }
    this.formGroup.setValue(
      this.parentFormGroup.controls[this.formKey].getRawValue(),
    );
  }
}
