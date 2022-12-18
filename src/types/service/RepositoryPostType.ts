import { PostViewModel, CommentViewModel, QueryPostModel, QueryCommentModel } from '../models'
import { PostType, CommentType } from '../schema'
import { ResponseViewModelDetail } from '../response'
import { UpdatePostService } from '../domain/posts'

export type RepositoryPostType = {
  findAllPosts: ({ searchNameTerm, pageNumber, pageSize, sortBy, sortDirection }: QueryPostModel) => Promise<ResponseViewModelDetail<PostViewModel>>
  findPostById: (id: string) => Promise<PostViewModel | null>
  findCommentsByPostId: (postId: string, { pageNumber, pageSize, sortBy, sortDirection }: QueryCommentModel) => Promise<ResponseViewModelDetail<CommentViewModel>>
  createdPost: (createdPost: PostType) => Promise<PostViewModel>
  createdCommentByPostId: (createdComment: CommentType) => Promise<CommentViewModel>
  updatePost: ({ id, title, shortDescription, content, blogId, blogName }: UpdatePostService) => Promise<boolean>
  deletePostById: (id: string) => Promise<boolean>
  _getPostViewModel: (dbPost: PostType) => PostViewModel
  _getCommentViewModel: (dbComment: CommentType) => CommentViewModel
  _getPostsViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: ResponseViewModelDetail<PostType>) => ResponseViewModelDetail<PostViewModel>
  _getCommentsViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: ResponseViewModelDetail<CommentType>) => ResponseViewModelDetail<CommentViewModel>
}
