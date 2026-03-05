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

  // Check if user is authenticated and has the required role
  if (authService.isAuthenticated() && authService.hasAnyRole(expectedRoles)) {
    return true;
  }

  // Se não tiver permissão, redireciona para agendamentos com aviso
  toastr.error('Você não tem permissão para acessar esta tela.', 'Acesso Negado');
  router.navigate(['/appointments']);
  return false;
};
