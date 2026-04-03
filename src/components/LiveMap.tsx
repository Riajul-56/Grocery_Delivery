"use client";
import L, { LatLngExpression } from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";

interface ILocation {
  latitude: number;
  longitude: number;
}

interface Iprops {
  userLocation: ILocation;
  deliveryBoyLocation: ILocation;
}

function LiveMap({ userLocation, deliveryBoyLocation }: Iprops) {
  const deliverBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
    iconSize: [45, 45],
  });

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    iconSize: [45, 45],
  });

  const center = [userLocation.latitude, userLocation.longitude];

  const linePositions =
    deliveryBoyLocation && userLocation
      ? [
          [userLocation.latitude, userLocation.longitude],
          [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        ]
      : [];

  return (
    <div className="w-full h-125 rounded-xl overflow-hidden shadow relative">
      {/* ==================== Map Container start ==================== */}
      <MapContainer
        className="w-full h-full"
        center={center as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userIcon}
        >
          <Popup>Delivery Address</Popup>
        </Marker>

        {deliveryBoyLocation && (
          <Marker
            position={[
              deliveryBoyLocation.latitude,
              deliveryBoyLocation.longitude,
            ]}
            icon={deliverBoyIcon}
          >
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}
        <Polyline positions={linePositions as any} color="green" />
      </MapContainer>

      {/* ==================== Map Container end ==================== */}
    </div>
  );
}

export default LiveMap;
