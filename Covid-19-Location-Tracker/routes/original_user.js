var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var saltRounds = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next){
  req.pool.getConnection(function(err, connection){
      if(err){
          res.sendStatus(500);
          return;
      }
      var firstName = req.body.firstName;
      var lastName = req.body.lastName;
      var number = req.body.addressNumber;
      var streetName = req.body.streetName;
      var city = req.body.city;
      var country = req.body.country;
      var stateName = req.body.stateName;
      var userID = req.body.userID;
      var accountType = 0;
      var emailAddress = req.body.email;
      var contact = req.body.contactNumber;
      var password;
      var checkUserID = "select userID from Accounts where userID = ?";
      connection.query(checkUserID, [userID], function(err, rows, fields){
          connection.release();
          if(err){
              req.sendStatus(101);
              return;
          }
          if(rows.length != 0){
              res.sendStatus(401);
              return;
          }
          var checkEmailAddress = 'select emailAddress from Accounts where emailAddress = ?';
          connection.query(checkUserID, [emailAddress], function(err, rows, fields){
              if(err){
                  req.sendStatus(102);
                  return;
              }
              if(rows.length != 0){
                  res.sendStatus(401);
                  return;
              }
              var createAddress = 'insert into Addresses(number, streetName, city, stateName, country) values (?,?,?,?,?)';
              connection.query(createAddress, [number, streetName, city, stateName, country], function(err, rows, fields){
                if(err){
                    console.log(err);
                    res.sendStatus(104);
                    return;
                }
             var addressID;
             var getAddressID = 'select MAX(addressID) as addressID from Addresses';
             connection.query(getAddressID, function(err, rows, fields){
                if(err){
                res.sendStatus(103);
                return;
                }
                addressID =rows[0].addressID;
                bcrypt.hash(req.body.password, saltRounds, function(err, hash){
                    var theHash = hash;
                    var createAccount = 'insert into Accounts(userID, passwordHash, accountType, emailAddress, contact, addressID) values (?,?,?,?,?,?)';
                        connection.query(createAccount, [userID, theHash, accountType, emailAddress, contact, addressID], function(err, rows, fields){
                        if(err){
                            console.log(err);
                            res.sendStatus(105);
                            return;
                        }
                        var createUserInfo = 'insert into UserInfo(userID, firstName, lastName) values (?,?,?)';
                        connection.query(createUserInfo, [userID, firstName, lastName], function(err, rows, fields){
                           if(err){
                               res.sendStatus(106);
                               return;
                           }
                           res.redirect('/index.html');
                        });
                    });
                });
                });
              });
          });
      });
    });
});

router.post("/addCheckInRecord", function(req, res, next){
    req.pool.getConnection(function(err, connection){
        if(err){
            res.sendStatus(500);
            return;
        }
        var checkInCode = req.body.check_in_code;
        var validateCheckInCode = "select checkInCode from CheckInCodeRecords where checkInCode = ?";
        connection.query(validateCheckInCode, [checkInCode], function(err, rows, fields){
            connection.release();
            if(err){
                res.sendStatus(500);
                return;
            }
            if(rows.length == 0){
                res.sendStatus(404);
                return;
            }
            var userID = req.session.userID;
            var latitude;
            var longitude;
            var dateAdded;
            var venue;
            var get_lat_lng = "select latitude, longitude from CheckInCodeRecords where checkInCode = ?";
            connection.query(get_lat_lng, [checkInCode], function(err, rows, fields){
                if(err){
                    res.sendStatus(500);
                }
                latitude = rows[0].latitude;
                longitude = rows[0].longitude;
                var get_date = "select current_timestamp() as today";
                connection.query(get_date, function(err, rows, fields){
                if(err){
                    res.sendStatus(500);
                }
                dateAdded = rows[0].today;
                var get_location = "select venueName from VenueInfo where checkInCode = ?";
                connection.query(get_location, [checkInCode], function(err, rows, fields){
                if(err){
                    res.sendStatus(500);
                    return;
                }
                venue = rows[0].venueName;
                // var record = {dateAdded: dateAdded, latitude: latitude, longitude: longitude, location: location, state: "empty", country: "empty", checkInCode:checkInCode};
                // res.send(record);
                // error in here
                var query = "insert into CheckInRecords(userID, latitude, longitude, dateAdded, checkInCode) values (?, ?, ?, ?, ?);";
                connection.query(query, [userID, latitude, longitude, dateAdded, checkInCode], function(err, rows, fields){
                if(err){
                    res.sendStatus(500);
                    return;
                }
                var record = {dateAdded: dateAdded, latitude: latitude, longitude: longitude, venue: venue, state: "empty", country: "empty", checkInCode:checkInCode};
                res.send(JSON.stringify(record));
            });
            });
            });
            });
        });
            });
});


