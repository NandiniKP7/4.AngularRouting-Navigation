# Angular Routing and Navigation — Navigation

## Topics Covered

1. **Initiating Navigation from the Template with RouterLinks**
2. **Demo: Implementing RouterLinks**
3. **Styling Active Links**
4. **Navigating Programmatically**
5. **Demo: Implementing Navigation with the Router Service**

This README focuses on **how users move between routes after the routes have already been defined**.

The key progression is:

```text
Routes exist
    ↓
RouterLink lets the user navigate from HTML
    ↓
RouterLinkActive shows which route is active
    ↓
Router service lets TypeScript navigate from code
```

---

# 1. Initiating Navigation from the Template with RouterLinks

## What problem does this solve?

Defining routes only tells Angular which URLs exist.

Example:

```ts
{
  path: 'office',
  component: OfficeComponent
}
```

Angular now understands:

```text
/office
   ↓
OfficeComponent
```

But the user should not have to manually type the URL into the browser.

We need clickable page elements that tell Angular:

```text
Navigate to this route.
```

That is what `RouterLink` does.

---

## `RouterLink`

`RouterLink` is an Angular directive used to start navigation from the template.

Instead of:

```html
<a href="/office">
  Office
</a>
```

Angular navigation uses:

```html
<a routerLink="/office">
  Office
</a>
```

### Main idea

```text
User clicks link
      ↓
RouterLink
      ↓
Angular Router
      ↓
URL changes
      ↓
Router matches route
      ↓
View changes
```

### Memory Rule

```text
Routes
→ define where URLs go

RouterLink
→ lets the user go there
```

---

# 2. Why Use an Anchor Element?

The transcript recommends using `RouterLink` with standard anchor elements:

```html
<a routerLink="/office">
  Office
</a>
```

rather than attaching navigation to arbitrary elements.

Why?

Because an anchor already means:

```text
"This element performs navigation."
```

That gives us better browser behavior and accessibility.

So the preferred pattern is:

```html
<a routerLink="...">
  ...
</a>
```

### Memory Rule

```text
Navigation
→ use <a>

Angular navigation
→ use RouterLink on <a>
```

---

# 3. Static RouterLink vs Bound RouterLink

There are two common ways to supply a route.

## Static String

```html
<a routerLink="/office">
  Office
</a>
```

Here Angular receives the literal string:

```text
/office
```

## Dynamic Property / Constant

Suppose TypeScript contains:

```ts
protected readonly Office_Route = Office_Route;
```

Then the template uses property binding:

```html
<a [routerLink]="Office_Route">
  Office
</a>
```

The square brackets mean:

```text
Read the value from TypeScript.
```

So:

```text
Office_Route
    ↓
"office"
    ↓
RouterLink uses "office"
```

Compare:

```html
routerLink="Office_Route"
```

This would mean:

```text
Use the literal text "Office_Route"
```

while:

```html
[routerLink]="Office_Route"
```

means:

```text
Evaluate the TypeScript property
and use its value
```

### Memory Rule

```text
routerLink="office"
→ literal value

[routerLink]="Office_Route"
→ TypeScript value
```

---

# 4. Why Use Route Constants?

The transcript uses route constants so the route path and the RouterLink can share the same value.

Without a constant:

```ts
{
  path: 'office',
  component: OfficeComponent
}
```

and somewhere else:

```html
<a routerLink="office">
```

The word `office` is repeated in multiple places.

If the path changes later, every copy must be updated.

Instead:

```ts
export const Office_Route = 'office';
```

Then use the same constant in the route:

```ts
{
  path: Office_Route,
  component: OfficeComponent
}
```

Expose it to the template:

```ts
protected readonly Office_Route = Office_Route;
```

Then:

```html
<a [routerLink]="Office_Route">
  Office
</a>
```

Now:

```text
ONE route value

Office_Route = "office"

       ↙               ↘

app.routes.ts           app.html
path: Office_Route      [routerLink]="Office_Route"
```

### Why this helps

```text
Less duplication
Less chance of typos
Easier future refactoring
```

---

