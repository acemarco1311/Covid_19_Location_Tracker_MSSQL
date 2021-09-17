var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var saltRounds = 10;

const sql = require('mssql/msnodesqlv8');
const pool = new sql.ConnectionPool({
    database: 'Covid_19_Tracker_Project',
    server: 'LAPTOP-O70TM76D',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
    }
});

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/signup', function(req, res, next){
    pool.connect().then(() => {
        var checkUserID = new sql.PreparedStatement(pool);
        checkUserID.input('userID', sql.VarChar(50));
        checkUserID.prepare(`select userID from Accounts where userID = @userID;`,err=>{
            if(err){
                return res.sendStatus(401);
            }
            checkUserID.execute({userID: req.body.userID}, (err,result)=>{
                if(err){
                    return res.sendStatus(402);
                }
                else if(result.recordset.length != 0) {
                    return res.sendStatus(405);
                }
                let checkEmailAddress = new sql.PreparedStatement(pool);
                checkEmailAddress.input('emailAddress', sql.VarChar(100));
                checkEmailAddress.prepare(`select emailAddress from Accounts where emailAddress = @emailAddress;`, err => {
                    if(err){
                        return res.sendStatus(403);
                    }
                    checkEmailAddress.execute({emailAddress: req.body.email}, (err, result) => {
                        if(err){
                            return res.sendStatus(404);
                        }
                        if(result.recordset.length != 0){
                            return res.sendStatus(405);
                        }
                        var createAddress = new sql.PreparedStatement(pool);
                        createAddress.input('number', sql.Int);
                        createAddress.input('streetName', sql.VarChar(20));
                        createAddress.input('city', sql.VarChar(20));
                        createAddress.input('stateName', sql.VarChar(20));
                        createAddress.input('country', sql.VarChar(20));
                        createAddress.prepare(`insert into Addresses(number, streetName, city, stateName, country) values (@number, @streetName, @city, @stateName, @country);`, err => {
                            if(err){
                                return res.sendStatus(406);
                            }
                            createAddress.execute({
                                number: req.body.addressNumber,
                                streetName: req.body.streetName,
                                city: req.body.city,
                                stateName: req.body.stateName,
                                country: req.body.country
                            }, (err, result) => {
                                if(err){
                                    return res.sendStatus(407);
                                }
                                var addressID;
                                pool.request().query(`select MAX(addressID) as addressID from Addresses;`, (err, result) => {
                                    if(err){
                                        return res.sendStatus(408);
                                    }
                                    addressID = result.recordset[0].addressID;
                                    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
                                        if(err){
                                            return res.sendStatus(409);
                                        }
                                        var theHash = hash;
                                        var createAccount = new sql.PreparedStatement(pool);
                                        createAccount.input('userID', sql.VarChar(50));
                                        createAccount.input('newPassword', sql.VarChar(256));
                                        createAccount.input('accountType', sql.Int);
                                        createAccount.input('emailAddress', sql.VarChar(100));
                                        createAccount.input('contact', sql.VarChar(50));
                                        createAccount.input('addressID', sql.Int);
                                        createAccount.prepare(`insert into Accounts(userID, passwordHash, accountType, emailAddress, contact, addressID) values (@userID, @newPassword, @accountType, @emailAddress, @contact, @addressID) ;`, err => {
                                            if(err){
                                                return res.sendStatus(500);
                                            }
                                            createAccount.execute({
                                                userID: req.body.userID,
                                                newPassword: theHash,
                                                accountType: 0,
                                                emailAddress: req.body.email,
                                                contact: req.body.contactNumber, 
                                                addressID: addressID
                                            }, (err, result) => {
                                                if(err){
                                                    return res.sendStatus(501);
                                                }
                                                var createUserInfo = new sql.PreparedStatement(pool);
                                                createUserInfo.input('userID', sql.VarChar(50));
                                                createUserInfo.input('firstName', sql.VarChar(20));
                                                createUserInfo.input('lastName', sql.VarChar(20));
                                                createUserInfo.prepare(`;`, err => {
                                                    if(err){
                                                        return res.sendStatus(502);
                                                    }
                                                    createUserInfo.execute({
                                                        userID: req.body.userID,
                                                        firstName: req.body.firstName,
                                                        lastName: req.body.lastName
                                                    }, (err, result) => {
                                                        if(err) {
                                                            return res.sendStatus(503);
                                                        }
                                                        res.redirect('/index.html');
                                                        createUserInfo.unprepare(err => {
                                                            if(err){
                                                                return res.sendStatus(504);
                                                            }
                                                        })
                                                    })
                                                })
                                                createAccount.unprepare(err => {
                                                    if(err){
                                                        return res.sendStatus(505);
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                                createAddress.unprepare(err => {
                                    if (err) {
                                        return res.sendStatus(506);
                                    }
                                })
                            });
                        });
                        checkEmailAddress.unprepare(err => {
                            if(err){
                                return res.sendStatus(507);
                            }
                        });
                    });
                });
                checkUserID.unprepare(err => {
                    if(err){
                        return res.sendStatus(508);
                    }
                });
            });
        });
    });
//   req.pool.getConnection(function(err, connection){
//       if(err){
//           res.sendStatus(500);
//           return;
//       }
//       var firstName = req.body.firstName;
//       var lastName = req.body.lastName;
//       var number = req.body.addressNumber;
//       var streetName = req.body.streetName;
//       var city = req.body.city;
//       var country = req.body.country;
//       var stateName = req.body.stateName;
//       var userID = req.body.userID;
//       var accountType = 0;
//       var emailAddress = req.body.email;
//       var contact = req.body.contactNumber;
//       var password;
//       var checkUserID = "select userID from Accounts where userID = ?";
//       connection.query(checkUserID, [userID], function(err, rows, fields){
//           connection.release();
//           if(err){
//               req.sendStatus(101);
//               return;
//           }
//           if(rows.length != 0){
//               res.sendStatus(401);
//               return;
//           }
//           var checkEmailAddress = 'select emailAddress from Accounts where emailAddress = ?';
//           connection.query(checkUserID, [emailAddress], function(err, rows, fields){
//               if(err){
//                   req.sendStatus(102);
//                   return;
//               }
//               if(rows.length != 0){
//                   res.sendStatus(401);
//                   return;
//               }
//               var createAddress = 'insert into Addresses(number, streetName, city, stateName, country) values (?,?,?,?,?)';
//               connection.query(createAddress, [number, streetName, city, stateName, country], function(err, rows, fields){
//                 if(err){
//                     console.log(err);
//                     res.sendStatus(104);
//                     return;
//                 }
//              var addressID;
//              var getAddressID = 'select MAX(addressID) as addressID from Addresses';
//              connection.query(getAddressID, function(err, rows, fields){
//                 if(err){
//                 res.sendStatus(103);
//                 return;
//                 }
//                 addressID =rows[0].addressID;
//                 bcrypt.hash(req.body.password, saltRounds, function(err, hash){
//                     var theHash = hash;
//                     var createAccount = 'insert into Accounts(userID, passwordHash, accountType, emailAddress, contact, addressID) values (?,?,?,?,?,?)';
//                         connection.query(createAccount, [userID, theHash, accountType, emailAddress, contact, addressID], function(err, rows, fields){
//                         if(err){
//                             console.log(err);
//                             res.sendStatus(105);
//                             return;
//                         }
//                         var createUserInfo = 'insert into UserInfo(userID, firstName, lastName) values (?,?,?)';
//                         connection.query(createUserInfo, [userID, firstName, lastName], function(err, rows, fields){
//                            if(err){
//                                res.sendStatus(106);
//                                return;
//                            }
//                            res.redirect('/index.html');
//                         });
//                     });
//                 });
//                 });
//               });
//           });
//       });
//     });
});

router.post("/addCheckInRecord", function(req, res, next){
    pool.connect().then(() => {
        var checkInCode = req.body.check_in_code;
        var validateCheckInCode = new sql.PreparedStatement(pool);
        validateCheckInCode.input('checkInCode', sql.Char(6));
        validateCheckInCode.prepare(`select checkInCode from CheckInCodeRecords where checkInCode = @checkInCode ;`, err => {
            if(err){
                return res.sendStatus(500);
            }
            validateCheckInCode.execute({checkInCode: checkInCode}, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                else if(result.recordset.length == 0){
                    return res.sendStatus(404);
                }
                var getLatLng = new sql.PreparedStatement(pool);
                getLatLng.input('checkInCode', sql.Char(6));
                getLatLng.prepare(`select latitude, longitude from CheckInCodeRecords where checkInCode = @checkInCode;`, err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                    getLatLng.execute({checkInCode: checkInCode}, (err,result) => {
                        if(err){
                            return res.sendStatus(404);
                        }
                        var latitude = result.recordset[0].latitude;
                        var longitude = result.recordset[0].longitude;
                        var userID = req.session.userID;
                        pool.request().query(`select current_timestamp as today;`, (err, result) => {
                            if(err) {
                                return res.sendStatus(500);
                            }
                            var dateAdded = result.recordset[0].today;
                            var getLocation = new sql.PreparedStatement(pool);
                            getLocation.input('checkInCode', sql.Char(6));
                            getLocation.prepare(`select venueName from venueInfo where checkInCode = @checkInCode;`, err => {
                                if(err){ 
                                    return res.sendStatus(500);
                                }
                                getLocation.execute({checkInCode: checkInCode}, (err, result) => {
                                    if(err){
                                        return res.sendStatus(500);
                                    }
                                    var venue = result.recordset[0].venueName;
                                    var checkInRecord = new sql.PreparedStatement(pool);
                                    checkInRecord.input('userID', sql.VarChar(50));
                                    checkInRecord.input('latitude', sql.Decimal(10, 7));
                                    checkInRecord.input('longitude', sql.Decimal(10, 7));
                                    checkInRecord.input('dateAdded', sql.DateTime);
                                    checkInRecord.input('checkInCode', sql.Char(6));
                                    checkInRecord.prepare(`insert into CheckInRecords(userID, latitude, longitude, dateAdded, checkInCode) values (@userID, @latitude, @longitude, @dateAdded, @checkInCode);`, err => {
                                        if(err){
                                            return res.sendStatus(400);
                                        }
                                        checkInRecord.execute({
                                            userID: userID,
                                            latitude: latitude,
                                            longitude: longitude,
                                            dateAdded: dateAdded,
                                            checkInCode: checkInCode
                                        }, (err, result) => {
                                            if(err){
                                                return res.sendStatus(500);
                                            }
                                            var record = {dateAdded: dateAdded, latitude: latitude, longitude: longitude, venue: venue, state: "empty", country: "empty", checkInCode: checkInCode};
                                            res.send(JSON.stringify(record));
                                            checkInRecord.unprepare(err => {
                                                if(err){
                                                    return res.sendStatus(500);
                                                }
                                            });
                                        });
                                    });
                                    getLocation.unprepare(err => {
                                        if(err){
                                            return res.sendStatus(500);
                                        }
                                    });
                                });
                            });
                        });
                        getLatLng.unprepare(err => {
                            if(err){
                                return res.sendStatus(500);
                            }
                        });
                    });
                });
                validateCheckInCode.unprepare(err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                });
            })
        });
    });
//     req.pool.getConnection(function(err, connection){
//         if(err){
//             res.sendStatus(500);
//             return;
//         }
//         var checkInCode = req.body.check_in_code;
//         var validateCheckInCode = "select checkInCode from CheckInCodeRecords where checkInCode = ?";
//         connection.query(validateCheckInCode, [checkInCode], function(err, rows, fields){
//             connection.release();
//             if(err){
//                 res.sendStatus(500);
//                 return;
//             }
//             if(rows.length == 0){
//                 res.sendStatus(404);
//                 return;
//             }
//             var userID = req.session.userID;
//             var latitude;
//             var longitude;
//             var dateAdded;
//             var venue;
//             var get_lat_lng = "select latitude, longitude from CheckInCodeRecords where checkInCode = ?";
//             connection.query(get_lat_lng, [checkInCode], function(err, rows, fields){
//                 if(err){
//                     res.sendStatus(500);
//                 }
//                 latitude = rows[0].latitude;
//                 longitude = rows[0].longitude;
//                 var get_date = "select current_timestamp() as today";
//                 connection.query(get_date, function(err, rows, fields){
//                 if(err){
//                     res.sendStatus(500);
//                 }
//                 dateAdded = rows[0].today;
//                 var get_location = "select venueName from VenueInfo where checkInCode = ?";
//                 connection.query(get_location, [checkInCode], function(err, rows, fields){
//                 if(err){
//                     res.sendStatus(500);
//                     return;
//                 }
//                 venue = rows[0].venueName;
//                 // var record = {dateAdded: dateAdded, latitude: latitude, longitude: longitude, location: location, state: "empty", country: "empty", checkInCode:checkInCode};
//                 // res.send(record);
//                 // error in here
//                 var query = "insert into CheckInRecords(userID, latitude, longitude, dateAdded, checkInCode) values (?, ?, ?, ?, ?);";
//                 connection.query(query, [userID, latitude, longitude, dateAdded, checkInCode], function(err, rows, fields){
//                 if(err){
//                     res.sendStatus(500);
//                     return;
//                 }
//                 var record = {dateAdded: dateAdded, latitude: latitude, longitude: longitude, venue: venue, state: "empty", country: "empty", checkInCode:checkInCode};
//                 res.send(JSON.stringify(record));
//             });
//             });
//             });
//             });
//         });
//             });
});


router.post('/signupVenue', function(req, res, next){
    pool.connect().then(() => {
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
        var checkUserID = new sql.PreparedStatement(pool);
        checkUserID.input('userID', sql.VarChar(50));
        checkUserID.prepare(`select userID from Accounts where userID = @userID`, err => {
            if(err){
                return res.sendStatus(100);
            }
            checkUserID.execute({userID: userID}, (err, result) => {
                if(err){
                    return res.sendStatus(101);
                }
                if(result.recordset.length != 0) {
                    return res.sendStatus(401);
                }
                var checkEmailAddress = new sql.PreparedStatement(pool);
                checkEmailAddress.input('emailAddress', sql.VarChar(100));
                checkEmailAddress.prepare(`select emailAddress from Accounts where emailAddress = @emailAddress;`, err => {
                    if(err){
                        return res.sendStatus(102);
                    }
                    checkEmailAddress.execute({emailAddress: emailAddress}, (err, result) => {
                        if(err){
                            return res.sendStatus(103);
                        }
                        var createAddress = new sql.PreparedStatement(pool);
                        createAddress.input('number', sql.Int);
                        createAddress.input('streetName', sql.VarChar(20));
                        createAddress.input('city', sql.VarChar(20));
                        createAddress.input('stateName', sql.VarChar(20));
                        createAddress.input('country', sql.VarChar(20));
                        createAddress.prepare(`insert into Addresses (number, streetName, 
                            city, stateName, country) values (@number, @streetName,
                            @city, @stateName, @country);`, err => {
                            if(err){
                                return res.sendStatus(104);
                            }
                            createAddress.execute({
                                number: number,
                                streetName: streetName,
                                city: city,
                                stateName: stateName,
                                country: country
                            }, (err, result) => {
                                if(err){
                                    return res.sendStatus(105);
                                }
                                var addressID;
                                pool.request().query(`select MAX(addressID) as addressID from Addresses;`, (err, result) => {
                                    if(err){
                                        return res.sendStatus(106);
                                    }
                                    addressID = result.recordset[0].addressID;
                                    bcrypt.hash(req.body.passwordVenue, saltRounds, function(err, hash){
                                        var passwordHash = hash;
                                        var createAccount = new sql.PreparedStatement(pool);
                                        createAccount.input('userID', sql.VarChar(50));
                                        createAccount.input('passwordHash', sql.VarChar(256));
                                        createAccount.input('accountType', sql.Int);
                                        createAccount.input('emailAddress', sql.VarChar(100));
                                        createAccount.input('contact', sql.VarChar(50));
                                        createAccount.input('addressID', sql.Int);
                                        createAccount.prepare(`insert into Accounts(userID,passwordHash, accountType,
                                            emailAddress, contact, addressID) values (@userID, @passwordHash, @accountType,
                                                @emailAddress, @contact, @addressID);`, err => {
                                            if(err){
                                                return res.sendStatus(107);
                                            }
                                            createAccount.execute({
                                                userID: userID,
                                                passwordHash: passwordHash,
                                                accountType: accountType,
                                                emailAddress: emailAddress,
                                                contact: contact,
                                                addressID: addressID
                                            }, (err, result) => {
                                                if(err){
                                                    return res.sendStatus(108);
                                                }
                                                var createCheckInCode = new sql.PreparedStatement(pool);
                                                createCheckInCode.input('checkInCode', sql.Char(6));
                                                createCheckInCode.input('latitude', sql.Decimal(10,7));
                                                createCheckInCode.input('longitude', sql.Decimal(10, 7));
                                                createCheckInCode.prepare(`insert into CheckInCodeRecords(checkInCode, 
                                                    latitude, longitude) values (@checkInCode, @latitude, @longitude)`, err => {
                                                        if(err) {
                                                            return res.sendStatus(109);
                                                        }
                                                        createCheckInCode.execute({
                                                            checkInCode: checkInCode,
                                                            latitude: latitude,
                                                            longitude: longitude
                                                        }, (err, result) => {
                                                            if(err){
                                                                return res.sendStatus(110);
                                                            }
                                                            var createVenueInfo = new sql.PreparedStatement(pool);
                                                            createVenueInfo.input('userID', sql.VarChar(50));
                                                            createVenueInfo.input('venueName', sql.VarChar(100));
                                                            createVenueInfo.input('checkInCode', sql.Char(6)); 
                                                            createVenueInfo.prepare(`insert into VenueInfo(userID, venueName, checkInCode) 
                                                            values (@userID, @venueName, @checkInCode);`, err => {
                                                                if(err){
                                                                    return res.sendStatus(111);
                                                                }
                                                                createVenueInfo.execute({
                                                                    userID: userID,
                                                                    venueName: venueName,
                                                                    checkInCode: checkInCode
                                                                }, (err, result) => {
                                                                    if(err){ 
                                                                        return res.sendStatus(112);
                                                                    }
                                                                    res.redirect('/index.html');
                                                                    createVenueInfo.unprepare(err => {
                                                                        if(err){
                                                                            return res.sendStatus(113);
                                                                        }
                                                                    });
                                                                });
                                                            });
                                                            createCheckInCode.unprepare(err => {
                                                                if(err){
                                                                    return res.sendStatus(114);
                                                                }
                                                            });
                                                        });
                                                    });
                                                createAccount.unprepare(err => {
                                                    if(err){
                                                        return res.sendStatus(115);
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                                createAddress.unprepare(err => {
                                    if(err){ 
                                        return res.sendStatus(116);
                                    }
                                });
                            });
                        });
                        checkEmailAddress.unprepare(err => {
                            if(err){
                                return res.sendStatus(117);
                            }
                        });
                    });
                });
                checkUserID.unprepare(err => {
                    if(err){
                        return res.sendStatus(118);
                    }
                });
            });
        });
    });
//   req.pool.getConnection(function(err, connection){
//       if(err){
//           res.sendStatus(500);
//           return;
//       }
//       var venueName = req.body.venueName;
//       var longitude = req.body.longitude;
//       var latitude = req.body.latitude;
//       var checkInCode= req.body.checkInCode;
//       var number = req.body.addressNumberVenue;
//       var streetName = req.body.streetNameVenue;
//       var city = req.body.cityVenue;
//       var country = req.body.countryVenue;
//       var stateName = req.body.stateNameVenue;
//       var userID = req.body.userIDVenue;
//       var accountType = 1;
//       var emailAddress = req.body.emailVenue;
//       var contact = req.body.contactNumberVenue;
//       var password;
//       var checkUserID = "select userID from Accounts where userID = ?";
//       connection.query(checkUserID, [userID], function(err, rows, fields){
//           connection.release();
//           if(err){
//               req.sendStatus(101);
//               return;
//           }
//           if(rows.length != 0){
//               res.sendStatus(401);
//               return;
//           }
//           var checkEmailAddress = 'select emailAddress from Accounts where emailAddress = ?';
//           connection.query(checkUserID, [emailAddress], function(err, rows, fields){
//               if(err){
//                   req.sendStatus(102);
//                   return;
//               }
//               if(rows.length != 0){
//                   res.sendStatus(401);
//                   return;
//               }
//               var createAddress = 'insert into Addresses(number, streetName, city, stateName, country) values (?,?,?,?,?)';
//               connection.query(createAddress, [number, streetName, city, stateName, country], function(err, rows, fields){
//                 if(err){
//                     console.log(err);
//                     res.sendStatus(104);
//                     return;
//                 }
//              var addressID;
//              var getAddressID = 'select MAX(addressID) as addressID from Addresses';
//              connection.query(getAddressID, function(err, rows, fields){
//                 if(err){
//                 res.sendStatus(103);
//                 return;
//                 }
//                 addressID =rows[0].addressID;
//                 bcrypt.hash(req.body.passwordVenue, saltRounds, function(err, hash){
//                     var theHash = hash;
//                     var createAccount = 'insert into Accounts(userID, passwordHash, accountType, emailAddress, contact, addressID) values (?,?,?,?,?,?)';
//                         connection.query(createAccount, [userID, theHash, accountType, emailAddress, contact, addressID], function(err, rows, fields){
//                         if(err){
//                             console.log(err);
//                             res.sendStatus(105);
//                             return;
//                         }


//                         var createCheckInCode='insert into CheckInCodeRecords(checkInCode,latitude,longitude) values (?,?,?)';
//                         connection.query(createCheckInCode, [checkInCode,latitude,longitude], function(err, rows, fields){
//                              if(err){
//                                console.log(err);
//                                res.sendStatus(106);
//                                return;
//                            }


//                         var createVenueInfo = 'insert into VenueInfo(userID, venueName, checkInCode) values (?,?,?)';
//                         connection.query(createVenueInfo, [userID, venueName, checkInCode], function(err, rows, fields){
//                            if(err){
//                                res.sendStatus(106);
//                                return;
//                            }
//                            res.redirect('/index.html');
//                         });
//                         });
//                 });
//                 });
//               });
//           });
//       });
//     });
// });
});

router.get("/checkInRecords", function(req, res, next){
    pool.connect().then(() => {
        var get_record = new sql.PreparedStatement(pool);
        get_record.input('userID', sql.VarChar(50));
        get_record.prepare(`select CheckInRecords.userID as userID, CheckInRecords.latitude as latitude, CheckInRecords.longitude as longitude, CheckInRecords.dateAdded as dateAdded, CheckInRecords.checkInCode as checkInCode, VenueInfo.venueName as venue from CheckInRecords LEFT OUTER JOIN VenueInfo ON CheckInRecords.checkInCode = VenueInfo.checkInCode where CheckInRecords.userID = @userID ORDER BY CheckInRecords.dateAdded desc;`, err => {
            if(err){
                return res.sendStatus(500);
            }
            get_record.execute({userID: req.session.userID}, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                res.send(JSON.stringify(result.recordset));
                get_record.unprepare(err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                });
            });
        });
    });
//    req.pool.getConnection(function(err, connection){
//     if(err){
//         res.sendStatus(500);
//         return;
//     }
//     var get_record = "select CheckInRecords.userID as userID, CheckInRecords.latitude as latitude, CheckInRecords.longitude as longitude, CheckInRecords.dateAdded as dateAdded, CheckInRecords.checkInCode as checkInCode, VenueInfo.venueName as venue from CheckInRecords LEFT OUTER JOIN VenueInfo ON CheckInRecords.checkInCode = VenueInfo.checkInCode where CheckInRecords.userID = ? ORDER BY CheckInRecords.dateAdded desc";
//     connection.query(get_record, [req.session.userID], function(err, rows, fields){
//         connection.release();
//         if(err){
//             res.sendStatus(500);
//             return;
//         }
//         res.send(JSON.stringify(rows));
//     });
//    });
});




router.get('/getUserInfo',function(req,res,next){
    pool.connect().then(() => {
        var get_userInfo = new sql.PreparedStatement(pool);
        get_userInfo.input('userID', sql.VarChar(50));
        get_userInfo.prepare(`Select UserInfo.firstName AS firstName, UserInfo.lastName AS lastName, Accounts.emailAddress AS emailAddress, Accounts.contact AS contact, Addresses.number AS streetNumber, Addresses.streetName AS streetName, Addresses.city AS city, Addresses.stateName AS stateName, Addresses.country AS country FROM UserInfo JOIN Accounts ON UserInfo.userID=Accounts.userID JOIN Addresses ON Addresses.addressID=Accounts.addressID WHERE Accounts.userID= @userID;`, err =>{
            if(err){
                return res.sendStatus(500);
            }
            get_userInfo.execute({userID: req.session.userID}, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                res.send(result.recordset);
                get_userInfo.unprepare(err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                });
            });
        });
    });
//    req.pool.getConnection(function(err,connection){
//     if(err){
//         res.sendStatus(500);
//         return;
//     }
//     var get_userInfo="Select UserInfo.firstName AS firstName, UserInfo.lastName AS lastName, Accounts.emailAddress AS emailAddress, Accounts.contact AS contact, Addresses.number AS streetNumber, Addresses.streetName AS streetName, Addresses.city AS city, Addresses.stateName AS stateName, Addresses.country AS country FROM UserInfo JOIN Accounts ON UserInfo.userID=Accounts.userID JOIN Addresses ON Addresses.addressID=Accounts.addressID WHERE Accounts.userID= ?";
//     connection.query(get_userInfo,[req.session.userID],function(err,rows,fields){
//         connection.release();
//        if(err){
//            res.sendStatus(500);
//            return;
//        }
//        res.send(JSON.stringify(rows));

//     });
//    });
});

router.get('/getUserName',function(req,res,next){
    pool.connect().then(() => {
        var get_username = new sql.PreparedStatement(pool);
        get_username.input('userID', sql.VarChar(50));
        get_username.prepare(`select Accounts.userID from Accounts where userID = @userID;`, err =>{
            if(err){
                return res.sendStatus(500);
            }
            get_username.execute({userID: req.session.userID}, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                res.send(JSON.stringify(result.recordset));
                get_username.unprepare(err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                })
            });
        });
    })
//    req.pool.getConnection(function(err,connection){
//     if(err){
//         res.sendStatus(500);
//         return;
//     }
//     var get_username="SELECT Accounts.userID FROM Accounts WHERE userID=?";
//     connection.query(get_username,[req.session.userID],function(err,rows,fields){
//         connection.release();
//        if(err){
//            res.sendStatus(500);
//            return;
//        }
//        res.send(JSON.stringify(rows));

//     });
//    });
});

router.get('/uploadUserInfo',function(req,res,next){
    pool.connect().then(() => {
        var edit_userInfo = new sql.PreparedStatement(pool);
        edit_userInfo.input('contact', sql.VarChar(50));
        edit_userInfo.input('email', sql.VarChar(100));
        edit_userInfo.input('userID', sql.VarChar(50));
        edit_userInfo.prepare(`UPDATE Accounts SET contact = @contact, emailAddress = @email 
        where userID = @userID;`, err => {
            if(err){
                return res.send(err);
            }
            edit_userInfo.execute({
                contact: req.query.contact,
                email: req.query.email,
                userID: req.session.userID,
            }, (err, result) => {
                if(err){
                    return res.sendStatus(402);
                }
                var edit_username = new sql.PreparedStatement(pool);
                edit_username.input('firstName', sql.VarChar(20));
                edit_username.input('lastName', sql.VarChar(20));
                edit_username.input('userID', sql.VarChar(50));
                edit_username.prepare(`update UserInfo set firstName = @firstName, lastName = @lastName where userID = @userID;`, err => {
                    if(err) {
                        return res.sendStatus(500);
                    }
                    edit_username.execute({
                        firstName: req.query.firstName,
                        lastName: req.query.lastName,
                        userID: req.session.userID,
                    }, (err, result) => {
                        if(err) {
                            return res.sendStatus(500);
                        }
                        res.send(result.recordset);
                        edit_username.unprepare(err => {
                            if(err) {
                                return res.sendStatus(500);
                            }
                        })
                    });
                });
                edit_userInfo.unprepare(err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                });
            });
        });
    })
    // req.pool.getConnection(function(err,connection){
    //     if(err){
    //         res.sendStatus(500);
    //         return;
    //     }
    //     var first_name=req.query.firstName;
    //     var last_name=req.query.lastName;
    //     var email=req.query.email;
    //     var contact=req.query.contact;
    //     var edit_userInfo="UPDATE Accounts JOIN UserInfo ON Accounts.UserID=UserInfo.UserID JOIN Addresses ON Accounts.addressId=Addresses.addressId SET Accounts.contact=?,Accounts.emailAddress=?,UserInfo.firstName=?,UserInfo.lastName=? WHERE Accounts.UserID=?";
    //     connection.query(edit_userInfo,[contact,email,first_name,last_name,req.session.userID],function(err,rows,fields){
    //         connection.release();
    //         if(err){
    //             res.sendStatus(500);
    //             return;
    //         }
    //         res.send(rows);
    //     });
    // });
});


router.get('/uploadAddress',function(req,res,next){
    pool.connect().then(() => {
        var editUserAddress = new sql.PreparedStatement(pool);
        editUserAddress.input('streetNumber', sql.Int);
        editUserAddress.input('streetName', sql.VarChar(20));
        editUserAddress.input('city', sql.VarChar(20));
        editUserAddress.input('state', sql.VarChar(20));
        editUserAddress.input('country', sql.VarChar(20));
        editUserAddress.input('userID', sql.VarChar(50));
        editUserAddress.prepare(`update Addresses set number = @streetNumber, streetName = @streetName, 
        city = @city, stateName = @state, country = @country where addressID = (select addressID from Accounts where userID = @userID);`, err => {
            if(err){
                return res.sendStatus(500);
            }
            editUserAddress.execute({
                streetNumber: req.query.streetNumber,
                streetName: req.query.streetName,
                city: req.query.city, 
                state: req.query.state, 
                country: req.query.country,
                userID: req.session.userID
            }, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                res.send(JSON.stringify(result.recordset));
                editUserAddress.unprepare(err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                });
            });
        }); 
    });
});
//    req.pool.getConnection(function(err,connection){
//        if(err){
//            res.sendStatus(500);
//            return;
//        }
//        var streetNumber=req.query.streetNumber;
//        var streetName=req.query.streetName;
//        var city=req.query.city;
//        var state=req.query.state;
//        var country=req.query.country;
//        var edit_userInfo="UPDATE Accounts JOIN Addresses ON Accounts.addressId=Addresses.addressId SET Addresses.number=?,Addresses.streetName=?,Addresses.city=?,Addresses.stateName=?,Addresses.country=? WHERE Accounts.UserID=?";
//        connection.query(edit_userInfo,[streetNumber,streetName,city,state,country,req.session.userID],function(err,rows,fields){
//            connection.release();
//             if(err){
//                 res.sendStatus(500);
//                 return;
//             }
//             res.send(JSON.stringify(rows));
//         });
//     });
// });

router.get('/uploadPassword',function(req,res,next){
    pool.connect().then(() => {
        var editUserPassword = new sql.PreparedStatement(pool);
        editUserPassword.input('userID', sql.VarChar(50));
        editUserPassword.input('newPassword', sql.VarChar(256));
        bcrypt.hash(req.query.password, saltRounds, (err,hash) => {
            if(err){
                return res.sendStatus(500);
            }
            editUserPassword.prepare(`UPDATE Accounts SET Accounts.passwordHash=@newPassword WHERE Accounts.userID=@userID;`, err => {
                if(err){
                    return res.sendStatus(500);
                }
                editUserPassword.execute({userID: req.session.userID, newPassword: hash}, (err,result) =>{
                    if(err){
                        return res.sendStatus(500);
                    }
                    res.send(JSON.stringify(result.recordset));
                    editUserPassword.unprepare(err => {
                        if(err){
                            return res.sendStatus(500);
                        }
                    })
                });
            });
        })
    });
    // req.pool.getConnection(function(err,connection){
    //    if(err){
    //        res.sendStatus(500);
    //        return;
    //    }
    //    var inputpassword=req.query.password;
    //    saltRounds=10;
    //    var edit_userInfo="UPDATE Accounts SET Accounts.passwordHash=? WHERE Accounts.UserID=?";
    //    bcrypt.hash(inputpassword, saltRounds, (err, hash) => {
    //         connection.query(edit_userInfo,[hash,req.session.userID],function(err,rows,fields){
    //             connection.release();
    //             if(err){
    //                 res.sendStatus(500);
    //                 return;
    //             }
    //             res.send(JSON.stringify(rows));
    //         });
    //    });
    // });
});

router.get('/getVenueUserInfo',function(req,res,next){
    pool.connect().then(() => {
        var get_venueUserInfo = new sql.PreparedStatement(pool);
        get_venueUserInfo.input('userID', sql.VarChar(50));
        get_venueUserInfo.prepare(`Select VenueInfo.venueName AS venueName, Accounts.contact AS contact, Accounts.emailAddress AS emailAddress, Addresses.number AS streetNumber, Addresses.streetName AS streetName, Addresses.city AS city, Addresses.stateName AS stateName, Addresses.country AS country FROM VenueInfo JOIN Accounts ON VenueInfo.userID=Accounts.userID JOIN Addresses ON Addresses.addressID=Accounts.addressID WHERE Accounts.userID= @userID;`, err => {
            if(err){ 
                return res.sendStatus(500);
            }
            get_venueUserInfo.execute({userID: req.session.userID}, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                res.send(JSON.stringify(result.recordset));
                get_venueUserInfo.unprepare(err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                });
            });
        });
    });
//    req.pool.getConnection(function(err,connection){
//     if(err){
//         res.sendStatus(500);
//         return;
//     }
//     var get_venueUserInfo="Select VenueInfo.venueName AS venueName, Accounts.contact AS contact, Accounts.emailAddress AS emailAddress, Addresses.number AS streetNumber, Addresses.streetName AS streetName, Addresses.city AS city, Addresses.stateName AS stateName, Addresses.country AS country FROM VenueInfo JOIN Accounts ON VenueInfo.userID=Accounts.userID JOIN Addresses ON Addresses.addressID=Accounts.addressID WHERE Accounts.userID= ?";
//     connection.query(get_venueUserInfo,[req.session.userID],function(err,rows,fields){
//         connection.release();
//        if(err){
//            res.sendStatus(500);
//            return;
//        }
//        res.send(JSON.stringify(rows));

//     });
//    });
});

router.post('/uploadVenueUserInfo',function(req,res,next){
    pool.connect().then(() => {
        var venueName = req.body.venueName;
        var emailAddress = req.body.emailAddress;
        var contact = req.body.contact;
        var userID = req.session.userID;
        var editVenueInfo = new sql.PreparedStatement(pool);
        editVenueInfo.input('userID', sql.VarChar(50));
        editVenueInfo.input('venueName', sql.VarChar(100));
        editVenueInfo.prepare(`update VenueInfo set venueName = @venueName where userID = @userID`, err => {
            if(err){
                return res.sendStatus(500);
            }
            editVenueInfo.execute({
                userID: userID,
                venueName: venueName
            }, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                var editVenueAccount = new sql.PreparedStatement(pool);
                editVenueAccount.input('userID', sql.VarChar(50));
                editVenueAccount.input('emailAddress', sql.VarChar(100));
                editVenueAccount.input('contact', sql.VarChar(50));
                editVenueAccount.prepare(`update Accounts set emailAddress = @emailAddress, contact = @contact where userID = @userID`, err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                    editVenueAccount.execute({
                        userID: userID,
                        emailAddress: emailAddress,
                        contact: contact
                    }, (err, result) => {
                        if(err) {
                            return res.sendStatus(500);
                        }
                        res.send(JSON.stringify(result.recordset));
                        editVenueAccount.unprepare( err => {
                            if(err) { 
                                return res.sendStatus(500);
                            }
                        });
                    })
                });
                editVenueInfo.unprepare(err => {
                    if(err){ 
                        return res.sendStatus(500);
                    }
                });
            });
        });
    });
    // req.pool.getConnection(function(err,connection){
    //     if(err){
    //         res.sendStatus(500);
    //         return;
    //     }
    //     var venueName=req.body.venueName;
    //     var emailAddress=req.body.emailAddress;
    //     var contact=req.body.contact;
    //     var edit_venueUserInfo="UPDATE Accounts JOIN VenueInfo ON Accounts.UserID=VenueInfo.UserID JOIN Addresses ON Accounts.addressId=Addresses.addressId SET VenueInfo.venueName=?,Accounts.emailAddress=?,Accounts.contact=? WHERE Accounts.UserID=?";
    //     connection.query(edit_venueUserInfo,[venueName,emailAddress,contact,req.session.userID],function(err,rows,fields){
    //         connection.release();
    //         if(err){
    //             res.sendStatus(500);
    //             return;
    //         }
    //         res.send(JSON.stringify(rows));
    //     });
    // });
});

router.post('/uploadVenueAddress',function(req,res,next){

    pool.connect().then(() => {
        var number = req.body.streetNumber;
        var streetName = req.body.streetName;
        var city = req.body.city;
        var stateName = req.body.state;
        var country = req.body.country;
        var userID = req.session.userID;
        var editAddress = new sql.PreparedStatement(pool);
        editAddress.input('number', sql.Int);
        editAddress.input('streetName', sql.VarChar(20));
        editAddress.input('city', sql.VarChar(20));
        editAddress.input('stateName', sql.VarChar(20));
        editAddress.input('country', sql.VarChar(20));
        editAddress.input('userID', sql.VarChar(50));
        editAddress.prepare(`update Addresses set number = @number, 
        streetName = @streetName, city = @city, stateName = @stateName,
        country = @country where addressID = (select addressID from Accounts 
            where userID = @userID);`, err => {
            if(err){
                return res.sendStatus(500);
            }
            editAddress.execute({
                number: number,
                streetName: streetName, 
                city: city, 
                stateName: stateName,
                country: country,
                userID: userID
            }, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                res.send(JSON.stringify(result.recordset));
                editAddress.unprepare(err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                });
            });
        });
    })
//    req.pool.getConnection(function(err,connection){
//        if(err){
//            res.sendStatus(500);
//            return;
//        }
//        var streetNumber=req.body.streetNumber;
//        var streetName=req.body.streetName;
//        var city=req.body.city;
//        var state=req.body.state;
//        var country=req.body.country;
//        var edit_venueUserInfo="UPDATE Accounts JOIN Addresses ON Accounts.addressId=Addresses.addressId SET Addresses.number=?,Addresses.streetName=?,Addresses.city=?,Addresses.stateName=?,Addresses.country=? WHERE Accounts.UserID=?";
//        connection.query(edit_venueUserInfo,[streetNumber,streetName,city,state,country,req.session.userID],function(err,rows,fields){
//            connection.release();
//             if(err){
//                 res.sendStatus(500);
//                 return;
//             }
//             res.send(JSON.stringify(rows));
//         });
//     });
});


