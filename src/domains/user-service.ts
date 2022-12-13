import { trim } from 'lodash'
import { userRepository } from '../repositories/user/user-db-repository'
import { getNextStrId } from '../utils'
import { UserType, SortDirection } from '../types'
import { ServiceUserType } from '../types/domain/users'

export const userService: ServiceUserType = {
  async findAllUsers({
    searchLoginTerm,
    searchEmailTerm,
    pageNumber,
    pageSize,
    sortBy = 'createdAt',
    sortDirection =  SortDirection.DESC,
  }) {
    const foundAllPosts = await userRepository.findAllUsers({
      searchLoginTerm,
      searchEmailTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    })

    return foundAllPosts
  },
  async findUserById(id) {
    const foundUserById = await userRepository.findUserById(id)

    return foundUserById
  },
  async createdUser({ login, password, email }) {
    const newUser: UserType = {
      id: getNextStrId(),
      login: trim(String(login)),
      email: trim(String(email)),
      createdAt: new Date().toISOString(),
    }

    const createdUser = await userRepository.createdUser(newUser)

    return createdUser
  },
  async deleteUserById(id) {
    const isDeleteUserById = await userRepository.deleteUserById(id)

    return isDeleteUserById
  },
}
