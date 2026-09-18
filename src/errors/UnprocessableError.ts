import CustomError from "./CustomError";

class UnprocessableError extends CustomError {
    public statusCode: number;
    public validationArr : any[]
    constructor (message: string, data:any[]){
        super(message)
        this.statusCode = 422
        this.validationArr = data
    }
}

export default UnprocessableError