router.post('/signupVenue', function(req, res, next){
  req.pool.getConnection(function(err, connection){
      if(err){
          res.sendStatus(500);
          return;
      }
      var venueName = req.body.venueName;
      var longitude = req.body.longitude;
      var latitude = req.body.latitude;
      var checkInCode= req.body.checkInCode;
      var number = req.body.addressNumberVenue;
      var streetName = req.body.streetNameVenue;
      var city = req.body.cityVenue;
      var country = req.body.countryVenue;
      var stateName = req.body.stateNameVenue;
      var userID = req.body.userIDVenue;
      var accountType = 1;
      var emailAddress = req.body.emailVenue;
      var contact = req.body.contactNumberVenue;
      var password;
      var checkUserID = "select userID from Accounts where userID = ?";
      connection.query(checkUserID, [userID], function(err, rows, fields){
          connection.release();
          if(err){
              req.sendStatus(101);
              return;
          }
          if(rows.length != 0){
              res.sendStatus(401);
              return;
          }
          var checkEmailAddress = 'select emailAddress from Accounts where emailAddress = ?';
          connection.query(checkUserID, [emailAddress], function(err, rows, fields){
              if(err){
                  req.sendStatus(102);
                  return;
              }
              if(rows.length != 0){
                  res.sendStatus(401);
                  return;
              }
              var createAddress = 'insert into Addresses(number, streetName, city, stateName, country) values (?,?,?,?,?)';
              connection.query(createAddress, [number, streetName, city, stateName, country], function(err, rows, fields){
                if(err){
                    console.log(err);
                    res.sendStatus(104);
                    return;
                }
             var addressID;
             var getAddressID = 'select MAX(addressID) as addressID from Addresses';
             connection.query(getAddressID, function(err, rows, fields){
                if(err){
                res.sendStatus(103);
                return;
                }
                addressID =rows[0].addressID;
                bcrypt.hash(req.body.passwordVenue, saltRounds, function(err, hash){
                    var theHash = hash;
                    var createAccount = 'insert into Accounts(userID, passwordHash, accountType, emailAddress, contact, addressID) values (?,?,?,?,?,?)';
                        connection.query(createAccount, [userID, theHash, accountType, emailAddress, contact, addressID], function(err, rows, fields){
                        if(err){
                            console.log(err);
                            res.sendStatus(105);
                            return;
                        }


                        var createCheckInCode='insert into CheckInCodeRecords(checkInCode,latitude,longitude) values (?,?,?)';
                        connection.query(createCheckInCode, [checkInCode,latitude,longitude], function(err, rows, fields){
                             if(err){
                               console.log(err);
                               res.sendStatus(106);
                               return;
                           }


                        var createVenueInfo = 'insert into VenueInfo(userID, venueName, checkInCode) values (?,?,?)';
                        connection.query(createVenueInfo, [userID, venueName, checkInCode], function(err, rows, fields){
                           if(err){
                               res.sendStatus(106);
                               return;
                           }
                           res.redirect('/index.html');
                        });
                        });
                });
                });
              });
          });
      });
    });
});
});

router.get("/checkInRecords", function(req, res, next){
   req.pool.getConnection(function(err, connection){
    if(err){
        res.sendStatus(500);
        return;
    }
    var get_record = "select CheckInRecords.userID as userID, CheckInRecords.latitude as latitude, CheckInRecords.longitude as longitude, CheckInRecords.dateAdded as dateAdded, CheckInRecords.checkInCode as checkInCode, VenueInfo.venueName as venue from CheckInRecords LEFT OUTER JOIN VenueInfo ON CheckInRecords.checkInCode = VenueInfo.checkInCode where CheckInRecords.userID = ? ORDER BY CheckInRecords.dateAdded desc";
    connection.query(get_record, [req.session.userID], function(err, rows, fields){
        connection.release();
        if(err){
            res.sendStatus(500);
            return;
        }
        res.send(JSON.stringify(rows));
    });
   });
});




