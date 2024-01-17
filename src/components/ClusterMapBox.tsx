import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

const sampleGeoJson = {
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
        coordinates: [-73.9749, 40.7736],
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
        coordinates: [-74.006, 40.7128],
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
        coordinates: [-73.9876, 40.7549],
      },
    },
  ],
};

const ClusterMapBox = () => {
  const handleClick = () => {
    console.log("clicked");
  };
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWthc2h0aGl0YW1lOTkiLCJhIjoiY2xxd2Qxd3gwMDFpaDJsbmtjbTJ3NDgwNiJ9.rw74N0qTJq6RODjfua_q9A";
  const mapContainerRef = useRef(null);
  const [lng] = useState(-73.9749);
  const [lat] = useState(40.7736);
  const [zoom] = useState(12);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    map.on("load", () => {
      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true. GL-JS will
      // add the point_count property to your source data.
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
          "circle-color": "#f1f075",
          "circle-radius": 10,
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
      // map.add

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
        const clusterId = features[0].properties.cluster_id;
        map
          .getSource("earthquakes")
          .getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.tsunami,
              zoom: zoom,
            });
          });
      });

      map.on("click", "unclustered-point", (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const mag = e.features[0].properties.mag;
        const tsunami = e.features[0].properties.tsunami === 1 ? "yes" : "no";

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`)
          .addTo(map);
      });

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => map.remove();
  }, [lat, lng, zoom]);

  return (
    <>
      <div>Map with Layer</div>
      <div className="h-96" ref={mapContainerRef} />

      <button onClick={handleClick}>Click</button>
    </>
  );
};

export default ClusterMapBox;

// map.on("load", () => {
//   map.addSource("national-park", {
//     type: "geojson",
//     data: {
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           properties: {},
//           geometry: {
//             coordinates: [
//               [
//                 [73.8584108715217, 18.49992211468448],
//                 [73.85580023467611, 18.475658244484208],
//                 [73.85997725362864, 18.448419198175344],
//                 [73.87616320206502, 18.44990507579581],
//                 [73.8850393673373, 18.454362631518364],
//                 [73.90801297157174, 18.4504003654785],
//                 [73.89130489576493, 18.482591129376317],
//                 [73.87668532943437, 18.503883236548788],
//                 [73.8584108715217, 18.49992211468448],
//               ],
//             ],
//             type: "Polygon",
//           },
//         },
//         {
//           type: "Feature",
//           properties: {},
//           geometry: {
//             coordinates: [
//               [
//                 [73.87616320206502, 18.50437837033745],
//                 [73.89757042419262, 18.505863763113126],
//                 [73.92889806632894, 18.503388101327104],
//                 [73.9372521042329, 18.561804163620636],
//                 [73.89078276839564, 18.54942954657527],
//                 [73.8834729852303, 18.54546947967451],
//                 [73.87355256522054, 18.530618411124706],
//                 [73.85423385256922, 18.525667768145013],
//                 [73.85788874415235, 18.50041725992915],
//                 [73.87616320206502, 18.50437837033745],
//               ],
//             ],
//             type: "Polygon",
//           },
//         },
//         {
//           type: "Feature",
//           properties: {},
//           geometry: {
//             coordinates: [
//               [
//                 [73.92837593896067, 18.503883236548788],
//                 [73.89861467893019, 18.505863763113126],
//                 [73.87720745680372, 18.50487350269509],
//                 [73.89182702313428, 18.480115131241362],
//                 [73.90853509894, 18.4504003654785],
//                 [73.93307508528036, 18.455848457710644],
//                 [73.93359721264966, 18.467734604240874],
//                 [73.93203083054277, 18.48605746667971],
//                 [73.93464146738731, 18.50041725992915],
//                 [73.92837593896067, 18.503883236548788],
//               ],
//             ],
//             type: "Polygon",
//           },
//         },
//         {
//           type: "Feature",
//           properties: {},
//           geometry: {
//             coordinates: [
//               [
//                 [73.9372521042329, 18.562299129639413],
//                 [73.92889806632894, 18.50487350269509],
//                 [73.93568572212595, 18.50041725992915],
//                 [73.95187167056343, 18.49992211468448],
//                 [73.95291592530103, 18.508339389096022],
//                 [73.99050909586501, 18.526657908209273],
//                 [73.98528782217596, 18.580116949796576],
//                 [73.966491236894, 18.577147442397333],
//                 [73.9372521042329, 18.562299129639413],
//               ],
//             ],
//             type: "Polygon",
//           },
//         },
//         {
//           type: "Feature",
//           properties: {},
//           geometry: {
//             coordinates: [
//               [
//                 [73.85997725362864, 18.448419198175344],
//                 [73.87459681995921, 18.448419198175344],
//                 [73.88295085786206, 18.454362631518364],
//                 [73.90749084420241, 18.4504003654785],
//                 [73.93307508528036, 18.45634373025088],
//                 [73.93307508528036, 18.48754301834846],
//                 [73.93464146738731, 18.50041725992915],
//                 [73.95239379793176, 18.50041725992915],
//                 [73.95343805266933, 18.5073491429997],
//                 [73.98946484112741, 18.52764804253961],
//                 [73.98476569480667, 18.580116949796576],
//                 [73.9372521042329, 18.563289057371264],
//                 [73.88556149470656, 18.548439538458794],
//                 [73.87303043785226, 18.531608522517317],
//                 [73.85371172520095, 18.525667768145013],
//                 [73.85788874415235, 18.49992211468448],
//                 [73.85475597993852, 18.47714388627554],
//                 [73.85997725362864, 18.448419198175344],
//               ],
//             ],
//             type: "Polygon",
//           },
//         },
//         {
//           type: "Feature",
//           properties: {},
//           geometry: {
//             coordinates: [73.95396018003862, 18.541014294653323],
//             type: "Point",
//           },
//         },
//         {
//           type: "Feature",
//           properties: {},
//           geometry: {
//             coordinates: [73.97219910344404, 18.557127325885375],
//             type: "Point",
//           },
//         },
//       ],
//     },
//   });

//   map.addLayer({
//     id: "outlines",
//     type: "circle",
//     source: "national-park",
//     layout: {},
//     paint: {
//       "circle-color": "#000",
//     },
//     filter: ["==", "$type", "Point"],
//   });

//   map.addLayer({
//     id: "pune_layers",
//     type: "fill",
//     source: "national-park",
//     layout: {},
//     paint: {
//       "fill-color": "#627BC1",
//       "fill-opacity": [
//         "case",
//         ["boolean", ["feature-state", "hover"], false],
//         1,
//         0.5,
//       ],
//     },
//     filter: ["==", "$type", "Polygon"],
//   });

//   map.addLayer({
//     id: "outline",
//     type: "line",
//     source: "national-park",
//     layout: {},
//     paint: {
//       "line-color": "#000",
//       "line-width": 3,
//     },
//   });

//   map.on("mousemove", "pune_layers", (e) => {
//     if (e.features && e.features.length > 0) {
//       if (hoveredPolygonId !== null) {
//         map.setFeatureState(
//           { source: "national-park", id: hoveredPolygonId },
//           { hover: false }
//         );
//       }
//       hoveredPolygonId = e.features[0].id;
//       map.setFeatureState(
//         { source: "national-park", id: hoveredPolygonId },
//         { hover: true }
//       );
//     }
//   });

//   // When the mouse leaves the state-fill layer, update the feature state of the
//   // previously hovered feature.
//   map.on("mouseleave", "pune_layers", () => {
//     if (hoveredPolygonId !== null) {
//       map.setFeatureState(
//         { source: "national-park", id: hoveredPolygonId },
//         { hover: false }
//       );
//     }
//     hoveredPolygonId = null;
//   });
// });
