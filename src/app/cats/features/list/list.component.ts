import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import {
  BehaviorSubject,
  map,
  merge,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';
import { CatListResolverData } from 'app/cats/data-access/cats.resolver';
import { Cat } from 'app/cats/models/cats.type';
import { CatService } from 'app/cats/data-access/cat.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    DatePipe,
    DecimalPipe,
    AsyncPipe,
    RouterLink,
  ],
  template: `
    <p-button label="Add cat" [routerLink]="['new']" />
    <section>
      <p-table
        [value]="cats$ | async"
        [lazy]="true"
        [tableStyle]="{ 'min-width': '50rem' }"
        [paginator]="true"
        [rows]="10"
        (onLazyLoad)="onLazyLoad($event)"
        [lazyLoadOnInit]="false"
        [totalRecords]="totalRecords$ | async"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn>Name</th>
            <th pSortableColumn>Description</th>
            <th pSortableColumn>Breed</th>
            <th pSortableColumn>Birthdate</th>
            <th pSortableColumn>Rate</th>
          </tr>
          <tr>
            <th><p-columnFilter type="text" field="name" /></th>
            <th><p-columnFilter type="text" field="description" /></th>
            <th><p-columnFilter type="text" field="breed" /></th>
            <th><p-columnFilter type="text" field="birthday" /></th>
            <th><p-columnFilter type="text" field="avg_rating" /></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-cat let-index="rowIndex">
          <!-- NB: GET cats doesnt return cat id-->
          <tr [routerLink]="[index + 1]" style="cursor: pointer;">
            <td>{{ cat.name }}</td>
            <td>{{ cat.description }}</td>
            <td>{{ cat.breed }}</td>
            <td>{{ cat.birthday | date: 'Y-MM-d' }}</td>
            <td>{{ cat.avg_rating | number: '1.2-2' }}</td>
          </tr>
        </ng-template>
      </p-table>
    </section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ListComponent {
  private readonly catService = inject(CatService);
  private readonly resolverData$ = inject(ActivatedRoute)
    .data as Observable<CatListResolverData>;
  private readonly catsResolverData$ = this.resolverData$.pipe(
    map(({ cats }) => cats),
    shareReplay(),
  );

  private readonly currentSlice$ = new BehaviorSubject<TableLazyLoadEvent>({
    first: 0,
    rows: 1,
  });
  private readonly catsPaginate$ = this.currentSlice$.pipe(
    switchMap((event) => this.catService.get(event)),
    map(({ results }) => results),
  );

  protected readonly cats$: Observable<Cat[]> = merge(
    this.catsResolverData$.pipe(map(({ results }) => results)),
    this.catsPaginate$,
  );
  protected readonly totalRecords$ = this.catsResolverData$.pipe(
    map(({ count }) => count),
  );

  protected onLazyLoad($event: TableLazyLoadEvent) {
    this.currentSlice$.next($event);
  }
}

export default ListComponent;
