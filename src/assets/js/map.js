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
    map.scrollWheelZoom.disable();


    return map;
  },

  setupMap: function() {
    this.map.setView([this.props.lat, this.props.lon], this.props.zoom);
  },

  createLayers: function() {

    new L.Control.Zoom({position: 'bottomright' }).addTo(this.map);

    var credits = L.control.attribution().addTo(this.map);
    credits.addAttribution("© <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>");

    var myLayer = L.mapbox.featureLayer().addTo(this.map);


    var thisMap = this.map
    var thisData;

    $.getJSON('assets/data/china_provinces_polygon.json', function(data) {

      myLayer.setGeoJSON(data);

      myLayer.eachLayer(function(layer) {
        layer.on('click', function(e) {
          var provinceName = $(this)[0].feature.properties.NAME.toLowerCase().replace(/ /g, '');

          console.log(provinceName);

        }); // end layer click event
      }); // end eachLayer

      console.log(data);

      thisData = data;

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





