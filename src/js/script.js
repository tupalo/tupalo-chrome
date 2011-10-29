/* Author: 

*/

function logger(msg){
  // console.log(msg);
}


function success(position) {
  logger("Got you at: LATITUDE: "+ position.coords.latitude +" LONGITUDE: "+ position.coords.longitude);
  var url = 'http://tupalo.com/en/api/v4/spots.json?tier=0&lat='+ position.coords.latitude +'&long='+ position.coords.longitude;
  $.getJSON(
    url,
    function(data){
      renderSpots(data)
    }
  )
}

function renderSpots(data){
  var spots = data.spots;
  logger("Got spots: ");
  logger(spots);
  // spots = [spots[0], spots[1], spots[2], spots[3], spots[4], spots[5], spots[6], spots[7], spots[8], spots[9]];
  $(spots.sort(function(a, b){ return a.spot.stars < b.spot.stars })).each(function(index){
    renderSpot(this.spot);
  });
  var number_of_spots = spots.length;
  var number_of_spots_in_last_row = ((number_of_spots >= 4) && (number_of_spots % 4 == 0)) ? 4 : (number_of_spots % 4)
  $('#spots > div.spot').removeClass('no_bottom_border').slice(-number_of_spots_in_last_row).addClass('no_bottom_border');
}

function renderSpot(spot){
  $('#spots').append(
    $("<div>").attr('class','span-one-third spot').append(
      $("<img>").attr('src', "http://maps.google.com/maps/api/staticmap?size=220x140&markers=icon:"+ encodeURI(spot.category.map_icon) +"|"+ spot.latitude +","+ spot.longitude +"&zoom=15&center="+ spot.latitude +","+ spot.longitude +"&sensor=false")
    ).append(
      $("<div>").attr('class', 'spot_data').append(
        $("<div>").attr('class','spot_name').text(spot.name)
      ).append(
        $("<div>").attr('class', 'spot_rating '+ classForRating(spot.stars))
      ).append(
        $("<div>").attr('class', 'spot_contact').html(spotContactInfo(spot))
      ).append(
       $("<a>").attr('class', 'btn on_tupalo').text("Show on Tupalo.com").attr('href', spot.spot_url).attr('target','_blank')
      )
    )
  )
}

function spotContactInfo(spot){
  var o = ""
  o += spot.phone ? '<b>'+ spot.phone +'</b><br/>' : '';
  o += spot.street ? spot.street +'<div class="spot_distance">'+ spot.distance +'m</div><br/>' : '';
  o += spot.website ? '<a href="'+ spot.website +'" target="_blank">'+ spot.website +'</a>' : '';
  return o
}

function signForHeading(heading){
  return {
    N:  "↑",
    NE: "↗",
    E:  "→",
    SE: "↘",
    S:  "↓",
    W:  "←",
    NW: " ↖",
    SW: " ↙"
  }[heading]
}

function classForRating(stars){
  return { 
    0: "rating0", 
    0.5: "rating0_5", 
    1.0: "rating1", 
    1.5: "rating1_5", 
    2.0: "rating2", 
    2.5: "rating2_5", 
    3.0: "rating3", 
    3.5: "rating3_5", 
    4.0: "rating4", 
    4.5: "rating4_5", 
    5: "rating5" }[stars]
}

function error(msg) {
  var s = document.querySelector('#status');
  s.innerHTML = typeof msg == 'string' ? msg : "failed";
  s.className = 'fail';
  logger(msg);
}


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  error('not supported');
}
