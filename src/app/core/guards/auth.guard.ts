import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (authService.isAuthenticated()) {
    return true;
  }

  // Se tem token na string mas não está autenticado, significa que expirou
  if (token && authService.isTokenExpired(token)) {
    try {
      // Usaremos injeção síncrona
      const toastr = inject(import('ngx-toastr').then(m => m.ToastrService) as any);
      (toastr as any).warning('Sua sessão expirou. Por favor, faça login novamente.', 'Sessão Expirada');
    } catch (e) { /* Ignora se o toastr não estiver acessível */ }

    authService.logout();
  }

  // Redireciona para login se não autenticado (ou expirou)
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
