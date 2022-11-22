import { isEmpty, trim, isNull } from 'lodash'
import { ErrorsMessagesType, ErrorsMessageType, AvailableResolutions } from '../types'

export const postErrorsValidator = {
  titleError: {
    message: "title is incorrectly",
    field: "title"
  },

  shortDescriptionError: {
    message: "shortDescription is incorrectly",
    field: "shortDescription"
  },

  contentError: {
    message: "content is incorrectly",
    field: "content"
  },

  blogIdError: {
    message: "blogId is incorrectly",
    field: "blogId"
  },
}

export const getPostErrors = (reqBody: { title: string, shortDescription: string, content: string, blogId: string }): ErrorsMessageType => {
    const errorsMessages: ErrorsMessagesType[] = []

    if (isNull(reqBody.title) || isEmpty(trim(String(reqBody.title))) || trim(String(reqBody.title)).length > 30) {
      errorsMessages.push(postErrorsValidator.titleError)
    }

    if (isNull(reqBody.shortDescription) || isEmpty(trim(String(reqBody.shortDescription))) || trim(String(reqBody.shortDescription)).length > 100) {
      errorsMessages.push(postErrorsValidator.shortDescriptionError)
    }

    if (isNull(reqBody.content) || isEmpty(trim(String(reqBody.content))) || trim(String(reqBody.content)).length > 1000) {
      errorsMessages.push(postErrorsValidator.contentError)
    }

    if (isNull(reqBody.blogId) || isEmpty(trim(String(reqBody.blogId)))) {
      errorsMessages.push(postErrorsValidator.blogIdError)
    }

    return { errorsMessages: errorsMessages }
  }
