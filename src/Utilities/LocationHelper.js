export function transformLayersToAreas(layers = []){
    const areas = layers.map((layer) => {
        const area = {};
        area.id = layer.id;
        // area.name = layer.name;
        // area.description = layer.description;
        area.type = "area";
        area.coordinates = layer.latLngs.map(latLng => {
            return [latLng.lng, latLng.lat]
        });
        if (area.coordinates.length > 1) { 
            area.type = "regions";
        } 
        return area;
    });
    return areas;
}