router.get("/getAccountType", function(req, res, next){
    pool.connect().then(() => {
        var getAccountType = new sql.PreparedStatement(pool);
        getAccountType.input('userID', sql.VarChar(50));
        getAccountType.prepare(`select accountType from Accounts where userID = @userID`, err =>{
            if(err){
                return res.sendStatus(500);
            }
            getAccountType.execute({userID: req.session.userID}, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                var accountType = {accountType: result.recordset[0].accountType};
                res.send(JSON.stringify(accountType));
                getAccountType.unprepare(err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                });
            });
        })
    });
    // req.pool.getConnection(function(err, connection){
    //     if(err){
    //         res.sendStatus(500);
    //         return;
    //     }
    //     var getAccountType = "select accountType from Accounts where userID = ?";
    //     connection.query(getAccountType, [req.session.userID], function(err, rows, fields){
    //         connection.release();
    //         if(err){
    //             res.sendStatus(500);
    //             return;
    //         }
    //         var accountType = {accountType: rows[0].accountType};
    //         res.send(JSON.stringify(rows));
    //     });

    // });
});
router.post('/admin_sign_up', function(req, res, next) {//Connect to the database
    var userID = req.body.user_id;
    var emailAddress = req.body.email_address;
    var officialName = req.body.official_name;
    var passwordHash = req.body.password;
    var number = req.body.address_No;
    var streetName = req.body.street;
    var city = req.body.city_Name;
    var stateName = req.body.stateName;
    var country = req.body.country;
    var contact = req.body.contact;
    pool.connect().then(() => {
        var checkUserID = new sql.PreparedStatement(pool);
        checkUserID.input('userID', sql.VarChar(50));
        checkUserID.prepare(`select userID from Accounts where userID = @userID;`, err => {
            if(err) {
                return res.sendStatus(500);
            }
            checkUserID.execute({userID:userID}, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                else if(result.recordset.length != 0) {
                    return res.sendStatus(401);
                }
                var checkEmailAddress = new sql.PreparedStatement(pool);
                checkEmailAddress.input('emailAddress', sql.VarChar(100));
                checkEmailAddress.prepare(`select emailAddress from Accounts where emailAddress = 
                @emailAddress;`, err => {
                    if(err) {
                        return res.sendStatus(500);
                    }
                    checkEmailAddress.execute({emailAddress:emailAddress}, (err , result) => {
                        if(err) {
                            return res.sendStatus(500);
                        }
                        else if(result.recordset.length != 0 ){
                            return res.sendStatus(401);
                        }
                        var createAddress = new sql.PreparedStatement(pool);
                        createAddress.input('number', sql.Int);
                        createAddress.input('streetName', sql.VarChar(20));
                        createAddress.input('city', sql.VarChar(20));
                        createAddress.input('stateName', sql.VarChar(20));
                        createAddress.input('country', sql.VarChar(20));
                        createAddress.prepare(`insert into Addresses(number, streetName, city, 
                            stateName, country) values (@number, @streetName, @city, @stateName,
                                @country);`, err => {
                                    if(err){
                                        return res.sendStatus(500);
                                    }
                                    createAddress.execute({
                                        number: number,
                                        streetName: streetName,
                                        city:city,
                                        stateName: stateName,
                                        country: country
                                    }, (err, result) => {
                                        if(err){
                                            return res.sendStatus(500);
                                        }
                                        var addressID; 
                                        pool.request().query(`select max(addressID) as addressID from Addresses;`, (err, result) => {
                                            if(err) {
                                                return res.sendStatus(500);
                                            }
                                            addressID = result.recordset[0].addressID;
                                            bcrypt.hash(passwordHash, saltRounds, function(err, hash) {
                                                if(err){
                                                    return res.sendStatus(500);
                                                }
                                                var createAccount = new sql.PreparedStatement(pool);
                                                createAccount.input('userID', sql.VarChar(50));
                                                createAccount.input('passwordHash', sql.VarChar(256));
                                                createAccount.input('addressID', sql.Int);
                                                createAccount.input('emailAddress', sql.VarChar(100));
                                                createAccount.input('contact', sql.VarChar(50));
                                                createAccount.prepare(`insert into Accounts(userID, passwordHash, accountType,
                                                    addressID, emailAddress, contact) values (@userID, @passwordHash, 
                                                        2, @addressID, @emailAddress, @contact);`, err => {
                                                            if(err) {
                                                                return res.sendStatus(500);
                                                            }
                                                            createAccount.execute({
                                                                userID: userID,
                                                                passwordHash: hash, 
                                                                addressID: addressID,
                                                                emailAddress: emailAddress,
                                                                contact: contact
                                                            }, (err, result) => {
                                                                if(err){
                                                                    return res.sendStatus(500);
                                                                }
                                                                var createAdminInfo = new sql.PreparedStatement(pool);
                                                                createAdminInfo.input('userID', sql.VarChar(50));
                                                                createAdminInfo.input('officialName', sql.VarChar(50));
                                                                createAdminInfo.prepare(`insert into AdminInfo(userID, officialName) values (@userID, @officialName);`, err => {
                                                                    if(err){
                                                                        return res.sendStatus(500);
                                                                    }
                                                                    createAdminInfo.execute({
                                                                        userID: userID,
                                                                        officialName: officialName,
                                                                    }, (err, result) => {
                                                                        if(err) {
                                                                            return res.sendStatus(500);
                                                                        }
                                                                        res.sendStatus(200);
                                                                        createAdminInfo.unprepare(err => {
                                                                            if(err){
                                                                                return res.sendStatus(500);
                                                                            }
                                                                        })
                                                                    });
                                                                });
                                                                createAccount.unprepare(err => {
                                                                    if(err){
                                                                        return res.sendStatus(500);
                                                                    }
                                                                })
                                                            });
                                                        });
                                            });
                                            
                                        });
                                        createAddress.unprepare(err => {
                                            if(err) {
                                                return res.sendStatus(500);
                                            }
                                        });
                                    });
                                });
                        checkEmailAddress.unprepare(err => {
                            if(err){
                                return res.sendStatus(500);
                            }
                        });
                    });
                });
                checkUserID.unprepare(err => {
                    if(err) {
                        return res.sendStatus(500);
                    }
                });
            });
        });
    });
    
//     var user_id = req.body.user_id;
//     var email_address = req.body.email_address;
//     var official_name = req.body.official_name;
//     var password_input = req.body.password;
//     var address_No = req.body.address_No;
//     var city_Name = req.body.city_Name;
//     var street = req.body.street;
//     var country = req.body.country;
//     var contact = req.body.contact;
//     var stateName=req.body.stateName;
    
// req.pool.getConnection( function(err,connection) {
    
//     if (err) {
//         res.sendStatus(500);
//         //console.log(0);
//         return;
//     }
//     var query1 = "select userID from Accounts where userID=?";
//     connection.query(query1, [user_id], function(err, rows, fields) {
//         connection.release(); // release connection
//         if (err) {
//             res.sendStatus(501);
//             //console.log(1);
//             return;
//         }
//         else if(rows.length!=0){
//             res.sendStatus(401);
//             return;
//         }
//         var query2 = "select emailAddress from Accounts where emailAddress=?";
//         connection.query(query2, [email_address], function(err, rows, fields) {
//             if (err) {
//                 res.sendStatus(502);
//                 //console.log(2);
//                 return;
//             }
//             if(rows.length!=0){
//                 res.sendStatus(402);
//                 return;
//             }
//             var query3 = "insert into Addresses(number,streetName,city,stateName,country) values(?,?,?,?,?)";
//             connection.query(query3, [address_No,street,city_Name,stateName,country], function(err, rows, fields) {
//                 if (err) {
//                     res.sendStatus(503);
//                     //console.log(3);
//                     return;
//                 }
//                 var addressID=13;
//                 var getAddressID = "select max(addressID) as addressID from Addresses";
//                 connection.query(getAddressID, function(err, rows, fields){
//                     if(err){
//                         res.sendStatus(504);
//                         return;
//                     }
//                     addressID=rows[0].addressID;
//                     //console.log(rows[0].addressID);
//                     //console.log(password);

//                     var query4 = 'insert into Accounts values (?,?,?,?,?,?)';
//                     bcrypt.hash(password_input, saltRounds, function(err, hash){
//                     connection.query(query4, [user_id,hash,2,addressID,email_address,contact], function(err, rows, fields) {
//                         if (err) {
//                             res.sendStatus(505);
//                             //console.log(4);
//                             return;
//                         }
//                         var query5 = "insert into AdminInfo(userID,officialName) values(?,?)";
//                         connection.query(query5, [user_id,official_name], function(err, rows, fields) {
//                             if (err) {
//                                 res.sendStatus(506);
//                                 console.log(5);
//                                 return;
//                             }
//                             res.sendStatus(200); //send response
//                         });
//                     });
//                     });
//                 });
//             });
//         });
//     });
// });
});
router.post('/admin_create_hotspot', function(req, res, next) {//Connect to the database
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var dateAdded = req.body.dateAdded;
    var confirmedCases = req.body.confirmedCases;
    var deaths = req.body.deaths;
    var recoveredCases = req.body.recoveredCases;
    var activeCases = req.body.activeCases;
    pool.connect().then(() => {
        var checkLatLng = new sql.PreparedStatement(pool);
        checkLatLng.input('latitude', sql.Decimal(10, 7));
        checkLatLng.input('longitude', sql.Decimal(10, 7));
        checkLatLng.prepare(`select latitude, longitude from Hotspots where 
        latitude = @latitude and longitude = @longitude;`, err => {
            if(err){
                return res.sendStatus(102);
            }
            checkLatLng.execute({latitude: latitude, longitude: longitude}, (err, result) => {
                if(err){
                    return res.sendStatus(103);
                }
                else if(result.recordset.length != 0){
                    var updateHotspot = new sql.PreparedStatement(pool);
                    updateHotspot.input('dateAdded', sql.Date);
                    updateHotspot.input('confirmedCases', sql.Int);
                    updateHotspot.input('deaths', sql.Int);
                    updateHotspot.input('recoveredCases', sql.Int);
                    updateHotspot.input('activeCases', sql.Int);
                    updateHotspot.input('latitude', sql.Decimal(10, 7));
                    updateHotspot.input('longitude', sql.Decimal(10, 7));
                    updateHotspot.prepare(`update Hotspots set dateAdded = @dateAdded,
                    confirmedCases = @confirmedCases, deaths = @deaths,
                    recoveredCases = @recoveredCases, activeCases = @activeCases 
                    where latitude = @latitude and longitude = @longitude;`, err => {
                        if(err) {
                            return res.sendStatus(104);
                        }
                        updateHotspot.execute({
                            dateAdded: dateAdded,
                            confirmedCases: confirmedCases,
                            deaths: deaths,
                            recoveredCases: recoveredCases,
                            activeCases: activeCases,
                            latitude: latitude,
                            longitude: longitude
                        }, (err, result) => {
                            if(err){
                                return res.sendStatus(105);
                            }
                            res.sendStatus(200);
                            updateHotspot.unprepare(err => {
                                if(err){
                                    return res.sendStatus(501);
                                }
                            });
                        });
                    });
                }
                else{
                    var newHotspot = new sql.PreparedStatement(pool);
                    newHotspot.input('dateAdded', sql.Date);
                    newHotspot.input('confirmedCases', sql.Int);
                    newHotspot.input('deaths', sql.Int);
                    newHotspot.input('recoveredCases', sql.Int);
                    newHotspot.input('activeCases', sql.Int);
                    newHotspot.input('latitude', sql.Decimal(10,7));
                    newHotspot.input('longitude', sql.Decimal(10, 7));
                    newHotspot.prepare(`insert into Hotspots(dateAdded, latitude, longitude,
                        confirmedCases, deaths, recoveredCases, activeCases)
                        values (@dateAdded, @latitude, @longitude, @confirmedCases,
                            @deaths, @recoveredCases, @activeCases);`, err => {
                        if(err){
                            return res.sendStatus(105);
                        }
                        newHotspot.execute({
                            dateAdded: dateAdded,
                            confirmedCases: confirmedCases,
                            deaths: deaths,
                            recoveredCases: recoveredCases,
                            activeCases: activeCases,
                            latitude: latitude,
                            longitude: longitude
                        }, (err, result) => {
                            if(err) {
                                return res.sendStatus(500);
                            }
                            res.sendStatus(200);
                            newHotspot.unprepare(err => {
                                if(err){
                                    return res.sendStatus(500);
                                }
                            });
                        });
                    });
                }
                checkLatLng.unprepare(err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                });
            });
        });
    });

//     var latitude  = req.body.latitude;
//     var longitude  = req.body.longitude ;
//     var dateAdded  = req.body.dateAdded;
//     var confirmedCases = req.body.confirmedCases;
//     var deaths = req.body.deaths;
//     var recoveredCases = req.body.recoveredCases;
//     var activeCases = req.body.activeCases;
// req.pool.getConnection( function(err,connection) {
//     if (err) {
//         res.sendStatus(500);
//         console.log(1);
//         return;
//     }
//     var query1 = "select latitude,longitude from Hotspots where latitude=? and longitude=?";
//     connection.query(query1, [latitude,longitude], function(err, rows, fields) {
//         connection.release(); // release connection
//         if (err) {
//             res.sendStatus(500);
//             console.log(2);
//             return;
//         }
//         if(rows.length != 0){
//             // res.sendStatus(501);
//             var update_HotSpots="update Hotspots set dateAdded=?,confirmedCases=?,deaths=?,recoveredCases=?,activeCases=? where latitude=? and longitude=?";
//             connection.query(update_HotSpots, [dateAdded,confirmedCases,deaths,recoveredCases,activeCases,latitude,longitude], function(err, rows, fields) {
//                 if (err) {
//                     res.sendStatus(500);
//                     console.log(3);
//                     return;
//                 }
//                 res.sendStatus(200);
//             });
//         }
//         else{
//             var query = "insert into Hotspots(latitude,longitude,dateAdded,confirmedCases,deaths,recoveredCases,activeCases) "+
//             "values(?,?,?,?,?,?,?)";
//             connection.query(query, [latitude,longitude,dateAdded,confirmedCases,deaths,recoveredCases,activeCases], function(err, rows, fields) {
//                 if (err) {
//                     res.sendStatus(500);
//                     console.log(3);
//                     return;
//                 }
//                 res.sendStatus(200);
//                 //res.json(rows); //send response
//              });
//         }
//     });
// });
});

