import { SortDirection } from '../../enums'

export type QueryPostModel = {
  searchNameTerm: string | null
  pageNumber: number
  pageSize: number
  sortBy: string
  sortDirection: SortDirection
}
