var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

fs.unlinkSync("database3.db");
var db = new sqlite3.Database('database3.db');
// var LineByLineReader = require('line-by-line');
// var lr = new LineByLineReader('goods101-2.txt');


var lineByLine = require('n-readlines');
var liner = new lineByLine('./goods104.txt');

db.serialize(function(){


	// 	db.run("CREATE TABLE if not exists goods (art TEXT, code TEXT, name TEXT, price TEXT)");
	db.run("CREATE TABLE [BARCODE] (" 
	  + "[ID] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
	  + "[WAREID] INTEGER NOT NULL CONSTRAINT [FK_BARCODE_SPRT] REFERENCES [SPRT]([ID]) ON DELETE CASCADE DEFAULT 0,"
	  + "[BARCODE] [VARCHAR(40)] NOT NULL DEFAULT 0,"
	  + "[SETSOFVALUESID] INTEGER CONSTRAINT [FK_BARCODE_VALUESHEMA] REFERENCES [VALUESHEMA]([ID]) ON DELETE CASCADE DEFAULT 0,"
	  + "[FACTOR] [FLOAT(15,6)] DEFAULT 0);");

	db.run("CREATE TABLE [ANALOG] ("
	  + "[ID] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
	  + "[WAREID] INTEGER CONSTRAINT [FK_ANALOG_WAREID_SPRT] REFERENCES [SPRT]([ID]) ON DELETE CASCADE DEFAULT 0,"
	  + "[ANALOGID] INTEGER CONSTRAINT [FK_ANALOG_SPRT] REFERENCES [SPRT]([ID]) ON DELETE CASCADE DEFAULT 0,"
	  + "[ANALOGCODE] VARCHAR(255));");

	db.run("CREATE TABLE [ASPECT] ("
	  + "[ID] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
	  + "[CODE] INTEGER,"
	  + "[SHEMAID] INTEGER CONSTRAINT [FK_ASPECT_SHEMA] REFERENCES [SHEMA]([ID]) ON DELETE CASCADE,"
	  + "[NAME] VARCHAR(30),"
	  + "[TEXT] VARCHAR(255));");

	db.run("CREATE TABLE [IMAGES] ("
	  + "[WAREID] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT CONSTRAINT [ware_id] REFERENCES [SPRT]([ID]) ON DELETE CASCADE ON UPDATE CASCADE,"
	  + "[NAME] VARCHAR(255),"
	  + "[ERROR] BOOL DEFAULT 0,"
	  + "[ADD] BOOL DEFAULT 0,"
	  + "[REMOVE] BOOL DEFAULT 0);");

	db.run("CREATE TABLE [IMPLEMENTSHEME] ("
	  + "[ID] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
	  + "[ASPECTID] INTEGER NOT NULL CONSTRAINT [FK_ASPECT_IMPLEMENTSHEMA] REFERENCES [ASPECT]([ID]) ON DELETE CASCADE,"
	  + "[VALUE] CHAR NOT NULL,"
	  + "[CODE] INTEGER,"
	  + "[BARCODEASPECT] CHAR,"
	  + "[NAME] CHAR);");

	db.run("CREATE TABLE [IntBarcs] ("
	  + "[ID] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
	  + "[NAME] VARCHAR(255),"
	  + "[PREFIXBEG] VARCHAR(255),"
	  + "[PREFIXEND] VARCHAR(255),"
	  + "[DATA] VARCHAR(255));");

	db.run("CREATE TABLE [REMAIN] ("
	  + "[ID] INTEGER NOT NULL PRIMARY KEY ON CONFLICT REPLACE AUTOINCREMENT,"
	  + "[WAREID] INTEGER NOT NULL ON CONFLICT REPLACE CONSTRAINT [FK_REMAIN_SPRT] REFERENCES [SPRT]([ID]) ON DELETE CASCADE DEFAULT 0,"
	  + "[SETSOFVALUESID] INTEGER CONSTRAINT [FK_REMAIN_VALUESHEMA] REFERENCES [VALUESHEMA]([ID]) ON DELETE CASCADE DEFAULT 0,"
	  + "[USEREMAIN] INTEGER NOT NULL DEFAULT 0,"
	  + "[REMAIN] [FLOAT(15,6)] DEFAULT 0,"
	  + "[SELL] [FLOAT(15,4)] DEFAULT 0,"
	  + "[PRICE] [FLOAT(15,4)] DEFAULT 0);");

	db.run("CREATE TABLE [SHEMA] ("
	  + "[ID] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
	  + "[NAME] VARCHAR(30) NOT NULL,"
	  + "[TEXT] VARCHAR(255));");

	db.run("CREATE TABLE [SPRT] ("
	  + "[ID] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
	  + "[CODE] VARCHAR(255) NOT NULL DEFAULT 0,"
	  + "[MARK] VARCHAR(20) DEFAULT NULL,"
	  + "[NAME] VARCHAR(100) DEFAULT NULL,"
	  + "[PRICE] INTEGER DEFAULT 0,"
	  + "[ISWARE] INTEGER DEFAULT 0,"
	  + "[ISWEIGHT] BOOL DEFAULT 1,"
	  + "[LIFE] DATETIME DEFAULT NULL,"
	  + "[REMAIN] FLOAT(7,4) DEFAULT NULL,"
	  + "[SERIES] VARCHAR(30) DEFAULT NULL,"
	  + "[CERTIFICAT] VARCHAR(30) DEFAULT NULL,"
	  + "[DESCRIPTION] VARCHAR(255) DEFAULT NULL,"
	  + "[PICTURE] VARCHAR(255),"
	  + "[FIRM] VARCHAR(255),"
	  + "[COUNTRY] VARCHAR(255),"
	  + "[SHEMA] INTEGER,"
	  + "[TEXT] VARCHAR(255),"
	  + "[ENTERPRISE] VARCHAR(255));");

	db.run("CREATE TABLE [SPUTNIK] ("
	  + "[ID] INTEGER PRIMARY KEY ON CONFLICT REPLACE AUTOINCREMENT,"
	  + "[WAREID] INTEGER CONSTRAINT [FK_SPUTNIK_WAREID_SPRT] REFERENCES [SPRT]([ID]) ON DELETE CASCADE DEFAULT 0,"
	  + "[SPUTNIKID] INTEGER CONSTRAINT [FK_SPUTNIK_SPRT] REFERENCES [SPRT]([ID]) ON DELETE CASCADE DEFAULT 0,"
	  + "[ACCOMPANYINGWARECODE] VARCHAR(255));");

	db.run("CREATE TABLE [VALUESHEMA] ("
	  + "[ID] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
	  + "[ASPECTVALUES1] INTEGER CONSTRAINT [ASPECTVALUES1] REFERENCES [IMPLEMENTSHEME]([ID]) ON DELETE CASCADE,"
	  + "[ASPECTVALUES2] INTEGER CONSTRAINT [ASPECTVALUES2] REFERENCES [IMPLEMENTSHEME]([ID]) ON DELETE CASCADE,"
	  + "[ASPECTVALUES3] INTEGER CONSTRAINT [ASPECTVALUES3] REFERENCES [IMPLEMENTSHEME]([ID]) ON DELETE CASCADE,"
	  + "[ASPECTVALUES4] INTEGER CONSTRAINT [ASPECTVALUES4] REFERENCES [IMPLEMENTSHEME]([ID]) ON DELETE CASCADE,"
	  + "[ASPECTVALUES5] INTEGER CONSTRAINT [ASPECTVALUES5] REFERENCES [IMPLEMENTSHEME]([ID]) ON DELETE CASCADE);");


	var stmt1 = db.prepare("INSERT INTO BARCODE (BARCODE) VALUES (?)");
	var stmt2 = db.prepare("INSERT INTO SPRT (CODE, NAME, PRICE) VALUES (?, ?, ?)");

	var i = 0;
	while (line = liner.next()) {
		line = line + "";
		var re = /^\d/i;
		if (!re.test(line)){continue}
		var re = /^([^\;]*)\;([^\;]*)\;([^\;]*)\;[^\;]*\;([^\;]*)\;/ig;
		var res = re.exec(line);
		i++; // id CODE for SPRT равен порядковому номеру записи
		// res[1] - artikul
		// res[2] - code
		// res[3] - name
		// res[4] - price
		
		stmt1.run(res[2]);
		stmt2.run(i, res[3], res[4]);
	}

	stmt1.finalize();
	stmt2.finalize();
});

db.close();






