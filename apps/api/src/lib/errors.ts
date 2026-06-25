export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'OAUTH_DENIED'
  | 'OAUTH_PROFILE_INCOMPLETE'
  | 'INTERNAL_ERROR'

export class AppError extends Error {
  readonly status: number
  readonly code: ErrorCode

  constructor(message: string, status: number, code: ErrorCode) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
  }
}

// Helpers pour les cas fréquents
export const Errors = {
  unauthorized: (msg = 'Non authentifié') => new AppError(msg, 401, 'UNAUTHORIZED'),
  notFound: (msg = 'Ressource introuvable') => new AppError(msg, 404, 'NOT_FOUND'),
  oauthDenied: () => new AppError('Consentement OAuth refusé', 400, 'OAUTH_DENIED'),
  oauthProfileIncomplete: () => new AppError('Profil Google incomplet', 400, 'OAUTH_PROFILE_INCOMPLETE'),
  internal: (msg = 'Erreur serveur') => new AppError(msg, 500, 'INTERNAL_ERROR'),
} as const
