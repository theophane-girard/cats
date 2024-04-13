import { Routes } from '@angular/router';
import {
  CatListResolver,
  CommentResolver,
} from './cats/data-access/cats.resolver';

export const routes: Routes = [
  {
    path: 'order',
    loadComponent: () => import('./order/order-shell.component'),
    children: [
      {
        path: '',
        redirectTo: 'cart',
        pathMatch: 'full'
      },
      {
        path: 'cart',
        loadComponent: () => import('./order/features/cart.component'),
      },
      {
        path: 'shipping',
        loadComponent: () => import('./order/features/shipping.component'),
      },
    ],
  },
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
