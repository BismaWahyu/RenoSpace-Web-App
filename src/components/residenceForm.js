import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { debounce } from "lodash";
import { useGeolocated } from "react-geolocated";
import { Divider, Input, Select, Button, Skeleton } from "antd";
import { translation } from "../utils/translation";
import GoogleMapReact from "google-map-react";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
const libs = ["places"];

export default function ResidenceForm({ onDataSubmit, isFetching, editData }) {
  const [content, setContent] = useState({});
  const [payload, setPayload] = useState({
    district_id: null,
    province_id: null,
    cleaning_area_size_id: null,
    latitude: 0,
    longitude: 0,
  });
  const [token, setToken] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [homeSize, setHomeSizes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [label, setLabel] = useState("");
  const [street, setStreet] = useState("");
  const [room, setRoom] = useState("");
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 10.99835602,
    lng: 77.01502627,
  });

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  const defaultProps = {
    center: {
      lat: coords?.latitude ? coords?.latitude : 22.322628,
      lng: coords?.longitude ? coords?.longitude : 114.175174,
    },
    zoom: 18,
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCqNVISSKUXTzSUejfJfljdtAH5UEODA54",
    libraries: libs,
  });

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchLngLat, setSearchLngLat] = useState(null);
  const autocompleteRef = useRef(null);
  const [dynamicLatLng, setDynamicLatLng] = useState(defaultProps.center);
  const [currentLocation, setCurrentLocation] = useState(null);

  const [requiredResidenceLabel, setRequiredResidenceLabel] = useState(false);
  const [requiredResidenceStreet, setRequiredResidenceStreet] = useState(false);
  const [requiredRoomNumber, setRequiredRoomNumber] = useState(false);
  const [requiredProvince, setRequiredProvince] = useState(false);
  const [requiredDistrict, setRequiredDistrict] = useState(false);
  const [requiredCleaningAreaSize, setRequiredCleaningAreaSize] =
    useState(false);

  const onChange = (value, which) => {
    if (which === "province") {
      setPayload((prevState) => ({
        ...prevState,
        province_id: value,
      }));
      setRequiredProvince(false);
      setRequiredDistrict(true);
      getDistrict(value);
    } else if (which === "district") {
      setPayload((prevState) => ({
        ...prevState,
        district_id: value,
      }));
      setRequiredDistrict(false);
    } else if (which === "homeSize") {
      setPayload((prevState) => ({
        ...prevState,
        cleaning_area_size_id: value,
      }));
      setRequiredCleaningAreaSize(false);
    } else if (which === "lat") {
      setPayload((prevState) => ({
        ...prevState,
        latitude: value,
      }));
      setMapCenter((prevState) => ({
        ...prevState,
        lat: Number(value),
      }));
    } else if (which === "lng") {
      setPayload((prevState) => ({
        ...prevState,
        longitude: value,
      }));
      setMapCenter((prevState) => ({
        ...prevState,
        lng: Number(value),
      }));
    }
  };
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const getProvince = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/provinces`)
      .then((res) => {
        const mappedProv = [];
        res.data.map((el) => {
          mappedProv.push({
            value: el.id,
            label: el.name,
          });
        });
        setProvinces(mappedProv);
      });
  };

  const getDistrict = (id) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/districts`)
      .then((res) => {
        const mappedDist = [];
        res.data.map((el) => {
          if (el.province.id === id) {
            mappedDist.push({
              value: el.id,
              label: el.name,
            });
          }
        });
        setDistricts(mappedDist);
      });
  };

  const saveResidence = () => {
    setIsSaving(true);

    if (label === "") {
      setRequiredResidenceLabel(true);

      setTimeout(() => {
        setRequiredResidenceLabel(false);
      }, 1500);

      setIsSaving(false);
    } else if (street === "") {
      setRequiredResidenceStreet(true);

      setTimeout(() => {
        setRequiredResidenceStreet(false);
      }, 1500);

      setIsSaving(false);
    } else if (room === "") {
      setRequiredRoomNumber(true);

      setTimeout(() => {
        setRequiredRoomNumber(false);
      }, 1500);

      setIsSaving(false);
    } else if (!payload.province_id) {
      setRequiredProvince(true);

      setTimeout(() => {
        setRequiredProvince(false);
      }, 1500);

      setIsSaving(false);
    } else if (!payload.cleaning_area_size_id) {
      setRequiredCleaningAreaSize(true);

      setTimeout(() => {
        setRequiredCleaningAreaSize(false);
      }, 1500);

      setIsSaving(false);
    } else {
      const dataSubmit = {
        name: label,
        street: street,
        room_no: room,
        ...payload,
      };

      if (editData === null) {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/residences`,
            dataSubmit,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            setIsSaving(false);

            if (!requiredDistrict) {
              setLabel("");
              setStreet("");
              setRoom("");
              setPayload({
                district_id: null,
                province_id: null,
                cleaning_area_size_id: null,
                latitude: 0,
                longitude: 0,
              });
              setMapCenter({
                lat: defaultProps.center.lat,
                lng: defaultProps.center.lng,
              });
              handleGetLocationClick();
              onDataSubmit();
            }
          });
      } else {
        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/residences/${editData.id}`,
            dataSubmit,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            setIsSaving(false);

            if (!requiredDistrict) {
              setLabel("");
              setStreet("");
              setPayload({
                district_id: null,
                province_id: null,
                cleaning_area_size_id: null,
                latitude: 0,
                longitude: 0,
              });
              setMapCenter({
                lat: defaultProps.center.lat,
                lng: defaultProps.center.lng,
              });
              handleGetLocationClick();
              onDataSubmit();
            }
          });
      }
    }
  };

  useEffect(() => {
    if (editData !== null) {
      getDistrict(editData.province.id);
      setLabel(editData.name);
      setStreet(editData.street);
      setPayload({
        district_id: editData.district.id,
        province_id: editData.province.id,
        cleaning_area_size_id: editData.cleaningAreaSize.id,
        latitude: Number(editData.latitude),
        longitude: Number(editData.longitude),
      });
      setMapCenter({
        lat: Number(editData.latitude),
        lng: Number(editData.longitude),
      });
      setCurrentLocation({
        lat: Number(editData.latitude),
        lng: Number(editData.longitude),
      });
    } else if (editData === null) {
      setLabel("");
      setStreet("");
      setRoom("");
      setPayload({
        district_id: null,
        province_id: null,
        cleaning_area_size_id: null,
        latitude: 10.99835602,
        longitude: 77.01502627,
      });
    }
  }, [editData]);

  const handleChange = (val, type) => {
    if (type === "label") {
      setLabel(val);
    }

    if (type === "street") {
      setStreet(val);
    }

    if (type === "room") {
      setRoom(val);
    }
  };

  useEffect(() => {
    const getToken = localStorage.getItem("token");

    if (getToken) setToken(getToken);

    getProvince();

    axios
      .get(
        translation.url + `?type=${localStorage.getItem("language") || "zh"}`
      )
      .then((response) => {
        let obj = {};
        response.data.data.forEach((v, i) => {
          obj[`${v.title_code}`] = v.text;
        });

        setContent(obj);
      });

    const fetchRoomSizes = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/cleaning-area-sizes`
        );
        let roomSizes = [];
        response.data.map((item) => {
          roomSizes.push({ value: item.id, label: item.size + " sqft" });
        });
        setHomeSizes(roomSizes);
      } catch (err) {
        throw err;
      }
    };
    fetchRoomSizes();
  }, []);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    setSelectedPlace(place);
    let address = "";
    place.address_components.map((addr, idx) => {
      if (idx === 0) {
        address = address + addr.long_name;
      } else {
        address = address + `, ${addr.long_name}`;
      }
    });
    setStreet(address);
    setSearchLngLat({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setPayload((prevState) => ({
      ...prevState,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    }));
    setCurrentLocation(null);
    setRequiredResidenceStreet(false);
  };

  const handleGetLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedPlace(null);
          setSearchLngLat(null);
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          throw error;
        }
      );
    }
  };

  const handleCenterChanged = debounce(() => {
    if (mapRef.current) {
      const mapCenter = mapRef.current.getCenter();
      setPayload((prevState) => ({
        ...prevState,
        latitude: mapCenter.lat(),
        longitude: mapCenter.lng(),
      }));
    }
  }, 300);

  const onMapLoad = (map) => {
    const controlDiv = document.createElement("div");
    const controlUI = document.createElement("div");
    controlUI.innerHTML = "Get Location";
    controlUI.classList =
      "btn-gradient-custom-1 flex w-full cursor-pointer items-center justify-center rounded-lg bg-blue-700 px-4 py-3 text-center text-sm text-white shadow-md";
    controlUI.style.border = "2px solid #ccc";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.style.width = "100%";
    controlUI.style.padding = "8px";
    controlUI.addEventListener("click", handleGetLocationClick);
    controlDiv.appendChild(controlUI);

    map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);

    mapRef.current = map;
  };

  if (!isLoaded) {
    return <Skeleton />;
  }

  return (
    <>
      <Skeleton loading={isFetching} active>
        <div className="mr-4 flex-1 rounded-xl shadow-lg">
          <div
            className="overflow-hidden rounded-xl"
            style={{ height: "300px", width: "100%" }}
          >
            <GoogleMap
              zoom={currentLocation || selectedPlace ? 18 : 12}
              center={currentLocation || searchLngLat || defaultProps.center}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                gestureHandling: "none",
              }}
              onLoad={onMapLoad}
              onCenterChanged={() => handleCenterChanged()}
              ref={mapRef}
            >
              {/* <Marker 
                position={dynamicLatLng || currentLocation || searchLngLat || defaultProps.center} 
              /> */}
            </GoogleMap>

            {/* Overlay Div with Image */}
            <div
              style={{
                position: "absolute",
                top: "27%",
                left: "48%",
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
              }}
            >
              <Image
                src="/assets/map-marker.png"
                width={50}
                height={50}
                alt="Overlay Image"
                // style={{ width: '50px', height: '50px' }}
              />
            </div>
          </div>

          <Divider orientation="left">Address Details</Divider>
          <div className="p-5">
            <div className="mb-3">
              <label>{content.residence_label}</label>
              <Input
                type="text"
                value={label}
                placeholder="Residence Label"
                onChange={(e) => handleChange(e.target.value, "label")}
                className="mb-2 mt-2"
              />
              {requiredResidenceLabel && (
                <p className="mb-4 text-red-500">required</p>
              )}
            </div>
            <div className="mb-3 mt-3">
              <label>{content.residence_address}</label>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocompleteRef.current = autocomplete;
                }}
                onPlaceChanged={handlePlaceChanged}
                options={{
                  fields: ["address_components", "geometry", "name"],
                  componentRestrictions: { country: "HK" },
                }}
              >
                <Input
                  value={street}
                  onChange={(e) => handleChange(e.target.value, "street")}
                  type="text"
                  placeholder="Search for a location"
                  className="mb-2 mt-2"
                />
              </Autocomplete>
              {requiredResidenceStreet && (
                <p className="mb-4 text-red-500">required</p>
              )}
            </div>
            <div className="mb-3">
              <label>Room Number</label>
              <Input
                type="text"
                value={room}
                placeholder="Room Number"
                onChange={(e) => handleChange(e.target.value, "room")}
                className="mb-2 mt-2"
              />
              {requiredRoomNumber && (
                <p className="mb-4 text-red-500">required</p>
              )}
            </div>
            <div className="mt-3 flex gap-3">
              <div className="flex-1">
                <label>{content.province}</label>
                <Select
                  showSearch
                  placeholder="Select a province"
                  optionFilterProp="children"
                  onChange={(value) => onChange(value, "province")}
                  filterOption={filterOption}
                  options={provinces}
                  style={{ width: "100%" }}
                  value={payload.province_id}
                  className="mt-2"
                />
                {requiredProvince && (
                  <p className="mb-4 text-red-500">required</p>
                )}
              </div>
              <div className="flex-1">
                <label>{content.district}</label>
                <Select
                  showSearch
                  placeholder="Select a district"
                  optionFilterProp="children"
                  onChange={(value) => onChange(value, "district")}
                  filterOption={filterOption}
                  options={districts}
                  style={{ width: "100%" }}
                  value={payload.district_id}
                  className="mt-2"
                />
                {requiredDistrict && <p className="text-red-500">required</p>}
              </div>
            </div>
            <div className="mt-3 flex-1">
              <label>{content.area_size}</label>
              <Select
                showSearch
                placeholder="Select a home size"
                optionFilterProp="children"
                onChange={(value) => onChange(value, "homeSize")}
                filterOption={filterOption}
                options={homeSize}
                style={{ width: "100%" }}
                value={payload.cleaning_area_size_id}
                className="mt-2"
              />
              {requiredCleaningAreaSize && (
                <p className="mb-4 text-red-500">required</p>
              )}
            </div>
            <Button
              key="button"
              type="primary"
              onClick={saveResidence}
              loading={isSaving}
              className="btn-gradient-custom-1 ml-auto mt-5 inline-block w-full rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Skeleton>
    </>
  );
}
