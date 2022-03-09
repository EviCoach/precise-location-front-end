export function transformLayersToAreas(layers = []){
    const areas = layers.map((layer) => {
        const area = {};
        area.coordinates = layer.latLngs.map(latLng => {
            return [latLng.lng, latLng.lat]
        });
        area.coordinates.push(area.coordinates[0]); // close the polygon
        return area;
    });
    return areas;
}
