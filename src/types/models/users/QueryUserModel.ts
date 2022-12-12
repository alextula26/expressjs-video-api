import { SortDirection } from '../../enums'

export type QueryUserModel = {
  /** 
    * searchLoginTerm for search term for user Login: Login should contains this term in any position
    * searchEmailTerm for search term for user Email: Email should contains this term in any position
    * pageNumber for number of portions that should be returned
    * pageSize for portions size that should be returned
    * sortBy for field by which the sorting takes place. Default value : createdAt
    * sortDirection for available values: asc, desc. Default value: desc
  */  
  searchLoginTerm: string | null
  searchEmailTerm: string | null
  pageNumber: number
  pageSize: number
  sortBy: string
  sortDirection: SortDirection
}
