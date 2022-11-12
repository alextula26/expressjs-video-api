import express from 'express'
import moment from 'moment'
import { isEmpty } from 'lodash'
import { getNextId, getErrors } from './utils'
import { db } from './mocks'

const app = express()
const port = 3000

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app
  .get('/', (_, res) => {
    res.status(200).send(db.videos)
  })
  .get('/api/videos', (_, res) => {
    res.status(200).send(db.videos)
  })
  .get('/api/videos/:id', (req, res) => {
    const video = db.videos.find(({ id }) => id === Number(req.params.id))
    
    if (!video) {
      res.status(404)
      return
    }

    res.status(200).send(video)
  })
  .post('/api/videos', (req, res) => {
    const errors = getErrors(req.body)
    
    console.log

    if (!isEmpty(errors)) {
      res.status(400).send(errors)
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
    res.status(201).send(item)
  })
  .put('/api/videos', (req, res) => {
    res.send('put videos')
  })
  .delete('/api/videos/:id', (req, res) => {
    const video = db.videos.find(({ id }) => id === Number(req.params.id))
    
    if (!video) {
      res.status(404)
      return
    }
    
    db.videos.filter(({ id }) => id !== video.id)
    res.status(204)
  })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
