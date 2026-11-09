import { Routes } from '@angular/router';
import { Login } from './auth/components/login/login';
import { Register } from './auth/components/register/register';
import { Home } from './home/components/home';
import { authGuard } from './shared/guards/auth-guard';
import { SalaForm } from './sala/components/sala-form/sala-form';
import { SalaList } from './sala/components/sala-list/sala-list';
import { MapaVisor } from './mapa/components/mapa-visor/mapa-visor';
import { PuestoForm } from './puesto/components/puesto-form/puesto-form';
import { ReservaForm } from './reserva/components/reserva-form/reserva-form';
import { ReservaList } from './reserva/components/reserva-list/reserva-list';
import { Profile } from './usuario/components/profile/profile';
import { PuestoList } from './puesto/components/puesto-list/puesto-list';
import { UsuarioList } from './usuario/components/usuario-list/usuario-list';

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
  },
  {
    path: 'puesto/list',
    component: PuestoList,
    canActivate: [authGuard],
  },
  {
    path: 'reserva/form',
    component: ReservaForm,
    canActivate: [authGuard],
  },
  {
    path: 'reserva/form/:id',
    component: ReservaForm,
    canActivate: [authGuard],
  },
  {
    path: 'reserva/list',
    component: ReservaList,
    canActivate: [authGuard],
  },
  {
    path: 'usuario/profile',
    component: Profile,
    canActivate: [authGuard],
  },  
  {
    path: 'usuario/list',
    component: UsuarioList,
    canActivate: [authGuard],
  },
];
