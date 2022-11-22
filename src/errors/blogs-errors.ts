import { isEmpty, trim, isNull } from 'lodash'
import { ErrorsMessagesType, ErrorsMessageType } from '../types'

export const blogErrorsValidator = {
  nameError: {
    message: "name is incorrectly",
    field: "name"
  },

  descriptionError: {
    message: "description is incorrectly",
    field: "description"
  },

  websiteUrlError: {
    message: "websiteUrl is incorrectly",
    field: "websiteUrl"
  }, 
}

export const getBlogsErrors = (reqBody: { name: string, description: string, websiteUrl: string }): ErrorsMessageType => {
    const errorsMessages: ErrorsMessagesType[] = []
    const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/

    if (isNull(reqBody.name) || isEmpty(trim(String(reqBody.name))) || trim(String(reqBody.name)).length > 15) {
      errorsMessages.push(blogErrorsValidator.nameError)
    }

    if (isNull(reqBody.description) || isEmpty(trim(String(reqBody.description))) || trim(String(reqBody.description)).length > 500) {
      errorsMessages.push(blogErrorsValidator.descriptionError)
    }

    if (isNull(reqBody.websiteUrl)
      || isEmpty(trim(String(reqBody.websiteUrl)))
      || trim(String(reqBody.websiteUrl)).length > 100
      || !pattern.test(reqBody.websiteUrl)
    ) {
      errorsMessages.push(blogErrorsValidator.websiteUrlError)
    }

    return { errorsMessages: errorsMessages }
  }
