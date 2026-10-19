# Angular Routing and Navigation — Routing Setup

## Topics Covered

- Basic routing
- Route definitions
- Default route
- Wildcard route
- Child routes
- Router debugging
- Router lifecycle events

> This README covers only the **Routing Setup** block.  
> `RouterLink`, route parameters, programmatic navigation, guards, lazy loading, and other later topics are intentionally not covered here.

---

# 1. Why Do We Need Routing?

An Angular application can have many screens.

In **MyTaskHub**:

```text
Home
Office
Learning
Kid
Home Activities
```

We want each screen to have its own URL:

```text
/home
/office
/learning
/kid
/house-activities
```

Angular Routing connects the browser URL to the component that should be displayed.

```text
Browser URL
    ↓
Angular Router
    ↓
Route configuration
    ↓
Matching route
    ↓
Component
    ↓
RouterOutlet
    ↓
Screen appears
```

### Memory Rule

```text
Routing = URL → Component
```

---

# 2. The Main Routing Pieces

For basic routing, keep these three pieces separate:

```text
Routes
      ↓
provideRouter(routes)
      ↓
RouterOutlet
```

### `Routes`

Defines the URL rules.

```ts
export const routes: Routes = [
  {
    path: 'office',
    component: OfficeComponent
  }
];
```

Meaning:

```text
/office
   ↓
OfficeComponent
```

### `provideRouter(routes)`

Registers the route configuration with Angular.

```ts
provideRouter(routes)
```

Meaning:

```text
routes
   ↓
give them to Angular Router
```

### `RouterOutlet`

Tells Angular where the matched routed component should appear.

```html
<router-outlet></router-outlet>
```

### Memory Rule

```text
Routes
→ WHAT URL belongs to what component

provideRouter(routes)
→ GIVE those routes to Angular

RouterOutlet
→ WHERE the component appears
```

---

# 3. Route Definitions

Routes are normally defined in:

```text
src/app/app.routes.ts
```

Import the Angular `Routes` type:

```ts
import { Routes } from '@angular/router';
```

A basic route looks like:

```ts
{
  path: 'office',
  component: OfficeComponent
}
```

## `path`

The `path` is the URL segment Angular should match.

```ts
path: 'office'
```

matches:

```text
/office
```

Do not put the `/` inside the route configuration.

```ts
// Correct
path: 'office'

// Not this
path: '/office'
```

## `component`

The `component` tells Angular what to display when that path matches.

```ts
component: OfficeComponent
```

So:

```ts
{
  path: 'office',
  component: OfficeComponent
}
```

reads as:

```text
When /office matches
       ↓
display OfficeComponent
```

---

# 4. Registering the Routes

Defining `routes` is not enough.

Angular must also be configured to use them.

In a standalone Angular application, this is done in:

```text
src/app/app.config.ts
```

Example:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
```

The important connection is:

```text
app.routes.ts
    ↓
routes
    ↓
app.config.ts
    ↓
provideRouter(routes)
    ↓
Angular Router knows the routes
```

---

# 5. Where Does the Routed Component Display?

Angular needs a place in the page to insert the component selected by the router.

That place is:

```html
<router-outlet></router-outlet>
```

Example:

```html
<header>
  MyTaskHub
</header>

<router-outlet></router-outlet>
```

If the URL is:

```text
/office
```

Angular does this:

```text
/office
   ↓
path: 'office'
   ↓
OfficeComponent
   ↓
<router-outlet>
   ↓
Office page appears
```

The application shell, such as the header/navigation, can remain visible while the routed page changes.

---

# 6. Default Route

The application's root URL is:

```text
/
```

Inside Angular route configuration, the empty root path is:

```ts
path: ''
```

You can directly display a component:

```ts
{
  path: '',
  component: HomeComponent
}
```

Meaning:

```text
/
↓
HomeComponent
```

Or redirect the root URL somewhere else:

```ts
{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}
```

Meaning:

```text
/
↓
redirect
↓
/home
```

## Why `pathMatch: 'full'`?

For a root redirect, we want the redirect only when the complete URL path is empty.

```ts
pathMatch: 'full'
```

means:

```text
Match the entire remaining URL.
```

### Memory Rule

```text
path: ''
→ root/default path