router.get('/getUserInfo',function(req,res,next){
   req.pool.getConnection(function(err,connection){
    if(err){
        res.sendStatus(500);
        return;
    }
    var get_userInfo="Select UserInfo.firstName AS firstName, UserInfo.lastName AS lastName, Accounts.emailAddress AS emailAddress, Accounts.contact AS contact, Addresses.number AS streetNumber, Addresses.streetName AS streetName, Addresses.city AS city, Addresses.stateName AS stateName, Addresses.country AS country FROM UserInfo JOIN Accounts ON UserInfo.userID=Accounts.userID JOIN Addresses ON Addresses.addressID=Accounts.addressID WHERE Accounts.userID= ?";
    connection.query(get_userInfo,[req.session.userID],function(err,rows,fields){
        connection.release();
       if(err){
           res.sendStatus(500);
           return;
       }
       res.send(JSON.stringify(rows));

    });
   });
});

router.get('/getUserName',function(req,res,next){
   req.pool.getConnection(function(err,connection){
    if(err){
        res.sendStatus(500);
        return;
    }
    var get_username="SELECT Accounts.userID FROM Accounts WHERE userID=?";
    connection.query(get_username,[req.session.userID],function(err,rows,fields){
        connection.release();
       if(err){
           res.sendStatus(500);
           return;
       }
       res.send(JSON.stringify(rows));

    });
   });
});

router.get('/uploadUserInfo',function(req,res,next){
    req.pool.getConnection(function(err,connection){
        if(err){
            res.sendStatus(500);
            return;
        }
        var first_name=req.query.firstName;
        var last_name=req.query.lastName;
        var email=req.query.email;
        var contact=req.query.contact;
        var edit_userInfo="UPDATE Accounts JOIN UserInfo ON Accounts.UserID=UserInfo.UserID JOIN Addresses ON Accounts.addressId=Addresses.addressId SET Accounts.contact=?,Accounts.emailAddress=?,UserInfo.firstName=?,UserInfo.lastName=? WHERE Accounts.UserID=?";
        connection.query(edit_userInfo,[contact,email,first_name,last_name,req.session.userID],function(err,rows,fields){
            connection.release();
            if(err){
                res.sendStatus(500);
                return;
            }
            res.send(rows);
        });
    });
});


router.get('/uploadAddress',function(req,res,next){
   req.pool.getConnection(function(err,connection){
       if(err){
           res.sendStatus(500);
           return;
       }
       var streetNumber=req.query.streetNumber;
       var streetName=req.query.streetName;
       var city=req.query.city;
       var state=req.query.state;
       var country=req.query.country;
       var edit_userInfo="UPDATE Accounts JOIN Addresses ON Accounts.addressId=Addresses.addressId SET Addresses.number=?,Addresses.streetName=?,Addresses.city=?,Addresses.stateName=?,Addresses.country=? WHERE Accounts.UserID=?";
       connection.query(edit_userInfo,[streetNumber,streetName,city,state,country,req.session.userID],function(err,rows,fields){
           connection.release();
            if(err){
                res.sendStatus(500);
                return;
            }
            res.send(JSON.stringify(rows));
        });
    });
});

router.get('/uploadPassword',function(req,res,next){
    req.pool.getConnection(function(err,connection){
       if(err){
           res.sendStatus(500);
           return;
       }
       var inputpassword=req.query.password;
       saltRounds=10;
       var edit_userInfo="UPDATE Accounts SET Accounts.passwordHash=? WHERE Accounts.UserID=?";
       bcrypt.hash(inputpassword, saltRounds, (err, hash) => {
            connection.query(edit_userInfo,[hash,req.session.userID],function(err,rows,fields){
                connection.release();
                if(err){
                    res.sendStatus(500);
                    return;
                }
                res.send(JSON.stringify(rows));
            });
       });
    });
});

router.get('/getVenueUserInfo',function(req,res,next){
   req.pool.getConnection(function(err,connection){
    if(err){
        res.sendStatus(500);
        return;
    }
    var get_venueUserInfo="Select VenueInfo.venueName AS venueName, Accounts.contact AS contact, Accounts.emailAddress AS emailAddress, Addresses.number AS streetNumber, Addresses.streetName AS streetName, Addresses.city AS city, Addresses.stateName AS stateName, Addresses.country AS country FROM VenueInfo JOIN Accounts ON VenueInfo.userID=Accounts.userID JOIN Addresses ON Addresses.addressID=Accounts.addressID WHERE Accounts.userID= ?";
    connection.query(get_venueUserInfo,[req.session.userID],function(err,rows,fields){
        connection.release();
       if(err){
           res.sendStatus(500);
           return;
       }
       res.send(JSON.stringify(rows));

    });
   });
});

