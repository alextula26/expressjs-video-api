import { commentCollection } from '../db'
import { RepositoryCommentType, CommentType } from '../../types'

export const commentRepository: RepositoryCommentType = {
  async findCommentById(id) {
    const foundComment: CommentType | null = await commentCollection.findOne({ id })

    if (!foundComment) {
      return null
    }

    return this._getCommentViewModel(foundComment)
  },
  async updateComment({id, content }) {
    const { matchedCount } = await commentCollection.updateOne({ id }, {
      $set: { content }
    })

    return matchedCount === 1
  },
  async deleteCommentById(id) {
    const { deletedCount } = await commentCollection.deleteOne({ id })

    return deletedCount === 1
  },
  _getCommentViewModel(dbComments) {
    return {
      id: dbComments.id,
      content: dbComments.content,
      userId: dbComments.userId,
      userLogin: dbComments.userLogin,
      createdAt: dbComments.createdAt,
    }
  },
  _getCommentsViewModelDetail({ items, totalCount, pagesCount, page, pageSize }) {
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: items.map(item => ({
        id: item.id,
        content: item.content,
        userId: item.userId,
        userLogin: item.userLogin,
        createdAt: item.createdAt,
      })),
    }
  },
}
