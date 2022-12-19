import { Router, Response } from 'express'
import { isEmpty } from 'lodash'
import { commentService } from '../domains/comment-service'
import {
  authMiddleware,
  titlePostValidation,
  shortPostDescriptionValidation,
  contentPostValidation,
  blogIdPostValidation,
  inputValidationMiddleware,
} from '../middlewares'

import {
  RequestWithParams,
  RequestWithParamsAndBody,
  URIParamsCommentModel,
  UpdateCommentModel,
  CommentViewModel,
  HTTPStatuses,
} from '../types'

export const commentsRouter = Router()

const middlewares = [
  authMiddleware,
  titlePostValidation,
  shortPostDescriptionValidation,
  contentPostValidation,
  blogIdPostValidation,
  inputValidationMiddleware,
]

commentsRouter
  .get('/:id', async (req: RequestWithParams<URIParamsCommentModel>, res: Response<CommentViewModel>) => {
    const commentById = await commentService.findCommentById(req.params.id)

    if (!commentById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.SUCCESS200).send(commentById)
  })  
  .put('/:id', middlewares, async (req: RequestWithParamsAndBody<URIParamsCommentModel, UpdateCommentModel>, res: Response<boolean>) => {
    const commentById = await commentService.findCommentById(req.params.id)

    if (isEmpty(commentById)) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    const isCommentUpdated = await commentService.updateComment({
      id: commentById.id,
      content: req.body.content,
    })

    if (!isCommentUpdated) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/:id', authMiddleware, async (req: RequestWithParams<URIParamsCommentModel>, res: Response<boolean>) => {
    const isCommentDeleted = await commentService.deleteCommentById(req.params.id)

    if (!isCommentDeleted) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
