import * as http from 'http';
import https from 'https';
import fs from 'fs';
import App from '@abserve/App';
import SocketServer from './Module/Chat/socketServer';
import { ChatController } from './Module/Chat/ChatController';

//let httpsoptions = {};
//if (process.env.NODE_ENV === 'production') {
  //httpsoptions = {
    //key: fs.readFileSync('/home/nodeabsera/servers/ssl/prrivate.key'),
    //cert: fs.readFileSync('/home/nodeabsera/servers/ssl/certificate.crt'),
    //ca: fs.readFileSync('/home/nodeabsera/servers/ssl/ca.crt'),
  //};
//}

class Server {

  private static serverInstance: Server;
  public Instance: any;
  private server: any;
  private readonly port!: number;

  public constructor() {
    this.Instance = new App();
    this.port = this.normalizePort(process.env.PORT || 3047);
    this.runServer();
  }

  public getServerInstance(): any {
    return this.server;
  }

  public static bootstrap(): Server {
    if (!this.serverInstance) {
      this.serverInstance = new Server();
      return this.serverInstance;
    } else {
      return this.serverInstance;
    }
  }

  private runServer(): void {
    this.Instance.Express.set('port', this.port);
    this.createServer();
  }

  private createServer() {

    if (process.env.NODE_ENV === 'production') {
      this.server = https.createServer(/*httpsoptions,*/ this.Instance.Express);
    } else {
      this.server = http.createServer(this.Instance.Express);
    }

    //Initialize the SocketServer
    const socketServer=new SocketServer(this.server);
    //pass the socket.io server instance
    new ChatController(socketServer.getIo());

    this.server.listen(this.port);

    this.server.on('listening', () => {
      let address = this.server.address();
      let bind = (typeof address === 'string') ? `pipe ${address}` : `port ${address.port}`;
      console.log(`Listening on ${bind}`);
    });

    this.server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') throw error;
      console.error(error);
      process.exit(1);
    });
  }

  private normalizePort(val: number | string): number {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    return port;
  }
}

export const server = Server.bootstrap();
