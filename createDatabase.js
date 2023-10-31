const sqlite = require('sqlite3')

db = new sqlite.Database('scores.db', (err) => {
  if (err) {
    console.log(err)
  }
  else {
    db.exec(`
      create table leaderboard (
        id int primary key not null,
        score int
      )
    `)
  }
})