router.get('/admin-getVenueInfo',function(req,res,next){
    pool.connect().then(() => {
        pool.request().query(`Select VenueInfo.userID AS venueID, 
        VenueInfo.venueName AS venueName, Accounts.contact AS contact, 
        Accounts.emailAddress AS emailAddress, Addresses.number AS streetNumber, 
        Addresses.streetName AS streetName, Addresses.city AS city, 
        Addresses.stateName AS stateName, Addresses.country AS country 
        FROM VenueInfo JOIN Accounts ON VenueInfo.userID=Accounts.userID 
        JOIN Addresses ON Addresses.addressID=Accounts.addressID`, (err, result) => {
            if(err){
                return res.sendStatus(500);
            }
            res.send(JSON.stringify(result.recordset));
        });
    });
//   req.pool.getConnection(function(err,connection){
//     if(err){
//         res.sendStatus(500);
//         return;
//     }
//     var get_VenueInfo="Select VenueInfo.userID AS venueID,VenueInfo.venueName AS venueName, Accounts.contact AS contact, Accounts.emailAddress AS emailAddress, Addresses.number AS streetNumber, Addresses.streetName AS streetName, Addresses.city AS city, Addresses.stateName AS stateName, Addresses.country AS country FROM VenueInfo JOIN Accounts ON VenueInfo.userID=Accounts.userID JOIN Addresses ON Addresses.addressID=Accounts.addressID";
//     connection.query(get_VenueInfo,function(err,rows,fields){
//         connection.release();
//       if(err){
//           res.sendStatus(500);
//           return;
//       }
//       res.send(JSON.stringify(rows));

//     });
//   });
});

