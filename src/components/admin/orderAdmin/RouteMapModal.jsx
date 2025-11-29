import React, { useEffect, useRef, useState, useMemo } from "react";
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
  const [currentPosition, setCurrentPosition] = useState([originLat, originLng]);
  const [watchId, setWatchId] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (isOpen && order && originLat && originLng) {
      fetchRoute();
      startWatchingPosition();
    }
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isOpen, order, originLat, originLng, vehicle]);

  useEffect(() => {
    if (!isOpen) {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      setCurrentPosition([originLat, originLng]);
    }
  }, [isOpen, originLat, originLng, watchId]);

  const startWatchingPosition = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt không hỗ trợ GPS!");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentPosition([lat, lng]);
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 13);
        }
        // Optional: Refetch route nếu vị trí thay đổi đáng kể (ví dụ: > 100m)
        const distance = calculateDistance(currentPosition[0], currentPosition[1], lat, lng);
        if (distance > 100) {
          fetchRouteWithNewPosition(lat, lng);
        }
      },
      (err) => {
        let message = "Lỗi theo dõi GPS: ";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message += "User từ chối quyền truy cập vị trí";
            break;
          case err.POSITION_UNAVAILABLE:
            message += "Vị trí không khả dụng (GPS tắt?)";
            break;
          case err.TIMEOUT:
            message += "Timeout lấy vị trí";
            break;
          default:
            message += err.message;
        }
        toast.error(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    setWatchId(id);
    toast.success("Bắt đầu theo dõi vị trí realtime!");
  };

  const fetchRoute = async (lat = originLat, lng = originLng) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderRoute(order.id, lat, lng, vehicle);
      setRouteData(data.data);
    } catch (err) {
      setError(err.message);
      toast.error(`Lỗi gọi Route API: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRouteWithNewPosition = (lat, lng) => {
    fetchRoute(lat, lng);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
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

  const latLngs = useMemo(() => {
    if (!routeData?.paths?.length) return [];
    const path = routeData.paths[0];
    return decodePolyline(path.points);
  }, [routeData]);

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
    const center = currentPosition;
    const bounds = latLngs.length > 0 ? latLngs : [[originLat, originLng], [originLat, originLng]];

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
          {latLngs.length > 0 && (
            <Polyline positions={latLngs} color="#1E90FF" weight={5} />
          )}
          <Marker position={currentPosition}>
            <Popup>🚀 Vị trí shipper hiện tại</Popup>
          </Marker>
          {latLngs.length > 0 && (
            <Marker position={latLngs[latLngs.length - 1]}>
              <Popup>📦 Địa chỉ giao hàng</Popup>
            </Marker>
          )}
        </MapContainer>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-bold mb-2">📍 Hướng dẫn:</h4>
          <p>Khoảng cách ước tính: {Math.round(path.distance)}m</p>
          <p>Thời gian ước tính: {Math.round(path.time / 60000)} phút</p>
          <ol className="mt-2 list-decimal pl-4 space-y-1 text-sm">
            {path.instructions?.map((inst, idx) => (
              <li key={idx}>
                {inst.text} ({Math.round(inst.distance)}m, {inst.street_name}, {inst.time ? `${Math.round(inst.time / 60000)} phút` : "n/a"})
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
          <h2 className="text-xl font-bold">Theo dõi giao hàng realtime - Order {order.orderCode}</h2>
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