import { BlogViewModel, BlogsViewModelDetail, PostsViewModelDetail } from '../../models'
import { BlogType, PostType } from '../../schema'

export type CreaetBlogService = {
  name: string
  description: string
  websiteUrl: string
}

export type UpdateBlogService = {
  id: string
  name: string
  description: string
  websiteUrl: string
}

export type RepositoryBlogType = {
  findAllBlogs: () => Promise<BlogsViewModelDetail>
  findBlogById: (id: string) => Promise<BlogViewModel | null>
  findPostsByBlogId: (blogId: string) => Promise<PostsViewModelDetail>
  createdBlog: ({ name, description, websiteUrl }: CreaetBlogService) => Promise<BlogViewModel> 
  updateBlog: ({ id, name, description, websiteUrl }: UpdateBlogService) => Promise<boolean>
  deleteBlogById: (id: string) => Promise<boolean>
  _getBlogViewModel: (dbBlog: BlogType) => BlogViewModel
  _getBlogsViewModelDetail: (dbBlogs: BlogType[]) => BlogsViewModelDetail
  _getPostsViewModelDetail: (dbPosts: PostType[]) => PostsViewModelDetail
}
