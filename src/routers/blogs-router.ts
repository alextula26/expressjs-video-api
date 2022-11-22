import { Router, Response } from "express";
import { isEmpty } from 'lodash'
import { blogsRepository } from '../repositories'
import { getBlogsErrors } from '../errors'
import {
  HTTPStatuses,
  BlogType,
  BlogViewModel,
  URIParamsBlogModel,
  CreateBlogModel,
  UpdateBlogModel,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  ErrorsMessageType,
} from '../types'

export const blogsRouter = Router()

export const getBlogViewModel = (db: BlogType): BlogViewModel => ({
  id: db.id,
  name: db.name,
  description: db.description,
  websiteUrl: db.websiteUrl,
})

blogsRouter
  .get('/', (_, res: Response<BlogViewModel[]>) => {
    const allBlogs = blogsRepository.findAllBlogs()
    const allBlogsResponse = allBlogs.map(getBlogViewModel)
    res.status(HTTPStatuses.SUCCESS200).send(allBlogsResponse)
  })
  .get('/:id', (req: RequestWithParams<URIParamsBlogModel>, res: Response<BlogViewModel>) => {
    const blogoById = blogsRepository.findBlogById(req.params.id)

    if (!blogoById) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }

    const blogoByIdResponse = getBlogViewModel(blogoById)
    res.status(HTTPStatuses.SUCCESS200).send(blogoByIdResponse)
  })
  .post('/', (req: RequestWithBody<CreateBlogModel>, res: Response<BlogViewModel | ErrorsMessageType>) => {
    const errors = getBlogsErrors(req.body)

    if (!isEmpty(errors.errorsMessages)) {
      res.status(HTTPStatuses.BADREQUEST400).send(errors)
      return
    }

    const createdBlog = blogsRepository.createdBlog({
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    })

    const createdBlogResponse = getBlogViewModel(createdBlog)
    res.status(HTTPStatuses.CREATED201).send(createdBlogResponse)
  })
  .put('/:id', (req: RequestWithParamsAndBody<URIParamsBlogModel, UpdateBlogModel>, res: Response) => {
    const errors = getBlogsErrors(req.body)

    if (!isEmpty(errors.errorsMessages)) {
      res.status(HTTPStatuses.BADREQUEST400).send(errors)
      return
    }

    const isBlogUpdated = blogsRepository.updateBlog(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    })

    if (!isBlogUpdated) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }

    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/:id', (req: RequestWithParams<URIParamsBlogModel>, res: Response) => {
    const isBlogDeleted = blogsRepository.deleteBlogById(req.params.id)

    if (!isBlogDeleted) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }
    
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
