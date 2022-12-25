import { Router, Response } from 'express'
import { emailManager } from '../managers'
//import { userService } from '../domains'
import {
  //authBasicMiddleware,
  //loginUserValidation,
  emailUserValidation,
  //passwordUserValidation,
  inputValidationMiddleware,
} from '../middlewares'

import {
  RequestWithBody,
  SendEmailModel,
  /*RequestWithQuery,
  RequestWithParams,
  URIParamsUserModel,
  QueryUserModel,
  CreateUserModel,
  UserViewModel,
  ResponseViewModelDetail,*/
  HTTPStatuses,
  ErrorsMessageType,
} from '../types'

export const emailRouter = Router()

const middlewares = [
  // authBasicMiddleware,
  // loginUserValidation,
  emailUserValidation,
  // passwordUserValidation,
  inputValidationMiddleware,
]

emailRouter
  .post('/send', middlewares, async (req: RequestWithBody<SendEmailModel>, res: Response<string | ErrorsMessageType>) => {
    const user = {
      id: '1',
      login: 'alextula',
      email: 'alex_marc86@mail.ru',
      passwordHash: 'passwordHash',
      createdAt: 'createdAt',
    }

    const isSendEmail: boolean = await emailManager.sendEmailCreatedUser(user)

    if (!isSendEmail) {
      res.status(HTTPStatuses.BADREQUEST400).send()
    }

    res.status(HTTPStatuses.SUCCESS200).send()
  })
  