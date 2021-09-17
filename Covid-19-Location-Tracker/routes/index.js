var express = require('express');
var router = express.Router();
const CLIENT_ID = "634822058489-au87q3693f7olnpnmetj80khjtqkovn4.apps.googleusercontent.com";
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
const haversine = require('haversine')
const bcrypt = require('bcrypt');
const saltRounds = 10;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/testEncryption', function(req, res, next){
  // var password = 'qwer';
  // bcrypt.genSalt(saltRounds, function(err, salt){
  //   bcrypt.hash(password, salt, function(err, hash){
  //     res.send(hash);
  //     // bcrypt.compare('qwer' ,hash, function(err, result){
  //     //   if(result){
  //     //     res.send("okela");
  //     //   }
  //     // });
  //   });
  // });
  bcrypt.compare('qwer', '$2b$10$i3OLDrgc23NckrPSOSH6O.ol43nhfcXR6NhTF2THAAn7ZpnxUbl3C', function(err, result){
    if(result){
      res.send("hahahah");
    }
    //$2b$10$i3OLDrgc23NckrPSOSH6O.ol43nhfcXR6NhTF2THAAn7ZpnxUbl3C
  });
});


const sql = require('mssql/msnodesqlv8');
const { VarChar } = require('mssql/msnodesqlv8');
const pool = new sql.ConnectionPool({
    database: 'Covid_19_Tracker_Project',
    server: 'LAPTOP-O70TM76D',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
    }
});


