import { useEffect, useState, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import Map from "react-map-gl";
import { $userInfo } from "../store/authStore";
import { useStore } from "@nanostores/react";

interface Info {
  latitude: number;
  longitude: number;
  name: string;
}

const ReactMapBox = () => {
  const user = useStore($userInfo);

  const [viewport, setViewport] = useState({
    latitude: 37.7749, // Replace with your latitude
    longitude: -122.4194, // Replace with your longitude
    zoom: 13,
  });

  const [popupInfo, setPopupInfo] = useState<Info | null>(null);

  const markers: Info[] = [
    { latitude: 37.7749, longitude: -122.4194, name: "Marker 1" },
    // Add more markers as needed
  ];

  return (
    // <Map
    //   {...viewport}
    //   mapStyle="mapbox://styles/mapbox/streets-v11"
    //   accessToken="pk.eyJ1IjoiYWthc2h0aGl0YW1lOTkiLCJhIjoiY2xxd2Qxd3gwMDFpaDJsbmtjbTJ3NDgwNiJ9.rw74N0qTJq6RODjfua_q9A"
    // >
    //   {markers.map((marker, index) => (
    //     <Marker
    //       key={index}
    //       latitude={marker.latitude}
    //       longitude={marker.longitude}
    //     >
    //       <div
    //         className="marker"
    //         onMouseEnter={() => setPopupInfo(marker)}
    //         onMouseLeave={() => setPopupInfo(null)}
    //       >
    //         {/* Marker content */}
    //       </div>
    //     </Marker>
    //   ))}

    //   {popupInfo && (
    //     <Popup
    //       latitude={popupInfo.latitude}
    //       longitude={popupInfo.longitude}
    //       closeButton={false}
    //       anchor="top"
    //     >
    //       <div>
    //         <h3>{popupInfo.name}</h3>
    //       </div>
    //     </Popup>
    //   )}
    // </Map>
    <></>
  );
};

export default ReactMapBox;
