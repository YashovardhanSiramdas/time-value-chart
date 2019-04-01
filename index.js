const express = require('express');
const cors = require('cors')
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');
const port = process.env.PORT || 8081;
app.use(bodyParser.json());
app.use(cors());
const mongoose = require("mongoose");
mongoose.connect("mongodb://yash:qwerty123@ds149365.mlab.com:49365/switchon_assignment");


const testSchema = new mongoose.Schema({
	timeStamp: Date,
	value: Number
});

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const newRecordModel = mongoose.model("newRecordModel", testSchema);
app.post('/insertData', (req, res) => {
	let {body} = req;
	let {timeStamp} = body;
	let {value} = body;

	const newRecord = new newRecordModel();
	newRecord.timeStamp = timeStamp;
	newRecord.value = value;

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
	    doc.sort((a, b) => {
	    	return new Date(a.timeStamp) - new Date(b.timeStamp);
	    })
	    return res.send(doc);
	})
})

app.listen(port, function() {
	console.log(`Server on ${port}`);
});