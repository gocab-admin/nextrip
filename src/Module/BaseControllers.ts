import axios from 'axios'

class BaseController {

  static async paginationBuilder(query: any = '') {
    let pagination: any = {}
    let take = query._limit || 10
    let pageNo = query._page || 1
    let skip = (pageNo - 1) * take
    pagination.take = Number(take)
    pagination.skip = Number(skip)
    return pagination
  }


  static async getGoogleUserInfo(access_token) {
    const { data } = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      // https://www.googleapis.com/oauth2/v1/userinfo?alt=json
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    return data
  }


  static async getFacebookUserData(access_token) {
    console.log(access_token)

    const { data } = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        // fields: ['email'].join(','),
        access_token: access_token
      }
    })
    console.log(data) // { email }
    return data
  }
}

export { BaseController }
