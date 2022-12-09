import { SortDirection } from '../../enums'

export type QueryBlogModel = {
  searchNameTerm: string | null
  pageNumber: number
  pageSize: number
  sortBy: string
  sortDirection: SortDirection
}
