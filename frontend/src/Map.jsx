import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import CuboidScene from "./CuboidScene";
import "./Map.css";

// Set the Mapbox access token for the API requests

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2stbW9oYW1hZHNob2FpYi0xMjMiLCJhIjoiY2xmY3VpNjhkMHI2NDN3bXZtMXFjcTI2biJ9.Q7rj96t5-5AUOVnXL5YSGw";

const Map = () => {
  const [viewport, setViewport] = useState({
    lng: -122.4194,
    lat: 37.7749,
    zoom: 10,
  });
  const [mapImages, setMapImages] = useState([]);
  const [markerLngLat, setMarkerLngLat] = useState([
    viewport.lng,
    viewport.lat,
  ]);
  const mapContainer = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Create a new Mapbox map instance

    const map = new mapboxgl.Map({
      container: mapContainer.current, // Reference to the map container DOM element
      style: "mapbox://styles/mapbox/streets-v11", // Mapbox style URL
      center: [viewport.lng, viewport.lat], // Initial map center coordinates
      zoom: viewport.zoom, // Initial map zoom level
      preserveDrawingBuffer: true, // Enable capturing the map as an image
    });

    // Create a marker that can be dragged around on the map
    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat(markerLngLat)
      .addTo(map);
    markerRef.current = marker;
    // Update the marker's coordinates when it's dragged
    marker.on("drag", () => {
      setMarkerLngLat(marker.getLngLat());
    });
    // Move the marker to the clicked location and update its coordinates
    map.once("click", (e) => {
      setMarkerLngLat([e.lngLat.lng, e.lngLat.lat]);
      marker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
    });
    // Set up the event listener for capturing the map as an image
    const captureButton = document.getElementById("capture-button");

    const renderImage = () => {
      map.getCanvas().toBlob((blob) => {
        const url = URL.createObjectURL(blob, { type: "image/png" });

        // console.log(url)
        setMapImages([...mapImages, url]);
      });
    };

    captureButton.addEventListener("click", renderImage);
    // Clean up the map instance and the event listener when the component unmounts

    return () => {
      map.remove();
      captureButton.removeEventListener("click", renderImage);
    };
  }, []);
  // Update the viewport coordinates to match the marker's coordinates

  useEffect(() => {
    setViewport({ ...viewport, lng: markerLngLat[0], lat: markerLngLat[1] });
  }, [markerLngLat]);

  return (
    <div>
      <div ref={mapContainer} style={{ height: "400px" }} />
      <button id="capture-button">Capture Region</button>
      {/* Display the captured map images as image elements */}

      {mapImages.map((image, index) => (
        <div>
          {/* <img key={index} src={image} alt="Map capture" /> */}
          <CuboidScene img={image}></CuboidScene>
        </div>
      ))}
    </div>
  );
};

export default Map;