# 5. MyTaskHub RouterLink Example

## `app.routes.ts`

```ts
import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { OfficeComponent } from './office/office.component';
import { KidComponent } from './kid/kid.component';
import { LearningComponent } from './learning/learning.component';
import { HouseActivitiesComponent } from './house-activities/house-activities.component';
import { AngularComponent } from './angular/angular.component';
import { TypescriptComponent } from './typescript/typescript.component';
import { NotfoundComponent } from './notfound/notfound.component';

export const Home_Route = 'home';
export const Office_Route = 'office';
export const Learning_Route = 'learning';
export const Kid_Route = 'kid';
export const HouseActivities_Route = 'house-activities';

export const routes: Routes = [
  {
    path: Home_Route,
    component: HomeComponent,
  },
  {
    path: Office_Route,
    component: OfficeComponent,
  },
  {
    path: Learning_Route,
    children: [
      {
        path: '',
        component: LearningComponent,
      },
      {
        path: 'angular',
        component: AngularComponent,
      },
      {
        path: 'typescript',
        component: TypescriptComponent,
      },
    ],
  },
  {
    path: Kid_Route,
    component: KidComponent,
  },
  {
    path: HouseActivities_Route,
    component: HouseActivitiesComponent,
  },
  {
    path: '**',
    component: NotfoundComponent,
  },
];
```

## `app.ts`

To use `RouterLink` in a standalone component:

```ts
import {
  RouterLink,
  RouterOutlet
} from '@angular/router';
```

Then:

```ts
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
```

Expose the route constants to the template:

```ts
protected readonly Home_Route = Home_Route;
protected readonly Office_Route = Office_Route;
protected readonly Learning_Route = Learning_Route;
protected readonly Kid_Route = Kid_Route;
protected readonly HouseActivities_Route = HouseActivities_Route;
```

## `app.html`

```html
<nav class="main-nav">
  <a [routerLink]="Home_Route">Home</a>
  <a [routerLink]="Office_Route">Office</a>
  <a [routerLink]="Learning_Route">Learning</a>
  <a [routerLink]="HouseActivities_Route">Home Activities</a>
  <a [routerLink]="Kid_Route">Kid</a>
</nav>
```

Now clicking Office follows this flow:

```text
Click Office
      ↓
[routerLink]="Office_Route"
      ↓
Office_Route = "office"
      ↓
Router navigates
      ↓
URL becomes /office
      ↓
path: Office_Route matches
      ↓
OfficeComponent
      ↓
<router-outlet>
      ↓
Office page appears
```

---

# 6. Absolute vs Relative RouterLinks

Angular needs to know:

```text
Should this path start from the application root?

OR

Should this path be added to the current route?
```

## Absolute Navigation

An absolute path starts from the application's base/root route.

```html
<a routerLink="/office">
  Office
</a>
```

The leading `/` means:

```text
Start from root.
```

If you are currently at:

```text
/learning/angular
```

and navigate to:

```text
/office
```

the result is simply:

```text
/office
```

### Memory Rule

```text
Leading /
→ start from root
```

## Relative Navigation

Relative navigation starts from the current route.

Suppose the current route is:

```text
/learning
```

and the template contains:

```html
<a routerLink="angular">
  Angular
</a>
```

Angular combines:

```text
current route
/learning

+

angular

=

/learning/angular
```

This works naturally with your child routes.

Likewise:

```html
<a routerLink="typescript">
  TypeScript
</a>
```

from `/learning` becomes:

```text
/learning/typescript
```

---

# 7. `./` and `../`

Imagine the current route is:

```text
/learning/angular
```

## `./`

A dot means:

```text
Start from the current route.
```

Conceptually:

```text
./topic
```

means:

```text
current route
+
topic
```

## `../`

Two dots mean:

```text
Move up one route segment first.
```

From:

```text
/learning/angular
```

using `../` moves back toward:

```text
/learning
```

## `../../`

Two `../` operations remove two levels.

```text
/learning/angular/topic
          ↓ ../
/learning/angular
          ↓ ../
/learning
```

You do not need to memorize every possible combination now.

