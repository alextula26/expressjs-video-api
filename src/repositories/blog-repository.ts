import { trim } from 'lodash'
import { db } from '../mocks'

import { getNextStrId } from '../utils'

import { BlogType, BlogsRepositoryType } from '../types'

export const blogsRepository: BlogsRepositoryType = {
  findAllBlogs: async () => db.blogs,
  findBlogById: async (id) => db.blogs.find((item) => item.id === id),
  createdBlog: async ({ name, description, websiteUrl }) => {
    const createdBlog: BlogType = {
      id: getNextStrId(),
      name: trim(String(name)),
      description: trim(String(description)),
      websiteUrl: trim(String(websiteUrl)),
    }

    db.blogs.push(createdBlog)

    return createdBlog
  },
  updateBlog: async (id, { name, description, websiteUrl }) => {      
      const updatedBlog: BlogType | undefined = db.blogs.find((item) => item.id === id)

      if (!updatedBlog) {
        return false
      }

      updatedBlog.id = id
      updatedBlog.name = trim(String(name))
      updatedBlog.description = trim(String(description))
      updatedBlog.websiteUrl = trim(String(websiteUrl))

      return true    
  },
  deleteBlogById: async (id) => {
    const blogById: BlogType | undefined = db.blogs.find(item => item.id === id)

    if (!blogById) {
      return false
    }

    db.blogs = db.blogs.filter(({ id }) => id !== blogById.id)
    return true
  },
}
