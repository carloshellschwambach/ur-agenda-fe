import { Component, OnInit, Input } from '@angular/core';

import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit {
  @Input() variant: 'emoji' | 'svg' = 'svg';
  currentTheme: Theme = 'light';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
