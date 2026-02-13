import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
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

  @Output() toggleStateChange = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
    this.toggleStateChange.emit(this.isExpanded === false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  navigateTo(path: string): void {
    console.log('Navigating to:', path);
    this.router.navigate([path]).then(success => {
      if (!success) {
        console.error('Navigation failed to:', path);
      }
    });
  }
}
