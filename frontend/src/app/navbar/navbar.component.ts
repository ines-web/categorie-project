import { Component, inject, OnInit } from '@angular/core';
import {AuthService} from "../authentication/auth.service";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) {}
  authService = inject(AuthService);
  http = inject(HttpClient);

  logout() {
    this.authService.logout()
  }

  get username(): string {
    return this.authService.getUsername();
  }

  ngOnInit(): void {
    this.http.get<string>('/api/secured').subscribe(console.log)
  }

  public goToHomePage(event: Event): void {
    event.preventDefault(); // Empêche le comportement par défaut du lien
    this.router.navigate(['/accueil']);
  }
}
