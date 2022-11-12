import express from 'express'
import moment from 'moment'
import { db } from './mocks'

const app = express()
const port = 3000

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.get('/', (req, res) => {
  res.send('Expressjs video api')
})

app.get('/api/videos', (_, res) => {
  res.status(200).json(db.videos)
})

app.get('/api/videos/:id', (req, res) => {
  const video = db.videos.find(({ id }) => id === Number(req.params.id))
  
  if (!video) {
    res.status(404).json()
    return
  }

  res.status(200).json(video)
})

app.post('/api/videos', (req, res) => {
  const item = {
    id: Number(moment().format('x')),
    title: req.body.title,
    author: req.body.author,
    availableResolutions: req.body.availableResolutions,
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: moment().format(),
    publicationDate: moment().format(),
  }

  db.videos.push(item)
  res.status(201).json(item)
})

app.put('/api/videos', (req, res) => {
  res.send('put videos')
})

app.delete('/api/videos/:id', (req, res) => {
  const video = db.videos.find(({ id }) => id === Number(req.params.id))
  
  if (!video) {
    res.sendStatus(404)
    return
  }
  
  db.videos.filter(({ id }) => id !== video.id)
  res.sendStatus(204)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
