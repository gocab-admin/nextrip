import { Request, Response } from 'express';
import * as path from 'path';

const notFound = (req: Request, res: Response): void => {
  const filePath = path.join(__dirname, '../public/AirstarNot-Found.html');
  res.status(404).sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  })
}

export default notFound