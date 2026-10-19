import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Home_Route,Office_Route, Learning_Route,kid_Route,HouseActivities_Route} from './app.routes'
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('my-routing-application');

  router = inject(Router);
protected readonly Home_Route=Home_Route;
protected readonly Office_Route=Office_Route
protected readonly Learning_Route=Learning_Route
protected readonly kid_Route=kid_Route
protected readonly HouseActivities_Route=HouseActivities_Route
  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Route changed:', event);
      }
    });
  }
}
