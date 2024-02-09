import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Comment,
  CreateCommentForm,
  GetResponse,
} from 'app/cats/models/cats.type';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly apiUrl = 'comments/';
  private readonly http = inject(HttpClient);

  public get(catId?: number) {
    const getComments$ = this.http
      .get<GetResponse<Comment>>(this.apiUrl)
      .pipe(map(({ results }) => results));
    if (!catId) {
      return getComments$;
    }
    return getComments$.pipe(
      map((comments) => comments.filter(({ cat }) => cat === Number(catId))),
    );
  }

  public createComment(comment: CreateCommentForm) {
    return this.http.post<Comment>(this.apiUrl, comment);
  }
}
