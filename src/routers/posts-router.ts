import { Router, Response } from "express";
import { isEmpty } from 'lodash'
import { postRepository, blogsRepository } from '../repositories'
import {
  authMiddleware,
  titlePostValidation,
  shortPostDescriptionValidation,
  contentPostValidation,
  blogIdPostValidation,
  inputValidationMiddleware,
} from '../middlewares'

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

export const getPostViewModel = (dbPost: PostType): PostViewModel => ({
  id: dbPost.id,
  title: dbPost.title,
  shortDescription: dbPost.shortDescription,
  content: dbPost.content,
  blogId: dbPost.blogId,
  blogName: dbPost.blogName,
})

const middlewares = [
  authMiddleware,
  titlePostValidation,
  shortPostDescriptionValidation,
  contentPostValidation,
  blogIdPostValidation,
  inputValidationMiddleware,
]

postsRouter
  .get('/', async (_, res: Response<PostViewModel[]>) => {
    const allPosts = await postRepository.findAllPosts()
    const allPostsResponse = allPosts.map(getPostViewModel)
    res.status(HTTPStatuses.SUCCESS200).send(allPostsResponse)
  })
  .get('/:id', async (req: RequestWithParams<URIParamsPostModel>, res: Response<PostViewModel>) => {
    const postById = await postRepository.findPostById(req.params.id)

    if (!postById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    const postByIdResponse = getPostViewModel(postById)
    res.status(HTTPStatuses.SUCCESS200).send(postByIdResponse)
  })
  .post('/', middlewares, async (req: RequestWithBody<CreatePostModel>, res: Response<PostViewModel | ErrorsMessageType>) => {
    const blogById = await blogsRepository.findBlogById(req.body.blogId)

    if (isEmpty(blogById)) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    const createdPost = await postRepository.createdPost({
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: blogById.id,
      blogName: blogById.name,
    })

    const createdPostResponse = getPostViewModel(createdPost)
    res.status(HTTPStatuses.CREATED201).send(createdPostResponse)
  })
  .put('/:id', middlewares, async (req: RequestWithParamsAndBody<URIParamsPostModel, UpdatePostModel>, res: Response) => {
    const blogById = await blogsRepository.findBlogById(req.body.blogId)

    if (isEmpty(blogById)) {
      return res.status(HTTPStatuses.BADREQUEST400).send()
    }

    const isPostUpdated = await postRepository.updatePost(req.params.id, {
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
  .delete('/:id', authMiddleware, async (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
    const isPostDeleted = await postRepository.deletePostById(req.params.id)

    if (!isPostDeleted) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
