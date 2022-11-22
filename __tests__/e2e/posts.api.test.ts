import request from 'supertest'
import { app } from '../../src'
import { BlogType, HTTPStatuses } from '../../src/types'
import { postErrorsValidator } from '../../src/errors'

describe('/api/posts',  () => { 
  beforeAll(async () => {
    await request(app).delete('/api/testing/all-data')
  })

  it('should return status 200 and empty array', async () => {
    await request(app)
      .get('/api/posts')
      .expect(HTTPStatuses.SUCCESS200, [])
  })

  it('should return status 404 for not existing posts', async () => {
    await request(app)
      .get('/api/posts/1')
      .expect(HTTPStatuses.NOTFOUND404)
  })

  it('should not create post with incorrect input data', async () => {
    await request(app)
      .post('/api/posts')
      .send({
        title: '',
        shortDescription: null,
        content: '',
        blogId: '',
      })
      .expect(HTTPStatuses.BADREQUEST400, {
        errorsMessages: [
          postErrorsValidator.titleError,
          postErrorsValidator.shortDescriptionError,
          postErrorsValidator.contentError,
          postErrorsValidator.blogIdError,
        ]
      })

    await request(app)
      .post('/api/posts')
      .send({
        title: 'title будет больше 30 символов'.repeat(3),
        shortDescription: 'shortDescription будет больше 500 символов'.repeat(20),
        content: 'content будет больше 1000 символов'.repeat(50),
        blogId: null,
      })
      .expect(HTTPStatuses.BADREQUEST400, {
        errorsMessages: [
          postErrorsValidator.titleError,
          postErrorsValidator.shortDescriptionError,
          postErrorsValidator.contentError,
          postErrorsValidator.blogIdError,
        ]
      })
      
      await request(app)
      .get('/api/posts/1')
      .expect(HTTPStatuses.NOTFOUND404)
  })

  let createdBlog1: BlogType

  it('should create post 1 with correct input data', async () => {
    const createdBlogResponce = await request(app)
      .post('/api/posts')
      .send({
        title: 'Пост 1',
        shortDescription: 'Очень хороший пост 1',
        content: 'Контент очень хорошего поста 1',
        blogId: '1',
      })
      .expect(HTTPStatuses.CREATED201)

    createdBlog1 = createdBlogResponce.body

    expect(createdBlog1).toEqual({
      id: expect.any(String),
      title: 'Пост 1',
      shortDescription: 'Очень хороший пост 1',
      content: 'Контент очень хорошего поста 1',
      blogId: '1',
    })

    await request(app)
      .get(`/api/posts/${createdBlog1.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdBlog1)   
      
    await request(app)
      .get('/api/posts')
      .expect(HTTPStatuses.SUCCESS200, [createdBlog1])
  })

  let createdBlog2: BlogType
  it('should create post 2 with correct input data', async () => {
    const createdBlogResponce = await request(app)
      .post('/api/posts')
      .send({
        title: 'Пост 2',
        shortDescription: 'Очень хороший пост 2',
        content: 'Контент очень хорошего поста 2',
        blogId: '1',
      })
      .expect(HTTPStatuses.CREATED201)

    createdBlog2 = createdBlogResponce.body

    expect(createdBlog2).toEqual({
      id: expect.any(String),
      title: 'Пост 2',
      shortDescription: 'Очень хороший пост 2',
      content: 'Контент очень хорошего поста 2',
      blogId: '1',
    })

    await request(app)
      .get(`/api/posts/${createdBlog2.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdBlog2)

    await request(app)
    .get('/api/posts')
    .expect(HTTPStatuses.SUCCESS200, [createdBlog1, createdBlog2])
  })

  it('should not update post 1 with incorrect input data', async () => {
      await request(app)
      .put(`/api/posts/${createdBlog1.id}`)
      .send({
        title: '',
        shortDescription: '',
        content: null,
        blogId: '',
      })
      .expect(HTTPStatuses.BADREQUEST400, {
        errorsMessages: [
          postErrorsValidator.titleError,
          postErrorsValidator.shortDescriptionError,
          postErrorsValidator.contentError,
          postErrorsValidator.blogIdError,
        ]
      })

      await request(app)
      .put(`/api/posts/${createdBlog1.id}`)
      .send({
        title: 'title будет больше 30 символов'.repeat(3),
        shortDescription: 'shortDescription будет больше 500 символов'.repeat(20),
        content: 'content будет больше 1000 символов'.repeat(50),
        blogId: null,
      })
      .expect(HTTPStatuses.BADREQUEST400, {
        errorsMessages: [
          postErrorsValidator.titleError,
          postErrorsValidator.shortDescriptionError,
          postErrorsValidator.contentError,
          postErrorsValidator.blogIdError,
        ] 
      })

      await request(app)
      .put('/api/posts/' + -100)
      .send({
        title: 'Пост 3',
        shortDescription: 'Очень хороший пост 3',
        content: 'Контент очень хорошего поста 3',
        blogId: '1',
      })
      .expect(HTTPStatuses.NOTFOUND404)

      await request(app)
      .get(`/api/posts/${createdBlog1.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdBlog1)   
  })

  it('should update post 1 with correct input data', async () => {
      await request(app)
      .put(`/api/posts/${createdBlog1.id}`)
      .send({
        title: 'Пост 3',
        shortDescription: 'Очень хороший пост 3',
        content: 'Контент очень хорошего поста 3',
        blogId: '1',
      })
      .expect(HTTPStatuses.NOCONTENT204)

      await request(app)
      .get(`/api/posts/${createdBlog1.id}`)
      .expect(HTTPStatuses.SUCCESS200, {
        ...createdBlog1,
        title: 'Пост 3',
        shortDescription: 'Очень хороший пост 3',
        content: 'Контент очень хорошего поста 3',
        blogId: '1',
      })

      await request(app)
      .get(`/api/posts/${createdBlog2.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdBlog2)
  })

  it('should delete all posts', async () => {
    await request(app)
      .delete('/api/posts/' + -100)
      .expect(HTTPStatuses.NOTFOUND404)

    await request(app)
      .delete(`/api/posts/${createdBlog1.id}`)
      .expect(HTTPStatuses.NOCONTENT204)

    await request(app)
      .delete(`/api/posts/${createdBlog2.id}`)
      .expect(HTTPStatuses.NOCONTENT204)

    await request(app)
      .get('/api/posts')
      .expect(HTTPStatuses.SUCCESS200, [])
  })
})
