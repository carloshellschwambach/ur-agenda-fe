import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { SidebarService } from '../../services/sidebar.service';
import { User } from '../../models/user.model';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, ThemeToggleComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isExpanded = true;
  user: User | null = null;
  canManageUsers = false;

  @Output() toggleStateChange = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      console.log('Sidebar User:', user);
      this.user = user;
      this.canManageUsers = this.authService.hasAnyRole(['ADMIN', 'OWNER', 'MANAGER', 'EMPLOYEE']);
      console.log('Can Manage Users:', this.canManageUsers);
      if (user) {
        console.log('User Roles:', user.roles);
      }
    });
  }

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
    this.sidebarService.setExpanded(this.isExpanded);
    this.toggleStateChange.emit(this.isExpanded === false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  navigateTo(path: string): void {
    console.log('Navigating to:', path);
    // Verificar se o caminho destino é o mesmo da rota atual, se sim, não faz nada
    if (this.router.url === path || this.router.url === `${path}`) {
      // Se já estamos no caminho, apenas verifica se expirou manualmente,
      // pois o Angular não dispara o Router Guard de novo pra mesma rota.
      const token = this.authService.getToken();
      if (token && this.authService.isTokenExpired(token)) {
        this.authService.logout();

        try {
          const toastr: any = this.router.routerState.snapshot.root;
          // Não temos acesso fácil ao toastr aqui, mas o authService.logout
          // já limpa a sessão. Na tentativa de reload ele joga pro login.
        } catch (e) { }

        this.router.navigate(['/auth/login']);
      }
      return;
    }

    this.router.navigate([path]).then(success => {
      if (!success) {
        console.warn('Navigation cancelled or failed for path:', path);
      }
    }).catch(err => {
      console.warn('Navigation error:', err);
    });
  }
}
