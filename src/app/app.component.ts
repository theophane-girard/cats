import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <h1 [routerLink]="['']" style="cursor: pointer">Rate My Cat</h1>
    <router-outlet />
  `,
})
export class AppComponent {}
