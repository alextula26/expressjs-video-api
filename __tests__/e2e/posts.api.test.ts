import request from 'supertest'
import { app } from '../../src'
import { PostType, BlogType, HTTPStatuses } from '../../src/types'
import { postErrorsValidator } from '../../src/errors'

describe('/api/posts',  () => {   
  let createdBlog1: BlogType
  let createdBlog2: BlogType

  beforeAll(async () => {
    await request(app).delete('/api/testing/all-data')
    
    const createdBlog1Responce = await request(app)
      .post('/api/blogs/')
      .send({
        name: 'Блог 1',
        description: 'Очень хороший блог 1',
        websiteUrl: 'https://cont.ws/2425094',
      })

    createdBlog1 = createdBlog1Responce.body

    const createdBlog2Responce = await request(app)
      .post('/api/blogs/')
      .send({
        name: 'Блог 2',
        description: 'Очень хороший блог 2',
        websiteUrl: 'https://cont.ws/2425095',
      })

    createdBlog2 = createdBlog2Responce.body    
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

  it('should not create post 1 with incorrect blog id', async () => {
    await request(app)
      .post('/api/posts')
      .send({
        title: 'Пост 1',
        shortDescription: 'Очень хороший пост 1',
        content: 'Контент очень хорошего поста 1',
        blogId: '-100',
      })
      .expect(HTTPStatuses.BADREQUEST400)
  })

  let createdPost1: PostType

  it('should create post 1 with correct input data', async () => {
    const createdPostResponce = await request(app)
      .post('/api/posts')
      .send({
        title: 'Пост 1',
        shortDescription: 'Очень хороший пост 1',
        content: 'Контент очень хорошего поста 1',
        blogId: createdBlog1.id,
      })
      .expect(HTTPStatuses.CREATED201)

    createdPost1 = createdPostResponce.body

    expect(createdPost1).toEqual({
      id: expect.any(String),
      title: 'Пост 1',
      shortDescription: 'Очень хороший пост 1',
      content: 'Контент очень хорошего поста 1',
      blogId: createdBlog1.id,
      blogName: createdBlog1.name,
    })

    await request(app)
      .get(`/api/posts/${createdPost1.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdPost1)   
      
    await request(app)
      .get('/api/posts')
      .expect(HTTPStatuses.SUCCESS200, [createdPost1])
  })

  let createdPost2: PostType

  it('should create post 2 with correct input data', async () => {
    const createdPostResponce = await request(app)
      .post('/api/posts')
      .send({
        title: 'Пост 2',
        shortDescription: 'Очень хороший пост 2',
        content: 'Контент очень хорошего поста 2',
        blogId: createdBlog2.id,
      })
      .expect(HTTPStatuses.CREATED201)

    createdPost2 = createdPostResponce.body

    expect(createdPost2).toEqual({
      id: expect.any(String),
      title: 'Пост 2',
      shortDescription: 'Очень хороший пост 2',
      content: 'Контент очень хорошего поста 2',
      blogId: createdBlog2.id,
      blogName: createdBlog2.name,
    })

    await request(app)
      .get(`/api/posts/${createdPost2.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdPost2)

    await request(app)
    .get('/api/posts')
    .expect(HTTPStatuses.SUCCESS200, [createdPost1, createdPost2])
  })

  it('should not update post 1 with incorrect input data', async () => {
      await request(app)
      .put(`/api/posts/${createdPost1.id}`)
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
      .put(`/api/posts/${createdPost1.id}`)
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
        blogId: createdBlog1.id,
      })
      .expect(HTTPStatuses.NOTFOUND404)

      await request(app)
      .get(`/api/posts/${createdPost1.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdPost1)   
  })

  it('should not update post 1 with incorrect blog id', async () => {
    await request(app)
      .put(`/api/posts/${createdPost1.id}`)
      .send({
        title: 'Пост 3',
        shortDescription: 'Очень хороший пост 3',
        content: 'Контент очень хорошего поста 3',
        blogId: '-100',
      })
      .expect(HTTPStatuses.BADREQUEST400)
  })

  it('should update post 1 with correct input data', async () => {
      await request(app)
      .put(`/api/posts/${createdPost1.id}`)
      .send({
        title: 'Пост 3',
        shortDescription: 'Очень хороший пост 3',
        content: 'Контент очень хорошего поста 3',
        blogId: createdBlog1.id,
      })
      .expect(HTTPStatuses.NOCONTENT204)

      await request(app)
      .get(`/api/posts/${createdPost1.id}`)
      .expect(HTTPStatuses.SUCCESS200, {
        ...createdPost1,
        title: 'Пост 3',
        shortDescription: 'Очень хороший пост 3',
        content: 'Контент очень хорошего поста 3',
        blogId: createdBlog1.id,
        blogName: createdBlog1.name,
      })

      await request(app)
      .get(`/api/posts/${createdPost2.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdPost2)
  })

  it('should delete all posts', async () => {
    await request(app)
      .delete('/api/posts/' + -100)
      .expect(HTTPStatuses.NOTFOUND404)

    await request(app)
      .delete(`/api/posts/${createdPost1.id}`)
      .expect(HTTPStatuses.NOCONTENT204)

    await request(app)
      .delete(`/api/posts/${createdPost2.id}`)
      .expect(HTTPStatuses.NOCONTENT204)

    await request(app)
      .get('/api/posts')
      .expect(HTTPStatuses.SUCCESS200, [])
  })
})
