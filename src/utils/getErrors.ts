import { isEmpty } from 'lodash'
import { ErrorsMessagesType } from '../types'

export const errorsValidator = {
  titleEmptyError: {
    message: "Поле не может быть пустым",
    field: "title"
  },
  authorEmptyError: {
    message: "Поле не может быть пустым",
    field: "title"
  },
  titleMore40Chars: {
    message: "Поле не может быть больше 40 символов",
    field: "title"
  },
  authorMore20Chars: {
    message: "Поле не может быть пустым",
    field: "title"
  }
}

export const getErrors = (reqBody: any) => {
    const errorsMessages: ErrorsMessagesType[] = []

    if (isEmpty(reqBody.title)) {
      errorsMessages.push(errorsValidator.titleEmptyError)
    }

    if (reqBody.title.length > 40) {
      errorsMessages.push(errorsValidator.titleMore40Chars)
    }

    if (isEmpty(reqBody.author)) {
      errorsMessages.push(errorsValidator.authorEmptyError)
    }

    if (reqBody.author.length > 20) {
      errorsMessages.push(errorsValidator.authorMore20Chars)
    }

    return errorsMessages
  }
