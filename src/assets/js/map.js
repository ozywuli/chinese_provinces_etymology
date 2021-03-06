(function() {

module.exports = function() {

var toggled = false;
var $infoToggle = $('.info-toggle');
var $infoPanel = $('.info-panel');
var $pulse = $('.pulse');

$infoToggle.on('click', '.pulse', function(e) {

  e.preventDefault();
  if (!$infoPanel.hasClass('active')) {
    $infoPanel.addClass('active');

    var pulse = $pulse.clone().removeClass('pulsate');
    $(this).remove();
    $infoToggle.append(pulse);
    pulse.addClass('pulsate');

  } else {

    var pulse = $pulse.clone().removeClass('pulsate');
    $(this).remove();
    $infoToggle.append(pulse);
    pulse.addClass('pulsate');

    $infoPanel.removeClass('active');

  }
});

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
                <li className="panels__item" itemID={province.name.toLowerCase().replace(/['\s]/g, '')}>
                   <h3>
                      {province.name}
                    </h3>
                    <div className="panels__row">
                      <div className="panels__cell">Simplified Chinese</div>
                      <div className="panels__cell">{province.name_ch}</div>
                    </div>
                    <div className="panels__row">
                      <div className="panels__cell">Pinyin</div>
                      <div className="panels__cell">{province.pinyin}</div>
                    </div>
                    <div className="panels__row">
                      <div className="panels__cell">Literal Meaning</div>
                      <div className="panels__cell panels__lit">{province.lit}</div>
                    </div>
                    <div className="panels__row">
                      {province.description}
                    </div>
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
L.mapbox.accessToken = 'pk.eyJ1Ijoib3p5d29vbGVlIiwiYSI6ImNpaDcwdTJ2bzBld2p1bWtpeG1lYTltaGcifQ.Ocpge8p64YCB1utqFOYtog';

var Map = React.createClass({

  getInitialState: function() {
    return {
      layers: '',
    }
  },

  createMap: function(element) {
    var map = L.mapbox.map(element, 'ozywoolee.87aae22b', {
      zoomControl: false,
      attributionControl: false
    });
    // map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable(); 

    var credits = L.control.attribution().addTo(map);
    credits.addAttribution("© <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>");
    return map;
  },

  setupMap: function() {
    this.map.setView([this.props.lat, this.props.lon], this.props.zoom);
  },

  createLayers: function() {

    var myLayer = L.mapbox.featureLayer().addTo(this.map);
    var thisMap = this.map;

    $.getJSON('assets/data/china_provinces_polygon.json', function(data) {

      // use the callback data to set the features layer
      myLayer.setGeoJSON(data);


      // loop through each layer from data callback
      myLayer.eachLayer(function(layer) {

        var allLayer = layer;

        // set all polygon color to yellow
        allLayer.setStyle({fillColor: 'yellow'});


        var layerName = layer.feature.properties.NAME.toLowerCase().replace(/['\s]/g, '');

        // Grab labels for each province form json and center them in the province polygon derived from coordinates
        var label = L.marker(layer.getBounds().getCenter(), {
          icon: L.divIcon({
            className: 'label--name label label-' + layerName + ' ' + 'label--name-' + layerName,
            html: '<div class="label__text">' + layer.feature.properties.NAME + '</div>',
            iconSize: [100, 40]
          })
        }).addTo(thisMap);


        var litLabel = L.marker(layer.getBounds().getCenter(), {
          icon: L.divIcon({
            className: 'label label-' + layerName + ' ' + 'hidden label--lit label--lit-' + layerName,
            html: '<div class="label__text">' + layer.feature.properties.NAME + '</div>',
            iconSize: [100, 40]
          })
        }).addTo(thisMap);


        layer.on('click', function(e) {

          var provinceName = $(this)[0].feature.properties.NAME.toLowerCase().replace(/['\s]/g, '');


          $('.label--lit-'+provinceName + ' ' + '.label__text').html($('[itemid="'+provinceName+'"] .panels__lit').html());



          if (toggled === false) {
            console.log(false);
            $('.label--lit').addClass('hidden');
            $('.label--name').removeClass('hidden');
            $('.label--name-' + provinceName).addClass('hidden');
            $('.label--lit-' + provinceName).removeClass('hidden');

          } else {
            console.log(true);
            $('.label--lit').removeClass('hidden');
            $('.label--name').addClass('hidden');
            $('.label--lit-' + provinceName).addClass('hidden');
            $('.label--name-' + provinceName).removeClass('hidden');

          }




          // reset all polygon colors to yellow
          myLayer.eachLayer(function(layer) {
            layer.setStyle({fillColor: 'yellow'});
          });

          // set active polygon color to red
          $(this)[0].setStyle({fillColor: 'red'});

          // set active class to corresponding panel
          $('.panels__item').removeClass('active');          
          $('[itemid="'+provinceName+'"]').addClass('active');
          $('.label__text').removeClass('label__text--active');
          $('.label-' + provinceName + ' ' + '.label__text').addClass('label__text--active');

          // pan to polygon
          thisMap.setView(layer.getBounds().getCenter(), 5);

        }); // end layer click event




      }); // end eachLayer






      // Hide province labels when zoomed out too far
      thisMap.on('zoomend', function() {
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




    $('.toggle').on('click', function(e) {
      e.preventDefault();


      if (toggled === false) {
          var store = [];


          $('.label--lit').each(function() {
            console.log( $(this).children().html() );
            store.push($(this).children().html().toLowerCase().replace(/['\s]/g, ''));
            
          });

          for (var i = 0; i < store.length; i++) {
            $('.label--lit-'+store[i]).html( '<div class="label__text">' + $('[itemid="'+store[i]+'"] .panels__lit').html() + '</div>');
          }

          toggled = true;
      } else if ( toggled === true ) {
        toggled = false;
      }


      if ( toggled === true ) {
        console.log(false);
        $('.label--name').addClass('hidden');
        $('.label--lit').removeClass('hidden');
      } else if ( toggled === false ) {
        console.log(true);
        $('.label--name').removeClass('hidden');
        $('.label--lit').addClass('hidden');
      }





    });

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
        <Panels />
        <Map lat="35" lon="105" zoom="5"/>
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





