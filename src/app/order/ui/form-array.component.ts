import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  TemplateRef,
  contentChild,
  inject,
  input,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  ReusableFormComponent,
  ToForm,
  provideParentControlContainer,
} from 'app/core/form.utils';

export type FormArrayComponentConfig = {
  maxLength?: number
}

export const AddControlFactory = new InjectionToken<
  <T>(...args: unknown[]) => T extends object ? ToForm<T> : FormControl<T>
>('AddControlFactory');

@Component({
  selector: 'app-form-array',
  standalone: true,
  template: `
    <fieldset [formArrayName]="controlKey()">
      <legend>{{ label() }}</legend>
      <button
        (click)="onAddControl()"
        [disabled]="
          config()?.maxLength &&
          formGroup.controls.length === config()?.maxLength
        "
      >
        +
      </button>
      @for (item of formGroup.controls; track $index) {
        <div id="item">
          <button (click)="removeControl($index)">-</button>
          <ng-container
            *ngTemplateOutlet="
              controlTemplateRef();
              context: { $implicit: item, index: $index }
            "
          />
        </div>
      }
    </fieldset>
  `,
  imports: [ReactiveFormsModule, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideParentControlContainer()],
  styles: `
    #item {
      display: flex;
    }
  `,
})
export default class FormArrayComponent<T> extends ReusableFormComponent<T[]> {
  controlTemplateRef = contentChild.required<TemplateRef<unknown>>('control');
  config = input<FormArrayComponentConfig>();
  removeControl(index: number) {
    this.formGroup.markAsDirty();
    this.formGroup.removeAt(index);
  }
  onAddControl() {
    this.formGroup.markAsDirty();
    const newItem: any = this.addControlFactory();
    this.formGroup.push(newItem);
  }
  override formGroup: ToForm<T[]> = new FormArray([]) as any;

  addControlFactory = inject(AddControlFactory);
}
