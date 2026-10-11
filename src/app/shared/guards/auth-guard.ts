import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from '../../auth/services/local-storage-service';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, RouterStateSnapshot) => {
  // Inyección de dependencias
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);

  // Búsqueda del token
  const token = localStorageService.get('token');
  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false; 
  }};