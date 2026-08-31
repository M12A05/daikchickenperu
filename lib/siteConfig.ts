export const SITE_NAME = 'Dais Chicken';
export const SITE_URL = 'https://daischicken.com.pe';

export const WHATSAPP_NUMBER = '51988497350';

export const PHONE_DISPLAY = '988 497 350';

export const ADDRESS = 'Roberto Thorndike Galup 1500, Lima 15081, Perú';

export const SCHEDULE = 'Lunes a Domingo: 12:00 PM - 11:00 PM';

export const PAYMENT_METHODS = ['Yape', 'Plin', 'Efectivo', 'Tarjeta'] as const;
export type PaymentMethod = typeof PAYMENT_METHODS[number];
