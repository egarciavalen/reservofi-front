import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from '../../auth/services/local-storage-service';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { firstValueFrom } from 'rxjs';


export const adminGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, RouterStateSnapshot) => {

  // Inyección de dependencias
  const localStorageService = inject(LocalStorageService);
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  const idUsuario = localStorageService.get('idUsuario');
  const token = localStorageService.get('token');

  if (!token || !idUsuario) {
    // Si no se detecta token, redirecciona a /home y finaliza
    router.navigate(['/home']);
    return false;
  }

  // Comprobación del rol administrador
  const isAdmin = await firstValueFrom(usuarioService.checkAdmin(idUsuario));

  if (isAdmin) {
    return true;
  } else {
    // Si el usuario NO es administrador, redirecciona a /home y finaliza
    router.navigate(['/home']);
    return false;    
  }
};