import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Comment } from 'app/cats/models/cats.type';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommentService } from 'app/cats/data-access/comment.service';
import { map, merge, Subject, switchMap, tap } from 'rxjs';
import { CommentResolverData } from 'app/cats/data-access/cats.resolver';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    InputNumberModule,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  template: `
    @if (cat) {
      <section>
        <p>Name: {{ cat.name }}</p>
        <p>Description: {{ cat.description }}</p>
        <p>Breed: {{ cat.breed }}</p>
        <p>Birth Date: {{ cat.birthday | date: 'Y-m-d' }}</p>
        <h2>Rates</h2>
        <ul>
          @for (comment of comments$ | async; track $index) {
            <li>{{ comment.note }} - {{ comment.text }}</li>
          }
        </ul>
      </section>
      <h2>Add Rate</h2>
      <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
        <section>
          <p-inputNumber
            inputId="integeronly"
            required
            min="0"
            max="5"
            formControlName="note"
            placeholder="Fill Rate"
          />
          <textarea
            rows="5"
            cols="30"
            required
            pInputTextarea
            formControlName="text"
            placeholder="Fill Comment"
          ></textarea>
        </section>
        <p-button label="Rate" type="submit" [disabled]="formGroup.invalid" />
      </form>
    } @else {
      <h1>Not Found</h1>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CommentComponent {
  private readonly commentService = inject(CommentService);
  private readonly currentRoute = inject(ActivatedRoute);
  private readonly resolverData$ = this.currentRoute.data;
  private readonly resolverDataSnapshot = this.currentRoute.snapshot
    .data as CommentResolverData;
  private readonly commentResolverData$ = this.resolverData$.pipe(
    map(({ comments }: CommentResolverData) => comments),
  );
  protected readonly cat = this.resolverDataSnapshot.cat;
  private readonly commentAdded$ = new Subject<Comment[]>();
  protected readonly comments$ = merge(
    this.commentResolverData$,
    this.commentAdded$,
  );
  private readonly emptyValueForm = {
    note: undefined,
    text: undefined,
    cat: this.currentRoute.snapshot.params['id'],
  };
  protected readonly formGroup = inject(FormBuilder).group({
    note: [this.emptyValueForm.note],
    text: [this.emptyValueForm.text],
    cat: [this.emptyValueForm.cat],
  });

  protected onSubmit() {
    this.commentService
      .createComment(this.formGroup.getRawValue())
      .pipe(
        switchMap((res) => this.commentService.get(res.cat)),
        tap((res) => this.commentAdded$.next(res)),
        tap(() => this.formGroup.reset(this.emptyValueForm)),
      )
      .subscribe();
  }
}

export default CommentComponent;
