import { useEffect, useRef } from "react";

export interface GoogleMapOptions /* extends React.PropsWithChildren */ {
  pin?: google.maps.LatLngLiteral;
  address?: string;
  onNewPosition?: (pos: google.maps.LatLngLiteral, address?: string) => void;
}

export default function GoogleMap(props: GoogleMapOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>();
  const pin = useRef<google.maps.Marker>();
  const info = useRef<google.maps.InfoWindow>();


  const defaultPos = {
    lat: 42.697750,
    lng: 23.321758,
  };

  async function findGeo(request: google.maps.GeocoderRequest) {
    const geocode = new google.maps.Geocoder();
    const { results: [result] } = await geocode.geocode({ ...request, region: "bg-BG" });
    console.info(result);
    return result;
  }

  function setPin(pos: google.maps.LatLngLiteral) {
    if (!pin.current) {
      pin.current = new google.maps.Marker({
        map: map.current
      });
    }
    pin.current.setPosition(pos);
    map.current?.panTo(pos);
  }

  async function updateInfo(result?: Partial<google.maps.GeocoderResult>) {
    if (!info.current) {
      info.current = new google.maps.InfoWindow({ disableAutoPan: true });
    }
    try {
      if (!result) {
        result = await findGeo({
          location: pin.current?.getPosition()
        });
      }
      info.current.setContent(result.formatted_address);
      info.current.open({ ...map.current, shouldFocus: false }, pin.current);
      return result.formatted_address;
    } catch (e) {
      console.error(e);
      return "";
    }
  }
  function handleLocationError(
    browserHasGeolocation: boolean,
    pos: google.maps.LatLngLiteral
  ) {
    const info = browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.";
    props.onNewPosition && props.onNewPosition(pos, info);
  }

  useEffect(() => {
    if (ref.current && !map.current) {
      map.current = new google.maps.Map(ref.current, {
        center: props.pin || defaultPos,
        zoom: 14,
        clickableIcons: false,
        fullscreenControl: false,
        mapTypeControl: false,
        rotateControl: false,
        streetViewControl: false,
        draggableCursor: "default"
        // draggingCursor: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/LoCos_Point.svg/1024px-LoCos_Point.svg.png), auto'
      });
      map.current.addListener("click", async (e: google.maps.MapMouseEvent) => {
        if (e.latLng && props.onNewPosition) {
          const location = e.latLng.toJSON();
          const { formatted_address } = await findGeo({ location });
          props.onNewPosition(location, formatted_address);
        }
      });
      const locationButton = document.createElement("div");

      locationButton.textContent = "Go to Current Location";
      locationButton.classList.add("custom-map-control-button");
      map.current.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
      locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position: GeolocationPosition) => {
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              const { formatted_address } = await findGeo({ location });
              // info.current.setPosition(pos);
              // infoWindow.setContent("Location found.");
              // infoWindow.open(map);
              setPin(location);
              props.onNewPosition && props.onNewPosition(location, formatted_address);
            },
            () => {
              handleLocationError(true, defaultPos);
            }
          );
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, defaultPos);
        }
      });
    }
  });

  useEffect(() => {
    if (props.pin) {
      setPin(props.pin);
      updateInfo(props.address ? { formatted_address: props.address } : undefined);
    } else if (typeof props.address === "string") {
      findGeo({ address: props.address }).then(result => {
        setPin(result.geometry.location.toJSON());
        return updateInfo(result);
      }).catch(console.error);
    }
  });

  return (<div ref={ref} style={{ height: "25rem" }} />);
}