router.get('/admin-getUserInfo',function(req,res,next){
    pool.connect().then(() => {
        pool.request().query(`Select UserInfo.userID AS userID, UserInfo.firstName AS firstName, UserInfo.lastName AS lastName,Accounts.contact AS contact, Accounts.emailAddress AS emailAddress, Addresses.number AS streetNumber, Addresses.streetName AS streetName, Addresses.city AS city, Addresses.stateName AS stateName, Addresses.country AS country FROM UserInfo JOIN Accounts ON UserInfo.userID=Accounts.userID JOIN Addresses ON Addresses.addressID=Accounts.addressID;`, (err, result) => {
            if(err){
                return res.sendStatus(500);
            }
            res.send(JSON.stringify(result.recordset));
        }); 
    });
//   req.pool.getConnection(function(err,connection){
//     if(err){
//         res.sendStatus(500);
//         return;
//     }
//     var get_UserInfo="Select UserInfo.userID AS userID, UserInfo.firstName AS firstName, UserInfo.lastName AS lastName,Accounts.contact AS contact, Accounts.emailAddress AS emailAddress, Addresses.number AS streetNumber, Addresses.streetName AS streetName, Addresses.city AS city, Addresses.stateName AS stateName, Addresses.country AS country FROM UserInfo JOIN Accounts ON UserInfo.userID=Accounts.userID JOIN Addresses ON Addresses.addressID=Accounts.addressID";
//     connection.query(get_UserInfo,function(err,rows,fields){
//         connection.release();
//       if(err){
//           res.sendStatus(500);
//           return;
//       }
//       res.send(JSON.stringify(rows));

//     });
//   });
});


