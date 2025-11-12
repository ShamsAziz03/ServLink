import React, { useRef, useEffect, useState } from "react";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { StyleSheet, View } from "react-native";

const Map = ({ selectPosition }) => {
  const INITIAL_REGION = {
    latitude: 31.95,
    longitude: 35.25,
    latitudeDelta: 1.2,
    longitudeDelta: 1.2,
  };

  const [markers, setMarkers] = useState([
    { title: "Ramallah", latlng: { latitude: 31.9028, longitude: 35.1956 } },
    { title: "Nablus", latlng: { latitude: 32.2211, longitude: 35.2544 } },
    { title: "Hebron", latlng: { latitude: 31.5326, longitude: 35.0998 } },
    { title: "Bethlehem", latlng: { latitude: 31.7054, longitude: 35.2024 } },
    { title: "Jericho", latlng: { latitude: 31.8569, longitude: 35.459 } },
    { title: "Jenin", latlng: { latitude: 32.4636, longitude: 35.2931 } },
    { title: "Tulkarm", latlng: { latitude: 32.3104, longitude: 35.0286 } },
    { title: "Qalqilya", latlng: { latitude: 32.1897, longitude: 34.9706 } },
  ]);
  const mapRef = useRef(null);
  //to store the location of user
  const [userCurrentLocation, setUserCurrentLocation] = useState({});

  const focusMap = (item) => {
    //to focus on region
    const userLocation = {
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    mapRef.current?.animateToRegion(userLocation);
    //to put mark on the region
    const newMark = {
      title: item.name,
      latlng: {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      },
    };
    setMarkers([...markers, newMark]);
    //to pass the user location to second page and questions
    const currentLocation = {
      address: item.address,
      addresstype: item.addresstype,
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      name: item.name,
      place_id: item.place_id,
    };
    setUserCurrentLocation(currentLocation);
  };

  useEffect(() => {
    if (selectPosition) {
      focusMap(selectPosition);
    }
  }, [selectPosition]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        ref={mapRef}
      >
        {/* OpenStreetMap tiles / photos of map is from OSM */}
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker.latlng} title={marker.title} />
        ))}
      </MapView>
    </View>
  );
};

export default Map;
