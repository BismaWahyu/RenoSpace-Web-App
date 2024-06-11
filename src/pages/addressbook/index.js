import Image from "next/image";
import { useGeolocated } from "react-geolocated";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Link from "next/link";
import axios from "axios";
import lottie from "lottie-web";
import { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import { debounce } from "lodash";
import {
  Tag,
  Button,
  Modal,
  Popconfirm,
  Skeleton,
  Typography,
  Tooltip,
  Divider,
  Input,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteFilled,
  QuestionCircleOutlined,
  AimOutlined,
} from "@ant-design/icons";
import { useLoadScript, GoogleMap, Autocomplete } from "@react-google-maps/api";
const libs = ["places"];
import { translation } from "../../utils/translation";
import Heading from "../../components/heading";
import { useRouter } from "next/router";
import Addressbook from "@/components/addressbook";

const { Title } = Typography;
const AnyReactComponent = () => (
  <Image src="/assets/map-marker.png" alt="marker" width="40" height="40" />
);

export default function Index() {
  const [token, setToken] = useState("");
  const [residences, setResidences] = useState([]);
  const [residence, setResidence] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchList, setIsFetchList] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [homeSize, setHomeSizes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState({});
  const router = useRouter();

  const [label, setLabel] = useState("");
  const [street, setStreet] = useState("");
  const [room, setRoom] = useState("");
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 10.99835602,
    lng: 77.01502627,
  });

  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchLngLat, setSearchLngLat] = useState(null);
  const autocompleteRef = useRef(null);
  const [language, setLanguage] = useState("");

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

  const [payload, setPayload] = useState({
    district_id: null,
    province_id: null,
    cleaning_area_size_id: null,
    latitude: 0,
    longitude: 0,
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

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const setMainResidence = (id) => {
    setLoadingSubmit(true);
    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/residences/${id}/use`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoadingSubmit(false);
        getResidence(token);
      });
  };

  const getResidence = (token) => {
    setIsFetchList(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/residences`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setResidences(res.data);
        setIsFetchList(false);
      });
  };

  const getProvince = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/provinces?locale=${
          localStorage.getItem("language") || "zh"
        }`
      )
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
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/districts?locale=${
          localStorage.getItem("language") || "zh"
        }`
      )
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

  const editResidence = (id) => {
    setIsFetching(true);
    openModal("edit");
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/residences/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setIsFetching(false);
        setResidence(res.data);
      });
  };

  const removeResidence = (id) => {
    setIsDelete(true);
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/residences/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setIsDelete(false);
        getResidence(token);
      });
  };

  const openModal = (type) => {
    if (type === "new") {
      setResidence(null);
      setModalTitle(content.add_new_residence);
    }
    if (type === "edit") {
      setModalTitle(content.edit_residence);
    }
    setIsModal(true);
  };

  const closeModal = () => {
    setIsModal(false);
  };

  const onResidenceSaved = () => {
    setIsModal(false);
    getResidence(token);
  };

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

  const saveResidence = () => {
    setIsSaving(true);

    if (label === "") {
      setRequiredResidenceLabel(true);
      setIsSaving(false);
    } else if (street === "") {
      setRequiredResidenceStreet(true);
      setIsSaving(false);
    } else if (room === "") {
      setRequiredRoomNumber(true);
      setIsSaving(false);
    } else if (!payload.province_id) {
      setRequiredProvince(true);
      setIsSaving(false);
    } else if (!payload.cleaning_area_size_id) {
      setRequiredCleaningAreaSize(true);
      setIsSaving(false);
    } else {
      const dataSubmit = {
        name: label,
        street: street,
        room_no: room,
        ...payload,
      };

      if (residence === null) {
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
              onResidenceSaved();
            }
          });
      } else {
        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/residences/${residence.id}`,
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
              onResidenceSaved();
            }
          });
      }
    }
  };

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    router.push(`${localStorage.getItem("language") || "zh"}/addressbook`);
    setLanguage(localStorage.getItem("language") || "zh");

    if (getToken) setToken(getToken);

    getResidence(getToken);

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

  useEffect(() => {
    if (residence !== null) {
      if (residence.province) getDistrict(residence.province.id);
      setLabel(residence?.name);
      let splitStreet = residence.street.split(",");
      let roomIdx = splitStreet.length - 1;
      setRoom(residence?.room_no);
      let removedString = splitStreet.splice(-1);
      // setStreet(splitStreet.join(","));
      setStreet(residence?.street);

      setPayload({
        district_id: residence.district.id,
        province_id: residence.province.id,
        cleaning_area_size_id: residence?.cleaningAreaSize?.id,
        latitude: Number(residence.latitude),
        longitude: Number(residence.longitude),
      });
      setMapCenter({
        lat: Number(residence.latitude),
        lng: Number(residence.longitude),
      });
      setCurrentLocation({
        lat: Number(residence.latitude),
        lng: Number(residence.longitude),
      });
    } else if (residence === null) {
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
  }, [residence]);

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

  if (!isLoaded) {
    return <Skeleton />;
  }

  return (
    <>
      <Heading />
      <Navbar language={language} />
      <div className="mt-16 flex min-h-screen flex-col">
        <div className="flex-1">
          <div className="flex items-center justify-center">
            <div className="w-10/12 rounded-xl p-7 shadow-lg">
              <div className="mb-8 flex items-center justify-between">
                <p className="text-custom-gray-2 text-xl font-bold">
                  {content.residence_addressbook}
                </p>
                <button
                  className="btn-gradient-custom-1 inline-block w-auto rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  onClick={() => openModal("new")}
                >
                  {content.add_new}
                </button>
              </div>

              <Skeleton loading={isFetchList} active>
                <Addressbook
                  type={"page"}
                  residences={residences}
                  content={content}
                  setDefault={setMainResidence}
                  onEdit={editResidence}
                  onRemove={removeResidence}
                />
                {residences.length === 0 && (
                  <div className="flex justify-center">
                    <Image
                      src="/assets/empty-anim.gif"
                      alt="Data is Empty"
                      width={300}
                      height={200}
                    />
                  </div>
                )}
              </Skeleton>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={modalTitle}
        centered
        open={isModal}
        onOk={() => setIsModal(false)}
        onCancel={() => closeModal()}
        footer={[]}
      >
        <Skeleton loading={isFetching} active>
          <div className="rouded-xl mr-4 flex-1 shadow-lg">
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
              ></GoogleMap>

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
            <Divider orientation="left">{content.address_details}</Divider>
            <div className="p-5">
              <div className="mb-3">
                <label>{content.residence_label}</label>
                <Input
                  className="mb-2 mt-2"
                  type="text"
                  value={label}
                  placeholder={content.placeholder_residence_label}
                  onChange={(e) => handleChange(e.target.value, "label")}
                />
                {requiredResidenceLabel && (
                  <p className="mb-4 text-red-500">required</p>
                )}
              </div>
              <div className="mb-3">
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
                    className="mb-2 mt-2"
                    value={street}
                    onChange={(e) => handleChange(e.target.value, "street")}
                    type="text"
                    placeholder={content.placeholder_street}
                  />
                </Autocomplete>
                {requiredResidenceStreet && (
                  <p className="mb-4 text-red-500">required</p>
                )}
              </div>
              <div className="mb-3">
                <label>{content.room_number}</label>
                <Input
                  className="mb-2 mt-2"
                  type="text"
                  defaultValue={
                    modalTitle === content.add_new_residence ? "" : room
                  }
                  value={room}
                  placeholder={content.placeholder_room_number}
                  onChange={(e) => handleChange(e.target.value, "room")}
                />
                {requiredRoomNumber && (
                  <p className="mb-4 text-red-500">required</p>
                )}
              </div>
              <div className="mt-3 flex gap-3">
                <div className="flex-1">
                  <label>{content.province}</label>
                  <Select
                    className="mt-2"
                    showSearch
                    placeholder={content.placeholder_select_province}
                    optionFilterProp="children"
                    onChange={(value) => onChange(value, "province")}
                    filterOption={filterOption}
                    options={provinces}
                    style={{ width: "100%" }}
                    value={payload.province_id}
                  />
                  {requiredProvince && (
                    <p className="mb-4 text-red-500">required</p>
                  )}
                </div>
                <div className="flex-1">
                  <label>{content.district}</label>
                  <Select
                    className="mt-2"
                    showSearch
                    placeholder={content.placeholder_select_district}
                    optionFilterProp="children"
                    onChange={(value) => onChange(value, "district")}
                    filterOption={filterOption}
                    options={districts}
                    style={{ width: "100%" }}
                    value={payload.district_id}
                  />
                  {requiredDistrict && <p className="text-red-500">required</p>}
                </div>
              </div>
              <div className="mt-3 flex-1">
                <label>{content.area_size}</label>
                <Select
                  className="mt-2"
                  showSearch
                  placeholder={content.placeholder_select_area_size}
                  optionFilterProp="children"
                  onChange={(value) => onChange(value, "homeSize")}
                  filterOption={filterOption}
                  options={homeSize}
                  style={{ width: "100%" }}
                  value={payload.cleaning_area_size_id}
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
                {content.save}
              </Button>
            </div>
          </div>
        </Skeleton>

        {/* <ResidenceForm
          onDataSubmit={() => onResidenceSaved()}
          isFetching={isFetching}
          editData={residence}
        /> */}
      </Modal>
      <div className="mt-auto">
        <Footer language={language} />
      </div>
    </>
  );
}
