const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRouter = require('./src/Routes/user.js');
const productRouter = require('./src/Routes/product');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const app = express();
app.listen(process.env.PORT);
app.use(express.json());
app.use(cors());
app.use(cookieParser('helloworld'));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 60000 * 60,
		},
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/user', userRouter);
app.use('/products', productRouter);

mongoose.connect(`${process.env.DB_HOST}`);

//? Callback functions for the database connection events.
mongoose.connection.on('connected', () => {
	console.log('Database Connected');
});

mongoose.connection.on('error', (e) => {
	console.log('Unable to connect to the Database ' + e.message);
});

app.get('/', (req, res) => {
	res.cookie('isSession', 'true', { maxAge: 60000 * 60, signed: true });
	res.send('Hello from home');
});

run();
async function run() {}
