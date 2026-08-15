import { StatusEnum } from './enum';

/**
 * 书籍信息
 * @param cover  封面URL
 * @param id  书籍id
 * @param category   分类
 * @param totalChapter   总章节数
 * @param author  作者
 * @param description  书籍描述
 * @param name  书籍名称
 * @param tags   标签
 * @param createdAt  创建时间
 * @param isEnded  是否完结
 * @param wordsCount  字数
 * @param updatedAt  更新时间
 */
export interface Book {
  cover: string;
  id: number;
  category: string;
  totalChapter: number;
  author: string;
  description: string;
  name: string;
  tags: string;
  createdAt: string;
  isActive: boolean;
  isEnded: boolean;
  wordsCount: number;
  updatedAt: string;
  parentId: number | null;
  status: StatusEnum;
}

/**
 * 书籍元信息
 * @param name  书籍名称
 * @param cover  封面
 * @param description  描述
 * @param category  分类
 * @param tags  标签
 */
export interface BookMeta {
  name: string;
  cover: string | null;
  description: string;
  category: string;
  tags: string;
}

/**
 * 目录信息
 * @param id  目录id
 * @param title  目录标题
 * @param wordsCount  字数
 * @param sort_order  排序
 * @param createdAt  创建时间
 * @param updatedAt  更新时间
 */
export interface Catalog {
  id: number;
  title: string;
  wordsCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookChapter extends Catalog {
  status: StatusEnum;
  bookId: number;
}

/**
 * 书籍阅读进度
 * @param bookId  书籍id
 * @param lastChapterId  最后阅读的章节id
 * @param lastPosition  最后阅读位置
 * @param lastReadAt  最后阅读时间
 */
export interface BookReadingProgress {
  bookId: number;
  lastChapterId: number;
  lastPosition: number;
  lastReadAt: string;
}

export type ShelfItem = Book & Partial<BookReadingProgress>;

/**
 * 管理后台书籍信息（含 authorCount 字段）
 */
export interface AdminBook extends Book {
  authorCount: number;
}

export interface ChapterReadStatistic {
  id: number;
  bookId: number;
  chapterId: number;
  hourStart: string;
  uniqueReader_count: number;
  pageViewCount: number;
  totalDuration: number;
}
