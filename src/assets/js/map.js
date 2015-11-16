(function() {

module.exports = function() {

/*
 * Panels
 */
var Panels = React.createClass({

  getInitialState: function() {
    return {
      provinces: [],
    }
  },

  componentDidMount: function() {
    $.getJSON('assets/data/china_provinces_etymology.json', function(data) {
      var provinces = data;

      if (this.isMounted()) {
        this.setState({
          provinces: provinces
        })
      }
    }.bind(this)); // end getJSON
  },

  render: function() {
    return (
      <div className="panels">
        <ul className="panels__container">
          {
            this.state.provinces.map(function(province) {
              return (
                <li className="panels__item" itemID={province.name.toLowerCase().replace(/ /g, '')}>
                  <h3>
                    {province.name}
                  </h3>
                </li>
              )
            }) // end provinces
          }
        </ul>
      </div>
    )
  }

});


/*
 * Map
 */
L.mapbox.accessToken = 'pk.eyJ1IjoiYW9zaWthIiwiYSI6IjQzRGIxeEkifQ.7OvmyBbXwwt9Qxjlh9Qd3w';

var Map = React.createClass({

  getInitialState: function() {
    return {
      layers: '',
    }
  },

  createMap: function(element) {
    var map = L.mapbox.map(element, 'mapbox.streets', {
      zoomControl: false,
      attributionControl: false
    });
    // map.scrollWheelZoom.disable();

    new L.Control.Zoom({position: 'bottomright' }).addTo(map);
    var credits = L.control.attribution().addTo(map);
    credits.addAttribution("© <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>");
/*
    L.marker([-37.7772, 175.2606]).bindLabel('Look revealing label!', {
      noHide: true,
      direction: 'auto'
    }).addTo(map);


      L.marker([22.80935, 113.557431])
        .bindLabel('Look revealing label!', {
          noHide: true,
          offset: [-35, -100]
        })
        .addTo(map);
*/

    return map;
  },

  setupMap: function() {
    this.map.setView([this.props.lat, this.props.lon], this.props.zoom);
  },

  createLayers: function() {

    var myLayer = L.mapbox.featureLayer().addTo(this.map);

    var thisMap = this.map;


    $.getJSON('assets/data/china_provinces_polygon.json', function(data) {

      myLayer.setGeoJSON(data);




      myLayer.eachLayer(function(layer) {

/*        layer.bindLabel(layer.feature.properties.NAME, {
          noHide: true
        }).addTo(thisMap);
*/


/*        var polygonCenter = layer.getBounds().getCenter();

        L.marker(polygonCenter)
          .bindLabel(layer.feature.properties.NAME, {
            noHide: true,
            offset: [-35, -100]
          })
          .addTo(thisMap);*/

        layer.on('click', function(e) {

          var provinceName = $(this)[0].feature.properties.NAME.toLowerCase().replace(/ /g, '');
          console.log(provinceName);

        }); // end layer click event

      }); // end eachLayer


    L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        var label = L.marker(layer.getBounds().getCenter(), {
          icon: L.divIcon({
            className: 'label label-' + layer.feature.properties.NAME.toLowerCase().replace(/ /g, ''),
            html: layer.feature.properties.NAME,
            iconSize: [100, 40]
          })
        }).addTo(thisMap);

        var labelLocal = L.marker(layer.getBounds().getCenter(), {
          icon: L.divIcon({
            className: 'label-local',
            html: layer.feature.properties.LOCALNAME,
            iconSize: [100, 40]
          })
        }).addTo(thisMap);

      }
    });

    thisMap.on('zoomend', function() {
      console.log(thisMap.getZoom());
      if ( thisMap.getZoom() <= 4 ) {
        $('.label').css('display', 'none');
      }
      if ( thisMap.getZoom() === 5 ) {
        $('.label').css('display', 'block'); 
      }
    })


    }); // end getJSON


  },

  componentDidMount: function() {
    if (this.props.createMap) {
        this.map = this.props.createMap(this.getDOMNode());
    } else {
        this.map = this.createMap(this.getDOMNode());
    }

    this.setupMap();
    this.createLayers();

  },

  render: function() {
    return (
      <div className='map'></div>
    )
  }

});


/*
 * Container
 */
var Container = React.createClass({
  render: function() {
    return (
      <div className="container">
        <Map lat="35" lon="100" zoom="4"/>
        <Panels />
      </div>
    )
  }
});


// Render the React component
React.render(
  <Container />,
  document.getElementById('mount')
)

} // end module export
})() // end anonymous wrapper





