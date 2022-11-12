import { isEmpty } from 'lodash'
import { ErrorsMessagesType } from '../types'

export const getErrors = (reqBody: any) => {
    const errorsMessages: ErrorsMessagesType[] = []

    if (isEmpty(reqBody.title)) {
      errorsMessages.push({
        message: "Поле не может быть пустым",
        field: "title"
      })
    }

    if (reqBody.title.length > 40) {
      errorsMessages.push({
        message: "Поле не может быть больше 40 символов",
        field: "title"
      })
    }

    if (isEmpty(reqBody.author)) {
      errorsMessages.push({
        message: "Поле не может быть пустым",
        field: "author"
      })
    }

    if (reqBody.author.length > 20) {
      errorsMessages.push({
        message: "Поле не может быть больше 20 символов",
        field: "author"
      })
    }

    return errorsMessages
  }
