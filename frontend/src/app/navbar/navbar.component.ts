import { Component, inject, OnInit } from '@angular/core';
import {AuthService} from "../authentication/auth.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
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
}
