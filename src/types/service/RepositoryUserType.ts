import { UserViewModel, QueryUserModel } from '../models'
import { UserType } from '../schema'
import { ResponseViewModelDetail } from '../response'

export type RepositoryUserType = {
  findAllUsers: ({ searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection }: QueryUserModel) => Promise<ResponseViewModelDetail<UserType>>
  findUserById: (id: string) => Promise<UserViewModel | null>
  createdUser: (createdUser: UserType) => Promise<UserViewModel>
  deleteUserById: (id: string) => Promise<boolean>
  _getUserViewModel: (dbUser: UserType) => UserViewModel
  _getUsersViewModelDetail: ({ items, totalCount, pagesCount, page, pageSize }: ResponseViewModelDetail<UserType>) => ResponseViewModelDetail<UserType>
}
