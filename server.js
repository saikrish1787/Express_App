const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRouter = require('./src/Routes/user');
const productRouter = require('./src/Routes/product');

const app = express();
app.listen(process.env.PORT);
app.use(express.json());
app.use('/user', userRouter);
app.use('/products', productRouter);

mongoose.connect(
	`${process.env.DB_HOST}`,
	() => {
		console.log('Database Connected');
	},
	(e) => {
		console.log('Unable to connect to the Database ' + e.message);
	}
);

app.get('/', (req, res) => {
	res.send('Hello from home');
});

run();
async function run() {}
