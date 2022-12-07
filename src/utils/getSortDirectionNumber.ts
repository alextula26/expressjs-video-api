import { SortDirection } from '../types'

export const getSortDirectionNumber = (sortDirection: SortDirection): number => {
    if (sortDirection === SortDirection.ASC) {
        return 1
    }

    return -1
}
