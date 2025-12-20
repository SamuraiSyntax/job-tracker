import { User } from './user.model';

/**
 * Requête de connexion
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Requête d'inscription
 */
export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

/**
 * Réponse d'authentification
 */
export interface AuthResponse {
  token: string;
  user: User;
}
