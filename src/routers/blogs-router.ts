import { Router, Response } from "express";
import { blogRepository } from '../repositories/blog/blog-db-repository'
import {
  authMiddleware,
  nameBlogValidation,
  descriptionBlogValidation,
  websiteUrlBlogValidation,
  titlePostValidation,
  shortPostDescriptionValidation,
  contentPostValidation,
  inputValidationMiddleware,
} from '../middlewares'

import {
  HTTPStatuses,
  BlogViewModel,
  PostViewModel,
  BlogsViewModelDetail,
  PostsViewModelDetail,
  URIParamsBlogModel,
  URIParamsPostsByBlogId,
  CreateBlogModel,
  CreatePostModelWithoutBlogId,
  UpdateBlogModel,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  ErrorsMessageType,
} from '../types'

export const blogsRouter = Router()

const middlewares = [
  authMiddleware,
  nameBlogValidation,
  descriptionBlogValidation,
  websiteUrlBlogValidation,
  inputValidationMiddleware
]

const middlewaresPost = [
  authMiddleware,
  titlePostValidation,
  shortPostDescriptionValidation,
  contentPostValidation,
  inputValidationMiddleware
]

blogsRouter
  .get('/', async (_, res: Response<BlogsViewModelDetail>) => {
    const allBlogs = await blogRepository.findAllBlogs()
    res.status(HTTPStatuses.SUCCESS200).send(allBlogs)
  })
  .get('/:id', async (req: RequestWithParams<URIParamsBlogModel>, res: Response<BlogViewModel>) => {
    const blogById = await blogRepository.findBlogById(req.params.id)

    if (!blogById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.SUCCESS200).send(blogById)
  })
  .get('/:blogId/posts', async (req: RequestWithParams<URIParamsPostsByBlogId>, res: Response<PostsViewModelDetail>) => {
    const blogById = await blogRepository.findBlogById(req.params.blogId)

    if (!blogById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    const postsByBlogId = await blogRepository.findPostsByBlogId(req.params.blogId)

    res.status(HTTPStatuses.SUCCESS200).send(postsByBlogId)
  })
  .post('/', middlewares, async (req: RequestWithBody<CreateBlogModel>, res: Response<BlogViewModel | ErrorsMessageType>) => {
    const createdBlog = await blogRepository.createdBlog({
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    })

    res.status(HTTPStatuses.CREATED201).send(createdBlog)
  })
  .post('/:blogId/posts', middlewaresPost, async (req: RequestWithParamsAndBody<URIParamsPostsByBlogId, CreatePostModelWithoutBlogId>, res: Response<PostViewModel | ErrorsMessageType>) => {
    const blogById = await blogRepository.findBlogById(req.params.blogId)

    if (!blogById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    const createdPostByBlogId = await blogRepository.createdPostByBlogId({
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: blogById.id,
      blogName: blogById.name,
    })

    res.status(HTTPStatuses.CREATED201).send(createdPostByBlogId)
  })  
  .put('/:id', middlewares, async (req: RequestWithParamsAndBody<URIParamsBlogModel, UpdateBlogModel>, res: Response) => {
    const isBlogUpdated = await blogRepository.updateBlog({
      id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    })

    if (!isBlogUpdated) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/:id', authMiddleware, async (req: RequestWithParams<URIParamsBlogModel>, res: Response) => {
    const isBlogDeleted = await blogRepository.deleteBlogById(req.params.id)

    if (!isBlogDeleted) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
