import { trim } from 'lodash'
import { postCollection } from '../db'

import { getNextStrId } from '../../utils'

import { RepositoryPostType } from '../../types/services'
import { PostType } from '../../types'

export const postRepository: RepositoryPostType = {
  async findAllPosts() {
    const posts: PostType[] = await postCollection.find().toArray()

    return this._getPostsViewModelDetail(posts)
  },
  async findPostById(id) {
    const foundPost: PostType | null = await postCollection.findOne({ id })

    if (!foundPost) {
      return null
    }

    return this._getPostViewModel(foundPost)
  },
  async createdPost({ title, shortDescription, content, blogId, blogName }) {
    const createdPost: PostType = {
      id: getNextStrId(),
      title: trim(String(title)),
      shortDescription: trim(String(shortDescription)),
      content: trim(String(content)),
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
    }

    await postCollection.insertOne(createdPost)

    return this._getPostViewModel(createdPost)
  },
  async updatePost({ id, title, shortDescription, content, blogId, blogName }) {  
    const { matchedCount } = await postCollection.updateOne({ id }, {
      $set: {
        title: trim(String(title)),
        shortDescription: trim(String(shortDescription)),
        content: trim(String(content)),
        blogId,
        blogName,
      }
    })

    return matchedCount === 1   
  },
  async deletePostById(id) {
    const { deletedCount } = await postCollection.deleteOne({ id })

    return deletedCount === 1
  },
  _getPostViewModel(dbPost) {
    return {
      id: dbPost.id,
      title: dbPost.title,
      shortDescription: dbPost.shortDescription,
      content: dbPost.content,
      blogId: dbPost.blogId,
      blogName: dbPost.blogName,
      createdAt: dbPost.createdAt,
    }
  },
  _getPostsViewModelDetail(dbPosts) {
    return {
      pagesCount: 0,
      page: 0,
      pageSize: 0,
      totalCount: 0,
      items: dbPosts.map(post => ({
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
      })),
    }
  },  
}
