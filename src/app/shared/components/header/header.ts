import { Component, inject } from '@angular/core';
import { LocalStorageService } from '../../../auth/services/local-storage-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  
  home(): void {
    this.router.navigateByUrl('home');
  }

  login(): void {
    this.router.navigateByUrl('login');
  }

  register(): void {
    this.router.navigateByUrl('register');
  }

  logout(): void {
    this.localStorageService.remove('idUsuario');
    this.localStorageService.remove('token');
    
    // Navegación al login
    this.router.navigateByUrl('login');
  }

}
