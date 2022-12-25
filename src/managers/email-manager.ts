import { emailAdapter } from "../adapters"
import { UserType } from '../types'

export const emailManager = {
  async sendEmailCreatedUser(user: UserType) {
    const messageId: string | null = await emailAdapter.sendEmail(
      user.email,
      'Подтверждение регистрации',
      '<h1>Hello guys</h1><div><a href=\"https://it-incubator.io/\">Click</a></div>'
    )

    if (!messageId) {
      return false
    }

    return true
  }
}
