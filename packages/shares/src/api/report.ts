import { post } from '../utils';

export type EventType = 'enter' | 'heartbeat' | 'exit';
export const useApiReport = {
  prefix: '/statistic',
  /**
   * 上报阅读情况
   * @param bookId  书籍ID
   * @param chapterId  章节ID
   * @param event_type  事件类型
   * @returns
   */
  reportChapterRead: async function (
    bookId: number,
    chapterId: number,
    eventType: EventType,
  ) {
    return await post<null>(`${this.prefix}/book-chapter`, {
      bookId: bookId,
      chapterId: chapterId,
      eventType: eventType,
    });
  },
};
