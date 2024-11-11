import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new Subject<string>();
  public error$ = this.errorSubject.asObservable();

  constructor() { }

  errorEvent(errorMessage: string) {
    this.errorSubject.next(errorMessage);
  }
}