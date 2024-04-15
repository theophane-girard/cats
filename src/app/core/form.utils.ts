import {
  DestroyRef,
  Directive,
  inject,
  Injectable,
  input,
  OnDestroy,
  OnInit,
  Output,
  Provider,
} from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  NgForm,
} from '@angular/forms';
import { distinctUntilChanged, filter, map } from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
  abstract formGroup: ToForm<T>;

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get form() {
    return this.formGroup as ToForm<T>;
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

export type ToFormArray<T> = T extends Date
  ? FormArray<FormControl<T>>
  : T extends object
    ? FormArray<ToForm<T>>
    : FormArray<FormControl<T>>;

export type ToForm<T extends object> = T extends Array<infer U> ? ToFormArray<U> : FormGroup<{
  [K in keyof T]: T[K] extends Date
    ? FormControl<T[K]>
  : T[K] extends Array<infer U extends object> ?
    FormArray<ToForm<U>>
    :T[K] extends object
      ? ToForm<T[K]>
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
  public get formGroup(): ToForm<T> {
    return this.ngForm.form as ToForm<T>;
  }
}

@Directive()
export abstract class MultiPageForm<T extends object = {}> {
  abstract formGroup: ToForm<T>;
}

@Directive()
export abstract class PageForm<
  TParent extends Record<string, object>,
  TKey extends keyof TParent,
> implements OnInit
{
  abstract formGroup: ToForm<TParent[TKey]>;
  abstract formKey: TKey;
  formProvider = inject(MultiPageForm<TParent>);
  #destroyRef = inject(DestroyRef)

  get valueChange$() {
    return this.formGroup?.valueChanges;
  }

  get parentFormGroup() {
    return this.formProvider.formGroup;
  }

  get form() {
    return this.formGroup as ToForm<TParent[TKey]>;
  }

  ngOnInit(): void {
    this.valueChange$
      .pipe(
        filter(() => this.formGroup.dirty),
        takeUntilDestroyed(this.#destroyRef), // Todo: check value init on route change
      )
      .subscribe((value) =>
        this.parentFormGroup.patchValue({ [this.formKey]: value } as any, {
          // Todo: as any
          emitEvent: false,
        }),
      );
    if (!this.parentFormGroup.controls[String(this.formKey)]) {
      this.parentFormGroup.addControl(
        String(this.formKey),
        this.formGroup as any, // Todo: as any
      );
      return;
    }
    this.formGroup.setValue(
      this.parentFormGroup.controls[this.formKey].getRawValue(),
    );
  }
}
