import { PostViewModel, PostsViewModelDetail, QueryPostModel } from '../../models'
import { PostType } from '../../schema'
import { ResponseViewModelDetail } from '../../response'
import { SortDirection } from '../../enums'
import { CreaetPostService, UpdatePostService } from '../posts'

export type RepositoryPostType = {
  findAllPosts: ({ searchNameTerm, pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection =  SortDirection.ASC}: QueryPostModel) => Promise<ResponseViewModelDetail<PostType>>
  findPostById: (id: string) => Promise<PostViewModel | null>
  createdPost: ({ title, shortDescription, content, blogId, blogName }: CreaetPostService) => Promise<PostViewModel>
  updatePost: ({ id, title, shortDescription, content, blogId, blogName }: UpdatePostService) => Promise<boolean>
  deletePostById: (id: string) => Promise<boolean>
  _getPostViewModel: (dbPosts: PostType) => PostViewModel
  _getPostsViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: ResponseViewModelDetail<PostType>) => PostsViewModelDetail
}