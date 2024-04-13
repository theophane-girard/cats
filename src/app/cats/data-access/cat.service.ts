import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'app/environments/environment';
import { TableLazyLoadEvent } from 'primeng/table';
import { mapLazyLoadEvent } from 'app/shared/paginate.utils';
import { Cat, CreateCatForm, GetResponse } from 'app/cats/models/cats.type';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatService {
  private readonly apiUrl = 'cats/';
  private readonly http = inject(HttpClient);
  public create(cat: CreateCatForm) {
    return this.http.post<CreateCatForm>(this.apiUrl, cat);
  }

  public get(event?: TableLazyLoadEvent) {
    const url = new URL(this.apiUrl, environment.apiBaseUrl);
    if (event) {
      const paginateQueryParams = mapLazyLoadEvent(event);
      Object.entries(paginateQueryParams).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return this.http.get<GetResponse<Cat>>(url.toString()).pipe(
      catchError(() =>
        of({
          count: 0,
          next: '',
          previous: '',
          results: [],
        }),
      ),
    );
  }
  public getById(id: number) {
    return this.http.get<Cat>(`${this.apiUrl + id}/`).pipe(
      catchError(() =>
        of(undefined),
      ),
    );
  }
}
