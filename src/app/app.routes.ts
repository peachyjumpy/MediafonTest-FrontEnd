import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ApplicationsComponent } from './components/applications/applications';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'applications', component: ApplicationsComponent, canActivate: [authGuard]},
    { path: '', redirectTo: 'login', pathMatch: 'full'}
];
