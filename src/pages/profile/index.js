import Image from "next/image";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import GoogleMapReact from "google-map-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import swal from "sweetalert";
import { translation } from "../../utils/translation";
import { auth } from "../../../firebase-auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import lottie from "lottie-web";
import EmptyAnim from "../../../public/assets/lottie/empty-data.json";
import Link from "next/link";
import Heading from "../../components/heading";
const { Title } = Typography;
import { debounce } from "lodash";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
import {
  useLoadScript,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
const libs = ["places"];

const AnyReactComponent = () => (
  <Image src="/assets/map-marker.png" alt="marker" width="40" height="40" />
);

export default function Page() {
  const router = useRouter();
  const [profile, setProfile] = useState({});
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [residence, setResidence] = useState([]);
  const [token, setToken] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [quiz, setQuiz] = useState({});
  const [isAsap, setIsAsap] = useState(false);
  const [block, setBlock] = useState("");
  const [floor, setFloor] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [content, setContent] = useState({});
  const [country, setCountry] = useState("");
  const [center, setCenter] = useState({
    lat: 22.35551723519138,
    lng: 114.12451327158885,
  });

  const [residences, setResidences] = useState([]);
  const [residence, setResidence] = useState(null);
  const [isFetchList, setIsFetchList] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchLngLat, setSearchLngLat] = useState(null);
  const mapRef = useRef(null);
  const [label, setLabel] = useState("");
  const [street, setStreet] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [homeSize, setHomeSizes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [room, setRoom] = useState("");
  const [requiredDistrict, setRequiredDistrict] = useState(false);
  const [payload, setPayload] = useState({
    district_id: null,
    province_id: null,
    cleaning_area_size_id: null,
    latitude: 0,
    longitude: 0,
  });
  const [mapCenter, setMapCenter] = useState({
    lat: 10.99835602,
    lng: 77.01502627,
  });
  const autocompleteRef = useRef(null);
  const [language, setLanguage] = useState("");

  const onChange = (value, which) => {
    if (which === "province") {
      setPayload((prevState) => ({
        ...prevState,
        province_id: value,
      }));
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

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 18,
  };

  const saveResidence = () => {
    setIsSaving(true);

    const dataSubmit = {
      name: label,
      room_no: room,
      street: street,
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

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    router.push(`${localStorage.getItem("language") || "zh"}/profile`);
    setLanguage(localStorage.getItem("language") || "zh");

    if (getToken) setToken(getToken);

    getProvince();
    getResidence(getToken);

    // my profile
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/my-profile`, {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      })
      .then((res) => {
        setPhone("852" + res.data.phone_number);
        setProfile(res.data);
      });

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

    if (residence !== null) {
      console.log(residence);
      getDistrict(residence.province.id);
      setLabel(residence.name);
      let splitStreet = residence.street.split(",");
      let roomIdx = splitStreet.length - 1;
      setRoom(residence?.room_no);
      setStreet(residence.street);
      setPayload({
        district_id: residence.district.id,
        province_id: residence.province.id,
        cleaning_area_size_id: residence.cleaningAreaSize.id,
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
      setPayload({
        district_id: null,
        province_id: null,
        cleaning_area_size_id: null,
        latitude: 10.99835602,
        longitude: 77.01502627,
      });
    }

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
  }, [residence]);

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

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCqNVISSKUXTzSUejfJfljdtAH5UEODA54",
    libraries: libs,
  });

  const LottieAnimation = () => {
    const animationContainer = useRef(null);

    useEffect(() => {
      const empty = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: EmptyAnim,
      });

      return () => empty.destroy(); // Clean up on component unmount
    }, []);

    return <div ref={animationContainer} />;
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

  const onChangePhone = (value, country, e, formattedValue) => {
    setCountry(country.countryCode);
    setPhone(value);
  };

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
    controlUI.style.backgroundColor = "white";
    controlUI.style.color = "black";
    controlUI.style.border = "2px solid #ccc";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.style.width = "100%";
    controlUI.style.padding = "8px 0";
    controlUI.addEventListener("click", handleGetLocationClick);
    controlDiv.appendChild(controlUI);

    map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);

    mapRef.current = map;
  };

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

  const onSubmitProfile = async () => {
    try {
      let ph = "";
      if (country === "hk") {
        ph = phone.slice(3);
      }

      if (country === "id") {
        ph = phone.slice(2);
      }

      if (country === "us") {
        ph = phone.slice(1);
      }

      // update profile
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/${profile.id}`,
        {
          email: email,
          // first_name: firstName,
          // last_name: lastName,
          name: name,
          phone_number: ph,
        },
        {
          headers: {},
        }
      );

      swal("Success", `Success update profile`, "success");

      setTimeout(() => {
        router.reload();
      }, 1200);
    } catch (error) {
      if (error?.response?.status === 400) {
        swal("Bad Request", `${error.response.data.message}`);
      } else {
        swal("Err", `Error making POST request ${error}`, "error");
      }
    }
  };

  return (
    <>
      <Heading />
      <Navbar language={language} />
      <div className="mx-auto mt-16 px-12 md:px-32">
        <div className="w-full items-start justify-between md:flex md:gap-32">
          <div className="w-full rounded-xl p-7 shadow-lg">
            <p className="text-custom-gray-2 mb-4 text-xl font-bold">
              {content.personal_information}
            </p>
            <div className="flex gap-5 max-[768px]:grid">
              <div className="mb-5 w-full max-[768px]:mb-0">
                <label className="text-custom-gray-2 text-md mb-2 block">
                  {content.name}
                </label>
                <input
                  className={`mb-0 block w-full appearance-none rounded-lg border bg-white px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none max-[768px]:w-full`}
                  type="text"
                  placeholder={content.placeholder_name}
                  defaultValue={profile.name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {/* <div className="mb-5 w-full max-[768px]:mb-0">
                <label className="text-custom-gray-2 text-md mb-2 block">
                  {content.first_name}
                </label>
                <input
                  className={`mb-0 block w-full appearance-none rounded-lg border bg-white px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none max-[768px]:w-full`}
                  type="text"
                  placeholder="Type your first name here"
                  defaultValue={profile.first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div> */}
              {/* <div className="w-full">
                <label className="text-custom-gray-2 text-md mb-2 block">
                  {content.last_name}
                </label>
                <input
                  className={`mb-0 block w-full appearance-none rounded-lg border bg-white px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none max-[768px]:w-full`}
                  type="text"
                  placeholder="Type your last name here"
                  defaultValue={profile.last_name}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div> */}
            </div>
            <div className="mb-5 w-full max-[768px]:mt-4">
              <label className="text-custom-gray-2 text-md mb-2 block">
                {content.email}
              </label>
              <input
                className={`mb-0 block w-full appearance-none rounded-lg border bg-white px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none max-[768px]:w-full`}
                type="text"
                placeholder={content.placeholder_email}
                defaultValue={profile.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-5 w-full max-[768px]:mt-4">
              <label className="text-custom-gray-2 text-md mb-2 block">
                {content.phone}
              </label>
              <PhoneInput
                country={"hk"}
                onlyCountries={["hk"]}
                value={phone}
                onChange={(value, country, e, formattedValue) =>
                  onChangePhone(value, country, e, formattedValue)
                }
                inputStyle={{
                  width: "100%",
                  height: "39px",
                  borderRadius: "0.5rem",
                }}
              />
            </div>
            <div className="mb-5 w-full pt-3">
              <a
                onClick={onSubmitProfile}
                class="btn-gradient-custom-1 w-full cursor-pointer rounded-lg bg-blue-700 px-4 py-3 text-center text-sm text-white shadow-md"
              >
                {content.update_profile}
              </a>
            </div>

            {/* Residence */}
            <div className="mt-14">
              <div className="flex-1">
                <div className="">
                  <div className="">
                    <div className="flex items-center justify-between">
                      <p className="text-custom-gray-2 mb-4 text-xl font-bold">
                        {content.current_residence}
                      </p>
                    </div>

                    <Skeleton loading={isFetchList} active>
                      <div className="">
                        {residences
                          .slice()
                          .sort((a, b) => {
                            if (
                              a.is_current_residence &&
                              !b.is_current_residence
                            ) {
                              return -1;
                            } else if (
                              !a.is_current_residence &&
                              b.is_current_residence
                            ) {
                              return 1;
                            }
                            return 0;
                          })
                          .map(
                            (addr, idx) =>
                              addr.is_current_residence && (
                                <div key={idx} className="">
                                  <div className="mr-4 h-full flex-1 rounded-xl shadow-lg">
                                    <div
                                      className="overflow-hidden rounded-xl"
                                      style={{ height: "300px", width: "100%" }}
                                    >
                                      <GoogleMapReact
                                        bootstrapURLKeys={{
                                          key: "AIzaSyCqNVISSKUXTzSUejfJfljdtAH5UEODA54",
                                        }}
                                        defaultCenter={{
                                          lat: Number(addr.latitude),
                                          lng: Number(addr.longitude),
                                        }}
                                        defaultZoom={defaultProps.zoom}
                                      >
                                        <AnyReactComponent
                                          lat={Number(addr.latitude)}
                                          lng={Number(addr.longitude)}
                                          text="📍"
                                        />
                                      </GoogleMapReact>
                                    </div>
                                    <div className="flex flex-col p-4">
                                      <div
                                        className={
                                          addr.is_current_residence
                                            ? "mb-4"
                                            : "hidden"
                                        }
                                      >
                                        <Tag bordered={false} color="success">
                                          <span className="text-[16px]">
                                            {content.main_residence}
                                          </span>
                                        </Tag>
                                      </div>
                                      <div
                                        className={
                                          addr.is_current_residence
                                            ? "mb-4 flex items-center justify-between gap-4"
                                            : "mb-4 mt-4 flex items-center justify-between gap-4"
                                        }
                                      >
                                        <div>
                                          <Title level={3}>{addr.name}</Title>
                                          <p>{addr?.street}</p>
                                        </div>
                                        <div className="flex flex-col">
                                          <div className="flex flex-row justify-between">
                                            {!addr.is_current_residence && (
                                              <Tooltip
                                                title="Set as Main"
                                                color={"green"}
                                              >
                                                <Button
                                                  icon={<AimOutlined />}
                                                  className="btn-gradient-custom-1 mb-3 flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                                  loading={loadingSubmit}
                                                  onClick={() =>
                                                    setMainResidence(addr.id)
                                                  }
                                                />
                                              </Tooltip>
                                            )}
                                            <Tooltip
                                              title="Edit"
                                              color={"blue"}
                                            >
                                              <Button
                                                icon={<EditOutlined />}
                                                size={12}
                                                onClick={() =>
                                                  editResidence(addr.id)
                                                }
                                                className="btn-gradient-custom-1 mx-2 flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                              />
                                            </Tooltip>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {(idx + 1) % 2 === 0 && (
                                    <div className="h-0 w-full"></div>
                                  )}
                                </div>
                              )
                          )}
                      </div>
                      {residences.length === 0 && (
                        <div className="flex justify-center">
                          <LottieAnimation className="w-1/3" />
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
                      center={
                        currentLocation || searchLngLat || defaultProps.center
                      }
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
                  <Divider orientation="left">
                    {content.address_details}
                  </Divider>
                  <div className="p-5">
                    <div className="mb-3">
                      <label>{content.residence_label}</label>
                      <Input
                        className="mb-2 mt-2"
                        type="text"
                        value={label}
                        placeholder={content.residence_label}
                        onChange={(e) => setLabel(e.target.value)}
                      />
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
                          onChange={(e) => setStreet(e.target.value)}
                          type="text"
                          placeholder={content.placeholder_street}
                        />
                      </Autocomplete>
                    </div>
                    <div className="mb-3">
                      <label>{content.room_number}</label>
                      <Input
                        className="mb-2 mt-2"
                        type="text"
                        value={room}
                        placeholder={content.room_number}
                        onChange={(e) => setRoom(e.target.value)}
                      />
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
                        {requiredDistrict && (
                          <p className="text-red-500">required</p>
                        )}
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
            </Modal>
            {/* Residence */}
          </div>
        </div>
      </div>

      <Footer language={language} />
    </>
  );
}
