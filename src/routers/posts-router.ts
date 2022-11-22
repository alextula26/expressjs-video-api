import { Router, Response } from "express";
import { isEmpty } from 'lodash'
import { postRepository } from '../repositories'
import { getPostErrors } from '../errors'
import {
  HTTPStatuses,
  PostType,
  PostViewModel,
  URIParamsPostModel,
  CreatePostModel,
  UpdatePostModel,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  ErrorsMessageType,
} from '../types'

export const postsRouter = Router()

export const getPostViewModel = (db: PostType): PostViewModel => ({
  id: db.id,
  title: db.title,
  shortDescription: db.shortDescription,
  content: db.content,
  blogId: db.blogId,
  blogName: db.blogName,
})  

postsRouter
  .get('/', (_, res: Response<PostViewModel[]>) => {
    const allPosts = postRepository.findAllPosts()
    const allPostsResponse = allPosts.map(getPostViewModel)
    res.status(HTTPStatuses.SUCCESS200).send(allPostsResponse)
  })
  .get('/:id', (req: RequestWithParams<URIParamsPostModel>, res: Response<PostViewModel>) => {
    const postById = postRepository.findPostById(req.params.id)

    if (!postById) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }

    const postByIdResponse = getPostViewModel(postById)
    res.status(HTTPStatuses.SUCCESS200).send(postByIdResponse)
  })
  .post('/', (req: RequestWithBody<CreatePostModel>, res: Response<PostViewModel | ErrorsMessageType>) => {
    const errors = getPostErrors(req.body)

    if (!isEmpty(errors.errorsMessages)) {
      res.status(HTTPStatuses.BADREQUEST400).send(errors)
      return
    }

    const createdPost = postRepository.createdPost({
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
    })

    const createdPostResponse = getPostViewModel(createdPost)
    res.status(HTTPStatuses.CREATED201).send(createdPostResponse)
  })
  .put('/:id', (req: RequestWithParamsAndBody<URIParamsPostModel, UpdatePostModel>, res: Response) => {
    const errors = getPostErrors(req.body)

    if (!isEmpty(errors.errorsMessages)) {
      res.status(HTTPStatuses.BADREQUEST400).send(errors)
      return
    }

    const isPostUpdated = postRepository.updatePost(req.params.id, {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
    })

    if (!isPostUpdated) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/:id', (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
    const isPostDeleted = postRepository.deletePostById(req.params.id)

    if (!isPostDeleted) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
