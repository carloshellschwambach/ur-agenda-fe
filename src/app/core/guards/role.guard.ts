import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  // Extract roles from the route data
  const expectedRoles = route.data['roles'] as Array<string>;

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    // If not authenticated (or expired), don't redirect to appointments.
    // Let authGuard handle the routing to login. Just return false here.
    return false;
  }

  // Se o usuário está autenticado, mas não tem a role necessária
  if (!authService.hasAnyRole(expectedRoles)) {
    // Se não tiver permissão, redireciona para agendamentos com aviso
    toastr.error('Você não tem permissão para acessar esta tela.', 'Acesso Negado');
    router.navigate(['/appointments']);
    return false;
  }

  return true;
};