Remember:

```text
/
→ root

no leading /
→ relative

./
→ current level

../
→ up one level
```

---

# 8. Multi-Segment RouterLinks

A route can contain more than one segment.

Example:

```text
/learning/angular
```

RouterLink can receive multiple path segments:

```html
<a [routerLink]="['/learning', 'angular']">
  Angular
</a>
```

Angular combines:

```text
/learning
+
angular
↓
/learning/angular
```

The transcript also explains that route values can be:

```text
static strings
dynamic properties
arrays containing multiple route segments
```

This becomes useful when some part of the URL comes from data.

---

# 9. Why Relative Navigation Can Be Easier to Maintain

Suppose your application has:

```text
/learning/angular
```

and inside `LearningComponent` you write:

```html
<a routerLink="angular">
```

If the parent path later changes from:

```text
/learning
```

to:

```text
/study
```

the relative link can still mean:

```text
current parent
+
angular
```

Absolute paths may require more updates because the full structure is written explicitly.

That does not mean absolute navigation is wrong.

The important rule from the transcript is:

```text
Choose absolute or relative based on
how the component is expected to be used.
```

---

# 10. Styling Active Links

## What problem does this solve?

Users need to know:

```text
Which page am I currently on?
```

Angular knows which route is active.

`RouterLinkActive` lets the template visually reflect that.

Example:

```html
<a
  [routerLink]="Office_Route"
  routerLinkActive="active-link">
  Office
</a>
```

If the Office route is active:

```text
RouterLinkActive
      ↓
adds CSS class
      ↓
active-link
```

---

# 11. Import `RouterLinkActive`

In a standalone component, using the directive in HTML is not enough.

Import it:

```ts
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
```

Then add it to the component imports:

```ts
@Component({
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ]
})
```

The transcript demonstrates an important debugging lesson:

```text
RouterLinkActive in HTML
+
not imported
=
active styling does not work
```

### Memory Rule

```text
Use directive in standalone template
→ import the directive
```

---

# 12. MyTaskHub Active Navigation

Your navigation can be:

```html
<nav class="main-nav">
  <a
    [routerLink]="Home_Route"
    routerLinkActive="active-link"
    ariaCurrentWhenActive="page">
    Home
  </a>

  <a
    [routerLink]="Office_Route"
    routerLinkActive="active-link"
    ariaCurrentWhenActive="page">
    Office
  </a>

  <a
    [routerLink]="Learning_Route"
    routerLinkActive="active-link"
    ariaCurrentWhenActive="page">
    Learning
  </a>

  <a
    [routerLink]="HouseActivities_Route"
    routerLinkActive="active-link"
    ariaCurrentWhenActive="page">
    Home Activities
  </a>

  <a
    [routerLink]="Kid_Route"
    routerLinkActive="active-link"
    ariaCurrentWhenActive="page">
    Kid
  </a>
</nav>
```

---

# 13. Active Link CSS

Your CSS class:

```css
.active-link {
  background-color: rgb(211, 143, 104);
  border: solid 2px white;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
```

When a route is active:

```text
Current URL
     ↓
Router determines active route
     ↓
RouterLinkActive checks link
     ↓
route matches
     ↓
active-link CSS class is added
```

---

# 14. `ariaCurrentWhenActive`

Visual styling is helpful, but not every user can rely on visual changes.

The transcript adds:

```html
ariaCurrentWhenActive="page"
```

with:

```html
routerLinkActive="active-link"
```

Example:

```html
<a
  [routerLink]="Office_Route"
  routerLinkActive="active-link"
  ariaCurrentWhenActive="page">
  Office
</a>
```

Important distinction:

```text
RouterLinkActive
→ directive

ariaCurrentWhenActive
→ input belonging to RouterLinkActive
```

So you import `RouterLinkActive`, but you do not separately import `ariaCurrentWhenActive`.

---

# 15. `RouterLink` vs `RouterLinkActive`

Do not confuse these two.

```text
RouterLink
→ NAVIGATE

RouterLinkActive
→ STYLE / MARK the currently active navigation
```

