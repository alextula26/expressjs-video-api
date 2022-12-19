import { Router, Response } from 'express'
import { isEmpty } from 'lodash'
import { postService } from '../domains/post-service'
import { blogService } from '../domains/blog-service'
import {
  authMiddleware,
  titlePostValidation,
  shortPostDescriptionValidation,
  contentPostValidation,
  blogIdPostValidation,
  contentCommentValidation,
  inputValidationMiddleware,
} from '../middlewares'

import {
  RequestWithBody,
  RequestWithQuery,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  URIParamsPostModel,
  URIParamsCommentsByPostId,
  QueryPostModel,
  QueryCommentModel,
  CreatePostModel,
  CreateCommentsModel,
  UpdatePostModel,
  PostViewModel,
  CommentViewModel,
  ResponseViewModelDetail,
  HTTPStatuses,
  ErrorsMessageType,
} from '../types'

export const postsRouter = Router()

const middlewares = [
  authMiddleware,
  titlePostValidation,
  shortPostDescriptionValidation,
  contentPostValidation,
  blogIdPostValidation,
  inputValidationMiddleware,
]

const middlewaresComment = [
  authMiddleware,
  contentCommentValidation,
  inputValidationMiddleware
]

postsRouter
  .get('/', async (req: RequestWithQuery<QueryPostModel>, res: Response<ResponseViewModelDetail<PostViewModel>>) => {
    const allPosts = await postService.findAllPosts({
      searchNameTerm: req.query.searchNameTerm,
      pageNumber: req.query.pageNumber, 
      pageSize: req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
    })
    
    res.status(HTTPStatuses.SUCCESS200).send(allPosts)
  })
  .get('/:id', async (req: RequestWithParams<URIParamsPostModel>, res: Response<PostViewModel>) => {
    const postById = await postService.findPostById(req.params.id)

    if (!postById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.SUCCESS200).send(postById)
  })
  .get('/:postId/comments', async (req: RequestWithParamsAndQuery<URIParamsCommentsByPostId, QueryCommentModel>, res: Response<ResponseViewModelDetail<CommentViewModel>>) => {
    const postById = await postService.findPostById(req.params.postId)

    if (!postById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    const commentsByPostId = await postService.findCommentsByPostId(req.params.postId, {
      pageNumber: req.query.pageNumber, 
      pageSize: req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
    })

    res.status(HTTPStatuses.SUCCESS200).send(commentsByPostId)
  })  
  .post('/', middlewares, async (req: RequestWithBody<CreatePostModel>, res: Response<PostViewModel | ErrorsMessageType>) => {
    const blogById = await blogService.findBlogById(req.body.blogId)

    if (isEmpty(blogById)) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    const createdPost = await postService.createdPost({
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: blogById.id,
      blogName: blogById.name,
    })

    res.status(HTTPStatuses.CREATED201).send(createdPost)
  })
  .post('/:postId/comments', middlewaresComment, async (req: RequestWithParamsAndBody<URIParamsCommentsByPostId, CreateCommentsModel>, res: Response<CommentViewModel | ErrorsMessageType>) => {
    const postById = await postService.findPostById(req.params.postId)
    
    if (!postById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    const createdCommentByPostId = await postService.createdCommentByPostId({
      content: req.body.content,
      postId: postById.id,
    })

    res.status(HTTPStatuses.CREATED201).send(createdCommentByPostId)
  })
  .put('/:id', middlewares, async (req: RequestWithParamsAndBody<URIParamsPostModel, UpdatePostModel>, res: Response<boolean>) => {
    const blogById = await blogService.findBlogById(req.body.blogId)

    if (isEmpty(blogById)) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    const isPostUpdated = await postService.updatePost({
      id: req.params.id,
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: blogById.id,
      blogName: blogById.name,
    })

    if (!isPostUpdated) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/:id', authMiddleware, async (req: RequestWithParams<URIParamsPostModel>, res: Response<boolean>) => {
    const isPostDeleted = await postService.deletePostById(req.params.id)

    if (!isPostDeleted) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
