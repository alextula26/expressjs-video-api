import { body } from 'express-validator';
import { postsErrorsValidator } from '../errors'

export const titlePostValidation = body('title')
    .not().isEmpty()
    .withMessage(postsErrorsValidator.titleError.message)
    .isString()
    .withMessage(postsErrorsValidator.titleError.message)
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage(postsErrorsValidator.titleError.message)

export const shortPostDescriptionValidation = body('shortDescription')
    .not().isEmpty()
    .withMessage(postsErrorsValidator.shortDescriptionError.message)
    .isString()
    .withMessage(postsErrorsValidator.shortDescriptionError.message)
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage(postsErrorsValidator.shortDescriptionError.message)

export const contentPostValidation = body('content')
    .not().isEmpty()
    .withMessage(postsErrorsValidator.contentError.message)
    .isString()
    .withMessage(postsErrorsValidator.contentError.message)
    .trim()
    .isLength({ min: 3, max: 1000 })
    .withMessage(postsErrorsValidator.contentError.message)

export const blogIdPostValidation = body('blogId')
    .not().isEmpty()
    .withMessage(postsErrorsValidator.blogIdError.message)
    .isString()
    .withMessage(postsErrorsValidator.blogIdError.message)
    .trim()
    /*.isLength({ min: 1, max: 14 })
    .withMessage(postsErrorsValidator.blogIdError.message)*/
