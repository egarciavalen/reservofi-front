import { Routes } from '@angular/router';
import { Login } from './auth/components/login/login';
import { Register } from './auth/components/register/register';
import { Home } from './home/components/home';
import { Debug } from './shared/components/debug/debug';
import { authGuard } from './shared/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'debug',
    component: Debug,
    canActivate: [authGuard],
  }
];
