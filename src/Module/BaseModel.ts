import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { Config } from '@abserve/Config/AppConfig'

class BaseModel {
  salt: string
  hash: string

  setPassword(password = 'abservetech') {
    let obj = { salt: '', hash: '' }
    obj.salt = crypto.randomBytes(16).toString('hex')
    obj.hash = crypto.pbkdf2Sync(password, obj.salt, 1000, 64, 'sha512').toString('hex')
    return obj
  }

  validPassword(password = 'abservetech', salt, hashval) {
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return hashval === hash
  }

  getPassword(password = 'abservetech') {
    let salt = crypto.randomBytes(16).toString('hex')
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    const obj = { salt, hash }
    return obj
  }

  generateJwt(generateObj) {
    let expiry = new Date()
    expiry.setDate(expiry.getDate() + 7) // 7 days
    const secret = Config.auth.cipherKey
    return jwt.sign(generateObj, secret, {
      expiresIn: '30d'
    })
  }

  checkNewPassword(newPassword, hash, salt) {
    let newHash = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, 'sha512').toString('hex')
    if (newHash === hash) {
      return 0
    } else {
      return newHash
    }
  }
}

export { BaseModel }