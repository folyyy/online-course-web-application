// Constants
const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
const port = process.env.SERVERPORT
const urlencodedParser = bodyParser.urlencoded({extended: false})
const { Pool } = require('pg')
const pool = new Pool({
    database: 'online-course',
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    port: 5432,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 1000,
})
const multer  = require('multer')
const fs = require('fs')


// Dependencies
app.use(express.static('public'));
app.use(express.static('src'));
app.use(express.json({limit: '1mb'}));

var storage = multer.diskStorage({
  destination: './public/files',
    filename: function ( req, file, cb ) {
      cb( null, file.originalname);
    }
});

var upload = multer( { storage: storage } );

// Setting up nodemailer
const nodemailer = require('nodemailer');
var transport = {
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Nodemailer connected');
  }
});

// Server start
app.listen(port, () => console.log(`Server started on port ${port}.`));


// Queries
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

app.post('/api/registerUser', urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let user = {
        date: date,
        email: request.body.email || null,
        password: request.body.password || null,
        firstName: request.body.firstName || null,
        lastName: request.body.lastName || null,
        phoneNumber: request.body.phoneNumber || null,
        dateOfBirth: request.body.dateOfBirth || null,
        country: request.body.country || null,
        city: request.body.city || null
    }
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query(`INSERT INTO "Users"(email, password, firstname, lastname, country, city, date, role, phonenumber, dateofbirth) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [user.email, user.password, user.firstName, user.lastName, user.country, user.city, user.date, "user", user.phoneNumber, user.dateOfBirth], (err) => {
          done()
          if (err) {
            console.log(err.stack)
            response.sendStatus(500);
          } else response.sendStatus(200);
        })
      }) 
});

app.post('/api/loginUser', urlencodedParser, function (request, response) {
  if(!request.body) return response.sendStatus(400);
  let user = {
      email: request.body.email || null,
      password: request.body.password || null,
  }
  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(`SELECT "id", "email", "date" FROM "Users" WHERE "email" = $1 AND "password" = $2`,[user.email, user.password], (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          if (res.rows.length > 0) {
            res.rows[0].success = true;
            response.send(res.rows);
          }
          else {
            res.rows.push({id: 0, success: false});
            response.send(res.rows);
          }
        }
      })
    }) 
});

app.post('/api/getUser', function(request,response) {
  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(`SELECT email, firstname, lastname, phonenumber, dateofbirth, country, city, date, role, usergroup, image, uuid FROM "Users" WHERE id = $1 AND email = $2`
      , [request.body.id, request.body.email] , (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
          response.sendStatus(500);
        } else {
          if(res.rowCount === '0') {
          response.sendStatus(500)
          }
          else {
              response.send(res.rows);
          }
        }
      })
    }) 
});

app.post('/api/updateUserImage', function(request,response) {
  if(!request.body.id || !request.body.imageURL) return response.sendStatus(404);
  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(`UPDATE "Users" SET "image" = $1 WHERE id = $2`, [request.body.imageURL, request.body.id] , (err) => {
        done()
        if (err) {
          console.log(err.stack)
          response.sendStatus(404)
        } else {
          response.sendStatus(200)
          }
      })
    }) 
});

app.post('/api/deleteUserImage', function(request,response) {
  if(!request.body.id) return response.sendStatus(404);
  console.log(request.body)
  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(`UPDATE "Users" SET "image" = null WHERE id = $1`, [request.body.id] , (err) => {
        done()
        if (err) {
          console.log(err.stack)
          response.sendStatus(404)
        } else {
          response.sendStatus(200)
          }
      })
    }) 
});

app.post("/api/uploadScheduleFile", upload.single('filedata'), function (request, response, next) {
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(`SELECT id FROM "Schedule" WHERE usergroup = $1 AND filename = $2`, [request.body.userGroup, request.file.filename], (err, res) => {
      if (err) {
        console.log(err.stack)
        response.sendStatus(404)
      } else {
        if(res.rowCount === 0) {
            client.query(`INSERT INTO "Schedule"(usergroup, filename) VALUES($1,$2)`, [request.body.userGroup, request.file.filename], (err) => {
              done()
              if (err) {
                console.log(err.stack)
                response.sendStatus(404)
              } else response.sendStatus(200)
            })
        } else {
            client.query(`UPDATE "Schedule" SET filename = $1 WHERE id = $2`, [request.file.filename, res.rows[0].id], (err) => {
              done()
              if (err) {
                console.log(err.stack)
                response.sendStatus(404)
              } else response.sendStatus(200) 
            })
          }
      }
    })
  })
});

app.post('/api/deleteScheduleFile', urlencodedParser, function(request,response) {
  if(!request.body) return response.sendStatus(404)
  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(`DELETE FROM "Schedule" WHERE usergroup = $1 AND filename = $2`, [request.body.usergroup, request.body.filename] , (err, res) => {
        if (err) {
          console.log(err.stack)
          response.sendStatus(404)
        } else {
          if (res.rowCount === 0) {
            done()
            console.log("Файла " + request.body.filename + " (Группа " + request.body.usergroup + ") нет в базе данных")
            response.redirect("/course/schedule")
          } else {
              client.query(`SELECT id from "Schedule" WHERE filename = $1`, [request.body.filename] , (err, res) => {
                done()
                if (err) {
                  console.log(err.stack)
                  response.sendStatus(404)
                } else {
                  if (res.rowCount === 0) {
                    const path = `./public/files/${request.body.filename}`
                    fs.unlink(path, (err) => {
                      if (err) {
                        console.error(err)
                        response.sendStatus(404)
                      } else {
                        console.log("Файл " + request.body.filename + " (Группа " + request.body.usergroup + ") был удален из   ервера и базы данных")
                        response.redirect('/course/schedule')
                      }
                    })
                  } else {
                    console.log("Файл " + request.body.filename + " (Группа " + request.body.usergroup + ") был удален из базы данных")
                    response.redirect("/course/schedule")
                    }
                  }
              })
            }
          }
      })
    })
});

app.post('/api/getUserSchedule', function(request,response) {
  if(!request.body.userGroup) return response.sendStatus(404);
  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(`SELECT filename, usergroup FROM "Schedule" WHERE usergroup = $1 ORDER BY id`, [request.body.userGroup] , (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
          response.sendStatus(404);
        } else {
          if(res.rowCount === 0) {
          response.sendStatus(404)
          }
          else {
              response.send(res.rows);
          }
        }
      })
    }) 
});

app.get('/api/getSchedule', function(request,response) {
  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(`SELECT filename, usergroup FROM "Schedule" ORDER BY usergroup`, (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
          response.sendStatus(404);
        } else {
          if(res.rowCount === '0') {
          response.sendStatus(404)
          }
          else {
            response.send(res.rows);
          }
        }
      })
    }) 
});

app.post('/api/getLectures', function(request,response) {
  if(!request.body.userGroup) return response.sendStatus(404);
  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(`SELECT lectureurl, name, description, thumbnail FROM "Lectures" WHERE usergroup = $1 ORDER BY id`, [request.body.userGroup] , (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
          response.sendStatus(404);
        } else {
          if(res.rowCount === 0) {
          response.sendStatus(404)
          }
          else {
              response.send(res.rows);
          }
        }
      })
    }) 
});

app.post('/api/getTestsList', function(request,response) {
  if(!request.body.userGroup) return response.sendStatus(404);
  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(`SELECT DISTINCT topic FROM "Tests" WHERE usergroup = $1`, [request.body.userGroup] , (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
          response.sendStatus(404);
        } else {
          if(res.rowCount === 0) {
          response.sendStatus(404)
          }
          else {
              response.send(res.rows);
          }
        }
      })
    }) 
});

app.post('/api/getTest', function(request,response) {
  if(!request.body.topic) return response.sendStatus(404);
  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(`SELECT * FROM "Tests" WHERE topic = $1 ORDER BY id`, [request.body.topic] , (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
          response.sendStatus(404);
        } else {
          if(res.rowCount === 0) {
          response.sendStatus(404)
          }
          else {
              response.send(res.rows);
          }
        }
      })
    }) 
});

app.post('/api/getChatUsersList', function(request,response) {
  if(!request.body.uuid) return response.sendStatus(404);
  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(`SELECT * FROM "ChatUsers" WHERE user_uuid = $1`, [request.body.uuid] , (err, res) => {
        if (err) {
          done()
          console.log(err.stack)
          response.sendStatus(404);
        } else {
          if (res.rowCount === 0) {
            client.query(`SELECT * FROM "Users" WHERE uuid = $1`, [request.body.uuid] , (err, result) => {
              if (err) {
                done()
                console.log(err.stack)
                response.sendStatus(404);
              } else {
                var friend_firstname = result.rows[0].firstname
                var friend_lastname = result.rows[0].lastname
                var friend_avatar = result.rows[0].image
                client.query(`INSERT INTO "ChatUsers" VALUES($1,$2,$3,$4,$5,$6)`, [friend_firstname, friend_lastname, request.body.uuid, request.body.uuid, 
                  request.body.chatUuid, friend_avatar] , (err) => {
                  if (err) {
                    done()
                    console.log(err.stack)
                    response.sendStatus(404)
                  } else {
                    done()
                    response.send([{chat_uuid: 'nothing'}])
                  }
                })
              }
            })
          }
          else if (res.rows[0].friend_uuid === request.body.uuid && res.rowCount === 1 && res.rows[0].friend_uuid !== res.rows[0].user_uuid) {
            var friend_uuid = res.rows[0].user_uuid
            client.query(`SELECT * FROM "Users" WHERE uuid = $1`, [friend_uuid] , (err, result) => {
              if (err) {
                done()
                console.log(err.stack)
                response.sendStatus(404);
              } else {
                var friend_firstname = result.rows[0].firstname
                var friend_lastname = result.rows[0].lastname
                var friend_avatar = result.rows[0].image
                client.query(`INSERT INTO "ChatUsers" VALUES($1,$2,$3,$4,$5,$6)`, [friend_firstname, friend_lastname, friend_uuid, request.body.uuid, 
                  request.body.chatUuid, friend_avatar] , (err) => {
                  if (err) {
                    done()
                    console.log(err.stack)
                    response.sendStatus(404)
                  } else {
                    done()
                    response.redirect('/course/chat')
                  }
                })
              }
            })
          } else {
            done()
            response.send(res.rows)
          }
        }
      })
    }) 
});

app.post('/api/getChatMessagesList', function(request,response) {
  if(!request.body.friendUuid && !request.body.userUuid) return response.sendStatus(404);
  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(`SELECT * FROM "ChatMessages" WHERE sender_uuid = $1 AND friend_uuid = $2 UNION SELECT * FROM "ChatMessages" WHERE sender_uuid = $2 AND friend_uuid = $1 ORDER BY id`,
      [request.body.friendUuid, request.body.userUuid] , (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
          response.sendStatus(404);
        } else {
          if(res.rowCount === 0) {
            let rows = [{message_uuid: 'nothing'}]
            response.send(rows);
          }
          else {
              response.send(res.rows);
          }
        }
      })
    }) 
});

app.post('/api/sendMessage', function(request,response) {
  if(!request.body.userUuid) return response.sendStatus(404);
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(`SELECT friend_uuid, user_uuid, chat_uuid FROM "ChatUsers" WHERE user_uuid = $1 AND friend_uuid = $2`, [request.body.friendUuid, request.body.userUuid] , (err, res) => {
      if (err) {
        done()
        console.log(err.stack)
        response.sendStatus(404);
      } if (res.rowCount === 0) {
        client.query(`SELECT * FROM "Users" WHERE uuid = $1`, [request.body.userUuid] , (err, res) => {
          if (err) {
            done()
            console.log(err.stack)
            response.sendStatus(404)
          } else {
            let firstname = res.rows[0].firstname
            let lastname = res.rows[0].lastname
            let avatar = res.rows[0].image
            client.query(`INSERT INTO "ChatUsers" VALUES($1,$2,$3,$4,$5,$6)`, [firstname, lastname, request.body.userUuid, request.body.friendUuid, 
              request.body.chatUuid, avatar] , (err) => {
              if (err) {
                done()
                console.log(err.stack)
                response.sendStatus(404)
              } else {
                var today = new Date();
                client.query(`INSERT INTO "ChatMessages"(content, sender_uuid, friend_uuid, message_uuid, timelapse) VALUES($1,$2,$3,$4,$5)`,
                [request.body.content, request.body.userUuid, request.body.friendUuid, request.body.messageUuid, today] , (err) => {
                  done()
                  if (err) {
                    console.log(err.stack)
                    response.sendStatus(404);
                  } else response.sendStatus(200);
                })
              }
            })
          }
        })
      } else {
        var today = new Date();
          client.query(`INSERT INTO "ChatMessages"(content, sender_uuid, friend_uuid, message_uuid, timelapse) VALUES($1,$2,$3,$4,$5)`,
          [request.body.content, request.body.userUuid, request.body.friendUuid, request.body.messageUuid, today] , (err) => {
            done()
            if (err) {
              console.log(err.stack)
              response.sendStatus(404);
            } else response.sendStatus(200);
          })
      }
    })
  })
});

app.post('/api/addFriend', function(request,response) {
  if(!request.body.userUuid) return response.sendStatus(404);
  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(`SELECT * FROM "Users" WHERE id = $1`, [request.body.friendId] , (err, res) => {
        if (err) {
          done()
          console.log(err.stack)
          response.sendStatus(404)
        } else if (res.rowCount !== 0) {
          var friend_firstname = res.rows[0].firstname
          var friend_lastname = res.rows[0].lastname
          var friend_uuid = res.rows[0].uuid
          var friend_avatar = res.rows[0].image
          client.query(`SELECT friend_uuid, user_uuid FROM "ChatUsers" WHERE friend_uuid = $1 AND user_uuid = $2`, [friend_uuid, request.body.userUuid] , (err, res) => {
            if (err) {
              done()
              console.log(err.stack)
              response.sendStatus(404);
            } else if (res.rowCount === 0) {
              client.query(`INSERT INTO "ChatUsers" VALUES($1,$2,$3,$4,$5,$6)`, [friend_firstname, friend_lastname, friend_uuid, request.body.userUuid, 
                request.body.chatUuid, friend_avatar] , (err) => {
                if (err) {
                  done()
                  console.log(err.stack)
                  response.sendStatus(404)
                } else {
                  done()
                  response.sendStatus(200)
                }
              })
            } else response.sendStatus(404)
          })
        } else response.sendStatus(404)
      })
    }) 
})

app.post('/api/sendSupportTicket', urlencodedParser, function(request,response) {
  const email = request.body.email
  var message = request.body.message

  var mail = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,  
    subject: `Support ticket from ${email}`,
    html: message
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      response.sendStatus(404)
    } else {
      response.sendStatus(200)
    }
  })
});