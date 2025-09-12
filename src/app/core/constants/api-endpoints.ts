// src/app/core/constants/api-endpoints.ts

export const API_CONFIG = {
  // URLs base de los microservicios
  SECURITY_SERVICE: 'https://api-security.magicdreams.com/api/v1',
  BUSINESS_SERVICE: 'https://api-business.magicdreams.com/api/v1',
  NOTIFICATIONS_SERVICE: 'https://api-notifications.magicdreams.com/api/v1',
  
  // Configuración de headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30 segundos
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo
};

export const SECURITY_ENDPOINTS = {
  // Autenticación
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  
  // Usuario
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
  DELETE_ACCOUNT: '/user/delete-account',
  
  // Roles y permisos
  ROLES: '/roles',
  PERMISSIONS: '/permissions',
  USER_ROLES: '/user/roles',
  USER_PERMISSIONS: '/user/permissions',
  
  // Sesiones
  ACTIVE_SESSIONS: '/user/sessions',
  REVOKE_SESSION: '/user/sessions',
  REVOKE_ALL_SESSIONS: '/user/sessions/revoke-all',
};

export const BUSINESS_ENDPOINTS = {
  // Tours
  TOURS: '/tours',
  TOUR_BY_ID: (id: string) => `/tours/${id}`,
  TOUR_SEARCH: '/tours/search',
  TOUR_CATEGORIES: '/tours/categories',
  TOUR_DESTINATIONS: '/tours/destinations',
  TOUR_AVAILABILITY: (id: string) => `/tours/${id}/availability`,
  TOUR_REVIEWS: (id: string) => `/tours/${id}/reviews`,
  TOUR_GALLERY: (id: string) => `/tours/${id}/gallery`,
  
  // Reservas
  BOOKINGS: '/bookings',
  BOOKING_BY_ID: (id: string) => `/bookings/${id}`,
  USER_BOOKINGS: '/user/bookings',
  CREATE_BOOKING: '/bookings',
  CANCEL_BOOKING: (id: string) => `/bookings/${id}/cancel`,
  CONFIRM_BOOKING: (id: string) => `/bookings/${id}/confirm`,
  BOOKING_STATUS: (id: string) => `/bookings/${id}/status`,
  
  // Pagos
  PAYMENTS: '/payments',
  PAYMENT_BY_ID: (id: string) => `/payments/${id}`,
  PROCESS_PAYMENT: '/payments/process',
  PAYMENT_METHODS: '/payments/methods',
  PAYMENT_STATUS: (id: string) => `/payments/${id}/status`,
  REFUND_PAYMENT: (id: string) => `/payments/${id}/refund`,
  
  // Destinos
  DESTINATIONS: '/destinations',
  DESTINATION_BY_ID: (id: string) => `/destinations/${id}`,
  POPULAR_DESTINATIONS: '/destinations/popular',
  DESTINATION_TOURS: (id: string) => `/destinations/${id}/tours`,
  
  // Promociones y descuentos
  PROMOTIONS: '/promotions',
  ACTIVE_PROMOTIONS: '/promotions/active',
  PROMOTION_BY_CODE: (code: string) => `/promotions/code/${code}`,
  VALIDATE_COUPON: '/promotions/validate-coupon',
  
  // Reviews y calificaciones
  REVIEWS: '/reviews',
  CREATE_REVIEW: '/reviews',
  REVIEW_BY_ID: (id: string) => `/reviews/${id}`,
  USER_REVIEWS: '/user/reviews',
  
  // Favoritos
  FAVORITES: '/user/favorites',
  ADD_FAVORITE: '/user/favorites',
  REMOVE_FAVORITE: (id: string) => `/user/favorites/${id}`,
  
  // Dashboard y estadísticas
  DASHBOARD_STATS: '/dashboard/stats',
  BOOKING_ANALYTICS: '/analytics/bookings',
  REVENUE_ANALYTICS: '/analytics/revenue',
  USER_ANALYTICS: '/analytics/users',
  
  // Configuraciones
  SETTINGS: '/settings',
  COMPANY_INFO: '/settings/company',
  BOOKING_POLICIES: '/settings/booking-policies',
  CANCELLATION_POLICIES: '/settings/cancellation-policies',
};

