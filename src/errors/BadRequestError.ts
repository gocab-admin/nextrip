import CustomError from "./CustomError";

class BadRequestError extends CustomError {
    public statusCode: number;
    constructor (message: string){
        super(message)
        this.statusCode = 400
    }
}

export default BadRequestError