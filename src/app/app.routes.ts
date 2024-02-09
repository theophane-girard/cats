import { Routes } from '@angular/router';
import {
  CatListResolver,
  CommentResolver,
} from './cats/data-access/cats.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./cats/features/list/list.component'),
    resolve: CatListResolver,
  },
  {
    path: 'new',
    loadComponent: () => import('./cats/features/create/create.component'),
  },
  {
    path: ':id',
    loadComponent: () => import('./cats/features/comment/comment.component'),
    resolve: CommentResolver,
  },
];