router.get('/delete-account',function(req,res,next){
    pool.connect().then(() =>{
        var ban = new sql.PreparedStatement(pool);
        ban.input('userID', sql.VarChar(50));
        ban.prepare(`delete from Accounts where userID = @userID`, err => {
            if(err){
                return res.sendStatus(500);
            }
            ban.execute({userID: req.query.venueID}, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                res.send(JSON.stringify(result.recordset));
                ban.unprepare(err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                });
            });
        });
    });
//   req.pool.getConnection(function(err,connection){
//     if(err){
//         res.sendStatus(500);
//         return;
//     }
//     var venueID=req.query.venueID;
//     var banned_venue="DELETE FROM Accounts WHERE userID=?";
//     connection.query(banned_venue,[venueID],function(err,rows,fields){
//         connection.release();
//       if(err){
//           res.sendStatus(500);
//           return;
//       }
//       res.send(JSON.stringify(rows));

//     });
//   });
});

router.get("/UserInfo", function(req, res, next){
    pool.connect().then(() => {
        pool.request().query(`SELECT CheckInRecords.dateAdded as time, CheckInRecords.userID as userID, concat(UserInfo.firstName, ' ' , UserInfo.lastName) as userName, concat(Addresses.number , ', ' , Addresses.streetName, ', ' , Addresses.city ,', ' , Addresses.stateName , ', ' , Addresses.country) as userAddress, Accounts.emailAddress as userEmail, Accounts.contact as userContact FROM CheckInRecords JOIN Accounts ON CheckInRecords.userID = Accounts.userID JOIN UserInfo ON  CheckInRecords.userID = UserInfo.userID JOIN Addresses ON Accounts.addressID = Addresses.addressID WHERE CheckInRecords.checkInCode ORDER BY CheckInRecords.dateAdded DESC`, (err, result) => {
            if(err){
                return res.sendStatus(500);
            }
            res.send(JSON.stringify(result.recordset));
        });
    });
//   req.pool.getConnection(function(err,connection){
//     if(err){
//         res.sendStatus(500);
//         return;
//     }
//     var query = "SELECT CheckInRecords.dateAdded as time, CheckInRecords.userID as userID, concat(UserInfo.firstName, ' ' , UserInfo.lastName) as userName, concat(Addresses.number , ', ' , Addresses.streetName, ', ' , Addresses.city ,', ' , Addresses.stateName , ', ' , Addresses.country) as userAddress, Accounts.emailAddress as userEmail, Accounts.contact as userContact FROM CheckInRecords JOIN Accounts ON CheckInRecords.userID = Accounts.userID JOIN UserInfo ON  CheckInRecords.userID = UserInfo.userID JOIN Addresses ON Accounts.addressID = Addresses.addressID WHERE CheckInRecords.checkInCode ORDER BY CheckInRecords.dateAdded DESC";
//     connection.query(query,function(err,rows,fields){
//         connection.release();
//       if(err){
//           res.sendStatus(500);
//           return;
//       }
//       res.send(JSON.stringify(rows));

//     });
//   });
});

