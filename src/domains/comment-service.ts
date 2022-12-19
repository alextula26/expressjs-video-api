import { trim } from 'lodash'
import { commentRepository } from '../repositories/comment/comment-db-repository'
import { ServiceCommentType } from '../types/domain/comments'

export const commentService: ServiceCommentType = {
  async findCommentById(id: string) {
    const foundCommentById = await commentRepository.findCommentById(id)

    return foundCommentById
  },
  async updateComment({ id, content }) {
    const updatedComment = {
      id,
      content: trim(String(content)),
    }

    const isUpdatedComment = await commentRepository.updateComment(updatedComment)

    return isUpdatedComment
  },
  async deleteCommentById(id) {
    const isDeleteCommentById = await commentRepository.deleteCommentById(id)

    return isDeleteCommentById
  },
}
