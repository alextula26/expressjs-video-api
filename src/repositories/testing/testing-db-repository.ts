import { blogCollection, postCollection } from '../../repositories/db'
import { RepositoryTestingType } from '../../types/service'

export const testingRepository: RepositoryTestingType = {
  deleteAll: async () => {
    await postCollection.deleteMany({})
    await blogCollection.deleteMany({})

    return true
  },
}
