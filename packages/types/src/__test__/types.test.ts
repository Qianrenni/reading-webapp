import { describe, it, expectTypeOf } from 'vitest';
import type { ResponseModel, Book, BookMeta, MenuItem } from '../index';

/**
 * 共享类型包为纯类型声明，测试以类型断言（expectTypeOf）锁定关键结构，
 * 防止前后端字段漂移。
 */
describe('共享类型结构', () => {
  it('ResponseModel<T> 结构', () => {
    expectTypeOf<ResponseModel<number>>().toEqualTypeOf<{
      code: number;
      data: number;
      message: string;
    }>();
  });

  it('Book 关键字段', () => {
    expectTypeOf<Book>().toHaveProperty('id');
    expectTypeOf<Book>().toHaveProperty('name');
    expectTypeOf<Book>().toHaveProperty('author');
    expectTypeOf<Book>().toHaveProperty('status');
    expectTypeOf<Book['id']>().toEqualTypeOf<number>();
    expectTypeOf<Book['parentId']>().toEqualTypeOf<number | null>();
  });

  it('BookMeta cover 可空', () => {
    expectTypeOf<BookMeta['cover']>().toEqualTypeOf<string | null>();
  });

  it('MenuItem 结构', () => {
    expectTypeOf<MenuItem>().toEqualTypeOf<{
      name: string;
      path: string;
      icon: string;
    }>();
  });
});
