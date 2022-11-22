import { trim } from 'lodash'
import { db } from '../mocks'

import { getNextStrId } from '../utils'

import {
  PostType,
  CreatePostModel,
  UpdatePostModel,
} from '../types'

export const postRepository = {
  findAllPosts: (): PostType[] => db.posts,
  findPostById: (id: string): PostType | undefined => (
    db.posts.find((item) => item.id === id)
  ),
  createdPost: ({ title, shortDescription, content, blogId }: CreatePostModel): PostType => {
    const createdPost: PostType = {
      id: getNextStrId(),
      title: trim(String(title)),
      shortDescription: trim(String(shortDescription)),
      content: trim(String(content)),
      blogId,
    }

    db.posts.push(createdPost)

    return createdPost
  },
  updatePost: (
    id: string,
    { title, shortDescription, content, blogId }: UpdatePostModel
    ): boolean => {      
      const updatedPost = db.posts.find((item) => item.id === id)
      
      if (!updatedPost) {
        return false
      }

      updatedPost.id = id
      updatedPost.title = trim(String(title))
      updatedPost.shortDescription = trim(String(shortDescription))
      updatedPost.content = trim(String(content))
      updatedPost.blogId = blogId

      return true    
  },
  deletePostById: (id: string): boolean => {
    const postById = db.posts.find(item => item.id === id)

    if (!postById) {
      return false
    }

    db.posts = db.posts.filter(({ id }) => id !== postById.id)
    return true
  },
}