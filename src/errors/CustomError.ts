class CustomError extends Error {
    public statusCode : number

    constructor (message: string){
        super(message)
        this.name = this.constructor.name
        Error.captureStackTrace(this,CustomError)
    }
}

export default CustomError