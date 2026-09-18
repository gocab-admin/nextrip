import { Request } from 'express';
import { Socket } from 'socket.io';
import { Readable } from "stream";

type Auth = {
    userId: string,
    email: string,
    name: string,
    role: string
}

type authData = {
    userId: string,
    email: string,
    name: string,
    role: string,
}

type File = {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: number,
    stream: Readable,
    buffer: Buffer
}

type Files = [File]

interface AuthenticateRequest extends Request {
    auth?: Auth,
}

interface CustomSocket extends Socket {
    authData?: authData,
}

interface SingleFileRequest extends Request {
    auth?: Auth,
    file?: File,
}

interface MultipleFileRequest extends Request {
    auth?: Auth,
    files?: Files,
}

interface FacebookProfile extends Request {
    auth?: Auth,
    id?: string,
    displayName?: string,
}
export { SingleFileRequest, MultipleFileRequest, AuthenticateRequest, FacebookProfile, CustomSocket }