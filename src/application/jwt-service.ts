import jwt from 'jsonwebtoken'
import { settings } from '../settings'
import { UserType } from '../types'

export const jwtService = {
  async createAccessToken (user: UserType) {
    const accessToken = jwt.sign({ userId: user.id }, settings.ACCESS_TOKEN_SECRET, { expiresIn: '10d' })
    return { accessToken }
  },
  async createRefreshToken (user: UserType) {
    const refreshToken = jwt.sign({ userId: user.id }, settings.REFRESH_TOKEN_SECRET, { expiresIn: '20d' })
    return { refreshToken }
  },   
  async getUserIdByAccessToken (token: string) {
    try {
      const result: any = jwt.verify(token, settings.ACCESS_TOKEN_SECRET)

      return result.userId
    } catch (error) {
      return null
    }
  },
  async getUserIdByRefreshToken (token: string) {
    try {
      const result: any = jwt.verify(token, settings.REFRESH_TOKEN_SECRET)

      return result.userId
    } catch (error) {
      return null
    }
  }  
}
