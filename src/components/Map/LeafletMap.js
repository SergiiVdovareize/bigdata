import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const LeafletMap = ({ lat, lng }) => {
  if (!lat || !lng) {
    return null;
  }

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[lat, lng]}>
        <Popup>
          A point at latitude: {lat}, longitude: {lng}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default LeafletMap;
