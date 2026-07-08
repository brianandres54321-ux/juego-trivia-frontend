import { buildSocketUrl } from './config';

describe('buildSocketUrl', () => {
  it('preserva una URL ya apuntando al endpoint de WebSocket', () => {
    expect(buildSocketUrl('wss://example.com/ws')).toBe('wss://example.com/ws');
  });

  it('agrega /ws si la URL base no lo incluye', () => {
    expect(buildSocketUrl('https://example.com')).toBe('https://example.com/ws');
  });
});
