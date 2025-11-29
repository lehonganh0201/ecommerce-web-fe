import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { getOrderRoute } from "@/apis/shipping";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const RouteMapModal = ({ isOpen, onClose, order, originLat, originLng, vehicle = "car" }) => {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (isOpen && order && originLat && originLng) {
      fetchRoute();
    }
  }, [isOpen, order, originLat, originLng, vehicle]);

  const fetchRoute = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderRoute(order.id, originLat, originLng, vehicle);
      setRouteData(data.data); // Giả sử response là { data: RouteResponse }
    } catch (err) {
      setError(err.message);
      toast.error(`Lỗi gọi Route API: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const decodePolyline = (encoded) => {
    let index = 0,
      lat = 0,
      lng = 0;
    const coordinates = [];
    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
      lng += dlng;

      coordinates.push([lat * 1e-5, lng * 1e-5]);
    }
    return coordinates.map((coord) => [coord[0], coord[1]]);
  };

  if (!isOpen) return null;

  const renderMap = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-100">
          <div className="text-lg">Đang tải route...</div>
        </div>
      );
    }

    if (error || !routeData?.paths?.length) {
      return (
        <div className="flex items-center justify-center h-96 bg-red-50 border border-red-200">
          <div className="text-red-600">Lỗi: {error || "Không có đường đi"}</div>
        </div>
      );
    }

    const path = routeData.paths[0];
    const pointsEncoded = path.points;
    const latLngs = decodePolyline(pointsEncoded);

    const center = [originLat, originLng];
    const bounds = latLngs;

    return (
      <>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
          bounds={bounds}
          boundsOptions={{ padding: [20, 20] }}
          ref={mapRef}
        >
          <TileLayer
            url={`${import.meta.env.VITE_API_URL}/maps/tiles/{z}/{x}/{y}`}
            attribution="VietMap via Proxy"
          />
          <Polyline positions={latLngs} color="#1E90FF" weight={5} />
          <Marker position={[originLat, originLng]}>
            <Popup>🚀 Vị trí hiện tại</Popup>
          </Marker>
          <Marker position={latLngs[latLngs.length - 1]}>
            <Popup>📦 Địa chỉ giao hàng</Popup>
          </Marker>
        </MapContainer>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-bold mb-2">📍 Hướng dẫn:</h4>
          <p>Khoảng cách: {Math.round(path.distance)}m</p>
          <p>Thời gian ước tính: {Math.round(path.time / 60000)} phút</p>
          <ol className="mt-2 list-decimal pl-4 space-y-1 text-sm">
            {path.instructions?.map((inst, idx) => (
              <li key={idx}>
                {inst.text} ({Math.round(inst.distance)}m, {inst.streetName})
              </li>
            ))}
          </ol>
        </div>
      </>
    );
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Chỉ đường giao hàng - Order {order.orderCode}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          {renderMap()}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RouteMapModal;