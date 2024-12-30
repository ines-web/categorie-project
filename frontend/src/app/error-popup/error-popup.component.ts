import { Component, OnInit } from '@angular/core';
import { ErrorService } from './error.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'error-pop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss']
})
export class ErrorPopupComponent implements OnInit {
  errorMessage: string = '';

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    this.errorService.error$.subscribe((message: string) => {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = '';
      }, 3500);
    });
  }
}