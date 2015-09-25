(function() {
'use strict';

var _markerClicked = false;
var infoCard = null;
var mapSearch = null;
var mapDirections = null;
var selector = null;

var t = document.querySelector('#t');
t.getLocation = false;

t.addEventListener('dom-change', function(e) {
  infoCard = document.querySelector('info-card');
  mapSearch = document.querySelector('google-map-search');
  mapDirections = document.querySelector('google-map-directions');
  selector = document.querySelector('#markerselector');
});

t._onDirectionsResponse = function(e, detail) {
  var dur = detail.response.routes[0].legs[0].duration.text;
  this.set('selectedMarker.duration', dur);
};

t._onGeoResponse = function(e, detail) {
  // Set user's location as start address for directions.
  mapDirections.startAddress = {lat: detail.latitude, lng: detail.longitude};
};

t._onMarkerClick = function(e, detail) {
  _markerClicked = true;
  infoCard.dismissOnOutsideClick = true;
  mapDirections.map = null; // remove displayed directions when marker is clicked.

  var marker = this.$.markerlist.itemForElement(e.target);

  mapSearch.getDetails(marker.place_id).then(function(place) {
    marker = place; // replace marker metadata with full details.
    selector.select(marker);
    infoCard.open();
  });
};

t._showDirections = function(e, detail) {
  mapDirections.map = mapSearch.map; // setting the map displays the directions.
  t.async(function() {
    infoCard.close();
  }, 800);
};

document.addEventListener('google-map-ready', function(e) {
  document.body.classList.add('loaded');
  var loadEl = document.getElementById('loading');
  loadEl.addEventListener('transitionend', loadEl.remove);
});

document.addEventListener('click', function(e) {
  if (!_markerClicked) {
    infoCard.dismissOnOutsideClick = false;
  }
  _markerClicked = false;
});

})();