router.post('/uploadVenueUserInfo',function(req,res,next){
    req.pool.getConnection(function(err,connection){
        if(err){
            res.sendStatus(500);
            return;
        }
        var venueName=req.body.venueName;
        var emailAddress=req.body.emailAddress;
        var contact=req.body.contact;
        var edit_venueUserInfo="UPDATE Accounts JOIN VenueInfo ON Accounts.UserID=VenueInfo.UserID JOIN Addresses ON Accounts.addressId=Addresses.addressId SET VenueInfo.venueName=?,Accounts.emailAddress=?,Accounts.contact=? WHERE Accounts.UserID=?";
        connection.query(edit_venueUserInfo,[venueName,emailAddress,contact,req.session.userID],function(err,rows,fields){
            connection.release();
            if(err){
                res.sendStatus(500);
                return;
            }
            res.send(JSON.stringify(rows));
        });
    });
});

router.post('/uploadVenueAddress',function(req,res,next){
   req.pool.getConnection(function(err,connection){
       if(err){
           res.sendStatus(500);
           return;
       }
       var streetNumber=req.body.streetNumber;
       var streetName=req.body.streetName;
       var city=req.body.city;
       var state=req.body.state;
       var country=req.body.country;
       var edit_venueUserInfo="UPDATE Accounts JOIN Addresses ON Accounts.addressId=Addresses.addressId SET Addresses.number=?,Addresses.streetName=?,Addresses.city=?,Addresses.stateName=?,Addresses.country=? WHERE Accounts.UserID=?";
       connection.query(edit_venueUserInfo,[streetNumber,streetName,city,state,country,req.session.userID],function(err,rows,fields){
           connection.release();
            if(err){
                res.sendStatus(500);
                return;
            }
            res.send(JSON.stringify(rows));
        });
    });
});


// router.get('/uploadVenueUserInfo',function(req,res,next){
//     req.pool.getConnection(function(err,connection){
//         if(err){
//             res.sendStatus(500);
//             return;
//         }
//         var venueName=req.query.venueName;
//         var emailAddress=req.query.emailAddress;
//         var contact=req.query.contact;
//         var edit_venueUserInfo="UPDATE Accounts JOIN VenueInfo ON Accounts.UserID=VenueInfo.UserID JOIN Addresses ON Accounts.addressId=Addresses.addressId SET VenueInfo.venueName=?,Accounts.emailAddress=?,Accounts.contact=? WHERE Accounts.UserID=?";
//         connection.query(edit_venueUserInfo,[venueName,emailAddress,contact,req.session.userID],function(err,rows,fields){
//             connection.release();
//             if(err){
//                 res.sendStatus(500);
//                 return;
//             }
//             res.send(rows);
//         });
//     });
// });


// router.get('/uploadVenueAddress',function(req,res,next){
//   req.pool.getConnection(function(err,connection){
//       if(err){
//           res.sendStatus(500);
//           return;
//       }
//       var streetNumber=req.query.streetNumber;
//       var streetName=req.query.streetName;
//       var city=req.query.city;
//       var state=req.query.state;
//       var country=req.query.country;
//       var edit_userInfo="UPDATE Accounts JOIN Addresses ON Accounts.addressId=Addresses.addressId SET Addresses.number=?,Addresses.streetName=?,Addresses.city=?,Addresses.stateName=?,Addresses.country=? WHERE Accounts.UserID=?";
//       connection.query(edit_userInfo,[streetNumber,streetName,city,state,country,req.session.userID],function(err,rows,fields){
//           connection.release();
//             if(err){
//                 res.sendStatus(500);
//                 return;
//             }
//             res.send(JSON.stringify(rows));
//         });
//     });
// });

