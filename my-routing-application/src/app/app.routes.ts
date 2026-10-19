import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OfficeComponent } from './office/office.component';
import { KidComponent } from './kid/kid.component';
import { LearningComponent } from './learning/learning.component';
import { HouseActivitiesComponent } from './house-activities/house-activities.component';
import { AngularComponent } from './angular/angular.component';
import { TypescriptComponent } from './typescript/typescript.component';
import { NotfoundComponent } from './notfound/notfound.component';
export const Home_Route='home'
export const Office_Route='office'
export const Learning_Route='learning'
export const kid_Route='kid'
export const HouseActivities_Route='house-activities'

export const routes: Routes = [
    {
        path:'home',
        component:HomeComponent,
    },
    {
        path:'office',
        component:OfficeComponent,
    },
    {
        path:'learning',
        children:[
            {
                path:'',
                component:LearningComponent,
            },
            {
                path:'angular',
                component:AngularComponent,
            },
            {
                path:'typescript',
                component:TypescriptComponent,
            },
        ]
        
    },
    {
        path:'kid',
        component:KidComponent,
    },
    {
        path:'house-activities',
        component:HouseActivitiesComponent,
    },
    {
        path:'**',
        component:NotfoundComponent,
    }
];
