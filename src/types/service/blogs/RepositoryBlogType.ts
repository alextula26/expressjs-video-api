import { BlogViewModel, PostViewModel, BlogsViewModelDetail, PostsViewModelDetail, QueryBlogModel } from '../../models'
import { BlogType, PostType } from '../../schema'
import { ResponseViewModelDetail } from '../../response'
import { SortDirection } from '../../enums'
import { CreaetBlogService, UpdateBlogService } from '../blogs'
import { CreaetPostService } from '../posts'

export type RepositoryBlogType = {
  findAllBlogs: ({ searchNameTerm, pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection =  SortDirection.ASC}: QueryBlogModel) => Promise<ResponseViewModelDetail<BlogType>>
  findBlogById: (id: string) => Promise<BlogViewModel | null>
  findPostsByBlogId: (blogId: string, { searchNameTerm, pageNumber, pageSize, sortBy, sortDirection }: QueryBlogModel) => Promise<PostsViewModelDetail>
  createdBlog: ({ name, description, websiteUrl }: CreaetBlogService) => Promise<BlogViewModel>
  createdPostByBlogId: ({ title, shortDescription, content, blogId, blogName }: CreaetPostService) => Promise<PostViewModel>
  updateBlog: ({ id, name, description, websiteUrl }: UpdateBlogService) => Promise<boolean>
  deleteBlogById: (id: string) => Promise<boolean>
  _getBlogViewModel: (dbBlog: BlogType) => BlogViewModel
  _getPostViewModel: (dbPosts: PostType) => PostViewModel
  _getBlogsViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: ResponseViewModelDetail<BlogType>) => BlogsViewModelDetail
  _getPostsViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: ResponseViewModelDetail<PostType>) => PostsViewModelDetail
}
