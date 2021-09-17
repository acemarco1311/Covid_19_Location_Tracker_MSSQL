
// function signUp(){
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function(req, res, next){
//     if(this.readyState === 4 && this.status === 200){
//         window.location.href="/index.html";
//     }
//     };
//     xhttp.open("POST", "/signupVenue", true);
//     xhttp.setRequestHeader("Content-Type", "application/json");
// }


function getDangerous(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(req, res, next){
      if(this.readyState === 4 && this.status === 200){
        var dangerousRecords = JSON.parse(this.response);
        let index;
        for(index = 0; index < dangerousRecords.length; index++){
          let row = document.createElement("tr");
          let time = document.createElement("td");
          let latitude = document.createElement("td");
          let longitude = document.createElement("td");
          let location = document.createElement("td");
          let state = document.createElement("td");
          let country = document.createElement("td");
          let hotspotsInfo = document.createElement("td");
  
          hotspotsInfo.innerText = JSON.stringify(dangerousRecords[index].nearHotspots);
          time.innerText = new Date(dangerousRecords[index].dateAdded).toLocaleString();
          latitude.innerText = dangerousRecords[index].latitude;
          longitude.innerText = dangerousRecords[index].longitude;
          location.innerText = dangerousRecords[index].venue;
          //call api to get statename and countryname of each checkInRecord
          let apikey = 'c5cb98d5a9074db39c8354d178045edd';
          let latitude2 = dangerousRecords[index].latitude.toString();
          let longitude2 = dangerousRecords[index].longitude.toString();
  
          let api_url = 'https://api.opencagedata.com/geocode/v1/json';
  
          let request_url = api_url
              + '?'
              + 'key=' + apikey
              + '&q=' + encodeURIComponent(latitude2 + ',' + longitude2)
              + '&pretty=1'
              + '&no_annotations=1';
  
                    // see full list of required and optional parameters:
                    // https://opencagedata.com/api#forward
  
          let request = new XMLHttpRequest();
          request.open('GET', request_url, true);
  
          request.onload = function() {
                      // see full list of possible response codes:
                      // https://opencagedata.com/api#codes
  
              if (request.status === 200){
                        // Success!
              var data = JSON.parse(request.responseText);
              state.innerText = data.results[0].components.state;
              country.innerText = data.results[0].components.country;
              } else if (request.status <= 500){
              // We reached our target server, but it returned an error
  
              console.log("unable to geocode! Response code: " + request.status);
              var result = JSON.parse(request.responseText);
              console.log('error msg: ' + result.status.message);
              } else {
                  console.log("server error");
              }
          };
  
          request.onerror = function() {
          // There was a connection error of some sort
              console.log("unable to connect to server");
          };
  
          request.send();  // make the request
          row.appendChild(time);
          row.appendChild(latitude);
          row.appendChild(longitude);
          row.appendChild(location);
          row.appendChild(state);
          row.appendChild(country);
          row.appendChild(hotspotsInfo);
          document.getElementById('dangerous-records').appendChild(row);
    }
           }
      };
    xhttp.open('get', '/getDangerous', true);
    xhttp.send();
  }
  function showVenueHistory(){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(req, res, next){
          if(this.readyState === 4 && this.status === 200){
              //alert(this.responseText);
              var checkInRecords = JSON.parse(this.response);
              let index;
              for(index = 0; index<checkInRecords.length; index++){
                  let row = document.createElement("tr");
                  let time = document.createElement("td");
                  let userID = document.createElement("td");
                  let userName = document.createElement("td");
                  let userAddress = document.createElement("td");
                  let userEmail = document.createElement("td");
                  let userContact = document.createElement("td");
  
  
                  time.innerText = new Date(checkInRecords[index].time).toLocaleString();
                  userID.innerText = checkInRecords[index].userID;
                  userName.innerText = checkInRecords[index].userName;
                  userAddress.innerText = checkInRecords[index].userAddress;
                  userEmail.innerText = checkInRecords[index].userEmail;
                  userContact.innerText = checkInRecords[index].userContact;
                  row.appendChild(time);
                  row.appendChild(userID);
                  row.appendChild(userName);
                  row.appendChild(userAddress);
                  row.appendChild(userEmail);
                  row.appendChild(userContact);
                  document.getElementById("venue-records").appendChild(row);
              }
          }
      };
      xhttp.open("GET", "/venue_info", true);
      xhttp.send();
  }
  
  // Get the modal
  var button = document.getElementById('button-click-user');
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == button) {
      button.style.display = "none";
    }
  };
  
  var buttonVenue=document.getElementById('button-click-venue');
  window.onclick = function(event) {
    if (event.target == buttonVenue) {
      buttonVenue.style.display = "none";
    }
  };
  //When the user click to sign up admin
  function clickAdmin(){
      alert("Please send your information to this email a1816586@student.adelaide.edu.au in order to create an admin account");
  }
  

  
  'use strict';
  
  $(function() {
  
  
      $("input[type='password'][data-eye]").each(function(i) {
          var $this = $(this),
              id = 'eye-password-' + i,
              el = $('#' + id);
  
          $this.wrap($("<div/>", {
              style: 'position:relative',
              id: id
          }));
  
          $this.css({
              paddingRight: 60
          });
          $this.after($("<div/>", {
              html: 'Show',
              class: 'btn btn-primary btn-sm',
              id: 'passeye-toggle-'+i,
          }).css({
                  position: 'absolute',
                  right: 10,
                  top: ($this.outerHeight() / 2) - 12,
                  padding: '2px 7px',
                  fontSize: 12,
                  cursor: 'pointer',
          }));
  
          $this.after($("<input/>", {
              type: 'hidden',
              id: 'passeye-' + i
          }));
  
          var invalid_feedback = $this.parent().parent().find('.invalid-feedback');
  
          if(invalid_feedback.length) {
              $this.after(invalid_feedback.clone());
          }
  
          $this.on("keyup paste", function() {
              $("#passeye-"+i).val($(this).val());
          });
          $("#passeye-toggle-"+i).on("click", function() {
              if($this.hasClass("show")) {
                  $this.attr('type', 'password');
                  $this.removeClass("show");
                  $(this).removeClass("btn-outline-primary");
              }else{
                  $this.attr('type', 'text');
                  $this.val($("#passeye-"+i).val());
                  $this.addClass("show");
                  $(this).addClass("btn-outline-primary");
              }
          });
      });
  
      $(".login-validation").submit(function() {
          var form = $(this);
          if (form[0].checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.addClass('was-validated');
      });
  });
  
  
  window.map = undefined;
  function initMap(){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(req, res, next){
          if(this.readyState === 4 && this.status === 200){
              var hotspots = JSON.parse(this.response);
              var options = {
                  zoom: 10,
                  //always center in Adelaide
                  center: {lat: -34.9285, lng: 138.6007}
              };
              window.map = new google.maps.Map(document.getElementById("map"), options);
              let index;
              for(index = 0; index<hotspots.length; index++){
                  let hotspotCircle = new google.maps.Circle({
                      strokeColor: "#FF0000",
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: "#FF0000",
                      fillOpacity: 0.35,
                      map,
                      center: {lat: hotspots[index].latitude, lng: hotspots[index].longitude},
                      radius: Math.sqrt(hotspots[index].activeCases) * 3000,
                  });
                  let hotspotMarker = new google.maps.Marker({
                      position: {lat: hotspots[index].latitude, lng: hotspots[index].longitude},
                      map,
                      title: "Hotspot",
                      icon:"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
                  });
                  let infowindow = new google.maps.InfoWindow({
                      content: `<p>
                       <span style="font-weight: bold">Confirmed Cases</span>: ${hotspots[index].confirmedCases}
                      <br>
                       <span style="font-weight: bold"> Deaths</span>: ${hotspots[index].deaths}
                        <br>
                      <span style="font-weight: bold">Recovered Cases</span>: ${hotspots[index].recoveredCases}
                        <br>
                        <span style="font-weight: bold"> Active Cases</span>: ${hotspots[index].activeCases}
                        <br>
                          <span style="font-weight: bold"> Latitude</span>: ${hotspots[index].latitude}
                          <br>
                          <span style="font-weight: bold"> Longitude</span>: ${hotspots[index].longitude}
                          </p>`,
                  });
                  hotspotMarker.addListener("click", () => {
                          infowindow.open(map, hotspotMarker);
                  });
              }
          }
      };
      xhttp.open("GET", "/hotspots_info", true);
      xhttp.send();
  
  }
  
  
  
  window.map = undefined;
  function initMapAdmin(){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(req, res, next){
          if(this.readyState === 4 && this.status === 200){
              var hotspots = JSON.parse(this.response);
              var options = {
                  zoom: 10,
                  //always center in Adelaide
                  center: {lat: -34.9285, lng: 138.6007}
              };
              window.map = new google.maps.Map(document.getElementById("map"), options);
              let index;
              for(index = 0; index<hotspots.length; index++){
                  let hotspotCircle = new google.maps.Circle({
                      strokeColor: "#FF0000",
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: "#FF0000",
                      fillOpacity: 0.35,
                      map,
                      center: {lat: hotspots[index].latitude, lng: hotspots[index].longitude},
                      radius: Math.sqrt(hotspots[index].activeCases) * 3000,
                  });
                  let hotspotMarker = new google.maps.Marker({
                      position: {lat: hotspots[index].latitude, lng: hotspots[index].longitude},
                      map,
                      title: "Hotspot",
                      icon:"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
                  });
                  let infowindow = new google.maps.InfoWindow({
                      content: `<p>
                       <span style="font-weight: bold">Confirmed Cases</span>: ${hotspots[index].confirmedCases}
                      <br>
                       <span style="font-weight: bold"> Deaths</span>: ${hotspots[index].deaths}
                        <br>
                      <span style="font-weight: bold">Recovered Cases</span>: ${hotspots[index].recoveredCases}
                        <br>
                        <span style="font-weight: bold"> Active Cases</span>: ${hotspots[index].activeCases}
                        <br>
                          <span style="font-weight: bold"> Latitude</span>: ${hotspots[index].latitude}
                          <br>
                          <span style="font-weight: bold"> Longitude</span>: ${hotspots[index].longitude}
                          <br>
                          <button class="delete_button" onclick="deleteHotspot(${hotspots[index].latitude}, ${hotspots[index].longitude})"> Delete </button>
                          </p>`
                  });
                  hotspotMarker.addListener("click", () => {
                          infowindow.open(map, hotspotMarker);
                  });
              }
          }
      };
      xhttp.open("GET", "/hotspots_info", true);
      xhttp.send();
  
  }
  
  
  
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(check_current_location);
    }
  }
  
  function getLocationGPS(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(checkInByGPS);
    }
  }
  
  function check_current_location(position){
      const currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
      const center = new google.maps.LatLng(currentLocation);
      window.map.panTo(center);
  }
  
  function checkInByGPS(position){
  
      var checkInLocation = {latitude: position.coords.latitude, longitude: position.coords.longitude};
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(req, res, next){
          if(this.readyState === 4 && this.status === 200){
              alert("Add new record successfully, restart the page to see more information.");
              window.location.href = "/edit-history.html";
          }
          if(this.status === 500){
              alert("Error occurred, cannot add more record, sorry for the inconvenience!");
          }
      };
      xhttp.open("POST", "/checkInByGPS", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send(JSON.stringify(checkInLocation));
  }
  
  
  var testCheckInHistory = [
      { time: '13/11/2020', latitude: 99.99999, longitude: 99.999999, venue: 'ABC Bakery', state: 'New York', country: 'USA' },
      { time: '14/11/2020', latitude: 91.99999, longitude: 89.999999, venue: 'ABC Hotel', state: 'Can Tho', country: 'Vietnam' },
      { time: '15/11/2020', latitude: 92.99999, longitude: 109.999999, venue: 'ABC Cinema', state: 'Ho Chi Minh City', country: 'Vietnam' },
      { time: '16/11/2020', latitude: 92.99999, longitude: 109.999999, venue: 'ABC Restaurant', state: 'New York', country: 'USA' },
      { time: '17/11/2020', latitude: 94.99999, longitude: 89.999999, venue: 'ABC Store', state: 'New York', country: 'USA' },
  ];
  
  
  function getDangerousCheckIn(){
      var dangerousRecords =  new Vue({
         el: '#show-history',
         mounted: function(){
             this.getCheckInRecords();
         },
         data: {
             checkInRecords: [],
             dangerousRecords: [],
  
         },
         methods: {
             getCheckInRecords : function(){
                 var xhttp = new XMLHttpRequest();
                 xhttp.onreadystatechange = function(req, res, next){
                   if(this.readyState === 4 && this.status === 200){
                      var checkIn =  JSON.parse(this.response);
                      let index;
                      for(index = 0; index<checkIn.length; index++){
                          let time = new Date(checkIn[index].dateAdded).toLocaleString();
                          let venue;
                          if(!(checkIn[index].venue)){
                              let apikey = 'c5cb98d5a9074db39c8354d178045edd';
                             let latitude2 = checkIn[index].latitude.toString();
                             let longitude2 = checkIn[index].longitude.toString();
                             let api_url = 'https://api.opencagedata.com/geocode/v1/json';
                             let request_url = api_url
                              + '?'
                              + 'key=' + apikey
                              + '&q=' + encodeURIComponent(latitude2 + ',' + longitude2)
                              + '&pretty=1'
                              + '&no_annotations=1';
                             let request = new XMLHttpRequest();
                             request.open('GET', request_url, true);
                             request.onload = function() {
                                      // see full list of possible response codes:
                                      // https://opencagedata.com/api#codes
  
                              if (request.status === 200){
                                        // Success!
                              var data = JSON.parse(request.responseText);
                              venue = data.results[0].components.state;
                              let newRecord = {time: time, venue: venue};
                              dangerousRecords.checkInRecords.push(newRecord);
                              } else if (request.status <= 500){
                              // We reached our target server, but it returned an error
  
                              console.log("unable to geocode! Response code: " + request.status);
                              var result = JSON.parse(request.responseText);
                              console.log('error msg: ' + result.status.message);
                              } else {
                                  console.log("server error");
                              }
                          };
  
                          request.onerror = function() {
                          // There was a connection error of some sort
                              console.log("unable to connect to server");
                          };
  
                          request.send();  // make the request
                          }
                          else{
                              venue = checkIn[index].venue;
                              let newRecord = {time: time, venue: venue};
                              dangerousRecords.checkInRecords.push(newRecord);
                          }
                          // let newRecord = {time: time, venue: venue};
                          // dangerousRecords.checkInRecords.push(newRecord);
                      }
                   }
                 };
                 xhttp.open('get', '/users/checkInRecords', true);
                 xhttp.send();
             },
  
             getDangerous : function(event){
                 var xhttp = new XMLHttpRequest();
                 xhttp.onreadystatechange = function(req, res, next){
                     if(this.readyState === 4 && this.status === 200){
                         var temp = [];
                         var records = JSON.parse(this.response);
                         let index;
                         for(index = 0; index < records.length; index++){
                             let time = new Date(records[index].dateAdded).toLocaleString();
                             let latitude = records[index].latitude;
                             let longitude = records[index].longitude;
                             let venue = records[index].venue;
                             let state;
                             let country;
                             let nearHotspots = records[index].nearHotspots;
                             let apikey = 'c5cb98d5a9074db39c8354d178045edd';
                             let latitude2 = records[index].latitude.toString();
                             let longitude2 = records[index].longitude.toString();
                             let api_url = 'https://api.opencagedata.com/geocode/v1/json';
                             let request_url = api_url
                              + '?'
                              + 'key=' + apikey
                              + '&q=' + encodeURIComponent(latitude2 + ',' + longitude2)
                              + '&pretty=1'
                              + '&no_annotations=1';
                             let request = new XMLHttpRequest();
                             request.open('GET', request_url, true);
                             request.onload = function() {
                                      // see full list of possible response codes:
                                      // https://opencagedata.com/api#codes
  
                              if (request.status === 200){
                                        // Success!
                              var data = JSON.parse(request.responseText);
                              state = data.results[0].components.state;
                              country = data.results[0].components.country;
                              let i;
                              for(i  = 0; i<nearHotspots.length; i++){
                                  nearHotspots[i].state = state;
                                  nearHotspots[i].country = country;
                              }
                              let dangerous = {time: time, latitude: latitude, longitude: longitude, venue: venue, state: state, country: country, nearHotspots: nearHotspots};
                              temp.push(dangerous);
  
  
  
  
                              } else if (request.status <= 500){
                              // We reached our target server, but it returned an error
  
                              console.log("unable to geocode! Response code: " + request.status);
                              var result = JSON.parse(request.responseText);
                              console.log('error msg: ' + result.status.message);
                              } else {
                                  console.log("server error");
                              }
                          };
  
                          request.onerror = function() {
                          // There was a connection error of some sort
                              console.log("unable to connect to server");
                          };
  
                          request.send();  // make the request
  
                         }
                         dangerousRecords.dangerousRecords = temp;
                         if(records.length == 0){
                             alert("You have not been to any hotspot, keep staying safe by regularly check in!");
                         }
                         else{
                             alert("YOU HAVE BEEN TO A HOTSPOT, SEE THE DANGEROUS TABLE FOR MORE INFORMATION");
                          //   alert(JSON.stringify(records));
                         }
                     }
                 };
                 xhttp.open('get', '/getDangerous', true);
                 xhttp.send();
             },
             showNearHotspots : function(obj){
                var notification = ``;
                var index;
                for(index = 0; index<obj.nearHotspots.length; index++){
                    notification += `Hotspot ${index+ 1}:
                              State: ${obj.nearHotspots[index].state}
                              Country: ${obj.nearHotspots[index].country}
                              Latitude: ${obj.nearHotspots[index].latitude}
                              Longitude: ${obj.nearHotspots[index].longitude}
                              Confirmed Cases: ${obj.nearHotspots[index].confirmedCases}
                              Active Cases: ${obj.nearHotspots[index].activeCases}
                              Recorvered Cases: ${obj.nearHotspots[index].recoveredCases}
                              Deaths: ${obj.nearHotspots[index].deaths}
                              Distance hotspot to your checkin (meter): ${obj.nearHotspots[index].distance}
                                     `;
  
                }
                alert(notification);
  
             }
         }
      });
  }
  
  
  function showHistory(){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(req, res, next){
          if(this.readyState === 4 && this.status === 200){
              var checkInRecords = JSON.parse(this.response);
              let index;
              for(index = 0; index<checkInRecords.length; index++){
                  let row = document.createElement("tr");
                  let time = document.createElement("td");
                  let location = document.createElement("td");
                  time.innerText = new Date(checkInRecords[index].dateAdded).toLocaleString();
                  location.innerText = checkInRecords[index].venue;
                  row.appendChild(time);
                  row.appendChild(location);
                  document.getElementById("history").appendChild(row);
              }
          }
      };
      xhttp.open("GET", "/users/checkInRecords", true);
      xhttp.send();
  }
  
  function mapWithHistory() {
  
      var options = {
                          zoom: 10,
                          center: {lat: -34.9285, lng: 138.6007}
      };
      window.map = new google.maps.Map(document.getElementById("map"), options);
  
      var hotspots = [];
      var records = [];
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(req, res, next){
          if(this.readyState === 4 && this.status === 200){
              hotspots = JSON.parse(this.response);
              for(let index = 0; index<hotspots.length; index++){
                  let hotspotsCircle = new google.maps.Circle({
                      strokeColor: "#FF0000",
                      strokeOpacity: 0.8,
                      stokeWeight: 2,
                      fillColor: "#FF0000",
                      fillOpacity: 0.5,
                      map,
                      center: {lat: hotspots[index].latitude, lng: hotspots[index].longitude},
                      radius: Math.sqrt(hotspots[index].activeCases) * 3000,
                  });
                  let hotspotMarker = new google.maps.Marker({
                      position: {lat: hotspots[index].latitude, lng: hotspots[index].longitude},
                      map,
                      title: "Hotspot",
                      icon:"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
                  });
                  let infowindow = new google.maps.InfoWindow({
                      content: `<p>
                      <span style="font-weight: bold">Confirmed Cases</span>: ${hotspots[index].confirmedCases}
                      <br>
                      <span style="font-weight: bold"> Deaths</span>: ${hotspots[index].deaths}
                      <br>
                      <span style="font-weight: bold">Recovered Cases</span>: ${hotspots[index].recoveredCases}
                      <br>
                      <span style="font-weight: bold"> Active Cases</span>: ${hotspots[index].activeCases}
                      </p>`,
                  });
                  hotspotMarker.addListener("click", () => {
                      infowindow.open(map, hotspotMarker);
                  });
              }
          }
      };
      xhttp.open("get", "/hotspots_info",true);
      xhttp.send();
      var xml = new XMLHttpRequest();
      xml.onreadystatechange = function(req, res, next){
          if(this.readyState === 4 && this.status === 200){
              var records = JSON.parse(this.response);
              for(let i = 0; i<records.length; i++){
                  let checkInMarker = new google.maps.Marker({
                      position: {lat: records[i].latitude, lng: records[i].longitude},
                      map,
                      title: "You have been here",
                      icon: {
                          url: "/images/marker.png",
                          scaledSize: new google.maps.Size(25,25)
                      }
                  });
              }
          }
      };
      xml.open("get", "/users/checkInRecords", true);
      xml.send();
  }
  
  // function getDangerous(){
  //     // var hotspots = [];
  //     // var checkInRecords = [];
  //     // var dangerousRecords = [];
  //     // var xhttp = new XMLHttpRequest();
  //     // xhttp.onreadystatechange = function(req, res, next){
  //     //     if(this.readyState === 4 && this.status === 200){
  //     //         hotspots = JSON.parse(this.response);
  //     //         var xml = new XMLHttpRequest();
  //     //         xml.onreadystatechange = function(req, res, next){
  //     //           if(this.readyState === 4 && this.status === 200){
  //     //               checkInRecords = JSON.parse(this.response);
  //     //               let hotspotsIndex;
  //     //               let checkInRecordsIndex;
  //     //               for(checkInRecordsIndex = 0; checkInRecordsIndex < checkInRecords.length; checkInRecordsIndex++){
  //     //                   for(hotspotsIndex = 0; hotspotsIndex < hotspots.length; hotspotIndex++){
  //     //                       let checkDistance = new XMLHttpRequest();
  
  //     //                   }
  //     //               }
  //     //           }
  //     //         };
  //     //         xml.open('get', '/users/checkInRecords', true);
  //     //         xml.send();
  //     //     }
  //     // };
  //     // xhttp.open('get', '/hotspots_info', true);
  //     // xhttp.send();
  
  // }
  
  
  function testHaversine(){
        const start = {
    latitude: 30.849635,
    longitude: -83.24559
    };
  
  const end = {
    latitude: 27.950575,
    longitude: -82.457178
    };
    alert(haversine(start, end).toString());
  }
  
  

  
  function checkIn(){
      var code = document.getElementById("code").value;
      if(code.length != 6 || code.match(/^[0-9]+$/) === null){
          alert("Invalid check-in code, must be 6 digits");
      }
      else{
      let check_in_code = {check_in_code: code};
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(req, res, next){
          if(this.readyState === 4 && this.status === 200){
              // vueCheckInHistory.checkIn.push(this.response);
              alert("Check in successfully");
              window.location.href = "/edit-history.html";
          }
          if(this.readyState === 4 && this.status === 404){
              alert("Cannot find any venue with the given check-in code");
          }
      };
      xhttp.open("POST", "/users/addCheckInRecord", true);
      xhttp.setRequestHeader("Content-Type","application/json");
      xhttp.send(JSON.stringify(check_in_code));
      }
  }
  

  
  function showFullCheckInHistory(){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(req, res, next){
          if(this.readyState === 4 && this.status === 200){
              var checkInRecords = JSON.parse(this.response);
              let index;
              for(index = 0; index<checkInRecords.length; index++){
                  let row = document.createElement("tr");
                  let latitude = document.createElement("td");
                  let longitude = document.createElement("td");
                  let checkInCode = document.createElement("td");
                  let state = document.createElement("td");
                  let country = document.createElement("td");
                  let time = document.createElement("td");
                  let location = document.createElement("td");
                    let apikey = 'c5cb98d5a9074db39c8354d178045edd';
                    let latitude2 = checkInRecords[index].latitude.toString();
                    let longitude2 = checkInRecords[index].longitude.toString();
  
                    let api_url = 'https://api.opencagedata.com/geocode/v1/json';
  
                    let request_url = api_url
                      + '?'
                      + 'key=' + apikey
                      + '&q=' + encodeURIComponent(latitude2 + ',' + longitude2)
                      + '&pretty=1'
                      + '&no_annotations=1';
  
                    // see full list of required and optional parameters:
                    // https://opencagedata.com/api#forward
  
                    let request = new XMLHttpRequest();
                    request.open('GET', request_url, true);
  
                    request.onload = function() {
                      // see full list of possible response codes:
                      // https://opencagedata.com/api#codes
  
                      if (request.status === 200){
                        // Success!
                        var data = JSON.parse(request.responseText);
                        state.innerText = data.results[0].components.state;
                        country.innerText = data.results[0].components.country;
                      } else if (request.status <= 500){
                        // We reached our target server, but it returned an error
  
                        console.log("unable to geocode! Response code: " + request.status);
                        var result = JSON.parse(request.responseText);
                        console.log('error msg: ' + result.status.message);
                      } else {
                        console.log("server error");
                      }
                    };
  
                    request.onerror = function() {
                      // There was a connection error of some sort
                      console.log("unable to connect to server");
                    };
  
                    request.send();  // make the request
                  latitude.innerText = checkInRecords[index].latitude;
                  longitude.innerText = checkInRecords[index].longitude;
                  checkInCode.innerText = checkInRecords[index].checkInCode;
                  time.innerText = new Date(checkInRecords[index].dateAdded).toLocaleString();
                  location.innerText = checkInRecords[index].venue;
                  row.appendChild(time);
                  row.appendChild(latitude);
                  row.appendChild(longitude);
                  row.appendChild(location);
                  row.appendChild(state);
                  row.appendChild(country);
                  row.appendChild(checkInCode);
                  document.getElementById("full_history").appendChild(row);
              }
          }
      };
      xhttp.open("GET", "/users/checkInRecords", true);
      xhttp.send();
  }
  
  
  function checkStateCountry(latitude, longitude){
    var apikey = 'c5cb98d5a9074db39c8354d178045edd';
    var api_url = 'https://api.opencagedata.com/geocode/v1/json';
    var request_url = api_url
      + '?'
      + 'key=' + apikey
      + '&q=' + encodeURIComponent(latitude + ',' + longitude)
      + '&pretty=1'
      + '&no_annotations=1';
  
    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward
  
    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);
  
    request.onload = function() {
      // see full list of possible response codes:
      // https://opencagedata.com/api#codes
  
      if (request.status === 200){
        // Success!
        var data = JSON.parse(request.responseText);
        let state;
        let country;
        state = data.results[0].components.state;
        country = data.results[0].components.country;
        let stateCountry = {state: state, country: country};
        return stateCountry;
  
      } else if (request.status <= 500){
        // We reached our target server, but it returned an error
  
        console.log("unable to geocode! Response code: " + request.status);
        var result = JSON.parse(request.responseText);
        console.log('error msg: ' + result.status.message);
      } else {
        console.log("server error");
      }
    };
  
    request.onerror = function() {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };
  
    request.send();  // make the request
  }
  
  function onSignIn(googleUser) {
      var id_token = {token: googleUser.getAuthResponse().id_token};
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
          if(this.readyState === 4 && this.status === 200){
              let result = JSON.parse(this.response);
              let accountType = result.accountType;
              if(accountType === 0){
                  window.location.href = '/user-home-page.html';
              }
              else if(accountType === 1){
                  window.location.href = '/venue-home-page.html';
              }
              else if(accountType === 2){
                  window.location.href = '/admin-home-page.html';
              }
          }
      };
      xhr.open('POST', '/loginGoogle', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(id_token));
  }
  
  function logout(){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(){
          if(this.readyState === 4 && this.status === 200){
              try{
                  gapi.auth2.getAuthInstance().signOut().finally(function(){
                        window.location.href='/index.html';
                    });
              } catch (e) {
                  window.location.href='/index.html';
              }
          }
      };
      xhttp.open("POST", "/logout", true);
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send();
  }
  
  
  // const paragraph=document.getElementById("edit-account");
  // const edit_button = document.getElementById("edit-button");
  // const end_button = document.getElementById("end-editing");
  
  // end_button.addEventListener("click", function() {
  // 	paragraph.contentEditable = true;
  // 	paragraph.style.backgroundColor = "#dddbdb";
  //   } );
  
  // edit-button.addEventListener("click", function() {
  // 	paragraph.contentEditable = false;
  // 	paragraph.style.backgroundColor = "#ffe44d";
  //   } );
  
  function check_admin_account(){
      var none_admin_div=document.getElementById("none_admin");
      var info_card_div=document.getElementById("info-card");
      //alert("Non-authorized");
      var xhttp = new XMLHttpRequest();
       xhttp.onreadystatechange=function(){
           if(this.readyState==4&&this.status==200){
              var accountType = JSON.parse(this.response)[0].accountType;
              //console.log(accountType);
              if(accountType!==2){
                  alert("Non-authorized");
                  none_admin_div.setAttribute('style',"display:block");
                  info_card_div.setAttribute('style',"display:none");
              }
           }
       };
        xhttp.open("get","/users/getAccountType ",true);
        xhttp.send();
  
  }
  
  function password_toggle(){
      var p_input=document.getElementById("Password");
      if (p_input.type === "password") {
          p_input.type = "text";
      }
      else {
          p_input.type = "password";
      }
  }
  function success_sign_up(){
      var policy=document.getElementById("policy").checked;
      if(policy==false){
          alert("Please accept the private policy before move on!");
      }
      else{
      var info_card=document.getElementById("info-card");
      var h1=document.getElementById("h1");
      var s_div=document.getElementById("success");
      var user_id = document.getElementById("UserID").value;
      var stateName=document.getElementById("stateName").value;
      var email_address = document.getElementById("EmailAddress").value;
      var official_name = document.getElementById("OfficialName").value;
      var password = document.getElementById("Password").value;
      var address_No = document.getElementById("AddressNo").value;
      var city_Name = document.getElementById("CityName").value;
      var street = document.getElementById("Street").value;
      var country = document.getElementById("Country").value;
      var contact = document.getElementById("Contact").value;
      var xhttp=new XMLHttpRequest();
      xhttp.onreadystatechange=function(){
          if(this.readyState==4&&this.status==200){
              h1.setAttribute('style',"display:none");
              info_card.setAttribute('style',"display:none");
              s_div.setAttribute('style',"display:block");
              alert("Sign up successfully!");
              window.location.href = "/admin-home-page.html";
          }
          else if(this.status==500){
              alert("Invaild Input! ");
          }
          else if(this.status==401){
              alert("UserID existed in the server! Change another one instead!");
          }
          else if(this.status==402){
              alert("Email Address existed in the server! Change another one instead!");
          }
          else if(this.status>500){
              alert("Invaild Input or insufficient information are provided!!");
          }
      };
      xhttp.open("post","/users/admin_sign_up",true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify({ user_id: user_id, email_address: email_address,
                                  official_name: official_name,password:password,
                                  address_No:address_No,city_Name:city_Name,
                                  street:street,country:country,stateName:stateName,contact:contact}));
      }
  }

  function showUserHistory(){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(req, res, next){
          if(this.readyState === 4 && this.status === 200){
              var checkInRecords = JSON.parse(this.response);
              let index;
              for(index = 0; index<checkInRecords.length; index++){
                  let row = document.createElement("tr");
                  let userID = document.createElement("td");
                  let latitude = document.createElement("td");
                  let longitude = document.createElement("td");
                  let checkInCode = document.createElement("td");
                  let state = document.createElement("td");
                  let country = document.createElement("td");
                  let time = document.createElement("td");
                  let location = document.createElement("td");
                    let apikey = 'c5cb98d5a9074db39c8354d178045edd';
                    let latitude2 = checkInRecords[index].latitude.toString();
                    let longitude2 = checkInRecords[index].longitude.toString();
  
                    let api_url = 'https://api.opencagedata.com/geocode/v1/json';
  
                    let request_url = api_url
                      + '?'
                      + 'key=' + apikey
                      + '&q=' + encodeURIComponent(latitude2 + ',' + longitude2)
                      + '&pretty=1'
                      + '&no_annotations=1';
  
                    // see full list of required and optional parameters:
                    // https://opencagedata.com/api#forward
  
                    let request = new XMLHttpRequest();
                    request.open('GET', request_url, true);
  
                    request.onload = function() {
                      // see full list of possible response codes:
                      // https://opencagedata.com/api#codes
  
                      if (request.status === 200){
                        // Success!
                        var data = JSON.parse(request.responseText);
                        console.log(data);
                        state.innerText = data.results[0].components.state;
                        country.innerText = data.results[0].components.country;
                      } else if (request.status <= 500){
                        // We reached our target server, but it returned an error
  
                        console.log("unable to geocode! Response code: " + request.status);
                        var result = JSON.parse(request.responseText);
                        console.log('error msg: ' + result.status.message);
                      } else {
                        console.log("server error");
                      }
                    };
  
                    request.onerror = function() {
                      // There was a connection error of some sort
                      console.log("unable to connect to server");
                    };
  
                    request.send();  // make the request
                  latitude.innerText = checkInRecords[index].latitude;
                  longitude.innerText = checkInRecords[index].longitude;
                  checkInCode.innerText = checkInRecords[index].checkInCode;
                  time.innerText = new Date(checkInRecords[index].dateAdded).toLocaleString();
                  location.innerText = checkInRecords[index].venue;
                  userID.innerText = checkInRecords[index].userID;
                  row.appendChild(time);
                  row.appendChild(userID);
                  row.appendChild(location);
                  row.appendChild(latitude);
                  row.appendChild(longitude);
                  row.appendChild(checkInCode);
                  row.appendChild(state);
                  row.appendChild(country);
                  document.getElementById("user-records").appendChild(row);
              }
          }
      };
      xhttp.open("GET", "/users/getAllCheckIn", true);
      xhttp.send();
  }
  function getUserName(){
      var xhttp=new XMLHttpRequest();
      var userName=document.getElementById("header");
  
      xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
              var UserInfo=JSON.parse(this.response);
              userName.innerText="Welcome to our website, "+UserInfo[0].userID+"!";
          }
      };
      xhttp.open('GET','/users/getUserName',true);
      xhttp.send();
  }
  
  
  
  window.onload=showUserInfo();
  function showUserInfo(){
      var xhttp=new XMLHttpRequest();
  
      xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
              var UserInfo=JSON.parse(this.response);
              for(var index=0;index<UserInfo.length;index++){
                  $("#edit-firstName").attr("value",UserInfo[index].firstName);
                  $("#edit-lastName").attr("value",UserInfo[index].lastName);
                  $("#edit-email").attr("value",UserInfo[index].emailAddress);
                  $("#edit-streetNumber").attr("value",UserInfo[index].streetNumber);
                  $("#edit-streetName").attr("value",UserInfo[index].streetName);
                  $("#edit-city").attr("value",UserInfo[index].city);
                  $("#edit-state").attr("value",UserInfo[index].stateName);
                  $("#edit-country").attr("value",UserInfo[index].country);
                  $("#edit-contact").attr("value",UserInfo[index].contact);
               }
               showUserHistory();
          }
      };
      xhttp.open('GET','/users/getUserInfo',true);
      xhttp.send();
  }
  
  window.onload=admin_showUserInfo();
  function admin_showUserInfo(){
      var xhttp=new XMLHttpRequest();
  
      xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
              var UserInfo=JSON.parse(this.response);
              for(var index=0;index<UserInfo.length;index++){
                  $("#edit-email").attr("value",UserInfo[index].emailAddress);
                  $("#edit-streetNumber").attr("value",UserInfo[index].streetNumber);
                  $("#edit-streetName").attr("value",UserInfo[index].streetName);
                  $("#edit-city").attr("value",UserInfo[index].city);
                  $("#edit-state").attr("value",UserInfo[index].stateName);
                  $("#edit-country").attr("value",UserInfo[index].country);
                  $("#edit-contact").attr("value",UserInfo[index].contact);
  
               }
  
          }
      };
      xhttp.open('GET','/users/admin-getUserInfo',true);
      xhttp.send();
  }

  
  window.onload=editUserInfo();
  function editUserInfo(){
      var xhttp=new XMLHttpRequest();
  
      var first_name=document.getElementById("edit-firstName");
      var last_name=document.getElementById("edit-lastName");
      var email=document.getElementById("edit-email");
      var streetName=document.getElementById("edit-streetName");
      var streetNumber=document.getElementById("edit-streetNumber");
      var city=document.getElementById("edit-city");
      var state=document.getElementById("edit-state");
      var country=document.getElementById("edit-country");
      var contact=document.getElementById("edit-contact");
  
      xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
              var UserInfo=JSON.parse(this.response);
              for(var index=0;index<UserInfo.length;index++){
                      first_name.innerText=UserInfo[index].firstName;
                      last_name.innerText=UserInfo[index].lastName;
                      email.innerText=UserInfo[index].emailAddress;
                      contact.innerText=UserInfo[index].contact;
  
                      streetNumber.innerText=UserInfo[index].streetNumber;
                      streetName.innerText=UserInfo[index].streetName;
                      city.innerText=UserInfo[index].city;
                      state.innerText=UserInfo[index].stateName;
                      country.innerText=UserInfo[index].country;
               }
          }
      };
      xhttp.open('GET','/users/getUserInfo',true);
      xhttp.send();
  }
  
  function uploadUserInfo(){
      var xhttp=new XMLHttpRequest();
  
      var first_name=document.getElementById("edit-firstName").value;
      var last_name=document.getElementById("edit-lastName").value;
      var email=document.getElementById("edit-email").value;
      var contact=document.getElementById("edit-contact").value;
  
      xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
              window.location.href="/manage-account.html";
              //   var error=JSON.parse(this.response);
              //   if(error=="duplicate"){
              //       console.log("email is existed");
              //       location.replace("/edit-account-userInfo.html");
              //   }
          }
      };
      xhttp.open('GET','/users/uploadUserInfo?firstName='+first_name+"&lastName="+last_name+"&email="+email+"&contact="+contact,true);
      xhttp.send();
  }
  
  
  function uploadAddress(){
      var xhttp= new XMLHttpRequest();
      var streetName=document.getElementById("edit-streetName").value;
      var streetNumber=document.getElementById("edit-streetNumber").value;
      var city=document.getElementById("edit-city").value;
      var state=document.getElementById("edit-state").value;
      var country=document.getElementById("edit-country").value;
  
      xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
              window.location.href="/manage-account.html";
          }
      };
      xhttp.open('GET','/users/uploadAddress?streetName='+streetName+"&streetNumber="+streetNumber+"&city="+city+"&state="+state+"&country="+country,true);
      xhttp.send();
  }
  function admin_create_hotspot(){
      var latitude = document.getElementById("latitude").value;
      var longitude = document.getElementById("longitude").value;
      var dateAdded = document.getElementById("dateAdded").value;
      var confirmedCases = document.getElementById("confirmedCases").value;
      var deaths = document.getElementById("deaths").value;
      var recoveredCases = document.getElementById("recoveredCases").value;
      var activeCases = document.getElementById("activeCases").value;
      var record = {
          latitude: latitude,
          longitude: longitude,
          dateAdded: dateAdded,
          confirmedCases: confirmedCases,
          deaths: deaths,
          recoveredCases: recoveredCases,
          activeCases: activeCases,
      }
      var xhttp=new XMLHttpRequest();
      xhttp.onreadystatechange=function(){
          if(this.readyState==4&&this.status==200){
              // var create_div=document.getElementById("create");
              // var response_div=document.getElementById("sucess_response");
              // create_div.setAttribute('style',"display:none");
              // response_div.setAttribute('style',"display:block");
              // document.getElementById("latitude").valueOf("");
              $("#latitude").val("");$("#confirmedCases").val("");
              $("#longitude").val("");$("#deaths").val("");
              $("#dateAdded").val("");$("#recoveredCases").val("");
              $("#activeCases").val("");
              alert("Hotspot added successfully!");
              window.onload(initMapAdmin());
          }
          else if(this.status==500){
              alert("Invalid Input! Please enter the correct format(7 decimal) of the longitude and latidude!");
          }
      };
      xhttp.open("post","/users/admin_create_hotspot",true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(record));
  }
  
  window.onload=showVenueUserInfo();
  
  function showVenueUserInfo(){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
              var VenueUserInfo=JSON.parse(this.response);
  
              for(var index=0;index<VenueUserInfo.length;index++){
                  $("#edit-venueName").attr("value",VenueUserInfo[index].venueName);
                  $("#edit-contactNo").attr("value",VenueUserInfo[index].contact);
                  $("#edit-emailAddress").attr("value",VenueUserInfo[index].emailAddress);
                  $("#edit-streetNumber").attr("value",VenueUserInfo[index].streetNumber);
                  $("#edit-streetName").attr("value",VenueUserInfo[index].streetName);
                  $("#edit-city").attr("value",VenueUserInfo[index].city);
                  $("#edit-state").attr("value",VenueUserInfo[index].stateName);
                  $("#edit-country").attr("value",VenueUserInfo[index].country);
  
  
               }
          }
      };
      xhttp.open('GET','/users/getVenueUserInfo',true);
      xhttp.send();
  }
  
  
  function uploadVenueUserInfo(){
       var venueName=document.getElementById("edit-venueName").value;
       var emailAddress=document.getElementById("edit-emailAddress").value;
       var contact=document.getElementById("edit-contactNo").value;
       var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
              window.location.href="/venue-manage.html";
          }
  };
     xhttp.open('POST', "/users/uploadVenueUserInfo", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ venueName:venueName, emailAddress:emailAddress, contact:contact}));
  }
  
  
  function uploadVenueAddress(){
      var streetNumber=document.getElementById("edit-streetNumber").value;
      var streetName=document.getElementById("edit-streetName").value;
      var city=document.getElementById("edit-city").value;
      var state=document.getElementById("edit-state").value;
      var country=document.getElementById("edit-country").value;
      var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
              window.location.href="/venue-manage.html";
          }
  };
            xhttp.open('POST', "/users/uploadVenueAddress", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ streetNumber:streetNumber, streetName:streetName, city:city, state:state, country:country}));
  }

  

  
  
  window.onload=editVenueUserInfo();
  function editVenueUserInfo(){
      var xhttp=new XMLHttpRequest();
  
      var venueName=document.getElementById("edit-venueName");
      var contact=document.getElementById("edit-contactNo");
      var emailAddress=document.getElementById("edit-emailAddress");
      var streetName=document.getElementById("edit-streetName");
      var streetNumber=document.getElementById("edit-streetNumber");
      var city=document.getElementById("edit-city");
      var state=document.getElementById("edit-state");
      var country=document.getElementById("edit-country");
  
  
  
      xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
              var UserInfo=JSON.parse(this.response);
              for(var index=0;index<UserInfo.length;index++){
                      venueName.innerText=UserInfo[index].venueName;
                      emailAddress.innerText=UserInfo[index].emailAddress;
                      contact.innerText=UserInfo[index].contact;
                      streetNumber.innerText=UserInfo[index].streetNumber;
                      streetName.innerText=UserInfo[index].streetName;
                      city.innerText=UserInfo[index].city;
                      state.innerText=UserInfo[index].stateName;
                      country.innerText=UserInfo[index].country;
               }
          }
      };
      xhttp.open('GET','/users/getVenueUserInfo',true);
      xhttp.send();
  }
  
  
  function toggle(){
      var password=document.getElementById("edit-password");
      if(password.type=== "password"){
          password.type="text";
      }else{
          password.type="password";
      }
  }
  function setPassword(){
      var show=document.getElementById("change-password");
      var hideButton=document.getElementById("change-password-button");
      if(show.style.display=="none"){
          show.style.display="";
          hideButton.style.display="none";
      }
      else{
          show.style.display="none";
          hideButton.style.display="";
      }
  }
  
  function uploadPassword(){
      var newPassword=document.getElementById("edit-password").value;
      var repeatNewPassword=document.getElementById("edit-repeat-password").value;
  
      if(newPassword==repeatNewPassword && newPassword.length>3){
          var xhttp=new XMLHttpRequest();
  
          xhttp.onreadystatechange=function(){
              if(this.readyState==4 && this.status==200){
                  location.replace("/");
                  alert("Change successfully");
              }
          };
          xhttp.open('GET','/users/uploadPassword?password='+repeatNewPassword,true);
          xhttp.send();
      }
      else{
           alert("password must be same and large than 3");
      }
  }

  function adminGetVenueInfo(){
      var ajaxObj = new XMLHttpRequest();
      ajaxObj.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
  
              var info=JSON.parse(this.response);
              for(var i=0;i<info.length;i++){
                  var VenueInfo=document.getElementById('VenueInfo');
                  var tr=document.createElement('tr');
                  var number=document.createElement('td');
                  var venueID=document.createElement('td');
                  var venueName=document.createElement('td');
                  var venueAddress=document.createElement('td');
                  var venueEmail=document.createElement('td');
                  var venueContact=document.createElement('td');
  
                  var editButton=document.createElement('button');
                  editButton.setAttribute("type","button");
                  editButton.setAttribute("class","user-button user-button-edit");
                  editButton.setAttribute("style","margin-left:10px;margin-top:12px");
                  // editButton.setAttribute("style","margin-left:10px");
                  editButton.setAttribute("id",(i+1));
                  // editButton.setAttribute("onclick","editInfo(this.id)");
                  editButton.setAttribute("onclick","banVenueAccount(this.id)");
                  tr.setAttribute("id","venue-"+(i+1));
                  number.setAttribute("id","venueNumber-"+(i+1));
                  venueID.setAttribute("id","venueID-"+(i+1));
  
                  venueName.setAttribute("id","venueName-"+(i+1));
                  venueAddress.setAttribute("id","venueAddress-"+(i+1));
                  venueEmail.setAttribute("id","venueEmail-"+(i+1));
                  venueContact.setAttribute("id","venueContact-"+(i+1));
  
                  VenueInfo.appendChild(tr);
                  tr.appendChild(number);
                  tr.appendChild(venueID);
                  tr.appendChild(venueName);
                  tr.appendChild(venueAddress);
                  tr.appendChild(venueEmail);
                  tr.appendChild(venueContact);
  
                  tr.appendChild(editButton);
  
  
                  number.innerText=i+1;
                  venueID.innerText=info[i].venueID;
                  venueName.innerText=info[i].venueName;
                  venueAddress.innerText=info[i].streetNumber+", "+info[i].streetName+", "+info[i].city+", "+info[i].stateName+", "+info[i].country;
                  venueEmail.innerText=info[i].emailAddress;
                  venueContact.innerText=info[i].contact;
  
                  editButton.innerText="ban";
  
  
  
              }
              adminGetUserInfo();
          }
      };
      ajaxObj.open('GET', '/users/admin-getVenueInfo',true);
      ajaxObj.send();
  }
  
  
  function adminGetUserInfo(){
      var ajaxObj = new XMLHttpRequest();
      ajaxObj.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
  
              var info=JSON.parse(this.response);
              for(var i=0;i<info.length;i++){
                  var UserInfo=document.getElementById('UserInfo');
                  var tr=document.createElement('tr');
                  var number=document.createElement('td');
                  var userID=document.createElement('td');
                  var userName=document.createElement('td');
                  var userAddress=document.createElement('td');
                  var userEmail=document.createElement('td');
                  var userContact=document.createElement('td');
  
                  var editButton=document.createElement('button');
                  editButton.setAttribute("type","button");
                  editButton.setAttribute("class","user-button user-button-edit");
                  editButton.setAttribute("style","margin-left:10px;margin-top:12px");
                  // editButton.setAttribute("style","margin-left:10px");
                  editButton.setAttribute("id",(i+1));
                  // editButton.setAttribute("onclick","editInfo(this.id)");
                  editButton.setAttribute("onclick","banUserAccount(this.id)");
                  tr.setAttribute("id","venue-"+(i+1));
                  number.setAttribute("id","venueNumber-"+(i+1));
                  userID.setAttribute("id","venueID-"+(i+1));
  
                  userName.setAttribute("id","venueName-"+(i+1));
                  userAddress.setAttribute("id","venueAddress-"+(i+1));
                  userEmail.setAttribute("id","venueEmail-"+(i+1));
                  userContact.setAttribute("id","venueContact-"+(i+1));
  
                  UserInfo.appendChild(tr);
                  tr.appendChild(number);
                  tr.appendChild(userID);
                  tr.appendChild(userName);
                  tr.appendChild(userAddress);
                  tr.appendChild(userEmail);
                  tr.appendChild(userContact);
                  tr.appendChild(editButton);
  
                  number.innerText=i+1;
                  userID.innerText=info[i].userID;
                  userName.innerText=info[i].firstName+' '+info[i].lastName;
                  userAddress.innerText=info[i].streetNumber+", "+info[i].streetName+", "+info[i].city+", "+info[i].stateName+", "+info[i].country;
                  userEmail.innerText=info[i].emailAddress;
                  userContact.innerText=info[i].contact;
  
                  editButton.innerText="ban";
              }
          }
      };
      ajaxObj.open('GET', '/users/admin-getUserInfo',true);
      ajaxObj.send();
  }
  
  function banVenueAccount(clicked_id){
      var xhttp=new XMLHttpRequest();
      xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
              var info=JSON.parse(this.response);
              if(confirm("Are you sure you want to ban users with ID "+'"'+info[clicked_id-1].venueID+'" ?')){
                  alert("Delete successful.");
                  xhttp.onreadystatechange=function(){
                      if(this.readyState==4 && this.status==200){
                          var info=JSON.parse(this.response);
                          location.replace("/manage-venue-and-user.html");
  
                      }
                  };
                  xhttp.open('GET','/users/delete-account?venueID='+info[clicked_id-1].venueID,true);
                  xhttp.send();
              }
          }
      };
      xhttp.open('GET', '/users/admin-getVenueInfo',true);
      xhttp.send();
  }
  
  function banUserAccount(clicked_id){
      var xhttp=new XMLHttpRequest();
      xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
              var info=JSON.parse(this.response);
              if(confirm("Are you sure you want to ban users with ID "+'"'+info[clicked_id-1].userID+'" ?')){
                  alert("Delete successful.");
                  xhttp.onreadystatechange=function(){
                      if(this.readyState==4 && this.status==200){
                          var info=JSON.parse(this.response);
                          location.replace("/manage-venue-and-user.html");
                      }
                  };
                  xhttp.open('GET','/users/delete-account?venueID='+info[clicked_id-1].userID,true);
                  xhttp.send();
              }
          }
      };
      xhttp.open('GET', '/users/admin-getUserInfo',true);
      xhttp.send();
  }
  window.onload=getAdminInfo();
  function getAdminInfo(){
      var xhttp=new XMLHttpRequest();
      var userID=document.getElementById("edit-userID");
      var email=document.getElementById("edit-email");
      var contact=document.getElementById("edit-contact");
      var officialName=document.getElementById("edit-officialName");
      var streetName=document.getElementById("edit-streetName");
      var streetNumber=document.getElementById("edit-streetNumber");
      var city=document.getElementById("edit-city");
      var state=document.getElementById("edit-state");
      var country=document.getElementById("edit-country");
  
      xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
              var UserInfo=JSON.parse(this.response);
              for(var index=0;index<UserInfo.length;index++){
                      email.innerText=UserInfo[index].emailAddress;
                      contact.innerText=UserInfo[index].contact;
                      officialName.innerText=UserInfo[index].officialName;
                      userID.innerText=UserInfo[index].userID;
                      streetNumber.innerText=UserInfo[index].streetNumber;
                      streetName.innerText=UserInfo[index].streetName;
                      city.innerText=UserInfo[index].city;
                      state.innerText=UserInfo[index].stateName;
                      country.innerText=UserInfo[index].country;
               }
          }
      };
      xhttp.open('GET','/users/getAdminInfo',true);
      xhttp.send();
  }
  // window.onload=showAdminuserInfo();
  // function showAdminUserInfo(){
  //     var xhttp = new XMLHttpRequest();
  //     xhttp.onreadystatechange=function(){
  //         if(this.readyState==4 && this.status==200){
  //             var AdminInfo=JSON.parse(this.response);
  
  //             for(var index=0;index<AdminInfo.length;index++){
  //                 $('$edit-officialName').attr("value",AdminInfo[index].officialName);
  //                 $("#edit-contact").attr("value",AdminInfo[index].contact);
  //                 $("#edit-email").attr("value",AdminInfo[index].emailAddress);
  //                 $('#edit-streetNumber').attr("value",AdminInfo[index].streetNumber);
  //                 $('#edit-streetName').attr("value",AdminInfo[index].streetName);
  //                 $('#edit-city').attr("value",AdminInfo[index].city);
  //                 $('#edit-state').attr("value",AdminInfo[index].stateName);
  //                 $('#edit-country').attr("value",AdminInfo[index].country);
  //              }
  //         }
  //     };
  //     xhttp.open('GET','/users/getAdminInfo',true);
  //     xhttp.send();
  // }
  
  
  function uploadAdminInfo(){
      var xhttp=new XMLHttpRequest();
       var contact=document.getElementById("edit-contact").value;
       var email=document.getElementById("edit-email").value;
       var officialName=document.getElementById("edit-officialName").value;
      xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
                window.location.href="/admin-manage-account.html";
          }
          else if(this.status==501){
              alert("Email existed, change another one!");
          }
      };
      xhttp.open('GET','/users/uploadAdminInfo?officialName='+officialName+"&contact="+contact+"&emailAddress="+email,true);
      xhttp.send();
  }
  
  function uploadAdminAddress(){
      var xhttp= new XMLHttpRequest();
  
      var streetName=document.getElementById("edit-streetName").value;
      var streetNumber=document.getElementById("edit-streetNumber").value;
      var city=document.getElementById("edit-city").value;
      var state=document.getElementById("edit-state").value;
      var country=document.getElementById("edit-country").value;
  
      xhttp.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
                window.location.href="/admin-manage-account.html";
          }
      };
      xhttp.open('GET','/users/uploadAdminAddress?streetName='+streetName+"&streetNumber="+streetNumber+"&city="+city+"&state="+state+"&country="+country,true);
      xhttp.send();
  }
  
  function deleteHotspot(latitude, longitude){
  
      var hotspot = {latitude: latitude, longitude: longitude};
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(req, res, next){
          if(this.readyState === 4 && this.status === 200){
              alert("Delete successfully");
              // window.location.href = "/admin-manage-hotspot.html";
              window.onload(initMapAdmin());
          }
      };
      xhttp.open("POST", "/deleteHotspot", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send(JSON.stringify(hotspot));
  }
  