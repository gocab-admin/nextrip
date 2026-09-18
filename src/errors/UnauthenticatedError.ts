import CustomError from "./CustomError";

class UnAuthenticatedError extends CustomError {
    public statusCode: number;
    constructor (message: string){
        super(message)
        this.statusCode = 401
    }
}

export default UnAuthenticatedError