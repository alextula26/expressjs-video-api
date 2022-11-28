import { db } from '../mocks'

import { TestingRepositoryType } from '../types'

export const testingRepository: TestingRepositoryType = {
  deleteAll: async () => {
    db.videos = []
    db.posts = []
    db.blogs = []

    return true
  },
}
