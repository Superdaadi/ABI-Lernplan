import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


interface Fach {
  name: string;
  kuerzel: string;
  route: string;
  farbe: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private router = inject(Router);

  facher: Fach[] = [
    {
      name: 'Mathematik',
      kuerzel: 'MA',
      route: '/mathe',
      farbe: 'gruen'
    },
    {
      name: 'Physik',
      kuerzel: 'PH',
      route: '/physik',
      farbe: 'blau'
    }
  ];

  planInhalt = '';
  planLoading = false;
  planFehler = '';

  navigiereZuLernplan(fach: Fach): void {
    this.router.navigate([fach.route]);
  }
}