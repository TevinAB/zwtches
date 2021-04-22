import express from 'express';
import api from './routes';

const app = express();

app.use('/api', api);
app.use(express.json());

export default app;