redirectTo
→ send the user to another route

pathMatch: 'full'
→ match the whole path
```

---

# 7. Wildcard Route

What if the user enters a URL that does not exist?

Example:

```text
/something-wrong
```

Angular can use a wildcard route:

```ts
{
  path: '**',
  component: NotfoundComponent
}
```

`**` means:

```text
No earlier route matched
        ↓
use this fallback route
```

Example:

```text
/something-wrong
        ↓
home?          no
office?        no
learning?      no
kid?           no
        ↓
**
        ↓
NotfoundComponent
```

## Why Must the Wildcard Be Last?

Angular checks routes in order.

```text
First matching route wins.
```

So the wildcard should come after the known routes:

```ts
export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'office',
    component: OfficeComponent
  },
  {
    path: '**',
    component: NotfoundComponent
  }
];
```

### Memory Rule

```text
** = unknown URL fallback

Wildcard = LAST
```

---

# 8. Child Routes

Sometimes routes belong under another route.

In MyTaskHub:

```text
/learning
/learning/angular
/learning/typescript
```

`angular` and `typescript` belong under `learning`.

That relationship can be represented with `children`.

```ts
{
  path: 'learning',
  children: [
    {
      path: '',
      component: LearningComponent
    },
    {
      path: 'angular',
      component: AngularComponent
    },
    {
      path: 'typescript',
      component: TypescriptComponent
    }
  ]
}
```

## `/learning`

```text
/learning
    ↓
parent = learning
    ↓
remaining path = ''
    ↓
default child = ''
    ↓
LearningComponent
```

## `/learning/angular`

```text
/learning/angular
       ↓
parent path = learning
       ↓
remaining path = angular
       ↓
child path = angular
       ↓
AngularComponent
```

The child path does not include the parent path again.

Use:

```ts
path: 'angular'
```

not:

```ts
path: 'learning/angular'
```

because Angular combines the parent and child:

```text
learning + angular
       ↓
/learning/angular
```

## `/learning/typescript`

```text
/learning/typescript
       ↓
learning
→ parent

typescript
→ child
       ↓
TypescriptComponent
```

### Memory Rule

```text
Parent path + Child path = Full URL
```

---

# 9. Child Route and `RouterOutlet`

`children` defines the **route hierarchy**.

If both a parent routed component and a child routed component need to be displayed at the same time, the parent component needs its own:

```html
<router-outlet></router-outlet>
```

Mental model:

```text
AppComponent RouterOutlet
       ↓
Parent routed component
       ↓
Parent's RouterOutlet
       ↓
Child routed component
```

Keep the distinction clear:

```text
children
→ defines routes underneath a parent

RouterOutlet
→ gives Angular somewhere to render routed content
```

---

# 10. Router Debugging

Routing can involve several internal steps:

```text
Navigation starts
    ↓
Angular examines routes
    ↓
A route is recognized
    ↓
Component is activated
    ↓
Navigation completes
```

Angular can log detailed Router activity with:

```ts
withDebugTracing()
```

Example:

```ts
import {
  provideRouter,
  withDebugTracing
} from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withDebugTracing()
    )
  ]
};
```

Use it when you want to inspect Router activity in the browser console.

### Memory Rule

```text
withDebugTracing()
→ show Router activity for debugging
```

---

# 11. Router Lifecycle Events

Sometimes application code needs to know that navigation is happening or has completed.

Angular's `Router` exposes:

```ts
router.events
```

Conceptually:

```text
Navigation happens
      ↓
Router produces events
      ↓
router.events
      ↓
our code can listen
```

A useful event introduced here is:

```ts
NavigationEnd
```

It represents a successfully completed navigation.

```text
User navigates to /office
        ↓
Router starts navigation
        ↓
route matches
        ↓
navigation succeeds
        ↓
NavigationEnd
```

Simplified example:

```ts
import { inject } from '@angular/core';
import {
  NavigationEnd,
  Router
} from '@angular/router';

export class App {

