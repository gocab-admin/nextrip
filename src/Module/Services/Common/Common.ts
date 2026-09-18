import fs from 'fs'
import path from 'path'
import process from 'node:process'
import { AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { Response } from 'express'
import { Config } from '@abserve/Config/AppConfig'

class ServerConfigController {
  
  static readonly configFileEditor = (inputObject: any) => (key: any, value: any) => {
    if (Object.keys(inputObject).includes(key)) {
      return Number(inputObject[key])
    }
    return value
  }


  static readonly restartServer = async () => {
    setTimeout(function () {
      process.exit(1)
    }, 10000) //30000 = 30 sec
  }


  static readonly serverCon = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      validation: {},
      statusCode: 500
    }
    try {
      let body = req.body
      let updatedJsonString
      fs.access(
        path.join(__dirname, '..', '..', 'Config', 'AppConfig.ts'),
        fs.constants.R_OK,
        async (err) => {
          if (err) {
            updatedJsonString =
              'const Config =' +
              JSON.stringify(Config, this.configFileEditor(body), 2) +
              '\nexports.Config = Config'
            fs.writeFile(
              path.join(__dirname, '..', '..', 'Config', 'AppConfig.js'),
              updatedJsonString,
              async (err) => {
                if (err) {
                  response.status = false
                  response.message = 'ERROR'
                  response.statusCode = 500
                }
              }
            )
          } else {
            updatedJsonString =
              'const Config =' +
              JSON.stringify(Config, this.configFileEditor(body), 2) +
              '\nexport { Config };'

            fs.writeFile(
              path.join(__dirname, '..', '..', 'Config', 'AppConfig.ts'),
              updatedJsonString,
              async (err) => {
                if (err) {
                  response.status = false
                  response.message = 'ERROR'
                  response.statusCode = 500
                }
              }
            )
          }
          await this.restartServer()
        }
      )


      // RESPONSE
      response.status = true
      response.message = 'UPDATED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getConfig = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      data: {},
      message: 'Unprocessable Entity',
      validation: {},
      statusCode: 500
    }
    fs.readFile(path.join(__dirname, '..', '..', 'Config', 'AppConfig.js'), 'utf8', (err, data) => {
      try {
        response.data = Config
        response.status = true
        response.message = 'CONFIG_DETAILL'
        response.statusCode = 200
      } catch (error) {
        console.log('Error \n', error)
        response.status = false
        response.message = error.message || response.message
        response.validation = error.cause || {}
        response.statusCode = error.statusCode || response.statusCode
      }
      return res.status(response.statusCode || 500).json(response).end()
    })
  }
}

export { ServerConfigController }