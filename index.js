var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db');
var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('goods101.txt');


var lineByLine = require('n-readlines');
var liner = new lineByLine('./goods101.txt');

db.serialize(function() {
	db.run("TRUNCATE TABLE ANALOG;"  
			+ "TRUNCATE TABLE ASPECT;" 
			+ "TRUNCATE TABLE BARCODE;" 
			+ "TRUNCATE TABLE IMAGES;" 
			+ "TRUNCATE TABLE IMPLEMENTSHEME;" 
			+ "TRUNCATE TABLE IntBarcs;" 
			+ "TRUNCATE TABLE REMAIN;" 
			+ "TRUNCATE TABLE SHEMA;" 
			+ "TRUNCATE TABLE SPRT;" 
			+ "TRUNCATE TABLE SPUTNIK;" 
			+ "TRUNCATE TABLE VALUESHEMA;");
// 	db.run("CREATE TABLE if not exists goods (art TEXT, code TEXT, name TEXT, price TEXT)");
// 	var stmt = db.prepare("INSERT INTO BARCODE (BARCODE) VALUES (?)");

// while (line = liner.next()) {
// 	line = line + "";
// 	var re = /^\d/i;
// 	if (!re.test(line)){continue}
// 	var re = /^([^\;]*)\;([^\;]*)\;([^\;]*)\;[^\;]*\;([^\;]*)\;/ig;
// 	var res = re.exec(line);
// 	// console.log(res);
// 	// res[1] - artikul
// 	// res[2] - code
// 	// res[3] - name
// 	// res[4] - price
// 	stmt.run(res[2]);
// 	// console.log(line);
// }

var stmt1 = db.prepare("INSERT INTO BARCODE (BARCODE) VALUES (?)");
var stmt2 = db.prepare("INSERT INTO SPRT (NAME, PRICE) VALUES (?, ?)");

while (line = liner.next()) {
	line = line + "";
	var re = /^\d/i;
	if (!re.test(line)){continue}
	var re = /^([^\;]*)\;([^\;]*)\;([^\;]*)\;[^\;]*\;([^\;]*)\;/ig;
	var res = re.exec(line);
	// console.log(res);
	// res[1] - artikul
	// res[2] - code
	// res[3] - name
	// res[4] - price
	stmt1.run(res[2]);
	stmt2.run(res[3],res[4]);

	// console.log(line);
}

	stmt1.finalize();
	stmt2.finalize();
});

db.close();