router.get("/usersVenuesInfo", function(req, res, next){
    pool.connect().then(() => {
        pool.request().query(`SELECT CheckInRecords.dateAdded as time, CheckInRecords.userID as userID, concat(UserInfo.firstName,' ',UserInfo.lastName) as userName, concat(Addresses.number , ', ' , Addresses.streetName, ', ' , Addresses.city ,', ' , Addresses.stateName , ', ' , Addresses.country) as userAddress, Accounts.emailAddress as userEmail, Accounts.contact as userContact FROM CheckInRecords JOIN Accounts ON CheckInRecords.userID=Accounts.userID JOIN UserInfo On CheckInRecords.userID=UserInfo.userID JOIn Addresses ON Accounts.addressID = Addresses.addressID ORDER BY CheckInRecords.dateAdded DESC`, (err, result) => {
            if(err){
                return res.sendStatus(500);
            }
            res.send(JSON.stringify(result.recordset));
        });
    });
//   req.pool.getConnection(function(err,connection){
//     if(err){
//         res.sendStatus(500);
//         return;
//     }
//     var query = "SELECT CheckInRecords.dateAdded as time, CheckInRecords.userID as userID, concat(UserInfo.firstName,' ',UserInfo.lastName) as userName, concat(Addresses.number , ', ' , Addresses.streetName, ', ' , Addresses.city ,', ' , Addresses.stateName , ', ' , Addresses.country) as userAddress, Accounts.emailAddress as userEmail, Accounts.contact as userContact FROM CheckInRecords JOIN Accounts ON CheckInRecords.userID=Accounts.userID JOIN UserInfo On CheckInRecords.userID=UserInfo.userID JOIn Addresses ON Accounts.addressID = Addresses.addressID ORDER BY CheckInRecords.dateAdded DESC";
//     connection.query(query,function(err,rows,fields){
//         connection.release();
//       if(err){
//           res.sendStatus(500);
//           return;
//       }
//       res.send(JSON.stringify(rows));

//     });
//   });
});




