import { CommentViewModel } from '../models'
import { CommentType } from '../schema'
import { ResponseViewModelDetail } from '../response'
import { UpdatePostService } from '../domain/posts'

export type RepositoryCommentType = {
  findCommentById: (id: string) => Promise<CommentViewModel | null>
  createdComment: (createdComment: CommentType) => Promise<CommentViewModel>
  updateComment: ({ id, title, shortDescription, content, blogId, blogName }: UpdatePostService) => Promise<boolean>
  deleteCommentById: (id: string) => Promise<boolean>
  _getCommentViewModel: (dbComments: CommentType) => CommentViewModel
  _getCommentsViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: ResponseViewModelDetail<CommentType>) => ResponseViewModelDetail<CommentViewModel>
}
