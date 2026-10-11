import { Routes } from '@angular/router';
import { Login } from './auth/components/login/login';
import { Register } from './auth/components/register/register';
import { Home } from './home/components/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  }
];
