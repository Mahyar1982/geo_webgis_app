/* global document */
import * as React from 'react';
import {useState, useEffect, useRef} from 'react';
import InteractiveMap, { Marker } from 'react-map-gl';
import { Editor, DrawPolygonMode, EditingMode } from 'react-map-gl-draw';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFoeWFhciIsImEiOiJja2lhOTBnbm4wbjBsMnNsYm16dGl6dmNjIn0.gY-LraqL_m5wYmfC_Hwr1g'; // Set your mapbox token here

function App() {

  const [viewport, setViewport] = useState({
    latitude: 60.185686975969844,
    longitude: 24.938107788227025,
    zoom: 14,
    bearing: 0,
    pitch: 0
  });

  const _editorRef = useRef()

  const [mode, modeHandler] = useState(null)

  const [markers, setMarkers] = React.useState([])
  const [polygonPoints, setPolygonPoints] = React.useState([])
  const [isPolygon, setIsPolygon] = React.useState(false)

  const handleClick = ({lngLat: [longitude, latitude]}) =>
    {
      if (!isPolygon) {
        setMarkers(markers => [...markers, { longitude, latitude }])
      } else {
        setPolygonPoints(polygonPoints => [...polygonPoints, { longitude, latitude }])
      }
    }

  const handleMarkerRemove = (i) => {
    {
      if (!isPolygon) {
        setMarkers(markers.filter(item => item.longitude !== markers[i].longitude))
      }
    }
  }

  const handlePolygonButton = () => {
    setIsPolygon(isPolygon => !isPolygon)
  }

  useEffect(() => {
    console.log(isPolygon)
  }, [isPolygon])

  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null)

  const _onSelect = options => {
    setSelectedFeatureIndex({selectedFeatureIndex: options && options.selectedFeatureIndex});
  };

  const _onDelete = () => {
    const selectedIndex = selectedFeatureIndex;
    if (selectedIndex !== null && selectedIndex >= 0) {
      _editorRef.deleteFeatures(selectedIndex);
    }
  };

  const _onUpdate = ({editType}) => {
    if (editType === 'addFeature') {
      this.setState({
        mode: new EditingMode()
      });
    }
  };

  return (
    <>
      <button
        onClick={() => handlePolygonButton()}
        style={{ position: 'absolute',
                 top: 20,
                 left: 20,
                 height: 40,
                 width: 80,
                 borderRadius: 5,
                 zIndex: 1,
                 color: 'white',
                 backgroundColor: isPolygon ? 'green' : 'red' }}>
          Polygon
      </button>
      <InteractiveMap
        {...viewport}
        onClick={handleClick}
        width="100vw"
        height="100vh"
        mapStyle="mapbox://sprites/mapbox/streets-v8"
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        {markers.length
          ? markers.map((m, i) => (
              // <Marker /> just places its children at the right lat lng.
              <Marker {...m} key={i}>
                <img
                  onClick={() => handleMarkerRemove(i)}
                  src={"./logo192.png"}
                  style={{ width: 50, height: 50, zIndex: 1 }} />
              </Marker>
            ))
          : null
        }
        {
          isPolygon ?
            <>
                <button
                  onClick={() => handlePolygonButton()}
                  style={{ position: 'absolute',
                          top: 80,
                          left: 20,
                          height: 40,
                          width: 80,
                          borderRadius: 5,
                          zIndex: 1,
                          color: 'white',
                          backgroundColor: 'gray' }}>
                    Delete Polygon
              </button>
              <Editor
                // to make the lines/vertices easier to interact with
                ref={_editorRef}
                clickRadius={12}
                mode={new DrawPolygonMode()}
                onSelect={() => _onSelect}
                // onUpdate={_onUpdate}
              />
            </>
          :
            null
        }
       {/* {_renderToolbar()} */}
      </InteractiveMap>
    </>
  );
}

document.body.style.margin = 0;

export default App;
