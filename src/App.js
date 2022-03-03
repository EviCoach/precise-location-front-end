import { MapContainer, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet'
// import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import './App.css';
import { useState } from 'react';
import NewAreaForm from './components/new_area_form/NewAreaForm';

function App() {
  const [show, setShow] = useState(false);
  const [mapLayers, setMapLayers] = useState([]);

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
    Object.values(_layers).map(({_leaflet_id}) => {
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

  console.log("The map layers in App component", mapLayers);

  return (
    <div className='map-view'>
      {show ? <NewAreaForm handler={removeForm} layers={mapLayers} /> : <div></div>}
      <MapContainer center={[6.451896921370773, 3.4709543175995354]} zoom={15}>
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
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;