Example:

```html
<a
  [routerLink]="Office_Route"
  routerLinkActive="active-link">
  Office
</a>
```

Flow:

```text
RouterLink
→ clicking goes to Office

RouterLinkActive
→ when Office is active, add active-link CSS
```

---

# 16. Navigating Programmatically

## What problem does this solve?

`RouterLink` works when navigation begins from the template:

```html
<a routerLink="...">
```

But sometimes navigation should happen because TypeScript logic finishes.

Examples from the transcript:

```text
User submits a form
      ↓
save succeeds
      ↓
navigate to confirmation page
```

or:

```text
User selects a product
      ↓
application stores selected product
      ↓
navigate to product detail
```

In those cases, navigation happens in TypeScript code.

Angular's `Router` service provides:

```text
navigate()
navigateByUrl()
```

---

# 17. `navigateByUrl()`

`navigateByUrl()` navigates using an absolute route URL.

Conceptually:

```ts
this.router.navigateByUrl('/office');
```

means:

```text
Go directly to /office
```

The transcript explains that it accepts a path string or URL tree and optional navigation behavior options.

For beginner understanding:

```text
navigateByUrl()
→ navigate using a complete destination URL
```

---

# 18. `navigate()`

`navigate()` accepts an array of path segments.

Example:

```ts
this.router.navigate([
  '/learning',
  'angular'
]);
```

Angular combines:

```text
/learning
+
angular
↓
/learning/angular
```

The transcript describes `navigate()` as easier to configure when navigation becomes more complex.

It can also support things such as:

```text
relative navigation
query parameters
navigation state
browser history options
```

Those details will become clearer as later routing topics are introduced.

### Memory Rule

```text
navigateByUrl()
→ complete URL

navigate()
→ route segments + navigation options
```

---

# 19. Injecting the Router

To navigate from TypeScript code, the component needs access to Angular's `Router`.

Example:

```ts
import { Router } from '@angular/router';
import { inject } from '@angular/core';
```

Then:

```ts
router = inject(Router);
```

Now TypeScript can call:

```ts
this.router.navigate(...)
```

or:

```ts
this.router.navigateByUrl(...)
```

---

# 20. Example: Programmatic Navigation in MyTaskHub

Suppose a method should take the user to Angular learning.

```ts
goToAngular() {
  this.router.navigate([
    '/learning',
    'angular'
  ]);
}
```

Flow:

```text
Method runs
    ↓
router.navigate(...)
    ↓
Angular builds URL
    ↓
/learning/angular
    ↓
Router checks routes
    ↓
Learning parent route
    ↓
Angular child route
    ↓
AngularComponent
```

This demonstrates navigation from TypeScript rather than from an `<a>` element.

---

# 21. Relative Programmatic Navigation

The transcript also demonstrates that `navigate()` can start from the current `ActivatedRoute`.

Conceptually:

```text
Current route
+
new route segments
=
new destination
```

This requires an `ActivatedRoute` starting point.

The important beginner idea is:

```text
Router
→ performs navigation

ActivatedRoute
→ represents where we currently are
```

If we use the current route as the starting point, Angular performs relative navigation.

---

# 22. Why Relative Programmatic Navigation Can Go Wrong

The transcript gives this example:

```text
Current URL:
/home
```

Then code tries to navigate relatively to:

```text
products/detail
```

Angular produces:

```text
/home/products/detail
```

But the desired route was:

```text
/products/detail
```

The reason:

```text
ActivatedRoute was used as the starting point
        ↓
current /home segment was retained
        ↓
new segments were added after it
```

This is an important debugging question:

```text
Did Angular start from the current route
when I actually wanted to start from root?
```

---

# 23. Two Ways to Fix the Wrong Relative Path

## Option 1 — Move Up First

Use:

```text
../
```

before adding the next segments.

Conceptually:

```text
/home
  ↓
../
  ↓
/
  ↓
products/detail
  ↓
/products/detail
```

## Option 2 — Use Absolute Navigation

Do not give the current route as the starting point.

Navigate from root instead.

Conceptually:

```text
/products/detail
```

