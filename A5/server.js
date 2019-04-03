// Devano Brown 
// A00408193
// This Javascript Adds Server Funcitonality 
//Set Up A Mysql Table , Allow Post Data Of Json to insert Text To A Mysql SMU Database 
//Also Allow Retrievable Of Data

//loads mysql module 
var mysql = require('mysql');
//load cors module for cross origin request 
const cors = require('cors');
//express webserver module 
var express = require('express');
//loads body-parser module for parsing json post data 
var bodyParser = require('body-parser');
//load exrpress from app 
var app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

//sets up a table to store the text datat if it doesnt exist 
let intialMysql = (mysqlConection)=>{
	let createTable ="CREATE TABLE IF NOT EXISTS textSaver \
(`id` INT NOT NULL AUTO_INCREMENT, \
`savedText` LONGTEXT CHARACTER SET ascii COLLATE ascii_bin NOT NULL,PRIMARY KEY (`id`))";
		mysqlConection.query(createTable,(error, result)=>{
			if (error) {
				console.log(error);
			}
			else {
				console.log("Table Good");
			}

		});
}
//adds formatting to string extends needed easier parsing 
String.prototype.format = function () {
	var args = [].slice.call(arguments);
	return this.replace(/(\{\d+\})/g, function (a){
		return args[+(a.substr(1,a.length-2))||0];
	});
};
//generic insert mysql command to insert data into the table
let newQuickText = "INSERT INTO textSaver (savedText) VALUES (?) "
app.post('/saveText', (req, res)=> {
	let writerText = req.body.text;
	console.log("Request To Save To MYSQL");
	con.query(newQuickText,writerText,(error, result)=>{
		if (error){
			console.log(error)
			
			return res.status(404).send({response:"Could Not Save Writting"});
		}
		else{
			console.log("Request To Save To MYSQL: Success");
			return res.status(200).send({response:"Writting Saved Succesfully"});
		}
	})
});
//SQL COMMAND GET LAST ENTRY
let getLastSaved = "SELECT savedText FROM textSaver ORDER BY id DESC LIMIT 1"
app.post('/retrieveText', (req, res)=> {
	console.log("Request To Read To MYSQL");
	con.query(getLastSaved,(error, result)=>{
		if (error){
			console.log(error)
			return res.status(404).send({response:"Could Not Load Writting"});
		}
		else{
			console.log("Request To Save To MYSQL: Success");
			let textData = result[0].savedText;
			console.log(textData);
			return res.status(200).send({response: textData});
		}
	})
});
//loads express on port 8189

let port = 8189
var con = mysql.createConnection({
	host: "localhost",
	user: "dr_brown",
	password: "A00408193",
	database: "dr_brown"
});
//connect to the mysql database 
con.connect((err) => {
	if (err)
		//if error throw 
		throw err;
	else {
		app.listen(port, (error)=> {
			//listens on aboce port 
			if (error){
				console.log(error)
			}
			else {
				//if sucess tell user which port
				let success = "Express Running On Port {0}";
				//aler user on port success 
				console.log(success.format(port));
				//call to set up mysql for table 
				intialMysql(con);
			}
		});
	}
})
