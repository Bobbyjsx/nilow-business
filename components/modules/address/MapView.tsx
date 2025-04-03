import { useCallback, useEffect, useRef } from 'react';

type MapControl = 'fullscreenControl' | 'streetViewControl' | 'mapTypeControl' | 'zoomControl' | 'scaleControl';

type MapViewProps = {
  location: google.maps.LatLng | null;
  onLocationChange?: (location: google.maps.LatLng) => void;
  controls?: MapControl[] | Record<MapControl, boolean>;
  radiusMiles?: number;
};

export const MapView = ({ location, onLocationChange, controls, radiusMiles }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

  const handleLocationChange = useCallback(
    (position: google.maps.LatLng) => {
      onLocationChange?.(position);
    },
    [onLocationChange],
  );

  useEffect(() => {
    if (!location || !mapRef.current) return;

    if (!window.google || !google.maps) {
      console.error('Google Maps API is not loaded correctly');
      return;
    }

    let map = mapInstanceRef.current;

    if (!map) {
      // Default control settings
      const defaultControls: Record<MapControl, boolean> = {
        fullscreenControl: true,
        streetViewControl: false,
        mapTypeControl: true,
        zoomControl: true,
        scaleControl: true,
      };

      // Configure map controls
      const mapOptions: google.maps.MapOptions = {
        center: location,
        zoom: 18, // Default zoom
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        ...defaultControls,
      };

      if (controls) {
        if (Array.isArray(controls)) {
          (['fullscreenControl', 'streetViewControl', 'mapTypeControl', 'zoomControl', 'scaleControl'] as MapControl[]).forEach((control) => {
            (mapOptions as any)[control] = controls.includes(control);
          });
        } else {
          Object.entries(controls).forEach(([control, enabled]) => {
            (mapOptions as any)[control] = enabled;
          });
        }
      }

      map = new google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;
    } else {
      // If map already exists, just update center
      map.setCenter(location);
    }

    // Marker setup
    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        position: location,
        map,
        draggable: !!onLocationChange,
      });

      // Drag event for updating location
      markerRef.current.addListener('dragend', () => {
        const newPosition = markerRef.current?.getPosition();
        if (newPosition) handleLocationChange(newPosition);
      });
    } else {
      markerRef.current.setPosition(location);
    }

    // Circle setup & map adjustment
    if (radiusMiles && radiusMiles > 0) {
      const radiusMeters = radiusMiles * 1609.34;

      if (!circleRef.current) {
        circleRef.current = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.15,
          map,
          center: location,
          radius: radiusMeters,
        });
      } else {
        circleRef.current.setCenter(location);
        circleRef.current.setRadius(radiusMeters);
        circleRef.current.setMap(map); // Ensure the circle remains visible
      }

      // Adjust map to fit circle
      const bounds = circleRef.current.getBounds();
      if (bounds) {
        map.fitBounds(bounds);
      }
    } else if (circleRef.current) {
      // If radius is removed, clear the circle
      circleRef.current.setMap(null);
      circleRef.current = null;
    }
  }, [location, handleLocationChange, controls, radiusMiles]);

  return (
    <div
      ref={mapRef}
      className='mt-4 h-64 w-full rounded-md shadow-md'
    />
  );
};
