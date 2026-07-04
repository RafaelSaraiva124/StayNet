"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import { geocodeLocation } from "@/lib/actions/map.action";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
  location: string;
  zoom?: number;
}

const Map = ({ location, zoom = 19 }: MapProps) => {
  const [position, setPosition] = useState<LatLngTuple | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadLocation = async () => {
      try {
        const coords = await geocodeLocation(location);

        if (coords) {
          setPosition([coords.lat, coords.lon]);
          setError(false);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    };

    loadLocation();
  }, [location]);

  if (error) {
    return (
      <p className="flex justify-center items-center text-sm  text-center">
        Não foi possível carregar a localização
      </p>
    );
  }

  if (!position) {
    return (
      <p className="text-sm text-gray-500 text-center">A carregar mapa…</p>
    );
  }

  return (
    <MapContainer
      attributionControl={false}
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>{location}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
