import express from 'express'
import moment from 'moment'
import { isEmpty } from 'lodash'
import { getNextId, getErrors } from './utils'
import { HTTPStatuses } from './types'
import { db } from './mocks'

const app = express()
const port = 3000

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app
  .get('/', (_, res) => {
    res.status(HTTPStatuses.SUCCESS200).send(db.videos)
  })
  .get('/api/videos', (_, res) => {
    res.status(HTTPStatuses.SUCCESS200).send(db.videos)
  })
  .get('/api/videos/:id', (req, res) => {
    const video = db.videos.find(({ id }) => id === Number(req.params.id))
    
    if (!video) {
      res.status(HTTPStatuses.NOTFOUND404)
      return
    }

    res.status(200).send(video)
  })
  .post('/api/videos', (req, res) => {
    const errors = getErrors(req.body)
    
    if (!isEmpty(errors)) {
      res.status(HTTPStatuses.BADREQUEST400).send(errors)
      return
    }    
    
    const item = {
      id: getNextId(),
      title: req.body.title,
      author: req.body.author,
      availableResolutions: req.body.availableResolutions,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: moment().format(),
      publicationDate: moment().format(),
    }

    db.videos.push(item)
    res.status(HTTPStatuses.CREATED201).send(item)
  })
  .put('/api/videos/:id', (req, res) => {
    const errors = getErrors(req.body)

    if (!isEmpty(errors)) {
      res.status(HTTPStatuses.BADREQUEST400).send(errors)
      return
    }
    
    const video = db.videos.find(({ id }) => id === Number(req.params.id))

    if (!video) {
      res.status(HTTPStatuses.NOTFOUND404).send()
      return
    }

    const id = Number(req.params.id)
    const item = {
      id,
      title: req.body.title,
      author: req.body.author,
      availableResolutions: req.body.availableResolutions,
      canBeDownloaded: req.body.canBeDownloaded,
      minAgeRestriction: req.body.minAgeRestriction,
      createdAt: video.createdAt,
      publicationDate: req.body.publicationDate,
    }

    db.videos.map(video => video.id === id ? item : video)
    res.status(HTTPStatuses.NOCONTENT204).send()
  })
  .delete('/api/videos/:id', (req, res) => {
    const video = db.videos.find(({ id }) => id === Number(req.params.id))
    
    if (!video) {
      res.status(HTTPStatuses.NOTFOUND404)
      return
    }
    
    db.videos.filter(({ id }) => id !== video.id)
    res.status(HTTPStatuses.NOCONTENT204)
  })
  .listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