//basic login function, check userID and password with those in our database
router.post("/login", function(req, res, next){
  pool.connect().then(() => {
    var checkUserID = new sql.PreparedStatement(pool);
    checkUserID.input('userID', sql.VarChar(50));
    checkUserID.prepare(`select userID from Accounts where userID = @userID`, err => {
      if(err){
        res.sendStatus(500);
        return;
      }
      checkUserID.execute({userID: req.body.userID}, (err, result) => {
        if(err){
          res.sendStatus(500);
          return;
        }
        else if(result.recordset.length == 0){
          res.sendStatus(401);
        }
        var query = new sql.PreparedStatement(pool);
        query.input('userID', sql.VarChar(50));
        query.prepare(`select passwordHash, accountType from Accounts where userID = @userID`,err =>{
          if(err){
            res.sendStatus(500);
            return;
          }
          query.execute({userID: req.body.userID}, (err, result) => {
            if(err){
              res.sendStatus(500);
              return;
            }
            var input = req.body.password;
            var correctPassword = result.recordset[0].passwordHash;
            var accountType = result.recordset[0].accountType;
            bcrypt.compare(input , correctPassword, function(err, result){
              if(result){
                req.session.userID = req.body.userID;
                if(accountType == 0){
                  res.redirect('/user-home-page.html');
                }
                else if(accountType == 1){
                  res.redirect('/venue-home-page.html');
                }
                else if(accountType == 2){
                  res.redirect('/admin-home-page.html');
                }
              }
              else {
                res.sendStatus(401);
                return;
              }
            });
            query.unprepare(err => {
              if(err){
                res.sendStatus(500);
                return;
              }
            });
          });
          
        });
        checkUserID.unprepare(err => {
          if(err){
            res.sendStatus(500);
            return;
          }
        });
      });
    });
  });


  // req.pool.getConnection(function(err, connection){
  //   if(err){
  //     res.sendStatus(500);
  //     return;
  //   }
  //   var checkUserID = "select userID from Accounts where userID = ?";
  //   connection.query(checkUserID, [req.body.userID], function(err, rows, fields){
  //     connection.release();
  //     if(err){
  //       res.sendStatus(500);
  //       return;
  //     }
  //     else if(rows.length ==0){
  //       res.sendStatus(401);
  //     }
  //   var query = "select passwordHash, accountType from Accounts where userID = ?";
  //   connection.query(query, [req.body.userID], function(err, rows, fields){
  //     if(err) {
  //       res.sendStatus(500);
  //       return;
  //     }
  //     var input = req.body.password;
  //     var correctPassword = rows[0].passwordHash;
  //     var accountType = rows[0].accountType;
  //     bcrypt.compare(input, correctPassword, function(err, result){
  //       if(result){
  //         req.session.userID = req.body.userID;
  //         if(accountType == 0){
  //           res.redirect('/user-home-page.html');
  //         }
  //         else if(accountType ==1 ){
  //           res.redirect("/venue-home-page.html")
  //         }
  //         else if(accountType ==2){
  //           res.redirect("/admin-home-page.html");
  //         }
  //       }
  //       else{
  //         res.sendStatus(401);
  //         return;
  //       }
  //     })
  //   })



      // if(accountIndex === -1){
      //   res.sendStatus(500);
      // }
      // else{
      //   // res.json(rows[accountIndex]);
      //   req.session.userID = req.body.userID;
      //   if(rows[accountIndex].accountType === 0){
      //     res.redirect('/user-home-page.html');
      //   }
      //   else if(rows[accountIndex].accountType === 1){
      //     res.redirect('/venue-home-page.html');
      //   }
      //   else if(rows[accountIndex].accountType === 2){
      //     res.redirect('/admin-home-page.html');
      //   }
      // }
  //   });
  // });
});
// basic log in with google, check their email in our database
router.post("/loginGoogle", function(req, res, next){
  pool.connect().then(() => {
    pool.request().query(`select emailAddress, userID, accountType from Accounts`, (err, result) => {
      if(err){
        res.sendStatus(500);
        return;
      }
      let index;
      async function verify(){
        const ticket = await client.verifyIdToken({
          idToken: req.body.token,
          audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        var email = payload['email'];
        let accountIndex = -1;
        for(index = 0; index < result.recordset.length; index++){
          if(email === result.recordset[index].emailAddress){
            accountIndex = index;
          }
        }
        if (accountIndex === -1){
          res.sendStatus(401);
          return;
        }
        else{
          req.session.userID = result.recordset[accountIndex].userID;
          let type = {accountType: result.recordset[accountIndex].accountType};
          res.send(JSON.stringify(type));
        }
      }
      verify().catch(console.error);
  
    });
  });

    // req.pool.getConnection(function(err, connection){
    //   if(err){
    //     res.sendStatus(500);
    //     return;
    //   }
    //   var query = "select emailAddress, userID, accountType from Accounts";
    //   connection.query(query, function(err, rows, fields){
    //     connection.release();
    //     if(err){
    //       res.sendStatus(500);
    //       return;
    //     }
    //     let index;
    //     async function verify() {
    //       const ticket = await client.verifyIdToken({
    //           idToken: req.body.token,
    //           audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    //           // Or, if multiple clients access the backend:
    //           //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    //       });
    //       const payload = ticket.getPayload();
    //       var email = payload['email'];
    //       // If request specified a G Suite domain:
    //       // const domain = payload['hd'];
    //       let accountIndex = -1;
    //       for(index = 0; index<rows.length; index++){
    //         if(email === rows[index].emailAddress){
    //           accountIndex = index;
    //         }
    //       }
    //       if(accountIndex === -1){
    //         res.send(500);
    //       }
    //       else{
    //         // res.json(rows[accountIndex]);
    //         req.session.userID = rows[accountIndex].userID;
    //         let type = {accountType: rows[accountIndex].accountType};
    //         res.send(JSON.stringify(type));
    //       }
    //     }
    //     verify().catch(console.error);
    //   });
    // });
});

router.post("/logout", function(req, res, next){
  delete req.session.userID;
  res.send();
});


router.post("/deleteHotspot", function(req, res, next){

  pool.connect().then(() => {
    var deleteHotspot  = new sql.PreparedStatement(pool);
    deleteHotspot.input('latitude', sql.Decimal(10, 7));
    deleteHotspot.input('longitude', sql.Decimal(10,7));
    deleteHotspot.prepare(`delete from Hotspots where latitude = @latitude and longitude = @longitude;`, err => {
      if(err) {
        return res.sendStatus(500);
      }
      deleteHotspot.execute({
        latitude: req.body.latitude,
        longitude: req.body.longitude
      }, (err, result) => {
        if(err) {
          return res.sendStatus(500);
        }
        res.sendStatus(500);
        deleteHotspot.unprepare( err => {
          if(err) {
            return res.sendStatus(500);
          }
        })
      });
    });
  });
  // req.pool.getConnection(function(err, connection){
  //   if(err){
  //     res.sendStatus(500);
  //     return;
  //   }
  //   var query = "DELETE FROM Hotspots where latitude = ? and longitude = ?";
  //   connection.query(query, [req.body.latitude.toString(), req.body.longitude.toString()], function(err, rows, fields){
  //     connection.release();
  //     if(err){
  //       res.sendStatus(500);
  //       return;
  //     }
  //     else{
  //       res.sendStatus(200);
  //     }
  //   });
  // });
});
router.get("/hotspots_info", function(req, res, next){
  pool.connect().then(() => {
    pool.request().query(`select latitude, longitude, confirmedCases, deaths, recoveredCases, activeCases, dateAdded from Hotspots;`, (err, result) => {
      if(err){
        res.sendStatus(500);
        return;
      }
      let index;
      let hotspots = [];
      for(index = 0; index < result.recordset.length; index++){
        let latitude = result.recordset[index].latitude;
        let longitude = result.recordset[index].longitude;
        let confirmedCases = result.recordset[index].confirmedCases;
        let deaths = result.recordset[index].deaths;
        let dateAdded = result.recordset[index].dateAdded;
        let recoveredCases = result.recordset[index].recoveredCases;
        let activeCases = result.recordset[index].activeCases;
        let hotspot = {latitude: latitude, longitude: longitude, confirmedCases: confirmedCases, deaths: deaths, dateAdded: dateAdded, recoveredCases: recoveredCases, activeCases: activeCases};
        hotspots.push(hotspot);
      }
      res.send(JSON.stringify(hotspots));
    });
  });


  // req.pool.getConnection(function(err, connection){
  //   if(err){
  //     res.sendStatus(500);
  //     return;
  //   }
  //   var query = "SELECT latitude, longitude, confirmedCases, deaths, recoveredCases, activeCases, dateAdded FROM Hotspots ";
  //   connection.query(query, function(err, rows, fields){
  //     connection.release();
  //     if(err){
  //       res.sendStatus(500);
  //       return;
  //     }
  //     let index;
  //     let hotspots = [];
  //     for(index = 0; index<rows.length; index++){
  //       let latitude = rows[index].latitude;
  //       let longitude = rows[index].longitude;
  //       let confirmedCases = rows[index].confirmedCases;
  //       let deaths = rows[index].deaths;
  //       let dateAdded = rows[index].dateAdded;
  //       let recoveredCases = rows[index].recoveredCases;
  //       let activeCases = rows[index].activeCases;
  //       let hotspot = {dateAdded: dateAdded, latitude: latitude, longitude: longitude, confirmedCases: confirmedCases, deaths: deaths, recoveredCases: recoveredCases, activeCases: activeCases};
  //       hotspots.push(hotspot);
  //     }
  //     res.send(JSON.stringify(hotspots));
  //   })
  // });
});

router.post("/checkInByGPS", function(req, res, next){
  pool.connect().then(() => {
    let query = new sql.PreparedStatement(pool);
    query.input('userID', sql.VarChar(50));
    query.input('latitude', sql.Decimal(10,7));
    query.input('longitude', sql.Decimal(10, 7));
    query.prepare(`INSERT INTO CheckInRecords(userID, latitude, longitude, dateAdded) 
    VALUES (@userID, @latitude, @longitude, current_timestamp);`, err => {
      if(err){
        res.sendStatus(500);
        return;
      } 
      query.execute({userID: req.session.userID, latitude: req.body.latitude,
                      longitude: req.body.longitude}, (err, result) => {
                        if(err){
                          res.sendStatus(500);
                          return;
                        }
                        res.send();
                        query.unprepare(err => {
                          if(err){
                            res.sendStatus(500);
                            return;
                          }
                        });
                      });
    });
  });

  // req.pool.getConnection(function(err, connection){
  //   if(err){
  //     res.sendStatus(500);
  //     return;
  //   }
  //   var latitude = req.body.latitude;
  //   var longitude = req.body.longitude;
  //   var query = "insert into CheckInRecords(userID, latitude, longitude, dateAdded) values (?, ?, ?, current_timestamp())";
  //   connection.query(query, [req.session.userID, latitude, longitude], function(err, rows, fields){
  //     connection.release();
  //     if(err){
  //       res.sendStatus(500);
  //       return;
  //     }
  //     else{
  //       res.send();
  //     }
  //   });
  // })
});

router.get("/getDistance", function(req, res, next){
  const start = {
  latitude: 30.849635,
  longitude: -83.24559
  }

const end = {
  latitude: 27.950575,
  longitude: -82.457178
  }

res.send(haversine(start, end).toString());
});

router.get("/getDangerous", function(req, res, next){
  pool.connect().then(() => {
    
    pool.request().query(`select latitude, longitude, dateAdded, 
    confirmedCases, deaths, recoveredCases, activeCases from Hotspots`, (err, result) => {
      if(err){
        res.sendStatus(500);
        return;
      }
      var hotspots = [];
      hotspots = result.recordset;

      let getCheckInRecords = new sql.PreparedStatement(pool);
      getCheckInRecords.input('userID', sql.VarChar(50));
      getCheckInRecords.prepare(`select CheckInRecords.userID as userID,
       CheckInRecords.latitude as latitude, 
       CheckInRecords.longitude as longitude, 
       CheckInRecords.dateAdded as dateAdded,
       CheckInRecords.checkInCode as checkInCode,
       VenueInfo.venueName as venue 
       from CheckInRecords LEFT OUTER JOIN VenueInfo 
       ON CheckInRecords.checkInCode = VenueInfo.checkInCode where CheckInRecords.userID = @userID 
       ORDER BY CheckInRecords.dateAdded desc;`, err => {
         if(err){
           res.sendStatus(500);
           return;
         }
         getCheckInRecords.execute({userID: req.session.userID}, (err, result) => {
          var checkInRecords = [];
          checkInRecords = result.recordset;
          let checkInRecordsIndex;
          let hotspotsIndex;
          let dangerousRecords = [];
          for(checkInRecordsIndex = 0; checkInRecordsIndex < checkInRecords.length; checkInRecordsIndex++){
            let nearHotspots = [];
            for(hotspotsIndex = 0; hotspotsIndex < hotspots.length; hotspotsIndex++){
              let start = {latitude: checkInRecords[checkInRecordsIndex].latitude,
                           longitude: checkInRecords[checkInRecordsIndex].longitude};
              let end = {latitude: hotspots[hotspotsIndex].latitude,
                          longitude: hotspots[hotspotsIndex].longitude};
              let distance = haversine(start, end, {unit: 'meter'});
              if(distance <= 10000){
                let temp = hotspots[hotspotsIndex];
                temp.distance = distance;
                nearHotspots.push(temp);
              }
              if(nearHotspots.length !== 0 && hotspotsIndex == hotspots.length-1){
                let latitude = checkInRecords[checkInRecordsIndex].latitude;
                let longitude = checkInRecords[checkInRecordsIndex].longitude;
                let dateAdded = checkInRecords[checkInRecordsIndex].dateAdded;
                let venue = checkInRecords[checkInRecordsIndex].venue;
                let checkInCode = checkInRecords[checkInRecordsIndex].checkInCode;
                let dangerous = {
                  latitude: latitude,
                  longitude: longitude,
                  dateAdded: dateAdded,
                  venue: venue,
                  checkInCode: checkInCode,
                  nearHotspots: nearHotspots,
                }
                dangerousRecords.push(dangerous);
              }
            }
          }
          res.json(dangerousRecords);
          getCheckInRecords.unprepare(err => {
            if(err){
              res.sendStatus(500);
              return;
            }
          });
         });
       });
       

    }); 
  });

  // req.pool.getConnection(function(err, connection){
  //   if(err){
  //     res.sendStatus(500);
  //     return;
  //   }
  //   var hotspots = [];
  //   var checkInRecords = [];
  //   var getHotspots = "select latitude, longitude, dateAdded, confirmedCases, deaths, recoveredCases, activeCases from Hotspots";
  //   connection.query(getHotspots, function(err, rows, fields){
  //     connection.release();
  //     if(err){
  //       res.sendStatus(500);
  //       return;
  //     }
  //     hotspots = rows;
  //   })
  //   var getCheckInRecords = "select CheckInRecords.userID as userID, CheckInRecords.latitude as latitude, CheckInRecords.longitude as longitude, CheckInRecords.dateAdded as dateAdded, CheckInRecords.checkInCode as checkInCode, VenueInfo.venueName as venue from CheckInRecords LEFT OUTER JOIN VenueInfo ON CheckInRecords.checkInCode = VenueInfo.checkInCode where CheckInRecords.userID = ? ORDER BY CheckInRecords.dateAdded desc";
  //   connection.query(getCheckInRecords, [req.session.userID], function(err, rows, fields){
  //     if(err){
  //       res.sendStatus(500);
  //       return;
  //     }
  //     checkInRecords = rows;
  //     var dangerousRecords = [];
  //     let checkInRecordsIndex;
  //     let hotspotsIndex;
  //     for(checkInRecordsIndex = 0; checkInRecordsIndex < checkInRecords.length; checkInRecordsIndex++){
  //       let nearHotspots = [];
  //       for(hotspotsIndex = 0; hotspotsIndex < hotspots.length; hotspotsIndex++){
  //         let start = {latitude: checkInRecords[checkInRecordsIndex].latitude, longitude: checkInRecords[checkInRecordsIndex].longitude};
  //         let end = {latitude: hotspots[hotspotsIndex].latitude, longitude: hotspots[hotspotsIndex].longitude};
  //         let distance = haversine(start, end, {unit: 'meter'});
  //         if(distance <= 10000){
  //           let temp = hotspots[hotspotsIndex];
  //           temp.distance = distance;
  //           // nearHotspots.push(hotspots[hotspotsIndex]);
  //           nearHotspots.push(temp);
  //         }
  //         if(nearHotspots.length !== 0 && hotspotsIndex === hotspots.length-1){
  //           let latitude = checkInRecords[checkInRecordsIndex].latitude;
  //           let longitude = checkInRecords[checkInRecordsIndex].longitude;
  //           let dateAdded = checkInRecords[checkInRecordsIndex].dateAdded;
  //           let venue = checkInRecords[checkInRecordsIndex].venue;
  //           let checkInCode = checkInRecords[checkInRecordsIndex].checkInCode;
  //           let dangerous = {latitude: latitude, longitude: longitude, dateAdded: dateAdded, venue: venue, checkInCode: checkInCode, nearHotspots: nearHotspots};
  //           dangerousRecords.push(dangerous);
  //         }
  //       }
  //     }
  //     res.json(dangerousRecords);
  //   });
  // });
});

router.get("/venue_info", function(req, res, next){
  pool.connect().then(() => {
    let query = new sql.PreparedStatement(pool);
    query.input('userID', sql.VarChar(50));
    query.prepare(`SELECT CheckInRecords.dateAdded as time, 
    CheckInRecords.userID as userID, 
    concat(UserInfo.firstName, ' ' , UserInfo.lastName) as userName, 
    concat(Addresses.number , ', ' , Addresses.streetName, ', ' , Addresses.city ,', ' , Addresses.stateName , ', ' , Addresses.country) as userAddress, 
    Accounts.emailAddress as userEmail, Accounts.contact as userContact 
    FROM CheckInRecords JOIN Accounts 
    ON CheckInRecords.userID = Accounts.userID 
    JOIN UserInfo ON  CheckInRecords.userID = UserInfo.userID 
    JOIN Addresses ON Accounts.addressID = Addresses.addressID 
    WHERE CheckInRecords.checkInCode = (SELECT checkInCode FROM VenueInfo WHERE userID = @userID) 
    ORDER BY CheckInRecords.dateAdded DESC;`, err => {
      if(err){
        res.sendStatus(500);
        return;
      }
      query.execute({userID: req.session.userID}, (err, result) => {
        if(err){
          res.sendStatus(500);
          return;
        }
        res.json(result.recordset);
        query.unprepare(err => {
          if(err){
            res.sendStatus(500);
            return;
          }
        });
      });
    });
    
  });

  // req.pool.getConnection(function(err, connection){
  //   if(err){
  //     res.sendStatus(500);
  //     return;
  //   }
  //   var query = "SELECT CheckInRecords.dateAdded as time, CheckInRecords.userID as userID, concat(UserInfo.firstName, ' ' , UserInfo.lastName) as userName, concat(Addresses.number , ', ' , Addresses.streetName, ', ' , Addresses.city ,', ' , Addresses.stateName , ', ' , Addresses.country) as userAddress, Accounts.emailAddress as userEmail, Accounts.contact as userContact FROM CheckInRecords JOIN Accounts ON CheckInRecords.userID = Accounts.userID JOIN UserInfo ON  CheckInRecords.userID = UserInfo.userID JOIN Addresses ON Accounts.addressID = Addresses.addressID WHERE CheckInRecords.checkInCode = (SELECT checkInCode FROM VenueInfo WHERE userID = ?) ORDER BY CheckInRecords.dateAdded DESC";
  //   connection.query(query, [req.session.userID], function(err, rows, fields){
  //     connection.release();
  //     if(err){
  //       res.sendStatus(500);
  //       return;
  //     }
  //     res.json(rows);
  //   })
  // });
});

router.get("/getAllCheckIn", function(req, res,next){
  pool.connect().then(() => {
    pool.request().query(`SELECT CheckInRecords.dateAdded as dateAdded, 
                          CheckInRecords.userID as userID,
                          CheckInRecords.latitude as latitude,
                          CheckInRecords.longitude as longitude,
                          VenueInfo.venueName as venue
                          FROM CheckInRecords LEFT OUTER JOIN VenueInfo
                          ON CheckInRecords.checkInCode = VenueInfo.checkInCode;`, (err, result) => {
                            if(err){
                              res.sendStatus(500);
                              return;
                            }
                            res.json(result.recordset);
                          });
  });

  // req.pool.getConnection(function(err, connection){
  //   if(err){
  //     res.sendStatus(500);
  //     return;
  //   }
  //   var query = "select CheckInRecords.dateAdded as dateAdded, CheckInRecords.userID as userID, CheckInRecords.latitude as latitude, CheckInRecords.longitude as longitude, VenueInfo.venueName as venue FROM CheckInRecords LEFT OUTER JOIN VenueInfo ON CheckInRecords.checkInCode = VenueInfo.checkInCode";
  //   connection.query(query, function(err, rows, fields){
  //     connection.release();
  //     if(err){
  //       res.sendStatus(500);
  //       return;
  //     }
  //     res.json(rows);
  //   });
  // });
});

module.exports = router;






