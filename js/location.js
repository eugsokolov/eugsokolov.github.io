function recordCoordinates(data) {
  if (validateHuman(data.honeypot)) {  //if form is filled, form will not be submitted
    return false;
  }

  data.formDataNameOrder = JSON.stringify(['lat', 'long']);
  data.formGoogleSheetName = "locations"; // default sheet name

  function something() {}
  console.log(data)
  postData(data, something)
}

function ipLookUp () {
  $.ajax('https://ipapi.co/json')
  .then(
      function success(response) {
          console.log('ip-api responses', response)
          recordCoordinates({'lat': response.latitude, 'long': response.longitude});
      },
      function fail(data, status) {
          console.log('ipLookUp failed', status);
      }
  );
}

function getLocation(){
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
    function success(position) {
      recordCoordinates({'lat': position.coords.latitude, 'long': position.coords.longitude});
    },
    function error(error_message) {
      console.error('An error has occured while retrieving location', error_message);
      ipLookUp();
    });
  } else {
    console.log('geolocation is not enabled on this browser');
    ipLookUp();
  }
}
