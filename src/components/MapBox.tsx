import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactDOM from "react-dom";
import { useStore } from "@nanostores/react";
import { $userInfo } from "../store/authStore";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const geoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Point A",
        "marker-color": "#00ff00",
        "marker-size": "medium",
        "marker-symbol": "star",
      },
      geometry: {
        type: "Point",
        coordinates: [-73.9749, 40.7736], // Longitude, Latitude
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Point B",
        "marker-color": "#0000ff",
        "marker-size": "medium",
        "marker-symbol": "circle",
      },
      geometry: {
        type: "Point",
        coordinates: [-74.006, 40.7128], // Longitude, Latitude
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Point C",
        "marker-color": "#ff0000",
        "marker-size": "medium",
        "marker-symbol": "triangle",
      },
      geometry: {
        type: "Point",
        coordinates: [-73.9876, 40.7549], // Longitude, Latitude
      },
    },
  ],
};

const CustomMarkerContent = () => (
  <div className="rounded-full">
    <img
      style={{ maxWidth: "50%" }}
      src={`https://placekitten.com/g/${60}/${60}/`}
    />
  </div>
);

const MapBox = () => {
  const user = useStore($userInfo);
  const [draw, setDraw] = useState<MapboxDraw | null>(null);
  console.log("user", JSON.stringify(user));
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWthc2h0aGl0YW1lOTkiLCJhIjoiY2xxd2Qxd3gwMDFpaDJsbmtjbTJ3NDgwNiJ9.rw74N0qTJq6RODjfua_q9A";

  const mapContainerRef = useRef(null);
  const [lng] = useState(-89.5);
  const [lat] = useState(44.5);
  const [zoom] = useState(4);

  const handleClick = () => {
    console.log("first");
  };

  const initializeMap = () => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/akashthitame99/clrg8d4w600ic01qvg1ui6s9h",
      center: [lng, lat],
      zoom: zoom,
    });

    geoJson.features.forEach((feature) => {
      const markerElement = document.createElement("div");
      ReactDOM.render(<CustomMarkerContent />, markerElement);

      const popup = new mapboxgl.Popup({ offset: 25 }).setText(
        feature.properties.name
      );

      new mapboxgl.Marker(markerElement)
        .setLngLat([
          feature.geometry.coordinates[0],
          feature.geometry.coordinates[1],
        ])
        .setPopup(popup)

        .addTo(map);

      markerElement.addEventListener("click", () => {
        handleClick();
      });
    });

    let hoveredPolygonId: any = null;
    let currentPopup: any = null;

    map.on("load", () => {
      map.addSource("states", {
        type: "geojson",
        data: "https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson",
      });

      map.addSource("earthquakes", {
        type: "geojson",

        data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "earthquakes",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#f28cb1",
          "circle-radius": 20,
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "earthquakes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "earthquakes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId =
          features[0].properties && features[0].properties.cluster_id;
        map
          .getSource("earthquakes")
          .getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });

      map.on("click", "unclustered-point", (e) => {
        if (e.features) {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const mag = e.features[0].properties && e.features[0].properties.mag;
          const tsunami =
            e.features[0].properties && e.features[0].properties.tsunami === 1
              ? "yes"
              : "no";

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`)
            .addTo(map);
        }
      });

      map.addLayer({
        id: "state-fills",
        type: "fill",
        source: "states",
        layout: {},
        paint: {
          "fill-color": "#627BC1",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.6,
            0.3,
          ],
        },
      });

      // map.addLayer({
      //   id: "state-borders",
      //   type: "line",
      //   source: "states",
      //   layout: {},
      //   paint: {
      //     "line-color": "#627BC1",
      //     "line-width": 2,
      //   },
      // });

      map.on("mousemove", "state-fills", (e) => {
        if (currentPopup) {
          currentPopup.remove();
        }

        if (e.features && e.features.length > 0) {
          if (hoveredPolygonId !== null) {
            map.setFeatureState(
              { source: "states", id: hoveredPolygonId },
              { hover: false }
            );
          }
          hoveredPolygonId = e.features[0].id;
          currentPopup = new mapboxgl.Popup({ closeButton: false })
            .setLngLat(e.lngLat)
            .setHTML(
              e.features[0].properties && e.features[0].properties.STATE_NAME
            )
            .addTo(map);
          map.setFeatureState(
            { source: "states", id: hoveredPolygonId },
            { hover: true }
          );
        }
      });

      map.on("mouseleave", "state-fills", () => {
        if (hoveredPolygonId !== null) {
          map.setFeatureState(
            { source: "states", id: hoveredPolygonId },
            { hover: false }
          );
        }
        hoveredPolygonId = null;
      });

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    const drawInstance = new MapboxDraw({
      displayControlsDefault: false,
    });

    map.addControl(drawInstance);
    setDraw(drawInstance);

    map.on("draw.create", function (e) {
      const features = e.features;
      console.log("create", features);
    });

    map.on("draw.update", function (e) {
      const features = e.features;
      const all = draw?.getAll();
      console.log("creaupdatete", all);
    });

    map.on("style.load", function () {
      map.setPaintProperty("", "fill-color", "blue");
    });

    return () => map.remove();
  };

  useEffect(() => {
    initializeMap();
  }, [lat, lng, zoom]);
  const handleDrawButtonClick = () => {
    draw && draw.changeMode("draw_polygon");
  };

  const handleClearMapBounds = () => {
    draw && draw.deleteAll();
  };

  return (
    <>
      <div>map</div>
      <div
        style={{ height: 600, width: 800, position: "relative" }}
        ref={mapContainerRef}
      >
        <button
          className="absolute z-10 top-4 right-6 p-2 bg-white rounded-md w-24 h-9"
          onClick={handleDrawButtonClick}
        >
          Draw
        </button>
        <button
          className="absolute z-10 bottom-6 right-6 bg-white rounded-md w-28 h-9"
          onClick={handleClearMapBounds}
        >
          Clear Map Bounds
        </button>
      </div>
    </>
  );
};

export default MapBox;
