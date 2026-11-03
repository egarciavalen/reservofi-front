import { Component, inject, signal, WritableSignal } from '@angular/core';
import { LocalStorageService } from '../../../auth/services/local-storage-service';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  // De forma estática para que puedan cambiarlo otros componentes
  // Esto cambiará con una implementación con Redux
  static usuarioAutenticado: WritableSignal<boolean> = signal(false);
  autenticado = Header.usuarioAutenticado;

  home(): void {
    this.router.navigateByUrl('home');
  }

  login(): void {
    this.router.navigateByUrl('login');
  }

  register(): void {
    this.router.navigateByUrl('register');
  }

  map(): void {
    this.router.navigateByUrl('mapa/visor');
  }

  salaList(): void {
    this.router.navigateByUrl('sala/list');
  }

  reservaList(): void {
    this.router.navigateByUrl('reserva/list');
  }

  logout(): void {
    this.localStorageService.remove('idUsuario');
    this.localStorageService.remove('token');
    
    // Se cambian las opciones del menú
    Header.usuarioAutenticado.set(false);

    // Navegación al login
    this.router.navigateByUrl('login');
  }


}