export const NOTIFICATIONS_ENDPOINTS = {
  // Notificaciones generales
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_BY_ID: (id: string) => `/notifications/${id}`,
  USER_NOTIFICATIONS: '/user/notifications',
  MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_AS_READ: '/notifications/read-all',
  DELETE_NOTIFICATION: (id: string) => `/notifications/${id}`,
  CLEAR_ALL_NOTIFICATIONS: '/notifications/clear-all',
  
  // Configuraciones de notificaciones
  NOTIFICATION_PREFERENCES: '/user/notification-preferences',
  UPDATE_PREFERENCES: '/user/notification-preferences',
  NOTIFICATION_TYPES: '/notification-types',
  
  // Push notifications
  SUBSCRIBE_PUSH: '/push/subscribe',
  UNSUBSCRIBE_PUSH: '/push/unsubscribe',
  PUSH_PREFERENCES: '/push/preferences',
  
  // Email notifications
  EMAIL_PREFERENCES: '/email/preferences',
  UNSUBSCRIBE_EMAIL: '/email/unsubscribe',
  EMAIL_TEMPLATES: '/email/templates',
  
  // SMS notifications
  SMS_PREFERENCES: '/sms/preferences',
  VERIFY_PHONE: '/sms/verify-phone',
  SMS_TEMPLATES: '/sms/templates',
  
  // Notificaciones en tiempo real (WebSocket)
  REALTIME_CONNECT: '/realtime/connect',
  REALTIME_DISCONNECT: '/realtime/disconnect',
  REALTIME_SUBSCRIBE: '/realtime/subscribe',
  REALTIME_UNSUBSCRIBE: '/realtime/unsubscribe',
  
  // Plantillas de notificaciones
  TEMPLATES: '/templates',
  TEMPLATE_BY_ID: (id: string) => `/templates/${id}`,
  CREATE_TEMPLATE: '/templates',
  UPDATE_TEMPLATE: (id: string) => `/templates/${id}`,
  DELETE_TEMPLATE: (id: string) => `/templates/${id}`,
  
  // Envío de notificaciones masivas
  BULK_SEND: '/bulk-send',
  BULK_STATUS: (id: string) => `/bulk-send/${id}/status`,
  BULK_CANCEL: (id: string) => `/bulk-send/${id}/cancel`,
  
  // Logs y auditoría
  NOTIFICATION_LOGS: '/logs',
  DELIVERY_STATUS: '/delivery-status',
  BOUNCE_REPORTS: '/bounce-reports',
  OPEN_TRACKING: '/tracking/opens',
  CLICK_TRACKING: '/tracking/clicks',
};

// Helper para construir URLs completas
export class ApiUrlBuilder {
  static security(endpoint: string): string {
    return `${API_CONFIG.SECURITY_SERVICE}${endpoint}`;
  }
  
  static business(endpoint: string): string {
    return `${API_CONFIG.BUSINESS_SERVICE}${endpoint}`;
  }
  
  static notifications(endpoint: string): string {
    return `${API_CONFIG.NOTIFICATIONS_SERVICE}${endpoint}`;
  }
}

// Configuración de ambientes
export const ENVIRONMENT_CONFIG = {
  development: {
    SECURITY_SERVICE: 'http://localhost:3001/api/v1',
    BUSINESS_SERVICE: 'http://localhost:3002/api/v1',
    NOTIFICATIONS_SERVICE: 'http://localhost:3003/api/v1',
  },
  staging: {
    SECURITY_SERVICE: 'https://staging-api-security.magicdreams.com/api/v1',
    BUSINESS_SERVICE: 'https://staging-api-business.magicdreams.com/api/v1',
    NOTIFICATIONS_SERVICE: 'https://staging-api-notifications.magicdreams.com/api/v1',
  },
  production: {
    SECURITY_SERVICE: 'https://api-security.magicdreams.com/api/v1',
    BUSINESS_SERVICE: 'https://api-business.magicdreams.com/api/v1',
    NOTIFICATIONS_SERVICE: 'https://api-notifications.magicdreams.com/api/v1',
  },
};