export function transformLayersToAreas(layers = []){
    const areas = layers.map((layer) => {
        const area = {};
        area.id = layer.id;
        area.coordinates = layer.latLngs.map(latLng => {
            // console.log("longitude", latLng.lng, "latitude", latLng.lat )
            return [latLng.lng, latLng.lat]
        });
        return area;
    });
    return areas;
}