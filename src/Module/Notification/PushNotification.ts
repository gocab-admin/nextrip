import ServiceAccount from '@abserve/Config/ServiceAccount.json'
import CustomError from '@abserve/errors/index'
import axios from 'axios'
import { GoogleAuth } from 'google-auth-library'

interface NotifyPayload {
  pushToken: string | null
  data: {
    title: string
    body: string
  }
}

class PushNotification {
  private static instance: PushNotification

  private token: string | null = null
  private createdAt: number | null = null

  private constructor() {}

  public static getInstance(): PushNotification {
    if (!PushNotification.instance) {
      PushNotification.instance = new PushNotification()
    }
    return PushNotification.instance
  }

  public async init(): Promise<void> {
    try {
      await this.getToken()
    } catch (error: any) {
      console.error('INITIALIZATION_ERROR:', error.message)
    }
  }

  private async getToken(): Promise<any> {
    try {
      let presentToken = this.token
      const lastDate = this.getCreatedAt()
      const nowDate = new Date().getTime()

      if (this.createdAt == null || presentToken == null || lastDate < nowDate) {
        presentToken = await this.setToken()
      }

      return presentToken
    } catch (error) {
      console.error('GET_TOKEN_ERROR: ', error)
      return null
    }
  }

  private async generateToken(): Promise<any> {
    try {
      const auth = new GoogleAuth({
        credentials: ServiceAccount,
        scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
      })
      const client = await auth.getClient()
      const accessToken = await client.getAccessToken()
      return accessToken?.token || null
    } catch (error) {
      console.error('GENERATE_TOKEN_ERROR: ', error)
      return null
    }
  }

  private async setToken(): Promise<any> {
    try {
      const newToken = await this.generateToken()
      if (newToken) {
        this.token = newToken
        this.setDate()
      } else {
        this.token = null
      }
    } catch (error) {
      console.error('SET_TOKEN_ERROR: ', error)
      this.token = null
    }
    return this.token
  }

  private getCreatedAt(): any {
    return this.createdAt
  }

  private setDate(): void {
    const currentDate = new Date()
    const expiryTime = currentDate.getTime() + 50 * 60 * 1000 // 50 minutes ahead
    this.createdAt = expiryTime
  }

  public async sendNotification(notify: any): Promise<any> {
    try {
      const { pushToken = null, data = {} } = notify
      if (!pushToken) throw new CustomError.BadRequestError('NO_PUSH_TOKEN_PROVIDED')
      
      const endPoint = `https://fcm.googleapis.com/v1/projects/${ServiceAccount.project_id}/messages:send`

      const authToken = await this.getToken()
      if (!authToken) throw new CustomError.UnAuthenticatedError('AUTHENTICATION_FAILED')

      const message = {
        message: {
          token: pushToken,
          notification: {
            body: data.body,
            title: data.title
          }
        }
      }

      const headers = {
        Authorization: `Bearer ${authToken.token || authToken}`,
        'Content-Type': 'application/json',
      }

      const response = await axios.post(endPoint, message, { headers })
      console.log('sendNotification Success: ', JSON.stringify({ status: response?.status, body: response?.data }))
      return true
    } catch (error: any) {
      console.error('SEND_NOTIFICATION_ERROR:', error?.response?.data || error.message)
      return false
    }
  }
}

export const pushNotification = PushNotification.getInstance()