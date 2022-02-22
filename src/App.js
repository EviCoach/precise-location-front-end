import { MapContainer, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import './App.css';
import { useState } from 'react';
import NewAreaForm from './components/new_area_form/NewAreaForm';

function App() {
  const [mapLayers, setMapLayers ] = useState([]); 
  const _onCreate = event => {
    console.log(event);
    const { layerType, layer } = event;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;

      setMapLayers((layers) => [
        ...layers,
        {
          id: _leaflet_id,
          latLngs: layer.getLatLngs()[0]
        }
      ]);
    }
  }
  const _onEdited = event => {
    console.log(event);
  }
  const _onDeleted = event => {
    console.log(event);
  }
  const _onDrawStart = event => {
    console.log(event);
  }
  const _onDrawStop = event => {
    console.log(event);
  }

  return (
    <div className='map-view'>
      <MapContainer className='border-map' center={[51.505, -0.09]} zoom={13}>
        <FeatureGroup>
          <EditControl position='topright'
            onCreated={_onCreate}
            onEdited={_onEdited}
            onDeleted={_onDeleted}
            onDrawStart={_onDrawStart}
            onDrawStop={_onDrawStop}
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
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
      <NewAreaForm/>
    </div>
    
  );
}

export default App;
