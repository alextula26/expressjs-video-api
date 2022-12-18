import { trim } from 'lodash'
import { postRepository } from '../repositories/post/post-db-repository'
import { getNextStrId } from '../utils'
import { PostType, CommentType, SortDirection } from '../types'
import { ServicePostType } from '../types/domain/posts'

export const postService: ServicePostType = {
  async findAllPosts({
    searchNameTerm,
    pageNumber,
    pageSize,
    sortBy = 'createdAt',
    sortDirection =  SortDirection.DESC,
  }) {
    const foundAllPosts = await postRepository.findAllPosts({
      searchNameTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    })

    return foundAllPosts
  },
  async findPostById(id) {
    const foundPostById = await postRepository.findPostById(id)

    return foundPostById
  },
  async findCommentsByPostId(postId: string, {
    pageNumber,
    pageSize,
    sortBy = 'createdAt',
    sortDirection =  SortDirection.DESC,
  }) {
    const foundCommentsByBlogId = await postRepository.findCommentsByPostId(postId, {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    })
    return foundCommentsByBlogId
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
  async createdCommentByPostId({ content, postId }) {
    const newComment: CommentType = {
      id: getNextStrId(),
      content: trim(String(content)),
      postId,
      userId: '1',
      userLogin: '1',
      createdAt: new Date().toISOString(),
    }

    const createdComment = await postRepository.createdCommentByPostId(newComment)

    return createdComment
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
