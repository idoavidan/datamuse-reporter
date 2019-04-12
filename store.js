var db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);

//create db
db.transaction(function(tx) {
  tx.executeSql("CREATE TABLE IF NOT EXISTS AFFILIATE (word unique)");
  tx.executeSql("CREATE TABLE IF NOT EXISTS MARKETING (word unique)");
  tx.executeSql("CREATE TABLE IF NOT EXISTS INFLUENCER (word unique)");
});

//safe insert
function executeString(table) {
  switch (table) {
    case "affiliate":
      return "INSERT INTO AFFILIATE (word) VALUES (?)";
    case "marketing":
      return "INSERT INTO MARKETING (word) VALUES (?)";
    case "influencer":
      return "INSERT INTO INFLUENCER (word) VALUES (?)";
  }
}

//insert array of words to DB table
function insertWords(words, table) {
  db.transaction(function(tx) {
    words.forEach(word => {
      tx.executeSql(executeString(table), [word]);
    });
  });
}