router.get('/getAdminInfo',function(req,res,next){
    pool.connect().then(() => {
        var getAdminInfo = new sql.PreparedStatement(pool);
        getAdminInfo.input('userID', sql.VarChar(50));
        getAdminInfo.prepare(`SELECT AdminInfo.officialName AS officialName, Accounts.userID AS userID, Accounts.emailAddress AS emailAddress, Accounts.contact AS contact, Addresses.number AS streetNumber,  Addresses.streetName AS streetName, Addresses.city AS city, Addresses.stateName AS stateName, Addresses.country AS country FROM AdminInfo join Accounts on AdminInfo.userID = Accounts.userID  JOIN Addresses ON Accounts.addressID=Addresses.addressID WHERE Accounts.userID=@userID;`, err => {
            if(err) {
                return res.sendStatus(500);
            }
            getAdminInfo.execute({userID: req.session.userID}, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                res.send(JSON.stringify(result.recordset));
                getAdminInfo.unprepare(err => {
                    if(err) {
                        return res.sendStatus(500);
                    }
                });
            });
        });
    });
//   req.pool.getConnection(function(err,connection){
//     if(err){
//         res.sendStatus(500);
//         return;
//     }
//     var get_adminInfo="SELECT AdminInfo.officialName AS officialName, Accounts.userID AS userID, Accounts.emailAddress AS emailAddress, Accounts.contact AS contact, Addresses.number AS streetNumber,  Addresses.streetName AS streetName, Addresses.city AS city, Addresses.stateName AS stateName, Addresses.country AS country FROM AdminInfo join Accounts on AdminInfo.userID = Accounts.userID  JOIN Addresses ON Accounts.addressID=Addresses.addressID WHERE Accounts.userID=?";
//     connection.query(get_adminInfo,[req.session.userID],function(err,rows,fields){
//         connection.release();
//       if(err){
//           res.sendStatus(500);
//           return;
//       }
//       res.send(JSON.stringify(rows));

//     });
//   });
});

