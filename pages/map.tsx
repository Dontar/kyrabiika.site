
import React, { useCallback } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";


interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  center: google.maps.LatLngLiteral;
  zoom: number;
}

const render = (status: Status): React.ReactElement => {
  if (status === Status.LOADING) return <h3>{status} .0000000000000000</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return <div></div>;
};

function Map({
  onClick,
  onIdle,
  children,
  style,
  center,
  zoom,
  ...options
}: React.PropsWithChildren<MapProps>) {
  const ref = React.useRef<HTMLDivElement>(null);
  // const ref2 = React.useRef<HTMLDivElement>(null);
  const [mapType, setMapType] = React.useState<string>("roadmap");

  const [map, setMap] = React.useState<google.maps.Map>();
  // const [map2, setMap2] = React.useState<google.maps.StreetViewPanorama>();
  const { lat, lng } = center;


  const onRightClick = useCallback((m) => {
    let mapTypes = Object.values(google.maps.MapTypeId);
    let type = m.getMapTypeId();

    setMapType(() => {
      let id = mapTypes.indexOf(type);
      if (id === mapTypes.length - 1) {
        return mapTypes[0];
      }
      return mapTypes[id + 1];
    });
  }, []);

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new google.maps.Map(ref.current, {
        zoom,
        center: { lat, lng },
        mapTypeId: mapType
      }));
    }
    if (map) {
      map.setOptions({ center: { lat, lng }, zoom, mapTypeId: mapType });
    }

  }, [ref, map, zoom, lat, lng, mapType]);

  // React.useEffect(() => {
  //   if (ref2.current && !map2) {
  //     setMap2(new window.google.maps.StreetViewPanorama(ref2.current, {
  //       zoom,
  //       position: center
  //     }));
  //   }

  // }, [ref2, map2, center, zoom]);

  React.useEffect(() => {
    if (map) {
      ["click", "idle", "rightclick"].forEach((eventName) => {
        google.maps.event.clearListeners(map, eventName);
      });

      if (onClick) {
        map.addListener("click", (e) => onClick(e));
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }

      if (onRightClick)
        map.addListener("rightclick", () => onRightClick(map));
    }
  }, [map, onClick, onIdle, onRightClick]);

  return (
    <>
      <div ref={ref} style={style} />
      {/* <div ref={ref2} style={style} /> */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

type optionsWithInfo = google.maps.MarkerOptions & {
  info: string;
}

const Marker: React.FC<optionsWithInfo> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>();
  const [infoWindow, setInfoWindow] = React.useState<google.maps.InfoWindow>();
  const { map, position, info } = options;


  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
      setInfoWindow(new google.maps.InfoWindow({ disableAutoPan: true }));
    }
    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
        infoWindow?.close();
      }
    };
  }, [marker, infoWindow]);

  React.useEffect(() => {
    if (marker) {
      console.log(info);
      marker.setOptions({position, map});
      infoWindow?.setContent(info);
      infoWindow?.open(map, marker,);
    }
  }, [marker, map, infoWindow, info, position]);

  return null;
};

const App: React.VFC = () => {
  const [clicks, setClicks] = React.useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = React.useState(12); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 42.697750,
    lng: 23.321758,
  });
  const [address, setAddress] = React.useState<string>("");

  const onClick = (e: google.maps.MapMouseEvent) => {
    setClicks([e.latLng!]);
    setCenter(e.latLng!.toJSON());
    const geocoder = new google.maps.Geocoder();
    try {
      geocoder.geocode({ location: e.latLng }, (results) => {
        if (results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          window.alert("No results found");
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };


  const form = (
    <div
      style={{
        padding: "1rem",
        flexBasis: "250px",
        height: "100%",
        overflow: "auto",
      }}
    >
      <label htmlFor="zoom">Zoom</label>
      <input
        type="number"
        id="zoom"
        name="zoom"
        value={zoom}
        onChange={(event) => setZoom(Number(event.target.value))}
      />
      <br />
      <label htmlFor="lat">Latitude</label>
      <input
        type="number"
        id="lat"
        name="lat"
        value={center.lat}
        onChange={(event) =>
          setCenter({ ...center, lat: Number(event.target.value) })
        }
      />
      <br />
      <label htmlFor="lng">Longitude</label>
      <input
        type="number"
        id="lng"
        name="lng"
        value={center.lng}
        onChange={(event) =>
          setCenter({ ...center, lng: Number(event.target.value) })
        }
      />
      <h3>{clicks.length === 0 ? "Click on map to add address" : "Clicks"}</h3>
      {clicks.map((latLng, i) => (
        <>
          <pre key={i}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
          <div>{address}</div>
        </>
      ))}
      <button onClick={() => setClicks([])}>Clear</button>
    </div>
  );

  // [START maps_react_map_component_app_return]
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Wrapper apiKey="AIzaSyDCTQ1_GSpfRU2tyKg78QLkN8BeaGQr4Ho" render={render}>
        <Map
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          // onRightClick={onRightClick}
          zoom={zoom}
          style={{ /*flexGrow: "1",*/ height: "500px", width: "750px" }}
        >
          {clicks.map((latLng, i) => (
            <Marker key={i} position={latLng} info={address} />
          ))}
        </Map>
      </Wrapper>
      {/* Basic form for controlling center and zoom of map. */}
      {form}
    </div>
  );
};

export default App;
