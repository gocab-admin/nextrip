import CustomError from "./CustomError";

class UnAuthorizedError extends CustomError {
    public statusCode: number;
    constructor (message: string){
        super(message)
        this.statusCode = 401
    }
}

export default UnAuthorizedError