export interface ITelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username: string;
  language_code: 'ru' | 'en';
  is_premium: boolean;
}