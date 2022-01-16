import { useEffect, useRef } from "react";

export interface GoogleMapOptions /* extends React.PropsWithChildren */ {
  pin?: google.maps.LatLngLiteral;
  address?: string;
  onNewPosition?: (pos: google.maps.LatLngLiteral, address: string) => void;
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
    const { results: [result] } = await geocode.geocode({...request, region: "bg-BG"});
    return result;
  }

  function setPin(pos: google.maps.LatLngLiteral) {
    if (!pin.current) {
      pin.current = new google.maps.Marker({
        map: map.current,
        position: pos
      });
    } else {
      pin.current.setPosition(pos);
      map.current?.panTo(pos);
    }
  }

  async function updateInfo() {
    if (!info.current) {
      info.current = new google.maps.InfoWindow();
    }
    const result = await findGeo({
      location: pin.current?.getPosition()
    });
    info.current.setContent(result.formatted_address);
    info.current.open(map.current, pin.current);
    return result.formatted_address;
  }

  useEffect(() => {
    if (ref.current && !map.current) {
      map.current = new google.maps.Map(ref.current, {
        center: props.pin || defaultPos,
        zoom: 12,
        clickableIcons: false,
        fullscreenControl: false,
        mapTypeControl: false,
        rotateControl: false,
        streetViewControl: false
      });
      map.current.addListener("click", async (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const pos = e.latLng.toJSON();
          setPin(pos);
          const address = await updateInfo();
          props.onNewPosition && props.onNewPosition(pos, address);
        }
      });
    }
  });

  useEffect(() => {
    if (props.pin) {
      setPin(props.pin);
      updateInfo();
    }
    if (props.address) {
      findGeo({address: props.address}).then(result => {
        setPin(result.geometry.location.toJSON());
        updateInfo();
      });

    }
  });

  return (<div ref={ref} style={{ height: "300px" }} />);
}
