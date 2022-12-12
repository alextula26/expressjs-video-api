import { trim } from 'lodash'
import { userCollection } from '../db'
import { RepositoryUserType, SortDirection, UserType } from '../../types'

export const userRepository: RepositoryUserType = {
  async findAllUsers({
    searchLoginTerm,
    searchEmailTerm,
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
  }) {
    const filter: any = {}
    const sort: any = { [sortBy]: sortDirection === SortDirection.ASC ? 1 : -1 }

    if (searchLoginTerm) {
      filter.login = { $regex: searchLoginTerm, $options: 'i' }
    }

    if (searchEmailTerm) {
      filter.email = { $regex: searchEmailTerm, $options: 'i' }
    }

    const totalCount = await userCollection.count(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)
    const skip = (+pageNumber - 1) * +pageSize

    const users: UserType[] = await userCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(+pageSize)
      .toArray()

    return this._getUsersViewModelDetail({
      items: users,
      totalCount,
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
    })
  },
  async findUserById(id) {
    const foundUser: UserType | null = await userCollection.findOne({ id })

    if (!foundUser) {
      return null
    }

    return this._getUserViewModel(foundUser)
  },
  async createdUser(createdUser) {
    await userCollection.insertOne(createdUser)

    return this._getUserViewModel(createdUser)
  },
  async deleteUserById(id) {
    const { deletedCount } = await userCollection.deleteOne({ id })

    return deletedCount === 1
  },
  _getUserViewModel(dbUser) {
    return {
      id: dbUser.id,
      login: dbUser.login,
      email: dbUser.email,
      createdAt: dbUser.createdAt,
    }
  },
  _getUsersViewModelDetail({ items, totalCount, pagesCount, page, pageSize }) {
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: items.map(item => ({
        id: item.id,
        login: item.login,
        email: item.email,
        createdAt: item.createdAt,
      })),
    }
  },
}
