var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
var check;
db.serialize(function() {

  db.run("CREATE TABLE if not exists goods (art TEXT, code TEXT, name TEXT, price TEXT)");
  var stmt = db.prepare("INSERT INTO goods VALUES (?, ?, ?, ?)");
  for (var i = 0; i < 10; i++) {
      stmt.run(i, i*2, i*3, i*4);
  }
  stmt.finalize();

  // db.each("SELECT rowid AS id, info FROM user_info", function(err, row) {
  //     console.log(row.id + ": " + row.info);
  // });
});

db.close();