import CustomError from "./CustomError";

class UnAvailableError extends CustomError {
    public statusCode: number;
    constructor (message: string){
        super(message)
        this.statusCode = 503
    }
}

export default UnAvailableError