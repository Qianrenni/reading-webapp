import { del, get, post } from '../utils';

export const useApiBookShelf = {
  add: async (bookId: number) => {
    return await post(`/shelf/add`, {
      bookId: bookId,
    });
  },
  get: async (): Promise<{
    success: boolean;
    data: { bookId: number; createdAt: string }[] | null;
    message: string | null;
  }> => {
    return await get<
      {
        bookId: number;
        createdAt: string;
      }[]
    >(`/shelf/get`);
  },
  delete: async (bookId: number) => {
    return await del(`/shelf/delete/${bookId}`);
  },
};
