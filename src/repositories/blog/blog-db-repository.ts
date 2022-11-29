import { trim } from 'lodash'
import { db } from '../../mocks'
import { client } from '../../repositories/db'

import { getNextStrId } from '../../utils'

import { RepositoryBlogType } from '../../types/services'
import { BlogViewModel } from '../../types/models'
import { BlogType } from '../../types'

export const getBlogViewModel = (db: BlogType): BlogViewModel => ({
  id: db.id,
  name: db.name,
  description: db.description,
  websiteUrl: db.websiteUrl,
})

const collection = client.db('bloggers').collection<BlogType>('blogs');

export const blogRepository: RepositoryBlogType = {
  findAllBlogs: async () => {
    const blogs = await collection.find().toArray()

    return blogs.map(getBlogViewModel)
  },
  findBlogById: async (id) => {
    const foundBlog: BlogType | null = await collection.findOne({ id })

    if (!foundBlog) {
      return null
    }

    return getBlogViewModel(foundBlog)
  },
  createdBlog: async ({ name, description, websiteUrl }) => {
    const createdBlog: BlogType = {
      id: getNextStrId(),
      name: trim(String(name)),
      description: trim(String(description)),
      websiteUrl: trim(String(websiteUrl)),
    }

    await collection.insertOne(createdBlog)

    return getBlogViewModel(createdBlog)
  },
  updateBlog: async ({id, name, description, websiteUrl }) => {      
    const { matchedCount } = await collection.updateOne({ id }, {
      $set: {
        name: trim(String(name)),
        description: trim(String(description)),
        websiteUrl: trim(String(websiteUrl)),
      }
    })

    return matchedCount === 1    
  },
  deleteBlogById: async (id) => {
    const { deletedCount } = await collection.deleteOne({ id })

    return deletedCount === 1
  },
}
