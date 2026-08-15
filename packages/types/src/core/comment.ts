/**
 * 书评信息（对应后端 BookComment）
 * @param id          评论id
 * @param bookId      书籍id
 * @param userId      作者用户id
 * @param userName    作者用户名
 * @param userAvatar  作者头像
 * @param content     评论正文
 * @param status      状态（PUBLISHED/REVIEWING/REJECTED/DELETED）
 * @param createdAt   创建时间
 * @param updatedAt   更新时间
 * @param parentId    父评论id（回复场景，可为空）
 */
export interface BookComment {
  id: number;
  bookId: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
}

/**
 * 章节行评论（对应后端 BookChapterComment）
 */
export interface BookChapterComment {
  id: number;
  chapterId: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
  line: number;
}

/**
 * 章节行评论映射：行号 -> 该行评论列表
 */
export type ChapterCommentsMap = Record<number, BookChapterComment[]>;

/**
 * 书评提交体
 */
export interface BookReviewBody {
  content: string;
}

/**
 * 行评论提交体
 */
export interface LineCommentBody {
  line: number;
  content: string;
}
