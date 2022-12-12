import { UserViewModel, QueryUserModel } from '../../models'
import { UserType } from '../../schema'
import { ResponseViewModelDetail } from '../../response'
import { CreaetUserService } from '..'

export type ServiceUserType = {
  findAllUsers: ({ searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection}: QueryUserModel) => Promise<ResponseViewModelDetail<UserType>>
  findUserById: (id: string) => Promise<UserViewModel | null>
  createdUser: ({ login, password, email }: CreaetUserService) => Promise<UserViewModel>
  deleteUserById: (id: string) => Promise<boolean>
}