The instructor chooses the absolute route in that example because the component should always navigate to the same destination.

---

# 24. How to Choose: Absolute or Relative?

Ask:

```text
Does this component always navigate to the same application route?
```

If yes:

```text
Absolute navigation may be simpler.
```

If the destination should depend on where the component is currently used:

```text
Relative navigation may be more reusable.
```

This is the main decision the transcript is teaching.

---

# 25. How This Applies to MyTaskHub Topics

Your application structure is:

```text
/learning
    ↓
/learning/angular
/learning/typescript
```

Later, each technology page can contain many topics.

Conceptually:

```text
/learning/angular
    ↓
click a topic
    ↓
route based on selected topic
```

and:

```text
/learning/typescript
    ↓
click a topic
    ↓
route based on selected topic
```

The exact dynamic topic URL will make more sense when the course introduces route parameters.

For now, the important connection is:

```text
Template click that directly represents navigation
→ RouterLink

TypeScript method must do something first,
then navigate
→ Router service
```

---

# 26. Template Navigation vs Programmatic Navigation

## Template

```html
<a [routerLink]="Office_Route">
  Office
</a>
```

Use when clicking the element simply means:

```text
Go to this route.
```

## Programmatic

```ts
this.router.navigate([
  '/learning',
  'angular'
]);
```

Use when:

```text
Run some TypeScript logic
        ↓
then navigate
```

Examples:

```text
Save
↓
success
↓
navigate
```

```text
Select something
↓
store/update value
↓
navigate
```

### Memory Rule

```text
RouterLink
→ navigation from HTML

Router
→ navigation from TypeScript
```

---

# 27. Full MyTaskHub Navigation Flow

## Normal Header Navigation

```text
User clicks Office
       ↓
RouterLink
       ↓
Office_Route = "office"
       ↓
Router service navigates
       ↓
URL = /office
       ↓
route matches
       ↓
OfficeComponent
       ↓
RouterOutlet
```

## Active Styling

```text
URL = /office
       ↓
Office route is active
       ↓
RouterLinkActive
       ↓
active-link CSS added
       ↓
ariaCurrentWhenActive = "page"
```

## Programmatic Navigation

```text
TypeScript method runs
       ↓
Router.navigate(...)
       ↓
Angular builds destination URL
       ↓
route matches
       ↓
view changes
```

---

# Navigation Cheat Sheet

| Concept | What to remember |
|---|---|
| `RouterLink` | Navigate from the template |
| `<a>` + `RouterLink` | Preferred navigation element |
| `[routerLink]` | Bind a TypeScript value |
| `/path` | Absolute navigation from root |
| `path` | Relative to current route |
| `./` | Current route level |
| `../` | Move up one route level |
| `['/learning', 'angular']` | Multi-segment navigation |
| Route constants | Reuse the same path value and avoid typos |
| `RouterLinkActive` | Add styles when a route is active |
| `ariaCurrentWhenActive="page"` | Identify current page for assistive technology |
| `Router` | Service used for navigation from TypeScript |
| `navigate()` | Navigate using path segments/options |
| `navigateByUrl()` | Navigate using a complete URL |
| `ActivatedRoute` | Represents the current route; useful for relative navigation |

---

# Final Memory Map

```text
ROUTES
→ define available URLs
```

```text
RouterLink
→ user clicks in HTML
→ URL changes
```

```text
RouterLinkActive
→ identify current route
→ apply active style
```

```text
Router
→ TypeScript navigates
```

```text
Absolute
→ start from root

Relative
→ start from current route
```

```text
RouterLink = HTML navigation
Router      = TypeScript navigation
```

---

# Most Important Flow to Remember

```text
User clicks link
      ↓
RouterLink
      ↓
Router service
      ↓
URL changes
      ↓
route configuration is checked
      ↓
matching route
      ↓
component
      ↓
RouterOutlet
      ↓
new view appears
```

And when navigation must happen from code:

```text
TypeScript logic
      ↓
Router.navigate(...)
      ↓
URL changes
      ↓
matching route
      ↓
view changes
```