router.get('/uploadAdminInfo',function(req,res,next){
    pool.connect().then(() => {
        var officialName = req.query.officialName;
        var emailAddress = req.query.emailAddress;
        var contact = req.query.contact;
        var userID = req.session.userID;
        var checkEmailAddress = new sql.PreparedStatement(pool);
        checkEmailAddress.input('userID' , sql.VarChar(50));
        checkEmailAddress.input('emailAddress', sql.VarChar(100));
        checkEmailAddress.prepare(`select emailAddress from Accounts where
        emailAddress = @emailAddress and userID <> @userID;`, err => {
            if(err){
                return res.sendStatus(500);
            }
            checkEmailAddress.execute({
                userID: userID,
                emailAddress: emailAddress,
            }, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                else if(result.recordset.length != 0){
                    return res.sendStatus(404);
                }
                var updateEmailContact = new sql.PreparedStatement(pool);
                updateEmailContact.input('userID', sql.VarChar(50));
                updateEmailContact.input('emailAddress', sql.VarChar(100));
                updateEmailContact.input('contact', sql.VarChar(50));
                updateEmailContact.prepare(`update Accounts set emailAddress = @emailAddress, 
                contact = @contact where userID = @userID;`, err => {
                   if(err){
                       return res.sendStatus(500);
                   } 
                   updateEmailContact.execute({
                       userID: userID,
                       emailAddress: emailAddress,
                       contact: contact,
                   }, (err, result) => {
                    if(err){
                        return res.sendStatus(500);
                    }
                    var updateOfficialName = new sql.PreparedStatement(pool);
                    updateOfficialName.input('userID', sql.VarChar(50));
                    updateOfficialName.input('officialName', sql.VarChar(50));
                    updateOfficialName.prepare(`update AdminInfo set officialName = @officialName 
                    where userID = @userID`, err => {
                        if(err){
                            return res.sendStatus(500);
                        }
                        updateOfficialName.execute({
                            userID: userID,
                            officialName: officialName
                        }, (err, result) => {
                            if(err){
                                return res.sendStatus(500);
                            }
                            res.send(result.recordset);
                            updateOfficialName.unprepare(err => {
                                if(err){
                                    return res.sendStatus(500);
                                }
                            });
                        });
                    });
                    updateEmailContact.unprepare(err => {
                        if(err){
                            return res.sendStatus(500);
                        }
                    });
                   });
                });
                checkEmailAddress.unprepare(err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                })
            });
        });
    });
    // req.pool.getConnection(function(err,connection){
    //     if(err){
    //         res.sendStatus(500);
    //         return;
    //     }
    //     var officialName=req.query.officialName;
    //     var emailAddress=req.query.emailAddress;
    //     var contact=req.query.contact;
    //     var query1="select emailAddress from Accounts where emailAddress=? AND userID <> ? ";
    //     connection.query(query1,[emailAddress, req.session.userID],function(err,rows,fields){
    //     connection.release();
    //     if(err){
    //         res.sendStatus(500);
    //         return;
    //     }
    //     else if(rows.length!=0){
    //         res.sendStatus(501);
    //         return;
    //     }
    //     var edit_AdminInfo="UPDATE Accounts SET Accounts.emailAddress=?,Accounts.contact=? WHERE Accounts.UserID=?";
    //         connection.query(edit_AdminInfo,[emailAddress,contact,req.session.userID],function(err,rows,fields){
    //             if(err){
    //                 res.sendStatus(500);
    //                 return;
    //             }
    //             res.send(rows);
    //             var query="UPDATE AdminInfo ad join Accounts a on ad.userID=a.userID SET ad.officialName=? WHERE a.UserID=?";
    //             connection.query(query,[officialName,req.session.userID],function(err,rows,fields){
    //                 if(err){
    //                     res.sendStatus(500);
    //                     return;
    //                 }
    //                 //res.send(rows);
    //             });
    //         });
    //     });
    // });
});

router.get('/uploadAdminAddress',function(req,res,next){
    pool.connect().then(() => {
        var number = req.query.streetNumber;
        var streetName = req.query.streetName;
        var city = req.query.city;
        var stateName = req.query.state;
        var country = req.query.country;
        var userID  = req.session.userID;
        var editAdminAddress = new sql.PreparedStatement(pool);
        editAdminAddress.input('number',sql.Int);
        editAdminAddress.input('streetName',sql.VarChar(20));
        editAdminAddress.input('city', sql.VarChar(20));
        editAdminAddress.input('stateName', sql.VarChar(20));
        editAdminAddress.input('country', sql.VarChar(20));
        editAdminAddress.input('userID', sql.VarChar(50));
        editAdminAddress.prepare(`update Addresses set number = @number, streetName = @streetName,
        city = @city, stateName = @stateName, country = @country where addressID = 
        (select addressID from Accounts where userID = @userID);`, err => {
            if(err){
                return res.sendStatus(500);
            }
            editAdminAddress.execute({
                number: number,
                streetName: streetName, 
                city: city,
                stateName: stateName, 
                country: country,
                userID: userID
            }, (err, result) => {
                if(err){
                    return res.sendStatus(500);
                }
                res.send(result.recordset);
                editAdminAddress.unprepare(err => {
                    if(err){
                        return res.sendStatus(500);
                    }
                });
            });
        });
    });
    // req.pool.getConnection(function(err,connection){
    //     if(err){
    //         res.sendStatus(500);
    //         return;
    //     }
    //     var streetNumber=req.query.streetNumber;
    //     var streetName=req.query.streetName;
    //     var city=req.query.city;
    //     var state=req.query.state;
    //     var country=req.query.country;
    //     var edit_AdminAddress="UPDATE Accounts JOIN Addresses ON Accounts.addressId=Addresses.addressId SET Addresses.number=?,Addresses.streetName=?,Addresses.city=?,Addresses.stateName=?,Addresses.country=? WHERE Accounts.UserID=?";
    //     connection.query(edit_AdminAddress,[streetNumber,streetName,city,state,country,req.session.userID],function(err,rows,fields){
    //         connection.release();
    //         if(err){
    //             res.sendStatus(500);
    //             return;
    //         }
    //         res.send(rows);
    //     });
    // });
});


router.get("/getAllCheckIn", function(req, res,next){
    pool.connect().then(() => {
        pool.request().query(`select VenueInfo.checkInCode, CheckInRecords.dateAdded as dateAdded, CheckInRecords.userID as userID, CheckInRecords.latitude as latitude, CheckInRecords.longitude as longitude, VenueInfo.venueName as venue FROM CheckInRecords LEFT OUTER JOIN VenueInfo ON CheckInRecords.checkInCode = VenueInfo.checkInCode;`, (err, result) => {
            if(err){
                return res.sendStatus(500);
            }
            res.json(result.recordset);
        });
    });
//   req.pool.getConnection(function(err, connection){
//     if(err){
//       res.sendStatus(500);
//       return;
//     }
//     var query = "select VenueInfo.checkInCode, CheckInRecords.dateAdded as dateAdded, CheckInRecords.userID as userID, CheckInRecords.latitude as latitude, CheckInRecords.longitude as longitude, VenueInfo.venueName as venue FROM CheckInRecords LEFT OUTER JOIN VenueInfo ON CheckInRecords.checkInCode = VenueInfo.checkInCode";
//     connection.query(query, function(err, rows, fields){
//       connection.release();
//       if(err){
//         res.sendStatus(500);
//         return;
//       }
//       res.json(rows);
//     });
//   });
});


module.exports = router;

