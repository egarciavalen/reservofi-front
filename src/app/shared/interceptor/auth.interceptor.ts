import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../../auth/services/local-storage-service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {

  // Inyección de dependencias
  const localStorageService = inject(LocalStorageService);
  
  // Búsqueda del token
  const token = localStorageService.get('token');

  // Si el token existe se intercepta la petición y se incluye en la cabecera
  if (token) {
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }
  
  // Continúa con la petición
  return next(req);
}
