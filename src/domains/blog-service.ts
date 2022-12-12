import { trim } from 'lodash'
import { blogRepository } from '../repositories/blog/blog-db-repository'
import { getNextStrId } from '../utils'
import { BlogType, PostType, SortDirection } from '../types'
import { ServiceBlogType } from '../types/domain/blogs'

export const blogService: ServiceBlogType = {
  async findAllBlogs({
    searchNameTerm = null,
    pageNumber = 1,
    pageSize = 10,
    sortBy = 'createdAt',
    sortDirection =  SortDirection.DESC,
  }) {
    const foundAllBlogs = await blogRepository.findAllBlogs({
      searchNameTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    })

    return foundAllBlogs
  },
  async findBlogById(id: string) {
    const foundBlogById = await blogRepository.findBlogById(id)

    return foundBlogById
  },
  async findPostsByBlogId(blogId: string, {
    searchNameTerm = null,
    pageNumber = 1,
    pageSize = 10,
    sortBy = 'createdAt',
    sortDirection =  SortDirection.DESC,
  }) {
    const foundPostsByBlogId = await blogRepository.findPostsByBlogId(blogId, {
      searchNameTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    })
    return foundPostsByBlogId
  },
  async createdBlog({ name, description, websiteUrl }) {
    const newBlog: BlogType = {
      id: getNextStrId(),
      name: trim(String(name)),
      description: trim(String(description)),
      websiteUrl: trim(String(websiteUrl)),
      createdAt: new Date().toISOString(),
    }

    const createdBlog = await blogRepository.createdBlog(newBlog)

    return createdBlog
  },
  async createdPostByBlogId({ title, shortDescription, content, blogId, blogName }) {
    const newPost: PostType = {
      id: getNextStrId(),
      title: trim(String(title)),
      shortDescription: trim(String(shortDescription)),
      content: trim(String(content)),
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
    }

    const createdPost = await blogRepository.createdPostByBlogId(newPost)

    return createdPost
  },
  async updateBlog({ id, name, description, websiteUrl }) {
    const updatedBlog = {
      id,
      name: trim(String(name)),
      description: trim(String(description)),
      websiteUrl: trim(String(websiteUrl)),
    }

    const isUpdatedBlog = await blogRepository.updateBlog(updatedBlog)

    return isUpdatedBlog
  },
  async deleteBlogById(id) {
    const isDeleteBlogById = await blogRepository.deleteBlogById(id)

    return isDeleteBlogById
  },
}
