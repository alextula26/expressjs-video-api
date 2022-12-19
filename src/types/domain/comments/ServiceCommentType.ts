import { CommentViewModel } from '../../models'
import { UpdateCommentService } from '../../domain'

export type ServiceCommentType = {
  findCommentById: (id: string) => Promise<CommentViewModel | null>
  updateComment: ({ id, content }: UpdateCommentService) => Promise<boolean>
  deleteCommentById: (id: string) => Promise<boolean>
}
