import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LeafletMap = ({data}) => {
  const { position: {lat, lng} = {}, path } = data
  if (!lat || !lng) {
    return null;
  }

  const DynamicMarker = () => {
    const map = useMap();
  
    // Update the map's center when the position changes
    useEffect(() => {
      map.setView([lat, lng]);
    }, [lat, lng, map]);
  
    return (
      <Marker position={[lat, lng]}>
        <Popup>
          Dynamic position: {lat}, {lng}
        </Popup>
      </Marker>
    );
  };

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={18}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
       <Polyline positions={path} color="blue" />
       <DynamicMarker lat={lat} lng={lng} />
    </MapContainer>
  );
};

export default LeafletMap;
