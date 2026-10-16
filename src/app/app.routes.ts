import { Routes } from '@angular/router';
import { Login } from './auth/components/login/login';
import { Register } from './auth/components/register/register';
import { Home } from './home/components/home';
import { Debug } from './shared/components/debug/debug';
import { authGuard } from './shared/guards/auth-guard';
import { SalaForm } from './sala/components/sala-form/sala-form';
import { SalaList } from './sala/components/sala-list/sala-list';
import { MapaVisor } from './mapa/components/mapa-visor/mapa-visor';
import { PuestoForm } from './puesto/components/puesto-form/puesto-form';

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
  },
  {
    path: 'sala/form',
    component: SalaForm,
    canActivate: [authGuard],
  },
  {
    path: 'sala/form/:id',
    component: SalaForm,
    canActivate: [authGuard],
  },
  {
    path: 'sala/list',
    component: SalaList,
    canActivate: [authGuard],
  },
  {
    path: 'mapa/visor',
    component: MapaVisor,
    canActivate: [authGuard],
  },
  {
    path: 'puesto/form',
    component: PuestoForm,
    canActivate: [authGuard],
  }
];
