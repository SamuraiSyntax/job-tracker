import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@models/index';
import { environment } from '@env/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private http = inject(HttpClient);
  private router = inject(Router);
  private storage = inject(StorageService);

  // Signals pour une réactivité optimale
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  private tokenSignal = signal<string | null>(this.loadTokenFromStorage());

  // Computed signals
  isAuthenticated = computed(() => !!this.tokenSignal());
  getCurrentUser = computed(() => this.currentUserSignal());

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => this.handleAuthentication(response)),
      catchError(this.handleError)
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData).pipe(
      tap(response => this.handleAuthentication(response)),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.storage.removeItem(this.TOKEN_KEY);
    this.storage.removeItem(this.USER_KEY);
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private handleAuthentication(response: AuthResponse): void {
    this.storage.setItem(this.TOKEN_KEY, response.token);
    this.storage.setItemStringified(this.USER_KEY, response.user);
    this.tokenSignal.set(response.token);
    this.currentUserSignal.set(response.user);
  }

  private loadUserFromStorage(): User | null {
    return this.storage.getItemParsed<User>(this.USER_KEY);
  }

  private loadTokenFromStorage(): string | null {
    return this.storage.getItem(this.TOKEN_KEY);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.status === 400 || error.status === 401) {
        errorMessage = error.error?.message || 'Email ou mot de passe incorrect';
      } else if (error.status === 409) {
        errorMessage = error.error?.message || 'L\'email est déjà utilisé';
      } else if (error.status === 0) {
        errorMessage = 'Impossible de contacter le serveur';
      }
    }
    
    return throwError(() => ({ message: errorMessage }));
  }
}
