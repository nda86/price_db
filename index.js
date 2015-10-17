var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('goods101.txt');


var lineByLine = require('n-readlines');
var liner = new lineByLine('./goods101.txt');

db.serialize(function() {
	db.run("CREATE TABLE if not exists goods (art TEXT, code TEXT, name TEXT, price TEXT)");
	var stmt = db.prepare("INSERT INTO goods VALUES (?, ?, ?, ?)");

while (line = liner.next()) {
	line = line + "";
	var re = /^\d/i;
	if (!re.test(line)){continue}
	var re = /^([^\;]*)\;([^\;]*)\;([^\;]*)\;[^\;]*\;([^\;]*)\;/ig;
	var res = re.exec(line);
	// console.log(res);
	stmt.run(res[1], res[2], res[3], res[4]);
	// console.log(line);
}
	stmt.finalize();
});

db.close();







