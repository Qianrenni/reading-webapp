import { describe, it, expect } from 'vitest';
import { DEFAULT_AVATAR } from '../avatar';

describe('DEFAULT_AVATAR', () => {
  it('指向后端静态头像资源', () => {
    expect(DEFAULT_AVATAR.endsWith('/static/guga.webp')).toBe(true);
    expect(DEFAULT_AVATAR).toContain('/static/guga.webp');
  });
});
