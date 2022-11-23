import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { registerValidation, loginValidation } from './validations.js';
import {handleValidationErrors, checkAuth} from './utils/index.js'
import * as UserController  from './controllers/UserController.js';


mongoose
  .connect(
   process.env.MONGODB_URI,
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());
app.use(cors());

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.patch('/block/:id', UserController.block);
app.patch('/unblock/:id', UserController.unblock);

app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/users', checkAuth, UserController.getAll);

app.delete('/users/:id', UserController.remove);


app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
