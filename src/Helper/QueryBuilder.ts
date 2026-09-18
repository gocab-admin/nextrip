import mongoose from "mongoose"

class QueryBuilder {
    static getSearchable(model:any, queryData:any) {
      return new Promise((resolve, reject) => {
        try {
          const queryObject = {}
          let searchAble = {}
          model.schema.eachPath((pathname:any, schematype:any) => {
            if (
              (schematype.options?.options?.isSearch ||
                (Array.isArray(schematype.options.type) &&
                  schematype.options.type[0].options?.isSearch)) &&
              queryData[pathname]
            ) {
              const addSearchAble = {}
              addSearchAble[pathname] = schematype.instance
  
              if (addSearchAble[pathname] === 'String') {
                queryObject[pathname] = { $regex: queryData[pathname], $options: 'i' }
              } else if (addSearchAble[pathname] === 'Number') {
                queryObject[pathname] = parseInt(queryData[pathname])
              } else if (addSearchAble[pathname] === 'ObjectId') {
                queryObject[pathname] = new mongoose.Types.ObjectId(queryData[pathname])
              } else if (addSearchAble[pathname] === 'Array') {
                const arrayIds = queryData[pathname].split(',')
                queryObject[pathname] = { $all: arrayIds }
              } else if (addSearchAble[pathname] === 'Boolean') {
                queryObject[pathname] = queryData[pathname]
              }
              searchAble = { ...searchAble, ...addSearchAble }
            }
            else if ((pathname == 'createdAt' || pathname == 'updatedAt' || pathname == 'scheduleOn') && queryData[pathname]){
              const setDate = new Date(queryData[pathname])
              if (setDate) {
                const addSearchAble = {}
                addSearchAble[pathname] = schematype.instance
                searchAble = { ...searchAble, ...addSearchAble }
                queryObject[pathname] = {
                  $gte: setDate.setHours(0, 0, 0, 0), // Start of day
                  $lt: setDate.setHours(23, 59, 59, 999) // End of day
                }
              }
            }
          })
          return resolve({ queryObject, searchAble })
        } catch (error) {
          console.log(error, 'error')
          reject(new Error(error))
        }
      })
    }
  }
  export { QueryBuilder }
  