router.get("/getAccountType", function(req, res, next){
    req.pool.getConnection(function(err, connection){
        if(err){
            res.sendStatus(500);
            return;
        }
        var getAccountType = "select accountType from Accounts where userID = ?";
        connection.query(getAccountType, [req.session.userID], function(err, rows, fields){
            connection.release();
            if(err){
                res.sendStatus(500);
                return;
            }
            var accountType = {accountType: rows[0].accountType};
            res.send(JSON.stringify(rows));
        });

    });
});
router.post('/admin_sign_up', function(req, res, next) {//Connect to the database
    var user_id = req.body.user_id;
    var email_address = req.body.email_address;
    var official_name = req.body.official_name;
    var password_input = req.body.password;
    var address_No = req.body.address_No;
    var city_Name = req.body.city_Name;
    var street = req.body.street;
    var country = req.body.country;
    var contact = req.body.contact;
    var stateName=req.body.stateName;
    //var password=password_input;
    //console.log(password);
    // if(password_input===null){
    //     res.sendStatus(500);
    // }
req.pool.getConnection( function(err,connection) {
    // bcrypt.hash(password_input, saltRounds, function(err, hash){
    //     password = hash;
    //     //console.log(password);
    // });
    if (err) {
        res.sendStatus(500);
        //console.log(0);
        return;
    }
    var query1 = "select userID from Accounts where userID=?";
    connection.query(query1, [user_id], function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
            res.sendStatus(501);
            //console.log(1);
            return;
        }
        else if(rows.length!=0){
            res.sendStatus(401);
            return;
        }
        var query2 = "select emailAddress from Accounts where emailAddress=?";
        connection.query(query2, [email_address], function(err, rows, fields) {
            if (err) {
                res.sendStatus(502);
                //console.log(2);
                return;
            }
            if(rows.length!=0){
                res.sendStatus(402);
                return;
            }
            var query3 = "insert into Addresses(number,streetName,city,stateName,country) values(?,?,?,?,?)";
            connection.query(query3, [address_No,street,city_Name,stateName,country], function(err, rows, fields) {
                if (err) {
                    res.sendStatus(503);
                    //console.log(3);
                    return;
                }
                var addressID=13;
                var getAddressID = "select max(addressID) as addressID from Addresses";
                connection.query(getAddressID, function(err, rows, fields){
                    if(err){
                        res.sendStatus(504);
                        return;
                    }
                    addressID=rows[0].addressID;
                    //console.log(rows[0].addressID);
                    //console.log(password);

                    var query4 = 'insert into Accounts values (?,?,?,?,?,?)';
                    bcrypt.hash(password_input, saltRounds, function(err, hash){
                    connection.query(query4, [user_id,hash,2,addressID,email_address,contact], function(err, rows, fields) {
                        if (err) {
                            res.sendStatus(505);
                            //console.log(4);
                            return;
                        }
                        var query5 = "insert into AdminInfo(userID,officialName) values(?,?)";
                        connection.query(query5, [user_id,official_name], function(err, rows, fields) {
                            if (err) {
                                res.sendStatus(506);
                                console.log(5);
                                return;
                            }
                            res.sendStatus(200); //send response
                        });
                    });
                    });
                });
            });
        });
    });
});
});
router.post('/admin_create_hotspot', function(req, res, next) {//Connect to the database
    var latitude  = req.body.latitude;
    var longitude  = req.body.longitude ;
    var dateAdded  = req.body.dateAdded;
    var confirmedCases = req.body.confirmedCases;
    var deaths = req.body.deaths;
    var recoveredCases = req.body.recoveredCases;
    var activeCases = req.body.activeCases;
req.pool.getConnection( function(err,connection) {
    if (err) {
        res.sendStatus(500);
        console.log(1);
        return;
    }
    var query1 = "select latitude,longitude from Hotspots where latitude=? and longitude=?";
    connection.query(query1, [latitude,longitude], function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
            res.sendStatus(500);
            console.log(2);
            return;
        }
        if(rows.length != 0){
            // res.sendStatus(501);
            var update_HotSpots="update Hotspots set dateAdded=?,confirmedCases=?,deaths=?,recoveredCases=?,activeCases=? where latitude=? and longitude=?";
            connection.query(update_HotSpots, [dateAdded,confirmedCases,deaths,recoveredCases,activeCases,latitude,longitude], function(err, rows, fields) {
                if (err) {
                    res.sendStatus(500);
                    console.log(3);
                    return;
                }
                res.sendStatus(200);
            });
        }
        else{
            var query = "insert into Hotspots(latitude,longitude,dateAdded,confirmedCases,deaths,recoveredCases,activeCases) "+
            "values(?,?,?,?,?,?,?)";
            connection.query(query, [latitude,longitude,dateAdded,confirmedCases,deaths,recoveredCases,activeCases], function(err, rows, fields) {
                if (err) {
                    res.sendStatus(500);
                    console.log(3);
                    return;
                }
                res.sendStatus(200);
                //res.json(rows); //send response
             });
        }
    });
});
});

