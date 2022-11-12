import express from 'express'
import { AvailableResolutions, VideoType } from './types/videos'

const app = express()
const port = 3000

const db:VideoType[] = [
  {
    id: 1,
    title: "Видео 1",
    author: "Автор 1",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2022-11-12T17:01:48.148Z",
    publicationDate: "2022-11-12T17:01:48.148Z",
    availableResolutions: [AvailableResolutions.P144],
  },
  {
    id: 2,
    title: "Видео 2",
    author: "Автор 2",
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: "2022-11-09T17:01:48.148Z",
    publicationDate: "2022-11-09T17:01:48.148Z",
    availableResolutions: [AvailableResolutions.P1440, AvailableResolutions.P720],
  },
  {
    id: 3,
    title: "Видео 3",
    author: "Автор 3",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2022-11-05T17:01:48.148Z",
    publicationDate: "2022-11-05T17:01:48.148Z",
    availableResolutions: [AvailableResolutions.P480],
  },
]

app.get('/', (req, res) => {
  res.send('Expressjs video api')
})

app.get('/api/videos', (_, res) => {
  res.json(db)
  res.sendStatus(200)  
})

app.get('/api/videos/:id', (req, res) => {
  const video = db.find(({ id }) => id === Number(req.params.id))
  
  if (!video) {
    res.sendStatus(404)
    return
  }
  
  res.json(video)
  res.sendStatus(200)
})

app.post('/api/videos', (req, res) => {
  res.send('post videos')
})

app.put('/api/videos', (req, res) => {
  res.send('put videos')
})

app.delete('/api/videos/:id', (req, res) => {
  const video = db.find(({ id }) => id === Number(req.params.id))
  
  if (!video) {
    res.sendStatus(404)
    return
  }
  
  db.filter(({ id }) => id !== video.id)
  res.sendStatus(204)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
