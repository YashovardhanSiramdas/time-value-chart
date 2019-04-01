const express = require('express');
var cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
const moment = require('moment');
const port = process.env.PORT || 8081;
app.use(bodyParser.json());
app.use(cors());
const mongoose = require("mongoose");
mongoose.connect("mongodb://yash:qwerty123@ds149365.mlab.com:49365/switchon_assignment");


const testSchema = new mongoose.Schema({
	timeStamp: Date,
	price: Number
});

const newRecordModel = mongoose.model("newRecordModel", testSchema);
app.post('/testApi', (req, res) => {
	let {body} = req;
	let {timeStamp} = body;
	let {price} = body;

	const newRecord = new newRecordModel();
	newRecord.timeStamp = timeStamp;
	newRecord.price = price;

	  newRecord.save((err, doc) => {
	    if (err) {
	      return res.send("Error: Server error");
	    }
	    return res.send(doc);

	});
})

app.get('/getData', (req, res) => {
	newRecordModel.find({}, (err, doc) => {
		if (err) {
	      return res.send("Error: Server error");
	    }
	    return res.send(doc);
	})
})

app.listen(port, function() {
	console.log(`Server on ${port}`);
});