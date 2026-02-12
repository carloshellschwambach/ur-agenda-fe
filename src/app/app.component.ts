import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ur-agenda';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Inicializa o tema na aplicação
    // O ThemeService já aplica automaticamente o tema ao ser injetado
  }
}
