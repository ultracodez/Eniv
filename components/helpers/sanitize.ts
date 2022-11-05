import sanitizeHtml from 'sanitize-html';
import { urlify } from './urlify';

export function sanitize(stringToSanitize: string): string {
  return sanitizeHtml(stringToSanitize);
}

export function sanitizeAndAddLinks(stringToSanitize: string) {
  return sanitize(urlify(stringToSanitize));
}
