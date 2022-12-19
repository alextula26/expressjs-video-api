import { CommentViewModel } from '../models'
import { CommentType } from '../schema'
import { ResponseViewModelDetail } from '../response'
import { UpdateCommentService } from '../domain'

export type RepositoryCommentType = {
  findCommentById: (id: string) => Promise<CommentViewModel | null>
  updateComment: ({ id, content }: UpdateCommentService) => Promise<boolean>
  deleteCommentById: (id: string) => Promise<boolean>
  _getCommentViewModel: (dbComments: CommentType) => CommentViewModel
  _getCommentsViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: ResponseViewModelDetail<CommentType>) => ResponseViewModelDetail<CommentViewModel>
}
