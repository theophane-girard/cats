import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { CatService } from './cat.service';
import { CommentService } from './comment.service';
import { Cat, Comment, GetResponse } from 'app/cats/models/cats.type';

export type ResolverData<T> = {
  [K in keyof T]: ResolveFn<T[K]>;
};

export type CatListResolverData = {
  cats: GetResponse<Cat>;
  comments: Comment[];
};
export type CommentResolverData = {
  cat: Cat;
  comments: Comment[];
};

export const CatListResolver: ResolverData<CatListResolverData> = {
  cats: () => inject(CatService).get(),
  comments: () => inject(CommentService).get(),
};
export const CommentResolver: ResolverData<CommentResolverData> = {
  cat: (currentRoute) => inject(CatService).getById(currentRoute.params['id']),
  comments: (currentRoute) =>
    inject(CommentService).get(currentRoute.params['id']),
};
