import { MapContainer, TileLayer, Marker, Popup, FeatureGroup, Polygon, GeoJSON, useMapEvents, useMapEvent } from 'react-leaflet'
// import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import './App.css';
import axios from 'axios';
import AppFab from "./components/appFab/AppFab";
import { useState } from 'react';
import NewAreaForm from './components/new_area_form/NewAreaForm';
const _axios = axios.create({
  baseURL: 'http://localhost:3000/'
});
const purpleOptions = { color: 'purple' }

function App() {
  const [show, setShow] = useState(false);
  const [mapLayers, setMapLayers] = useState([]);
  const [places, setPlaces] = useState([]);

  const removeForm = () => {
    // setMapLayers([]);
    setShow(false);
  }

  const _onCreate = event => {
    const { layerType, layer } = event;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;
      setShow(true);

      console.log("layer latlngs", layer.getLatLngs());
      setMapLayers((previousLayers) => {
        const newLayers = [
          ...previousLayers,
          {
            id: _leaflet_id,
            latLngs: layer.getLatLngs()[0]
          }
        ];
        return newLayers;
      });
    }
  }

  const _onEdited = event => {
    const { layers: { _layers } } = event;
    Object.values(_layers).map(({ _leaflet_id, editing }) => {
      console.log("Editing value: ", editing);
      setMapLayers((layers) => {
        return layers.map((l) => (l.id === _leaflet_id)
          ? { ...l, latLngs: { ...editing.latlngs[0] } }
          :
          l
        );
      })
    });
  }

  const _onDeleted = event => {
    console.log("Deleted", event);
    const { layers: { _layers } } = event;
    Object.values(_layers).map(({ _leaflet_id }) => {
      setMapLayers((previousLayers) => previousLayers
        .filter((l) => l.id !== _leaflet_id));
    });
  }

  const _onDrawStart = event => {
    console.log(event);
  }
  const _onDrawStop = event => {
    console.log(event);
  }

  const _onEditVertex = event => {
    console.log("Edit Vertex", event);
  }

  const _onEditMove = event => {
    console.log("Edit Move", event);
  }
  const _onDrawVertex = event => {
    console.log("Vertex drawn", event)
  }
  const _onDeleteVertex = event => {
    console.log("Vertex deleted", event);
  }
  let regions;

  const _onTouch = event => {
    /**
     * fetch mapped data from the backend
     * map through them
     * and display polygons on the map
     */
    _axios.get('/api/v2/areas').then(data => {
      const newPolygons = [];
      console.log(data.data.data);

      let placesData = data.data.data;
      placesData.forEach(place => {
        newPolygons.push(place.geometry.coordinates[0].map(value => value.reverse()));
      });
      setPlaces(newPolygons);


      // const places = data.data.data[0];
      // console.log("The places are ", JSON.stringify(places));
      // console.log("Places ", JSON.stringify(places.geometry.coordinates[0]));
      // // regions = places.map(place => <Polygon pathOptions={purpleOptions} positions={place.geometry.coordinates} />);
      // regions = <Polygon pathOptions={purpleOptions} positions={places.geometry.coordinates[0]} />;
      // setPlaces(places.geometry.coordinates[0]);
    });
  }

  function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      click(event) {
        // map.locate()
        const data = {};
        data.lat = event.latlng.lat;
        data.lng = event.latlng.lng;
        _axios.get(`/api/v2/areas/users?lat=${data.lat}&lng=${data.lng}`)
          .then(function (response) {
            console.log("Response from getting all users in a region", response.data);
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        console.log(event.latlng)
        setPosition(event.latlng)
        map.flyTo(event.latlng, map.getZoom())
      },
      // locationfound(e) {
      //   setPosition(e.latlng)
      //   map.flyTo(e.latlng, map.getZoom())
      // },
    })

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }

  console.log("The map layers in App component", mapLayers);

  return (
    <div>
      <AppFab onTouch={_onTouch} />

      <div className='map-view'>

        {show ? <NewAreaForm handler={removeForm} layers={mapLayers} /> : <div></div>}
        <MapContainer center={[6.451896921370773, 3.4709543175995354]} zoom={15}>
          {/* {places.map(place => <Polygon key={Math.random()} pathOptions={purpleOptions} positions={places[0]} />)} */}
          <Polygon key={Math.random()} pathOptions={purpleOptions} positions={places} />
          <FeatureGroup>
            <EditControl position='topright'
              onEditVertex={_onEditVertex}
              onEditMove={_onEditMove}
              onCreated={_onCreate}
              onEdited={_onEdited}
              onDeleted={_onDeleted}
              onDrawStart={_onDrawStart}
              onDrawStop={_onDrawStop}
              onDrawVertex={_onDrawVertex}
              onDeleteVertex={_onDeleteVertex}

              draw={{
                rectangle: false,
                polyline: false,
                circle: false,
                circlemarker: false,
                marker: false
              }} />
          </FeatureGroup>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
          <LocationMarker />

        </MapContainer>

      </div>
    </div>
  );
}

export default App;