router.get('/admin-getVenueInfo',function(req,res,next){
  req.pool.getConnection(function(err,connection){
    if(err){
        res.sendStatus(500);
        return;
    }
    var get_VenueInfo="Select VenueInfo.userID AS venueID,VenueInfo.venueName AS venueName, Accounts.contact AS contact, Accounts.emailAddress AS emailAddress, Addresses.number AS streetNumber, Addresses.streetName AS streetName, Addresses.city AS city, Addresses.stateName AS stateName, Addresses.country AS country FROM VenueInfo JOIN Accounts ON VenueInfo.userID=Accounts.userID JOIN Addresses ON Addresses.addressID=Accounts.addressID";
    connection.query(get_VenueInfo,function(err,rows,fields){
        connection.release();
      if(err){
          res.sendStatus(500);
          return;
      }
      res.send(JSON.stringify(rows));

    });
  });
});

router.get('/admin-getUserInfo',function(req,res,next){
  req.pool.getConnection(function(err,connection){
    if(err){
        res.sendStatus(500);
        return;
    }
    var get_UserInfo="Select UserInfo.userID AS userID, UserInfo.firstName AS firstName, UserInfo.lastName AS lastName,Accounts.contact AS contact, Accounts.emailAddress AS emailAddress, Addresses.number AS streetNumber, Addresses.streetName AS streetName, Addresses.city AS city, Addresses.stateName AS stateName, Addresses.country AS country FROM UserInfo JOIN Accounts ON UserInfo.userID=Accounts.userID JOIN Addresses ON Addresses.addressID=Accounts.addressID";
    connection.query(get_UserInfo,function(err,rows,fields){
        connection.release();
      if(err){
          res.sendStatus(500);
          return;
      }
      res.send(JSON.stringify(rows));

    });
  });
});


router.get('/delete-account',function(req,res,next){
  req.pool.getConnection(function(err,connection){
    if(err){
        res.sendStatus(500);
        return;
    }
    var venueID=req.query.venueID;
    var banned_venue="DELETE FROM Accounts WHERE userID=?";
    connection.query(banned_venue,[venueID],function(err,rows,fields){
        connection.release();
      if(err){
          res.sendStatus(500);
          return;
      }
      res.send(JSON.stringify(rows));

    });
  });
});

router.get("/UserInfo", function(req, res, next){
  req.pool.getConnection(function(err,connection){
    if(err){
        res.sendStatus(500);
        return;
    }
    var query = "SELECT CheckInRecords.dateAdded as time, CheckInRecords.userID as userID, concat(UserInfo.firstName, ' ' , UserInfo.lastName) as userName, concat(Addresses.number , ', ' , Addresses.streetName, ', ' , Addresses.city ,', ' , Addresses.stateName , ', ' , Addresses.country) as userAddress, Accounts.emailAddress as userEmail, Accounts.contact as userContact FROM CheckInRecords JOIN Accounts ON CheckInRecords.userID = Accounts.userID JOIN UserInfo ON  CheckInRecords.userID = UserInfo.userID JOIN Addresses ON Accounts.addressID = Addresses.addressID WHERE CheckInRecords.checkInCode ORDER BY CheckInRecords.dateAdded DESC";
    connection.query(query,function(err,rows,fields){
        connection.release();
      if(err){
          res.sendStatus(500);
          return;
      }
      res.send(JSON.stringify(rows));

    });
  });
});

