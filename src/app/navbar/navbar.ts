import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Effect to handle side effects when isDarkMode changes
    effect(() => {
      const dark = this.isDarkMode();
      if (dark) {
        document.body.classList.add('darkmode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('darkmode');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.isDarkMode.set(true);
    } else {
      this.isDarkMode.set(false);
    }
  }

  toggleDarkMode() {
    this.isDarkMode.update(v => !v);
  }
}
