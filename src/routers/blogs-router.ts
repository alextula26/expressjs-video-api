import { Router, Response } from 'express'
import { blogService } from '../domains/blog-service'
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
  RequestWithBody,
  RequestWithQuery,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  URIParamsBlogModel,
  URIParamsPostsByBlogId,
  QueryBlogModel,
  CreateBlogModel,
  CreatePostModelWithoutBlogId,
  UpdateBlogModel,
  BlogViewModel,
  PostViewModel,
  ResponseViewModelDetail,
  BlogType,
  PostType,
  HTTPStatuses,
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
  .get('/', async (req: RequestWithQuery<QueryBlogModel>, res: Response<ResponseViewModelDetail<BlogType>>) => {
    const allBlogs = await blogService.findAllBlogs({
      searchNameTerm: req.query.searchNameTerm,
      pageNumber: req.query.pageNumber, 
      pageSize: req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
    })

    res.status(HTTPStatuses.SUCCESS200).send(allBlogs)
  })
  .get('/:id', async (req: RequestWithParams<URIParamsBlogModel>, res: Response<BlogViewModel>) => {
    const blogById = await blogService.findBlogById(req.params.id)

    if (!blogById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.SUCCESS200).send(blogById)
  })
  .get('/:blogId/posts', async (req: RequestWithParamsAndQuery<URIParamsPostsByBlogId, QueryBlogModel>, res: Response<ResponseViewModelDetail<PostType>>) => {
    const blogById = await blogService.findBlogById(req.params.blogId)

    if (!blogById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    const postsByBlogId = await blogService.findPostsByBlogId(req.params.blogId, {
      searchNameTerm: req.query.searchNameTerm,
      pageNumber: req.query.pageNumber, 
      pageSize: req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
    })

    res.status(HTTPStatuses.SUCCESS200).send(postsByBlogId)
  })
  .post('/', middlewares, async (req: RequestWithBody<CreateBlogModel>, res: Response<BlogViewModel | ErrorsMessageType>) => {
    const createdBlog = await blogService.createdBlog({
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    })

    res.status(HTTPStatuses.CREATED201).send(createdBlog)
  })
  .post('/:blogId/posts', middlewaresPost, async (req: RequestWithParamsAndBody<URIParamsPostsByBlogId, CreatePostModelWithoutBlogId>, res: Response<PostViewModel | ErrorsMessageType>) => {
    const blogById = await blogService.findBlogById(req.params.blogId)

    if (!blogById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    const createdPostByBlogId = await blogService.createdPostByBlogId({
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: blogById.id,
      blogName: blogById.name,
    })

    res.status(HTTPStatuses.CREATED201).send(createdPostByBlogId)
  })  
  .put('/:id', middlewares, async (req: RequestWithParamsAndBody<URIParamsBlogModel, UpdateBlogModel>, res: Response<boolean>) => {
    const blogById = await blogService.findBlogById(req.params.id)

    if (!blogById) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }
    
    const isBlogUpdated = await blogService.updateBlog({
      id: blogById.id,
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    })

    if (!isBlogUpdated) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/:id', authMiddleware, async (req: RequestWithParams<URIParamsBlogModel>, res: Response<boolean>) => {
    const isBlogDeleted = await blogService.deleteBlogById(req.params.id)

    if (!isBlogDeleted) {
      return res.status(HTTPStatuses.NOTFOUND404).send()
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
