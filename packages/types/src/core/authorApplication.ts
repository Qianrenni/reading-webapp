/**
 * 作者申请记录
 */
export interface AuthorApplication {
  id: number;
  userId: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  handledBy: number | null;
  rejectReason: string | null;
  handledAt: string | null;
  createdAt: string;
  updatedAt: string;
}
