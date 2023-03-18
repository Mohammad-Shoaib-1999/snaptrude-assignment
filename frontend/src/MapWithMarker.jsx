import React,{useState,useRef} from 'react'
import GoogleMapReact, { Marker } from 'google-map-react';
import html2canvas from 'html2canvas';


const MapWithMarker = ({ center, zoom, onMapLoad }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const mapRef = useRef(null);

  const handleApiLoaded = (map, maps) => {
    // Save map instance to a ref so that we can access it later
    mapRef.current = map;

    // Get the bounds of the map
    const bounds = new maps.LatLngBounds();
    map.fitBounds(bounds);
    setMapBounds(bounds);

    // Listen for bounds changed event to update the state
    maps.event.addListener(map, 'bounds_changed', () => {
      setMapBounds(map.getBounds());
    });

    // Call the onMapLoad callback with the map instance
    onMapLoad(map);
  };

  const handleMapClick = (event) => {
    // Set the marker position to the clicked location
    setMarkerPosition({ lat: event.lat, lng: event.lng });
  };

  const captureVisibleRegion = () => {
    // Check if mapBounds is not null
    if (mapBounds) {
      // Get the HTML element that contains the map
      const mapElement = mapRef.current.getDiv();

      // Use html2canvas library to capture an image of the visible region
      html2canvas(mapElement, { useCORS: true, allowTaint: true }).then((canvas) => {
        // Display the image in a new tab
        const imageDataUrl = canvas.toDataURL();
        const newTab = window.open();
        newTab.document.body.innerHTML = `<img src="${imageDataUrl}"/>`;
      });
    } else {
      console.error("Error: Unable to get visible region bounds");
    }
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyAgRkUwz9eAMd7qp5-Ze22VO8GlLI0OYgk'}}
       
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        onClick={handleMapClick}
      >
        {markerPosition && <Marker lat={markerPosition.lat} lng={markerPosition.lng} />}
      </GoogleMapReact>
      <button onClick={captureVisibleRegion} style={{ position: 'absolute', top: '10px', left: '10px' }}>Capture Visible Region</button>
    </div>
  );
};

  

  export default MapWithMarker
  