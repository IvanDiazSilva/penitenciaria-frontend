import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-visitor-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="visitor-layout">
      <header>
        <h2>Portal del visitante</h2>
      </header>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class VisitorLayoutComponent {}