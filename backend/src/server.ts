import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';

import './database/connection';
import path from 'path';
import cors from 'cors';
import routes from './routes';
import errorHandler from './errors/handler';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(errorHandler);

app.listen(3333);