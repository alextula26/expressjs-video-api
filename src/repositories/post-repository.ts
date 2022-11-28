import { trim } from 'lodash'
import { db } from '../mocks'

import { getNextStrId } from '../utils'

import { PostType, PostsRepositoryType } from '../types'

export const postRepository: PostsRepositoryType = {
  findAllPosts: async () => db.posts,
  findPostById: async (id) => db.posts.find((item) => item.id === id),
  createdPost: async ({ title, shortDescription, content, blogId, blogName }) => {
    const createdPost: PostType = {
      id: getNextStrId(),
      title: trim(String(title)),
      shortDescription: trim(String(shortDescription)),
      content: trim(String(content)),
      blogId,
      blogName,
    }

    db.posts.push(createdPost)

    return createdPost
  },
  updatePost: async (id, { title, shortDescription, content, blogId, blogName })=> {  
      const updatedPost: PostType | undefined = db.posts.find((item) => item.id === id)
      
      if (!updatedPost) {
        return false
      }

      updatedPost.id = id
      updatedPost.title = trim(String(title))
      updatedPost.shortDescription = trim(String(shortDescription))
      updatedPost.content = trim(String(content))
      updatedPost.blogId = blogId
      updatedPost.blogName = blogName

      return true    
  },
  deletePostById: async (id) => {
    const postById: PostType | undefined = db.posts.find(item => item.id === id)

    if (!postById) {
      return false
    }

    db.posts = db.posts.filter(({ id }) => id !== postById.id)
    return true
  },
}
