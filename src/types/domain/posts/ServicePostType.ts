import { PostViewModel, CommentViewModel, QueryPostModel, QueryCommentModel } from '../../models'
import { ResponseViewModelDetail } from '../../response'
import { UpdatePostService, CreaetPostService, CreaetCommentByPostIdService } from '../../domain'

export type ServicePostType = {
  findAllPosts: ({ searchNameTerm, pageNumber, pageSize, sortBy, sortDirection}: QueryPostModel) => Promise<ResponseViewModelDetail<PostViewModel>>
  findPostById: (id: string) => Promise<PostViewModel | null>
  findCommentsByPostId: (postId: string, { pageNumber, pageSize, sortBy, sortDirection }: QueryCommentModel) => Promise<ResponseViewModelDetail<CommentViewModel>>
  createdPost: ({ title, shortDescription, content, blogId, blogName }: CreaetPostService) => Promise<PostViewModel>
  createdCommentByPostId: ({ content, postId }: CreaetCommentByPostIdService) => Promise<CommentViewModel>
  updatePost: ({ id, title, shortDescription, content, blogId, blogName }: UpdatePostService) => Promise<boolean>
  deletePostById: (id: string) => Promise<boolean>
}
