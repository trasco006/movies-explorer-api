const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const userRoutes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/Logger');
const { login, createUser } = require('./controllers/users');
const registerValidation = require('./middlewares/validators/registration');
const loginValidation = require('./middlewares/validators/login');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.connection.on('open', () => {
});
mongoose.connection.on('error', () => {
});


app.use(helmet());
app.use(bodyParser.json());
app.use(requestLogger);
app.use(cors());
app.post('/signin', loginValidation, login);
app.post('/signup', registerValidation, createUser);
app.use('/', auth, userRoutes);
app.use(errors());
app.use(errorLogger);
app.use(errorHandler);
app.listen(PORT);
