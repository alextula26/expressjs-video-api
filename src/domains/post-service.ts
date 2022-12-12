import { trim } from 'lodash'
import { postRepository } from '../repositories/post/post-db-repository'
import { getNextStrId } from '../utils'
import { PostType, SortDirection } from '../types'
import { ServicePostType } from '../types/domain/posts'

export const postService: ServicePostType = {
  async findAllPosts({
    searchNameTerm = null,
    pageNumber = 1,
    pageSize = 10,
    sortBy = 'createdAt',
    sortDirection =  SortDirection.DESC,
  }) {
    const foundAllPosts = await postRepository.findAllPosts({
      searchNameTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    })

    return foundAllPosts
  },
  async findPostById(id) {
    const foundPostById = await postRepository.findPostById(id)

    return foundPostById
  },
  async createdPost({ title, shortDescription, content, blogId, blogName }) {
    const newPost: PostType = {
      id: getNextStrId(),
      title: trim(String(title)),
      shortDescription: trim(String(shortDescription)),
      content: trim(String(content)),
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
    }

    const createdPost = await postRepository.createdPost(newPost)

    return createdPost
  },
  async updatePost({ id, title, shortDescription, content, blogId, blogName }) {  
    const updatedPost = {
      id,
      title: trim(String(title)),
      shortDescription: trim(String(shortDescription)),
      content: trim(String(content)),
      blogId,
      blogName,
    }

    const isUpdatedPost = await postRepository.updatePost(updatedPost)

    return isUpdatedPost
  },
  async deletePostById(id) {
    const isDeletePostById = await postRepository.deletePostById(id)

    return isDeletePostById
  },
}
