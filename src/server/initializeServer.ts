import express, { Request, Response } from 'express';
import api from './routes';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '../../dist/')));
app.use(express.json());
app.use('/api', api);
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../dist/', 'index.html'));
});

export default app;
