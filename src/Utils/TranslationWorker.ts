import mongoose from 'mongoose'
import { writeFileSync, existsSync } from 'node:fs'

import { parentPort } from 'worker_threads'
import Language from '../Module/Translation/models/Language'
import Translation from '../Module/Translation/models/Translation'

const getData = async (inputData: any) => {
  try {
    console.log('TRANSLATION_WORKER_GETDATA_START')
    const { languages, groupId, allGroups = [] } = inputData
    const jsonObject = {}
    const matchQuery = {
      deletedAt: null
    }

    if (groupId == null) {
      const groupIds = await Translation.distinct('group', { group: { $ne: null }, deletedAt: null }).exec()
      matchQuery['_id'] = { $nin: groupIds }
      matchQuery['group'] = null
    } else {
      matchQuery['group'] = new mongoose.Types.ObjectId(groupId)
    }

    const translationsCount = await Translation.find(matchQuery).count()

    // if (!translationsCount) throw new Error('NEED_TO_ADD_TRANSLATION')
    if (translationsCount){
      const parseCount = 100
      const totalIteration = Math.ceil(translationsCount / parseCount)
  
      for (let iterationIndex = 0; iterationIndex < totalIteration; iterationIndex++) {
        const translations = await Translation.aggregate([
          { $match: matchQuery },
          {
            $lookup: {
              from: 'transcribes',
              localField: '_id',
              foreignField: 'translation',
              as: 'transcribes'
            }
          },
          {
            $skip: iterationIndex * parseCount
          },
          {
            $limit: parseCount
          }
        ])
        for(let dataIndex in translations){
          const currentItem = translations[dataIndex]
          if (!allGroups.some((id) => id.equals(currentItem._id))) { 
            for (let languageIndex in languages) {
              jsonObject[languages[languageIndex].indexName] =
                jsonObject[languages[languageIndex].indexName] || {}
              jsonObject[languages[languageIndex].indexName][currentItem.interpret] =
                currentItem?.transcribes.find((item) => item.language.equals(languages[languageIndex]._id))?.describe ||
                currentItem.interpret
            }
          } else {
            const nestedObject = await getData({
              languages,
              groupId: currentItem._id,
              allGroups
            })
  
            for (let languageIndex in languages) {
              jsonObject[languages[languageIndex].indexName] =
                jsonObject[languages[languageIndex].indexName] || {}
              jsonObject[languages[languageIndex].indexName][currentItem.interpret] =
                nestedObject[languages[languageIndex].indexName]
            }
          }
        }
      }
    }
    console.log('TRANSLATION_WORKER_GETDATA_END')
    return jsonObject
  } catch (error) {
    throw error
  }
}

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connection Established');
  } catch (err) {
    console.error('Connection has some issue:', err);
    throw new Error('Connection has some issue.');
  }
};

const startWorker = async () => {
      try {
        await connectDb()
        console.log('TRANSLATION_WORKER_START')
        const buildJson = {}
        const languages = await Language.find({}).lean().exec()
        if (!languages) throw new Error('NEED_TO_ADD_LANGUAGE')

        const allGroups = await Translation.distinct('group', {
          group: { $ne: null },
          deletedAt: null
        })
          .lean()
          .exec()

        const mainGroupIds = await Translation.distinct('_id', {
          _id: { $in: allGroups },
          group: null,
          deletedAt: null
        }).exec()

        const mainGroups = await Translation.find({
          _id: { $in: mainGroupIds },
          group: null,
          deletedAt: null
        })
          .lean()
          .exec()
        for (const groupId of [null].concat(mainGroupIds)) {
          const currentItemIndex = mainGroups.findIndex((item) => item._id.equals(groupId))
          const currentItem = currentItemIndex != -1 ? mainGroups[currentItemIndex] : null
          console.log('PROCESSING_GROUP', groupId)
          const parseData = await getData({
            languages,
            groupId: groupId,
            allGroups
          })
          for (const language of languages) {
            buildJson[language.indexName] = buildJson[language.indexName] || {}
            if (currentItem) {
              buildJson[language.indexName][currentItem.interpret] = {
                ...buildJson[language.indexName][currentItem.interpret],
                ...parseData[language.indexName]
              }
            } else {
              buildJson[language.indexName] = {
                ...buildJson[language.indexName],
                ...parseData[language.indexName]
              }
            }
          }
        }

        // Write JSON File
        const path = './build/public/locale/'
        if (!existsSync(path)) throw new Error('DIRECTORY_NOT_EXITS')
        for (const language of languages) {
          await writeFileSync(
            path + language.indexName + '.json',
            JSON.stringify(buildJson[language.indexName] || {}, null, 2)
          )
        }
        mongoose.connection.close()
        return { message: 'FILE_GENERATED' }
      } catch (error) {
        mongoose.connection.close()
        throw error
      }
}

startWorker()
  .then((result) => {
    parentPort.postMessage(result)
  })
  .catch((error) => {
    console.error('TRANSLATION_WORKER_ERROR', error)
    parentPort.postMessage({ error: error.message })
  })
