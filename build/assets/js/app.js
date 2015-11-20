(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var app = require('./map.js');

app();


},{"./map.js":2}],2:[function(require,module,exports){
"use strict";

(function () {

  module.exports = function () {

    /*
     * Panels
     */
    var Panels = React.createClass({
      displayName: "Panels",

      getInitialState: function getInitialState() {
        return {
          provinces: []
        };
      },

      componentDidMount: function componentDidMount() {
        $.getJSON('assets/data/china_provinces_etymology.json', (function (data) {
          var provinces = data;

          if (this.isMounted()) {
            this.setState({
              provinces: provinces
            });
          }
        }).bind(this)); // end getJSON
      },

      render: function render() {

        return React.createElement(
          "div",
          { className: "panels" },
          React.createElement(
            "ul",
            { className: "panels__container" },
            this.state.provinces.map(function (province) {
              return React.createElement(
                "li",
                { className: "panels__item", itemID: province.name.toLowerCase().replace(/ /g, '') },
                React.createElement(
                  "h3",
                  null,
                  province.name
                )
              );
            }) // end provinces

          )
        );
      }

    });

    /*
     * Map
     */
    L.mapbox.accessToken = 'pk.eyJ1Ijoib3p5d29vbGVlIiwiYSI6ImNpaDcwdTJ2bzBld2p1bWtpeG1lYTltaGcifQ.Ocpge8p64YCB1utqFOYtog';

    var Map = React.createClass({
      displayName: "Map",

      getInitialState: function getInitialState() {
        return {
          layers: ''
        };
      },

      createMap: function createMap(element) {
        var map = L.mapbox.map(element, 'ozywoolee.87aae22b', {
          zoomControl: false,
          attributionControl: false
        });
        map.scrollWheelZoom.disable();

        // new L.Control.Zoom({position: 'bottomright' }).addTo(map);

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

      setupMap: function setupMap() {
        this.map.setView([this.props.lat, this.props.lon], this.props.zoom);
      },

      createLayers: function createLayers() {

        var myLayer = L.mapbox.featureLayer().addTo(this.map);

        var thisMap = this.map;

        $.getJSON('assets/data/china_provinces_polygon.json', function (data) {

          myLayer.setGeoJSON(data);

          myLayer.eachLayer(function (layer) {

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

            layer.on('click', function (e) {

              var provinceName = $(this)[0].feature.properties.NAME.toLowerCase().replace(/ /g, '');
              console.log(provinceName);
            }); // end layer click event
          }); // end eachLayer

          L.geoJson(data, {
            onEachFeature: function onEachFeature(feature, layer) {
              var label = L.marker(layer.getBounds().getCenter(), {
                icon: L.divIcon({
                  className: 'label label-' + layer.feature.properties.NAME.toLowerCase().replace(/ /g, ''),
                  html: layer.feature.properties.NAME,
                  iconSize: [100, 40]
                })
              }).addTo(thisMap);

              /*        var labelLocal = L.marker(layer.getBounds().getCenter(), {
                        icon: L.divIcon({
                          className: 'label-local',
                          html: layer.feature.properties.LOCALNAME,
                          iconSize: [100, 40]
                        })
                      }).addTo(thisMap);*/
            }
          });

          thisMap.on('zoomend', function () {
            console.log(thisMap.getZoom());
            if (thisMap.getZoom() <= 4) {
              $('.label').css('display', 'none');
            }
            if (thisMap.getZoom() === 5) {
              $('.label').css('display', 'block');
            }
          });
        }); // end getJSON
      },

      componentDidMount: function componentDidMount() {
        if (this.props.createMap) {
          this.map = this.props.createMap(this.getDOMNode());
        } else {
          this.map = this.createMap(this.getDOMNode());
        }

        this.setupMap();
        this.createLayers();
      },

      render: function render() {
        return React.createElement("div", { className: "map" });
      }

    });

    /*
     * Container
     */
    var Container = React.createClass({
      displayName: "Container",

      render: function render() {
        return React.createElement(
          "div",
          { className: "container" },
          React.createElement(Map, { lat: "35", lon: "105", zoom: "5" }),
          React.createElement(Panels, null)
        );
      }
    });

    // Render the React component
    React.render(React.createElement(Container, null), document.getElementById('mount'));
  }; // end module export
})(); // end anonymous wrapper


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcd2FtcFxcd3d3XFxsYWJcXGNwZVxcc3JjXFxhc3NldHNcXGpzXFxhcHAuanMiLCJDOlxcd2FtcFxcd3d3XFxsYWJcXGNwZVxcc3JjXFxhc3NldHNcXGpzXFxtYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUU5QixHQUFHLEVBQUUsQ0FBQztBQUNOOzs7QUNMQSxZQUFZLENBQUM7O0FBRWIsQ0FBQyxZQUFZOztBQUViLEVBQUUsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZO0FBQy9CO0FBQ0E7QUFDQTs7SUFFSSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO0FBQ25DLE1BQU0sV0FBVyxFQUFFLFFBQVE7O01BRXJCLGVBQWUsRUFBRSxTQUFTLGVBQWUsR0FBRztRQUMxQyxPQUFPO1VBQ0wsU0FBUyxFQUFFLEVBQUU7U0FDZCxDQUFDO0FBQ1YsT0FBTzs7TUFFRCxpQkFBaUIsRUFBRSxTQUFTLGlCQUFpQixHQUFHO1FBQzlDLENBQUMsQ0FBQyxPQUFPLENBQUMsNENBQTRDLEVBQUUsQ0FBQyxVQUFVLElBQUksRUFBRTtBQUNqRixVQUFVLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQzs7VUFFckIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQztjQUNaLFNBQVMsRUFBRSxTQUFTO2FBQ3JCLENBQUMsQ0FBQztXQUNKO1NBQ0YsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN2QixPQUFPOztBQUVQLE1BQU0sTUFBTSxFQUFFLFNBQVMsTUFBTSxHQUFHOztRQUV4QixPQUFPLEtBQUssQ0FBQyxhQUFhO1VBQ3hCLEtBQUs7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LEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7VUFDOUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO1NBQ2xDLENBQUM7T0FDSDtBQUNQLEtBQUssQ0FBQyxDQUFDO0FBQ1A7O0lBRUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FDdEYsQ0FBQztDQUNILEdBQUcsQ0FBQyxDQUFDLHdCQUF3QjtBQUM5QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhcHAgPSByZXF1aXJlKCcuL21hcC5qcycpO1xuXG5hcHAoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002TDNkaGJYQXZkM2QzTDJ4aFlpOWpjR1V2YzNKakwyRnpjMlYwY3k5cWN5OWhjSEF1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN1FVRkJRU3hKUVVGSkxFZEJRVWNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNN08wRkJSemxDTEVkQlFVY3NSVUZCUlN4RFFVRkRJaXdpWm1sc1pTSTZJa002TDNkaGJYQXZkM2QzTDJ4aFlpOWpjR1V2YzNKakwyRnpjMlYwY3k5cWN5OWhjSEF1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SjJZWElnWVhCd0lEMGdjbVZ4ZFdseVpTZ25MaTl0WVhBdWFuTW5LVHRjY2x4dVhISmNibHh5WEc1aGNIQW9LVHNpWFgwPSIsIlwidXNlIHN0cmljdFwiO1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4gICAgLypcclxuICAgICAqIFBhbmVsc1xyXG4gICAgICovXG4gICAgdmFyIFBhbmVscyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAgIGRpc3BsYXlOYW1lOiBcIlBhbmVsc1wiLFxuXG4gICAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwcm92aW5jZXM6IFtdXG4gICAgICAgIH07XG4gICAgICB9LFxuXG4gICAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgICQuZ2V0SlNPTignYXNzZXRzL2RhdGEvY2hpbmFfcHJvdmluY2VzX2V0eW1vbG9neS5qc29uJywgKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgdmFyIHByb3ZpbmNlcyA9IGRhdGE7XG5cbiAgICAgICAgICBpZiAodGhpcy5pc01vdW50ZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHByb3ZpbmNlczogcHJvdmluY2VzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmJpbmQodGhpcykpOyAvLyBlbmQgZ2V0SlNPTlxuICAgICAgfSxcblxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgXCJkaXZcIixcbiAgICAgICAgICB7IGNsYXNzTmFtZTogXCJwYW5lbHNcIiB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICBcInVsXCIsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogXCJwYW5lbHNfX2NvbnRhaW5lclwiIH0sXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnByb3ZpbmNlcy5tYXAoZnVuY3Rpb24gKHByb3ZpbmNlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgIFwibGlcIixcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogXCJwYW5lbHNfX2l0ZW1cIiwgaXRlbUlEOiBwcm92aW5jZS5uYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvIC9nLCAnJykgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgXCJoM1wiLFxuICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgIHByb3ZpbmNlLm5hbWVcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KSAvLyBlbmQgcHJvdmluY2VzXG5cbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICB9KTtcblxuICAgIC8qXHJcbiAgICAgKiBNYXBcclxuICAgICAqL1xuICAgIEwubWFwYm94LmFjY2Vzc1Rva2VuID0gJ3BrLmV5SjFJam9pYjNwNWQyOXZiR1ZsSWl3aVlTSTZJbU5wYURjd2RUSjJiekJsZDJwMWJXdHBlRzFsWVRsdGFHY2lmUS5PY3BnZThwNjRZQ0IxdXRxRk9ZdG9nJztcblxuICAgIHZhciBNYXAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgICBkaXNwbGF5TmFtZTogXCJNYXBcIixcblxuICAgICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGF5ZXJzOiAnJ1xuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgICAgY3JlYXRlTWFwOiBmdW5jdGlvbiBjcmVhdGVNYXAoZWxlbWVudCkge1xuICAgICAgICB2YXIgbWFwID0gTC5tYXBib3gubWFwKGVsZW1lbnQsICdvenl3b29sZWUuODdhYWUyMmInLCB7XG4gICAgICAgICAgem9vbUNvbnRyb2w6IGZhbHNlLFxuICAgICAgICAgIGF0dHJpYnV0aW9uQ29udHJvbDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIG1hcC5zY3JvbGxXaGVlbFpvb20uZGlzYWJsZSgpO1xuXG4gICAgICAgIC8vIG5ldyBMLkNvbnRyb2wuWm9vbSh7cG9zaXRpb246ICdib3R0b21yaWdodCcgfSkuYWRkVG8obWFwKTtcblxuICAgICAgICB2YXIgY3JlZGl0cyA9IEwuY29udHJvbC5hdHRyaWJ1dGlvbigpLmFkZFRvKG1hcCk7XG4gICAgICAgIGNyZWRpdHMuYWRkQXR0cmlidXRpb24oXCLCqSA8YSBocmVmPSdodHRwczovL3d3dy5tYXBib3guY29tL21hcC1mZWVkYmFjay8nPk1hcGJveDwvYT4gwqkgPGEgaHJlZj0naHR0cDovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHQnPk9wZW5TdHJlZXRNYXAgY29udHJpYnV0b3JzPC9hPlwiKTtcbiAgICAgICAgLypcclxuICAgICAgICAgICAgTC5tYXJrZXIoWy0zNy43NzcyLCAxNzUuMjYwNl0pLmJpbmRMYWJlbCgnTG9vayByZXZlYWxpbmcgbGFiZWwhJywge1xyXG4gICAgICAgICAgICAgIG5vSGlkZTogdHJ1ZSxcclxuICAgICAgICAgICAgICBkaXJlY3Rpb246ICdhdXRvJ1xyXG4gICAgICAgICAgICB9KS5hZGRUbyhtYXApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgIEwubWFya2VyKFsyMi44MDkzNSwgMTEzLjU1NzQzMV0pXHJcbiAgICAgICAgICAgICAgICAuYmluZExhYmVsKCdMb29rIHJldmVhbGluZyBsYWJlbCEnLCB7XHJcbiAgICAgICAgICAgICAgICAgIG5vSGlkZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBbLTM1LCAtMTAwXVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5hZGRUbyhtYXApO1xyXG4gICAgICAgICovXG5cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICAgIH0sXG5cbiAgICAgIHNldHVwTWFwOiBmdW5jdGlvbiBzZXR1cE1hcCgpIHtcbiAgICAgICAgdGhpcy5tYXAuc2V0VmlldyhbdGhpcy5wcm9wcy5sYXQsIHRoaXMucHJvcHMubG9uXSwgdGhpcy5wcm9wcy56b29tKTtcbiAgICAgIH0sXG5cbiAgICAgIGNyZWF0ZUxheWVyczogZnVuY3Rpb24gY3JlYXRlTGF5ZXJzKCkge1xuXG4gICAgICAgIHZhciBteUxheWVyID0gTC5tYXBib3guZmVhdHVyZUxheWVyKCkuYWRkVG8odGhpcy5tYXApO1xuXG4gICAgICAgIHZhciB0aGlzTWFwID0gdGhpcy5tYXA7XG5cbiAgICAgICAgJC5nZXRKU09OKCdhc3NldHMvZGF0YS9jaGluYV9wcm92aW5jZXNfcG9seWdvbi5qc29uJywgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgIG15TGF5ZXIuc2V0R2VvSlNPTihkYXRhKTtcblxuICAgICAgICAgIG15TGF5ZXIuZWFjaExheWVyKGZ1bmN0aW9uIChsYXllcikge1xuXG4gICAgICAgICAgICAvKiAgICAgICAgbGF5ZXIuYmluZExhYmVsKGxheWVyLmZlYXR1cmUucHJvcGVydGllcy5OQU1FLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBub0hpZGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9KS5hZGRUbyh0aGlzTWFwKTtcclxuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgLyogICAgICAgIHZhciBwb2x5Z29uQ2VudGVyID0gbGF5ZXIuZ2V0Qm91bmRzKCkuZ2V0Q2VudGVyKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIEwubWFya2VyKHBvbHlnb25DZW50ZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAuYmluZExhYmVsKGxheWVyLmZlYXR1cmUucHJvcGVydGllcy5OQU1FLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vSGlkZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBbLTM1LCAtMTAwXVxyXG4gICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgIC5hZGRUbyh0aGlzTWFwKTsqL1xuXG4gICAgICAgICAgICBsYXllci5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICAgIHZhciBwcm92aW5jZU5hbWUgPSAkKHRoaXMpWzBdLmZlYXR1cmUucHJvcGVydGllcy5OQU1FLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvIC9nLCAnJyk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb3ZpbmNlTmFtZSk7XG4gICAgICAgICAgICB9KTsgLy8gZW5kIGxheWVyIGNsaWNrIGV2ZW50XG4gICAgICAgICAgfSk7IC8vIGVuZCBlYWNoTGF5ZXJcblxuICAgICAgICAgIEwuZ2VvSnNvbihkYXRhLCB7XG4gICAgICAgICAgICBvbkVhY2hGZWF0dXJlOiBmdW5jdGlvbiBvbkVhY2hGZWF0dXJlKGZlYXR1cmUsIGxheWVyKSB7XG4gICAgICAgICAgICAgIHZhciBsYWJlbCA9IEwubWFya2VyKGxheWVyLmdldEJvdW5kcygpLmdldENlbnRlcigpLCB7XG4gICAgICAgICAgICAgICAgaWNvbjogTC5kaXZJY29uKHtcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2xhYmVsIGxhYmVsLScgKyBsYXllci5mZWF0dXJlLnByb3BlcnRpZXMuTkFNRS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyAvZywgJycpLFxuICAgICAgICAgICAgICAgICAgaHRtbDogbGF5ZXIuZmVhdHVyZS5wcm9wZXJ0aWVzLk5BTUUsXG4gICAgICAgICAgICAgICAgICBpY29uU2l6ZTogWzEwMCwgNDBdXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfSkuYWRkVG8odGhpc01hcCk7XG5cbiAgICAgICAgICAgICAgLyogICAgICAgIHZhciBsYWJlbExvY2FsID0gTC5tYXJrZXIobGF5ZXIuZ2V0Qm91bmRzKCkuZ2V0Q2VudGVyKCksIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogTC5kaXZJY29uKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdsYWJlbC1sb2NhbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbDogbGF5ZXIuZmVhdHVyZS5wcm9wZXJ0aWVzLkxPQ0FMTkFNRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uU2l6ZTogWzEwMCwgNDBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KS5hZGRUbyh0aGlzTWFwKTsqL1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpc01hcC5vbignem9vbWVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXNNYXAuZ2V0Wm9vbSgpKTtcbiAgICAgICAgICAgIGlmICh0aGlzTWFwLmdldFpvb20oKSA8PSA0KSB7XG4gICAgICAgICAgICAgICQoJy5sYWJlbCcpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpc01hcC5nZXRab29tKCkgPT09IDUpIHtcbiAgICAgICAgICAgICAgJCgnLmxhYmVsJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pOyAvLyBlbmQgZ2V0SlNPTlxuICAgICAgfSxcblxuICAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5jcmVhdGVNYXApIHtcbiAgICAgICAgICB0aGlzLm1hcCA9IHRoaXMucHJvcHMuY3JlYXRlTWFwKHRoaXMuZ2V0RE9NTm9kZSgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm1hcCA9IHRoaXMuY3JlYXRlTWFwKHRoaXMuZ2V0RE9NTm9kZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0dXBNYXAoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVMYXllcnMoKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJtYXBcIiB9KTtcbiAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgLypcclxuICAgICAqIENvbnRhaW5lclxyXG4gICAgICovXG4gICAgdmFyIENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAgIGRpc3BsYXlOYW1lOiBcIkNvbnRhaW5lclwiLFxuXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgXCJkaXZcIixcbiAgICAgICAgICB7IGNsYXNzTmFtZTogXCJjb250YWluZXJcIiB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWFwLCB7IGxhdDogXCIzNVwiLCBsb246IFwiMTA1XCIsIHpvb206IFwiNVwiIH0pLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFuZWxzLCBudWxsKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gUmVuZGVyIHRoZSBSZWFjdCBjb21wb25lbnRcbiAgICBSZWFjdC5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChDb250YWluZXIsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW91bnQnKSk7XG4gIH07IC8vIGVuZCBtb2R1bGUgZXhwb3J0XG59KSgpOyAvLyBlbmQgYW5vbnltb3VzIHdyYXBwZXJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002TDNkaGJYQXZkM2QzTDJ4aFlpOWpjR1V2YzNKakwyRnpjMlYwY3k5cWN5OXRZWEF1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN1FVRkJRU3hEUVVGRExGbEJRVmM3TzBGQlJWb3NVVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhaUVVGWE96czdPenRCUVVzMVFpeFJRVUZKTEUxQlFVMHNSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZGTjBJc2NVSkJRV1VzUlVGQlJTd3lRa0ZCVnp0QlFVTXhRaXhsUVVGUE8wRkJRMHdzYlVKQlFWTXNSVUZCUlN4RlFVRkZPMU5CUTJRc1EwRkJRVHRQUVVOR096dEJRVVZFTEhWQ1FVRnBRaXhGUVVGRkxEWkNRVUZYTzBGQlF6VkNMRk5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU1zTkVOQlFUUkRMRVZCUVVVc1EwRkJRU3hWUVVGVExFbEJRVWtzUlVGQlJUdEJRVU55UlN4alFVRkpMRk5CUVZNc1IwRkJSeXhKUVVGSkxFTkJRVU03TzBGQlJYSkNMR05CUVVrc1NVRkJTU3hEUVVGRExGTkJRVk1zUlVGQlJTeEZRVUZGTzBGQlEzQkNMR2RDUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETzBGQlExb3NkVUpCUVZNc1JVRkJSU3hUUVVGVE8yRkJRM0pDTEVOQlFVTXNRMEZCUVR0WFFVTklPMU5CUTBZc1EwRkJRU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRPMDlCUTJZN08wRkJSVVFzV1VGQlRTeEZRVUZGTEd0Q1FVRlhPenRCUVVWcVFpeGxRVU5GT3p0WlFVRkxMRk5CUVZNc1JVRkJReXhSUVVGUk8xVkJRM0pDT3p0alFVRkpMRk5CUVZNc1JVRkJReXh0UWtGQmJVSTdXVUZGTjBJc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZNc1VVRkJVU3hGUVVGRk8wRkJRekZETEhGQ1FVTkZPenRyUWtGQlNTeFRRVUZUTEVWQlFVTXNZMEZCWXl4RlFVRkRMRTFCUVUwc1JVRkJSU3hSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NSVUZCUlN4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFVkJRVVVzUlVGQlJTeERRVUZETEVGQlFVTTdaMEpCUTJwR096czdhMEpCUTBjc1VVRkJVU3hEUVVGRExFbEJRVWs3YVVKQlExZzdaVUZEUml4RFFVTk9PMkZCUTBZc1EwRkJRenM3VjBGRlJEdFRRVU5FTEVOQlExQTdUMEZEUmpzN1MwRkZSaXhEUVVGRExFTkJRVU03T3pzN08wRkJUVWdzUzBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4WFFVRlhMRWRCUVVjc09FWkJRVGhHTEVOQlFVTTdPMEZCUlhSSUxGRkJRVWtzUjBGQlJ5eEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVVV4UWl4eFFrRkJaU3hGUVVGRkxESkNRVUZYTzBGQlF6RkNMR1ZCUVU4N1FVRkRUQ3huUWtGQlRTeEZRVUZGTEVWQlFVVTdVMEZEV0N4RFFVRkJPMDlCUTBZN08wRkJSVVFzWlVGQlV5eEZRVUZGTEcxQ1FVRlRMRTlCUVU4c1JVRkJSVHRCUVVNelFpeFpRVUZKTEVkQlFVY3NSMEZCUnl4RFFVRkRMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF5eFBRVUZQTEVWQlFVVXNiMEpCUVc5Q0xFVkJRVVU3UVVGRGNFUXNjVUpCUVZjc1JVRkJSU3hMUVVGTE8wRkJRMnhDTERSQ1FVRnJRaXhGUVVGRkxFdEJRVXM3VTBGRE1VSXNRMEZCUXl4RFFVRkRPMEZCUTBnc1YwRkJSeXhEUVVGRExHVkJRV1VzUTBGQlF5eFBRVUZQTEVWQlFVVXNRMEZCUXpzN096dEJRVWs1UWl4WlFVRkpMRTlCUVU4c1IwRkJSeXhEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEZkQlFWY3NSVUZCUlN4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU5xUkN4bFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRExDdEpRVUVyU1N4RFFVRkRMRU5CUVVNN096czdPenM3T3pzN096czdPenM3UVVGblFuaExMR1ZCUVU4c1IwRkJSeXhEUVVGRE8wOUJRMW83TzBGQlJVUXNZMEZCVVN4RlFVRkZMRzlDUVVGWE8wRkJRMjVDTEZsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SFFVRkhMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzA5QlEzSkZPenRCUVVWRUxHdENRVUZaTEVWQlFVVXNkMEpCUVZjN08wRkJSWFpDTEZsQlFVa3NUMEZCVHl4SFFVRkhMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zV1VGQldTeEZRVUZGTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6czdRVUZGZEVRc1dVRkJTU3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXpzN1FVRkhka0lzVTBGQlF5eERRVUZETEU5QlFVOHNRMEZCUXl3d1EwRkJNRU1zUlVGQlJTeFZRVUZUTEVsQlFVa3NSVUZCUlRzN1FVRkZia1VzYVVKQlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03TzBGQlMzcENMR2xDUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEZWQlFWTXNTMEZCU3l4RlFVRkZPenM3T3pzN096czdPenM3T3pzN08wRkJhVUpvUXl4cFFrRkJTeXhEUVVGRExFVkJRVVVzUTBGQlF5eFBRVUZQTEVWQlFVVXNWVUZCVXl4RFFVRkRMRVZCUVVVN08wRkJSVFZDTEd0Q1FVRkpMRmxCUVZrc1IwRkJSeXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RlFVRkZMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUlVGQlJTeEZRVUZGTEVOQlFVTXNRMEZCUXp0QlFVTjBSaXh4UWtGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenRoUVVVelFpeERRVUZETEVOQlFVTTdWMEZGU2l4RFFVRkRMRU5CUVVNN08wRkJSMHdzVjBGQlF5eERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRkpMRVZCUVVVN1FVRkRaQ3g1UWtGQllTeEZRVUZGTEhWQ1FVRlRMRTlCUVU4c1JVRkJSU3hMUVVGTExFVkJRVVU3UVVGRGRFTXNhMEpCUVVrc1MwRkJTeXhIUVVGSExFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNc1JVRkJSU3hEUVVGRExGTkJRVk1zUlVGQlJTeEZRVUZGTzBGQlEyeEVMRzlDUVVGSkxFVkJRVVVzUTBGQlF5eERRVUZETEU5QlFVOHNRMEZCUXp0QlFVTmtMREpDUVVGVExFVkJRVVVzWTBGQll5eEhRVUZITEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF5eFhRVUZYTEVWQlFVVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hGUVVGRkxFVkJRVVVzUTBGQlF6dEJRVU42Uml4elFrRkJTU3hGUVVGRkxFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrN1FVRkRia01zTUVKQlFWRXNSVUZCUlN4RFFVRkRMRWRCUVVjc1JVRkJSU3hGUVVGRkxFTkJRVU03YVVKQlEzQkNMRU5CUVVNN1pVRkRTQ3hEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPenM3T3pzN096czdZVUZWYmtJN1YwRkRSaXhEUVVGRExFTkJRVU03TzBGQlJVZ3NhVUpCUVU4c1EwRkJReXhGUVVGRkxFTkJRVU1zVTBGQlV5eEZRVUZGTEZsQlFWYzdRVUZETDBJc2JVSkJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNUMEZCVHl4RFFVRkRMRTlCUVU4c1JVRkJSU3hEUVVGRExFTkJRVU03UVVGREwwSXNaMEpCUVVzc1QwRkJUeXhEUVVGRExFOUJRVThzUlVGQlJTeEpRVUZKTEVOQlFVTXNSVUZCUnp0QlFVTTFRaXhsUVVGRExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRk5CUVZNc1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF6dGhRVU53UXp0QlFVTkVMR2RDUVVGTExFOUJRVThzUTBGQlF5eFBRVUZQTEVWQlFVVXNTMEZCU3l4RFFVRkRMRVZCUVVjN1FVRkROMElzWlVGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhUUVVGVExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdZVUZEY2tNN1YwRkRSaXhEUVVGRExFTkJRVUU3VTBGSFJDeERRVUZETEVOQlFVTTdUMEZIU2pzN1FVRkZSQ3gxUWtGQmFVSXNSVUZCUlN3MlFrRkJWenRCUVVNMVFpeFpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhGUVVGRk8wRkJRM1JDTEdOQlFVa3NRMEZCUXl4SFFVRkhMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRExFTkJRVU03VTBGRGRFUXNUVUZCVFR0QlFVTklMR05CUVVrc1EwRkJReXhIUVVGSExFZEJRVWNzU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hGUVVGRkxFTkJRVU1zUTBGQlF6dFRRVU5vUkRzN1FVRkZSQ3haUVVGSkxFTkJRVU1zVVVGQlVTeEZRVUZGTEVOQlFVTTdRVUZEYUVJc1dVRkJTU3hEUVVGRExGbEJRVmtzUlVGQlJTeERRVUZETzA5QlJYSkNPenRCUVVWRUxGbEJRVTBzUlVGQlJTeHJRa0ZCVnp0QlFVTnFRaXhsUVVORkxEWkNRVUZMTEZOQlFWTXNSVUZCUXl4TFFVRkxMRWRCUVU4c1EwRkROVUk3VDBGRFJqczdTMEZGUml4RFFVRkRMRU5CUVVNN096czdPMEZCVFVnc1VVRkJTU3hUUVVGVExFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJRMmhETEZsQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeGxRVU5GT3p0WlFVRkxMRk5CUVZNc1JVRkJReXhYUVVGWE8xVkJRM2hDTEc5Q1FVRkRMRWRCUVVjc1NVRkJReXhIUVVGSExFVkJRVU1zU1VGQlNTeEZRVUZETEVkQlFVY3NSVUZCUXl4TFFVRkxMRVZCUVVNc1NVRkJTU3hGUVVGRExFZEJRVWNzUjBGQlJUdFZRVU5zUXl4dlFrRkJReXhOUVVGTkxFOUJRVWM3VTBGRFRpeERRVU5RTzA5QlEwWTdTMEZEUml4RFFVRkRMRU5CUVVNN096dEJRVWxJTEZOQlFVc3NRMEZCUXl4TlFVRk5MRU5CUTFZc2IwSkJRVU1zVTBGQlV5eFBRVUZITEVWQlEySXNVVUZCVVN4RFFVRkRMR05CUVdNc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGRGFrTXNRMEZCUVR0SFFVVkJMRU5CUVVFN1EwRkRRU3hEUVVGQkxFVkJRVWNzUTBGQlFTSXNJbVpwYkdVaU9pSkRPaTkzWVcxd0wzZDNkeTlzWVdJdlkzQmxMM055WXk5aGMzTmxkSE12YW5NdmJXRndMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUtHWjFibU4wYVc5dUtDa2dlMXh5WEc1Y2NseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dVhISmNiaThxWEhKY2JpQXFJRkJoYm1Wc2MxeHlYRzRnS2k5Y2NseHVkbUZ5SUZCaGJtVnNjeUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2NseHVYSEpjYmlBZ1oyVjBTVzVwZEdsaGJGTjBZWFJsT2lCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lISmxkSFZ5YmlCN1hISmNiaUFnSUNBZ0lIQnliM1pwYm1ObGN6b2dXMTBzWEhKY2JpQWdJQ0I5WEhKY2JpQWdmU3hjY2x4dVhISmNiaUFnWTI5dGNHOXVaVzUwUkdsa1RXOTFiblE2SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ0pDNW5aWFJLVTA5T0tDZGhjM05sZEhNdlpHRjBZUzlqYUdsdVlWOXdjbTkyYVc1alpYTmZaWFI1Ylc5c2IyZDVMbXB6YjI0bkxDQm1kVzVqZEdsdmJpaGtZWFJoS1NCN1hISmNiaUFnSUNBZ0lIWmhjaUJ3Y205MmFXNWpaWE1nUFNCa1lYUmhPMXh5WEc1Y2NseHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWFYTk5iM1Z1ZEdWa0tDa3BJSHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRjY2x4dUlDQWdJQ0FnSUNBZ0lIQnliM1pwYm1ObGN6b2djSEp2ZG1sdVkyVnpYSEpjYmlBZ0lDQWdJQ0FnZlNsY2NseHVJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ2ZTNWlhVzVrS0hSb2FYTXBLVHNnTHk4Z1pXNWtJR2RsZEVwVFQwNWNjbHh1SUNCOUxGeHlYRzVjY2x4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh5WEc1Y2NseHVJQ0FnSUhKbGRIVnliaUFvWEhKY2JpQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpY0dGdVpXeHpYQ0krWEhKY2JpQWdJQ0FnSUNBZ1BIVnNJR05zWVhOelRtRnRaVDFjSW5CaGJtVnNjMTlmWTI5dWRHRnBibVZ5WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdWMzUmhkR1V1Y0hKdmRtbHVZMlZ6TG0xaGNDaG1kVzVqZEdsdmJpaHdjbTkyYVc1alpTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQW9YSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YkdrZ1kyeGhjM05PWVcxbFBWd2ljR0Z1Wld4elgxOXBkR1Z0WENJZ2FYUmxiVWxFUFh0d2NtOTJhVzVqWlM1dVlXMWxMblJ2VEc5M1pYSkRZWE5sS0NrdWNtVndiR0ZqWlNndklDOW5MQ0FuSnlsOVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YURNK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZTNCeWIzWnBibU5sTG01aGJXVjlYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmFETStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDJ4cFBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDbGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTa2dMeThnWlc1a0lIQnliM1pwYm1ObGMxeHlYRzRnSUNBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnSUNBZ0lEd3ZkV3crWEhKY2JpQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdLVnh5WEc0Z0lIMWNjbHh1WEhKY2JuMHBPMXh5WEc1Y2NseHVYSEpjYmk4cVhISmNiaUFxSUUxaGNGeHlYRzRnS2k5Y2NseHVUQzV0WVhCaWIzZ3VZV05qWlhOelZHOXJaVzRnUFNBbmNHc3VaWGxLTVVscWIybGlNM0ExWkRJNWRtSkhWbXhKYVhkcFdWTkpOa2x0VG5CaFJHTjNaRlJLTW1KNlFteGtNbkF4WWxkMGNHVkhNV3haVkd4MFlVZGphV1pSTGs5amNHZGxPSEEyTkZsRFFqRjFkSEZHVDFsMGIyY25PMXh5WEc1Y2NseHVkbUZ5SUUxaGNDQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjY2x4dVhISmNiaUFnWjJWMFNXNXBkR2xoYkZOMFlYUmxPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUhKbGRIVnliaUI3WEhKY2JpQWdJQ0FnSUd4aGVXVnljem9nSnljc1hISmNiaUFnSUNCOVhISmNiaUFnZlN4Y2NseHVYSEpjYmlBZ1kzSmxZWFJsVFdGd09pQm1kVzVqZEdsdmJpaGxiR1Z0Wlc1MEtTQjdYSEpjYmlBZ0lDQjJZWElnYldGd0lEMGdUQzV0WVhCaWIzZ3ViV0Z3S0dWc1pXMWxiblFzSUNkdmVubDNiMjlzWldVdU9EZGhZV1V5TW1JbkxDQjdYSEpjYmlBZ0lDQWdJSHB2YjIxRGIyNTBjbTlzT2lCbVlXeHpaU3hjY2x4dUlDQWdJQ0FnWVhSMGNtbGlkWFJwYjI1RGIyNTBjbTlzT2lCbVlXeHpaVnh5WEc0Z0lDQWdmU2s3WEhKY2JpQWdJQ0J0WVhBdWMyTnliMnhzVjJobFpXeGFiMjl0TG1ScGMyRmliR1VvS1R0Y2NseHVYSEpjYmlBZ0lDQXZMeUJ1WlhjZ1RDNURiMjUwY205c0xscHZiMjBvZTNCdmMybDBhVzl1T2lBblltOTBkRzl0Y21sbmFIUW5JSDBwTG1Ga1pGUnZLRzFoY0NrN1hISmNibHh5WEc0Z0lDQWdkbUZ5SUdOeVpXUnBkSE1nUFNCTUxtTnZiblJ5YjJ3dVlYUjBjbWxpZFhScGIyNG9LUzVoWkdSVWJ5aHRZWEFwTzF4eVhHNGdJQ0FnWTNKbFpHbDBjeTVoWkdSQmRIUnlhV0oxZEdsdmJpaGNJc0twSUR4aElHaHlaV1k5SjJoMGRIQnpPaTh2ZDNkM0xtMWhjR0p2ZUM1amIyMHZiV0Z3TFdabFpXUmlZV05yTHljK1RXRndZbTk0UEM5aFBpRENxU0E4WVNCb2NtVm1QU2RvZEhSd09pOHZkM2QzTG05d1pXNXpkSEpsWlhSdFlYQXViM0puTDJOdmNIbHlhV2RvZENjK1QzQmxibE4wY21WbGRFMWhjQ0JqYjI1MGNtbGlkWFJ2Y25NOEwyRStYQ0lwTzF4eVhHNHZLbHh5WEc0Z0lDQWdUQzV0WVhKclpYSW9XeTB6Tnk0M056Y3lMQ0F4TnpVdU1qWXdObDBwTG1KcGJtUk1ZV0psYkNnblRHOXZheUJ5WlhabFlXeHBibWNnYkdGaVpXd2hKeXdnZTF4eVhHNGdJQ0FnSUNCdWIwaHBaR1U2SUhSeWRXVXNYSEpjYmlBZ0lDQWdJR1JwY21WamRHbHZiam9nSjJGMWRHOG5YSEpjYmlBZ0lDQjlLUzVoWkdSVWJ5aHRZWEFwTzF4eVhHNWNjbHh1WEhKY2JpQWdJQ0FnSUV3dWJXRnlhMlZ5S0ZzeU1pNDRNRGt6TlN3Z01URXpMalUxTnpRek1WMHBYSEpjYmlBZ0lDQWdJQ0FnTG1KcGJtUk1ZV0psYkNnblRHOXZheUJ5WlhabFlXeHBibWNnYkdGaVpXd2hKeXdnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdibTlJYVdSbE9pQjBjblZsTEZ4eVhHNGdJQ0FnSUNBZ0lDQWdiMlptYzJWME9pQmJMVE0xTENBdE1UQXdYVnh5WEc0Z0lDQWdJQ0FnSUgwcFhISmNiaUFnSUNBZ0lDQWdMbUZrWkZSdktHMWhjQ2s3WEhKY2Jpb3ZYSEpjYmx4eVhHNGdJQ0FnY21WMGRYSnVJRzFoY0R0Y2NseHVJQ0I5TEZ4eVhHNWNjbHh1SUNCelpYUjFjRTFoY0RvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjBhR2x6TG0xaGNDNXpaWFJXYVdWM0tGdDBhR2x6TG5CeWIzQnpMbXhoZEN3Z2RHaHBjeTV3Y205d2N5NXNiMjVkTENCMGFHbHpMbkJ5YjNCekxucHZiMjBwTzF4eVhHNGdJSDBzWEhKY2JseHlYRzRnSUdOeVpXRjBaVXhoZVdWeWN6b2dablZ1WTNScGIyNG9LU0I3WEhKY2JseHlYRzRnSUNBZ2RtRnlJRzE1VEdGNVpYSWdQU0JNTG0xaGNHSnZlQzVtWldGMGRYSmxUR0Y1WlhJb0tTNWhaR1JVYnloMGFHbHpMbTFoY0NrN1hISmNibHh5WEc0Z0lDQWdkbUZ5SUhSb2FYTk5ZWEFnUFNCMGFHbHpMbTFoY0R0Y2NseHVYSEpjYmx4eVhHNGdJQ0FnSkM1blpYUktVMDlPS0NkaGMzTmxkSE12WkdGMFlTOWphR2x1WVY5d2NtOTJhVzVqWlhOZmNHOXNlV2R2Ymk1cWMyOXVKeXdnWm5WdVkzUnBiMjRvWkdGMFlTa2dlMXh5WEc1Y2NseHVJQ0FnSUNBZ2JYbE1ZWGxsY2k1elpYUkhaVzlLVTA5T0tHUmhkR0VwTzF4eVhHNWNjbHh1WEhKY2JseHlYRzVjY2x4dUlDQWdJQ0FnYlhsTVlYbGxjaTVsWVdOb1RHRjVaWElvWm5WdVkzUnBiMjRvYkdGNVpYSXBJSHRjY2x4dVhISmNiaThxSUNBZ0lDQWdJQ0JzWVhsbGNpNWlhVzVrVEdGaVpXd29iR0Y1WlhJdVptVmhkSFZ5WlM1d2NtOXdaWEowYVdWekxrNUJUVVVzSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJRzV2U0dsa1pUb2dkSEoxWlZ4eVhHNGdJQ0FnSUNBZ0lIMHBMbUZrWkZSdktIUm9hWE5OWVhBcE8xeHlYRzRxTDF4eVhHNWNjbHh1WEhKY2JpOHFJQ0FnSUNBZ0lDQjJZWElnY0c5c2VXZHZia05sYm5SbGNpQTlJR3hoZVdWeUxtZGxkRUp2ZFc1a2N5Z3BMbWRsZEVObGJuUmxjaWdwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JNTG0xaGNtdGxjaWh3YjJ4NVoyOXVRMlZ1ZEdWeUtWeHlYRzRnSUNBZ0lDQWdJQ0FnTG1KcGJtUk1ZV0psYkNoc1lYbGxjaTVtWldGMGRYSmxMbkJ5YjNCbGNuUnBaWE11VGtGTlJTd2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnViMGhwWkdVNklIUnlkV1VzWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRzltWm5ObGREb2dXeTB6TlN3Z0xURXdNRjFjY2x4dUlDQWdJQ0FnSUNBZ0lIMHBYSEpjYmlBZ0lDQWdJQ0FnSUNBdVlXUmtWRzhvZEdocGMwMWhjQ2s3S2k5Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnYkdGNVpYSXViMjRvSjJOc2FXTnJKeXdnWm5WdVkzUnBiMjRvWlNrZ2UxeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lIWmhjaUJ3Y205MmFXNWpaVTVoYldVZ1BTQWtLSFJvYVhNcFd6QmRMbVpsWVhSMWNtVXVjSEp2Y0dWeWRHbGxjeTVPUVUxRkxuUnZURzkzWlhKRFlYTmxLQ2t1Y21Wd2JHRmpaU2d2SUM5bkxDQW5KeWs3WEhKY2JpQWdJQ0FnSUNBZ0lDQmpiMjV6YjJ4bExteHZaeWh3Y205MmFXNWpaVTVoYldVcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCOUtUc2dMeThnWlc1a0lHeGhlV1Z5SUdOc2FXTnJJR1YyWlc1MFhISmNibHh5WEc0Z0lDQWdJQ0I5S1RzZ0x5OGdaVzVrSUdWaFkyaE1ZWGxsY2x4eVhHNWNjbHh1WEhKY2JpQWdJQ0JNTG1kbGIwcHpiMjRvWkdGMFlTd2dlMXh5WEc0Z0lDQWdJQ0J2YmtWaFkyaEdaV0YwZFhKbE9pQm1kVzVqZEdsdmJpaG1aV0YwZFhKbExDQnNZWGxsY2lrZ2UxeHlYRzRnSUNBZ0lDQWdJSFpoY2lCc1lXSmxiQ0E5SUV3dWJXRnlhMlZ5S0d4aGVXVnlMbWRsZEVKdmRXNWtjeWdwTG1kbGRFTmxiblJsY2lncExDQjdYSEpjYmlBZ0lDQWdJQ0FnSUNCcFkyOXVPaUJNTG1ScGRrbGpiMjRvZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JqYkdGemMwNWhiV1U2SUNkc1lXSmxiQ0JzWVdKbGJDMG5JQ3NnYkdGNVpYSXVabVZoZEhWeVpTNXdjbTl3WlhKMGFXVnpMazVCVFVVdWRHOU1iM2RsY2tOaGMyVW9LUzV5WlhCc1lXTmxLQzhnTDJjc0lDY25LU3hjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdhSFJ0YkRvZ2JHRjVaWEl1Wm1WaGRIVnlaUzV3Y205d1pYSjBhV1Z6TGs1QlRVVXNYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHbGpiMjVUYVhwbE9pQmJNVEF3TENBME1GMWNjbHh1SUNBZ0lDQWdJQ0FnSUgwcFhISmNiaUFnSUNBZ0lDQWdmU2t1WVdSa1ZHOG9kR2hwYzAxaGNDazdYSEpjYmx4eVhHNHZLaUFnSUNBZ0lDQWdkbUZ5SUd4aFltVnNURzlqWVd3Z1BTQk1MbTFoY210bGNpaHNZWGxsY2k1blpYUkNiM1Z1WkhNb0tTNW5aWFJEWlc1MFpYSW9LU3dnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdhV052YmpvZ1RDNWthWFpKWTI5dUtIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1kyeGhjM05PWVcxbE9pQW5iR0ZpWld3dGJHOWpZV3duTEZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JvZEcxc09pQnNZWGxsY2k1bVpXRjBkWEpsTG5CeWIzQmxjblJwWlhNdVRFOURRVXhPUVUxRkxGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFkyOXVVMmw2WlRvZ1d6RXdNQ3dnTkRCZFhISmNiaUFnSUNBZ0lDQWdJQ0I5S1Z4eVhHNGdJQ0FnSUNBZ0lIMHBMbUZrWkZSdktIUm9hWE5OWVhBcE95b3ZYSEpjYmx4eVhHNGdJQ0FnSUNCOVhISmNiaUFnSUNCOUtUdGNjbHh1WEhKY2JpQWdJQ0IwYUdselRXRndMbTl1S0NkNmIyOXRaVzVrSnl3Z1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQWdJR052Ym5OdmJHVXViRzluS0hSb2FYTk5ZWEF1WjJWMFdtOXZiU2dwS1R0Y2NseHVJQ0FnSUNBZ2FXWWdLQ0IwYUdselRXRndMbWRsZEZwdmIyMG9LU0E4UFNBMElDa2dlMXh5WEc0Z0lDQWdJQ0FnSUNRb0p5NXNZV0psYkNjcExtTnpjeWduWkdsemNHeGhlU2NzSUNkdWIyNWxKeWs3WEhKY2JpQWdJQ0FnSUgxY2NseHVJQ0FnSUNBZ2FXWWdLQ0IwYUdselRXRndMbWRsZEZwdmIyMG9LU0E5UFQwZ05TQXBJSHRjY2x4dUlDQWdJQ0FnSUNBa0tDY3ViR0ZpWld3bktTNWpjM01vSjJScGMzQnNZWGtuTENBbllteHZZMnNuS1RzZ1hISmNiaUFnSUNBZ0lIMWNjbHh1SUNBZ0lIMHBYSEpjYmx4eVhHNWNjbHh1SUNBZ0lIMHBPeUF2THlCbGJtUWdaMlYwU2xOUFRseHlYRzVjY2x4dVhISmNiaUFnZlN4Y2NseHVYSEpjYmlBZ1kyOXRjRzl1Wlc1MFJHbGtUVzkxYm5RNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdVkzSmxZWFJsVFdGd0tTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NXRZWEFnUFNCMGFHbHpMbkJ5YjNCekxtTnlaV0YwWlUxaGNDaDBhR2x6TG1kbGRFUlBUVTV2WkdVb0tTazdYSEpjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdWJXRndJRDBnZEdocGN5NWpjbVZoZEdWTllYQW9kR2hwY3k1blpYUkVUMDFPYjJSbEtDa3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUhSb2FYTXVjMlYwZFhCTllYQW9LVHRjY2x4dUlDQWdJSFJvYVhNdVkzSmxZWFJsVEdGNVpYSnpLQ2s3WEhKY2JseHlYRzRnSUgwc1hISmNibHh5WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQnlaWFIxY200Z0tGeHlYRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQwbmJXRndKejQ4TDJScGRqNWNjbHh1SUNBZ0lDbGNjbHh1SUNCOVhISmNibHh5WEc1OUtUdGNjbHh1WEhKY2JseHlYRzR2S2x4eVhHNGdLaUJEYjI1MFlXbHVaWEpjY2x4dUlDb3ZYSEpjYm5aaGNpQkRiMjUwWVdsdVpYSWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEhKY2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJSEpsZEhWeWJpQW9YSEpjYmlBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lZMjl1ZEdGcGJtVnlYQ0krWEhKY2JpQWdJQ0FnSUNBZ1BFMWhjQ0JzWVhROVhDSXpOVndpSUd4dmJqMWNJakV3TlZ3aUlIcHZiMjA5WENJMVhDSXZQbHh5WEc0Z0lDQWdJQ0FnSUR4UVlXNWxiSE1nTHo1Y2NseHVJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FwWEhKY2JpQWdmVnh5WEc1OUtUdGNjbHh1WEhKY2JseHlYRzR2THlCU1pXNWtaWElnZEdobElGSmxZV04wSUdOdmJYQnZibVZ1ZEZ4eVhHNVNaV0ZqZEM1eVpXNWtaWElvWEhKY2JpQWdQRU52Ym5SaGFXNWxjaUF2UGl4Y2NseHVJQ0JrYjJOMWJXVnVkQzVuWlhSRmJHVnRaVzUwUW5sSlpDZ25iVzkxYm5RbktWeHlYRzRwWEhKY2JseHlYRzU5SUM4dklHVnVaQ0J0YjJSMWJHVWdaWGh3YjNKMFhISmNibjBwS0NrZ0x5OGdaVzVrSUdGdWIyNTViVzkxY3lCM2NtRndjR1Z5WEhKY2JseHlYRzVjY2x4dVhISmNibHh5WEc1Y2NseHVJbDE5Il19
