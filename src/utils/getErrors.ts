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
  },
  minAgeRestrictionLess1Number: {
    message: "Число в поле должно быть менее 1",
    field: "minAgeRestriction"
  },
  minAgeRestrictionMore18Number: {
    message: "Число в поле не может быть более 18",
    field: "minAgeRestriction"
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

    if (reqBody.minAgeRestriction < 1) {
      errorsMessages.push(errorsValidator.minAgeRestrictionLess1Number)
    }

    if (reqBody.minAgeRestriction > 18) {
      errorsMessages.push(errorsValidator.minAgeRestrictionMore18Number)
    }

    return errorsMessages
  }
