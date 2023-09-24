import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Observable to notify when the user is logged out
  loggedOut$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // You can initialize the authentication status based on a token in localStorage
    this.isAuthenticatedSubject.next(this.isAuthenticated());
  }

  isAuthenticated(): boolean {
    // Implement your logic to check if the user is authenticated (e.g., check for a token)
    const token = localStorage.getItem('token');
    return !!token; // Return true if the token exists, else false
  }

  login(token: string): void {
    // Implement your logic to set the user as authenticated (e.g., save the token)
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    // Implement your logic to clear the user's authentication status (e.g., remove the token)
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
  }
}