router.get("/usersVenuesInfo", function(req, res, next){
  req.pool.getConnection(function(err,connection){
    if(err){
        res.sendStatus(500);
        return;
    }
    var query = "SELECT CheckInRecords.dateAdded as time, CheckInRecords.userID as userID, concat(UserInfo.firstName,' ',UserInfo.lastName) as userName, concat(Addresses.number , ', ' , Addresses.streetName, ', ' , Addresses.city ,', ' , Addresses.stateName , ', ' , Addresses.country) as userAddress, Accounts.emailAddress as userEmail, Accounts.contact as userContact FROM CheckInRecords JOIN Accounts ON CheckInRecords.userID=Accounts.userID JOIN UserInfo On CheckInRecords.userID=UserInfo.userID JOIn Addresses ON Accounts.addressID = Addresses.addressID ORDER BY CheckInRecords.dateAdded DESC";
    connection.query(query,function(err,rows,fields){
        connection.release();
      if(err){
          res.sendStatus(500);
          return;
      }
      res.send(JSON.stringify(rows));

    });
  });
});




router.get('/getAdminInfo',function(req,res,next){
  req.pool.getConnection(function(err,connection){
    if(err){
        res.sendStatus(500);
        return;
    }
    var get_adminInfo="SELECT AdminInfo.officialName AS officialName, Accounts.userID AS userID, Accounts.emailAddress AS emailAddress, Accounts.contact AS contact, Addresses.number AS streetNumber,  Addresses.streetName AS streetName, Addresses.city AS city, Addresses.stateName AS stateName, Addresses.country AS country FROM AdminInfo join Accounts on AdminInfo.userID = Accounts.userID  JOIN Addresses ON Accounts.addressID=Addresses.addressID WHERE Accounts.userID=?";
    connection.query(get_adminInfo,[req.session.userID],function(err,rows,fields){
        connection.release();
      if(err){
          res.sendStatus(500);
          return;
      }
      res.send(JSON.stringify(rows));

    });
  });
});

router.get('/uploadAdminInfo',function(req,res,next){
    req.pool.getConnection(function(err,connection){
        if(err){
            res.sendStatus(500);
            return;
        }
        var officialName=req.query.officialName;
        var emailAddress=req.query.emailAddress;
        var contact=req.query.contact;
        var query1="select emailAddress from Accounts where emailAddress=? AND userID <> ? ";
        connection.query(query1,[emailAddress, req.session.userID],function(err,rows,fields){
        connection.release();
        if(err){
            res.sendStatus(500);
            return;
        }
        else if(rows.length!=0){
            res.sendStatus(501);
            return;
        }
        var edit_AdminInfo="UPDATE Accounts SET Accounts.emailAddress=?,Accounts.contact=? WHERE Accounts.UserID=?";
            connection.query(edit_AdminInfo,[emailAddress,contact,req.session.userID],function(err,rows,fields){
                if(err){
                    res.sendStatus(500);
                    return;
                }
                res.send(rows);
                var query="UPDATE AdminInfo ad join Accounts a on ad.userID=a.userID SET ad.officialName=? WHERE a.UserID=?";
                connection.query(query,[officialName,req.session.userID],function(err,rows,fields){
                    if(err){
                        res.sendStatus(500);
                        return;
                    }
                    //res.send(rows);
                });
            });
        });
    });
});

router.get('/uploadAdminAddress',function(req,res,next){
    req.pool.getConnection(function(err,connection){
        if(err){
            res.sendStatus(500);
            return;
        }
        var streetNumber=req.query.streetNumber;
        var streetName=req.query.streetName;
        var city=req.query.city;
        var state=req.query.state;
        var country=req.query.country;
        var edit_AdminAddress="UPDATE Accounts JOIN Addresses ON Accounts.addressId=Addresses.addressId SET Addresses.number=?,Addresses.streetName=?,Addresses.city=?,Addresses.stateName=?,Addresses.country=? WHERE Accounts.UserID=?";
        connection.query(edit_AdminAddress,[streetNumber,streetName,city,state,country,req.session.userID],function(err,rows,fields){
            connection.release();
            if(err){
                res.sendStatus(500);
                return;
            }
            res.send(rows);
        });
    });
});


router.get("/getAllCheckIn", function(req, res,next){
  req.pool.getConnection(function(err, connection){
    if(err){
      res.sendStatus(500);
      return;
    }
    var query = "select VenueInfo.checkInCode, CheckInRecords.dateAdded as dateAdded, CheckInRecords.userID as userID, CheckInRecords.latitude as latitude, CheckInRecords.longitude as longitude, VenueInfo.venueName as venue FROM CheckInRecords LEFT OUTER JOIN VenueInfo ON CheckInRecords.checkInCode = VenueInfo.checkInCode";
    connection.query(query, function(err, rows, fields){
      connection.release();
      if(err){
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});


module.exports = router;

