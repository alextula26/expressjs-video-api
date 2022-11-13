import request from 'supertest'
import moment from 'moment'
import { app } from '../../src'
import { VideoType, AvailableResolutions, HTTPStatuses } from '../../src/types'
import { errorsValidator } from '../../src/utils'

describe('/api/videos',  () => {
  beforeAll(async () => {
    await request(app).delete('/api/testing/all-data')
  })

  it('should return status 200 and empty array', async () => {
    await request(app)
      .get('/api/videos')
      .expect(HTTPStatuses.SUCCESS200, [])
  })

  it('should return status 404 for not existing videos', async () => {
    await request(app)
      .get('/api/videos/1')
      .expect(HTTPStatuses.NOTFOUND404)
  })

  it('should not create with incorrect input data', async () => {
    await request(app)
      .post('/api/videos')
      .send({
        title: '',
        author: '',
        availableResolutions: null,
      })
      .expect(HTTPStatuses.BADREQUEST400, [
        errorsValidator.titleEmptyError,
        errorsValidator.authorEmptyError,
      ])

      await request(app)
      .post('/api/videos')
      .send({ title: 'title будет больше 40 символов'.repeat(3), author: '', availableResolutions: null })
      .expect(HTTPStatuses.BADREQUEST400, [
        errorsValidator.titleMore40Chars,
        errorsValidator.titleEmptyError,
      ])

      await request(app)
      .post('/api/videos')
      .send({ title: '', author: 'author будет больше 20 символов'.repeat(2), availableResolutions: null })
      .expect(HTTPStatuses.BADREQUEST400, [
        errorsValidator.titleEmptyError,
        errorsValidator.authorMore20Chars,
      ])      

      await request(app)
      .get('/api/videos/1')
      .expect(HTTPStatuses.NOTFOUND404)
  })

  let createdVideo: VideoType

  it('should create with correct input data', async () => {
    const createdVideoResponce = await request(app)
      .post('/api/videos')
      .send({
        title: 'Видео 1',
        author: 'Автор 1',
        availableResolutions: [AvailableResolutions.P144],
      })
      .expect(HTTPStatuses.CREATED201)

    createdVideo = createdVideoResponce.body

    expect(createdVideo).toEqual({
      id: expect.any(Number),
      title: 'Видео 1',
      author: 'Автор 1',
      availableResolutions: [AvailableResolutions.P144],
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    })

    await request(app)
      .get(`/api/videos/${createdVideo.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdVideo)   
      
    await request(app)
      .get('/api/videos')
      .expect(HTTPStatuses.SUCCESS200, [createdVideo])
  })

  it('should not update with incorrect input data', async () => {
    const publicationDate = moment().format()
    
    await request(app)
      .post(`/api/videos/${createdVideo.id}`)
      .send({
        title: '',
        author: '',
        availableResolutions: null,
        canBeDownloaded: true,
        minAgeRestriction: 1,
        publicationDate: publicationDate,
      })
      .expect(HTTPStatuses.BADREQUEST400, [
        errorsValidator.titleEmptyError,
        errorsValidator.authorEmptyError,
      ])

      /*await request(app)
      .post('/api/videos')
      .send({
        title: 'title будет больше 40 символов'.repeat(3),
        author: '',
        availableResolutions: null,
      })
      .expect(HTTPStatuses.BADREQUEST400, [
        errorsValidator.titleMore40Chars,
        errorsValidator.titleEmptyError,
      ])

      await request(app)
      .post('/api/videos')
      .send({ title: '', author: 'author будет больше 20 символов'.repeat(2), availableResolutions: null })
      .expect(HTTPStatuses.BADREQUEST400, [
        errorsValidator.titleEmptyError,
        errorsValidator.authorMore20Chars,
      ])      

      await request(app)
      .get('/api/videos/1')
      .expect(HTTPStatuses.NOTFOUND404)
      */
  })
})