  router = inject(Router);

  constructor() {
    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        console.log('Navigation completed');
      }

    });
  }
}
```

Do not memorize the full code yet. Understand the flow:

```text
Router
  ↓
router.events
  ↓
subscribe
  ↓
receive Router events
  ↓
NavigationEnd
  ↓
navigation successfully completed
```

---

# 12. `withDebugTracing()` vs `router.events`

These solve different problems.

```text
withDebugTracing()
→ Angular automatically logs Router activity
→ debugging

router.events
→ our application code listens to Router events
→ reacting to navigation
```

Think:

```text
withDebugTracing()
→ "Show me what the Router is doing."

router.events
→ "Tell my code when Router events happen."
```

---

# 13. MyTaskHub Route Example

A simplified version of the current MyTaskHub routing structure is:

```ts
import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { OfficeComponent } from './office/office.component';
import { LearningComponent } from './learning/learning.component';
import { AngularComponent } from './angular/angular.component';
import { TypescriptComponent } from './typescript/typescript.component';
import { KidComponent } from './kid/kid.component';
import { HouseActivitiesComponent } from './house-activities/house-activities.component';
import { NotfoundComponent } from './notfound/notfound.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'office',
    component: OfficeComponent
  },
  {
    path: 'learning',
    children: [
      {
        path: '',
        component: LearningComponent
      },
      {
        path: 'angular',
        component: AngularComponent
      },
      {
        path: 'typescript',
        component: TypescriptComponent
      }
    ]
  },
  {
    path: 'kid',
    component: KidComponent
  },
  {
    path: 'house-activities',
    component: HouseActivitiesComponent
  },
  {
    path: '**',
    component: NotfoundComponent
  }
];
```

Trace it:

```text
/office
↓
OfficeComponent
```

```text
/learning
↓
parent 'learning'
↓
child ''
↓
LearningComponent
```

```text
/learning/angular
↓
parent 'learning'
↓
child 'angular'
↓
AngularComponent
```

```text
/learning/typescript
↓
parent 'learning'
↓
child 'typescript'
↓
TypescriptComponent
```

```text
/abc
↓
no route matches
↓
**
↓
NotfoundComponent
```

---

# 14. How Everything Connects

```text
app.routes.ts
    ↓
Define URL rules
    ↓
app.config.ts
    ↓
provideRouter(routes)
    ↓
Angular Router
    ↓
Reads current URL
    ↓
Checks routes in order
    ↓
First matching route wins
    ↓
Selects component
    ↓
RouterOutlet
    ↓
Component appears
```

For child routes:

```text
/learning/angular
        ↓
learning
→ parent route
        ↓
angular
→ child route
        ↓
AngularComponent
```

For invalid URLs:

```text
No normal route matches
        ↓
**
        ↓
NotfoundComponent
```

For debugging:

```text
withDebugTracing()
→ detailed Router logging

router.events
→ stream of Router events

NavigationEnd
→ successful navigation finished
```

---

# Routing Setup Cheat Sheet

| Concept | Meaning |
|---|---|
| `Routes` | Array of route definitions |
| `path` | URL segment Angular matches |
| `component` | Component Angular displays |
| `provideRouter(routes)` | Registers routes with Angular |
| `RouterOutlet` | Place where routed content appears |
| `path: ''` | Root/default path or default child |
| `redirectTo` | Redirect to another route |
| `pathMatch: 'full'` | Require the entire remaining path to match |
| `path: '**'` | Fallback for unknown URLs |
| `children` | Routes underneath a parent route |
| `withDebugTracing()` | Log Router activity |
| `router.events` | Router lifecycle event stream |
| `NavigationEnd` | Successful navigation completed |

---

# Final Memory Map

```text
URL
 ↓
Routes
 ↓
First matching route
 ↓
Component
 ↓
RouterOutlet
 ↓
SCREEN
```

```text
''
→ default/root

**
→ unknown URL
→ LAST

children
→ routes under a parent
```

```text
withDebugTracing()
→ DEBUG

router.events
→ LISTEN

NavigationEnd
→ NAVIGATION FINISHED
```
