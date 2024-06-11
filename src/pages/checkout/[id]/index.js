import Image from "next/image";
import _ from "lodash";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import GoogleMapReact from "google-map-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import swal from "sweetalert";
import DatePicker from "react-datepicker";
import Calendar from "../../../components/calendar";
import "react-datepicker/dist/react-datepicker.css";
import { translation } from "../../../utils/translation";
import { auth } from "../../../../firebase-auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import Link from "next/link";
import Heading from "../../../components/heading";
const { Title } = Typography;
import { debounce } from "lodash";
import OtpInput from "react-otp-input";
import Countdown from "react-countdown";
import BeatLoader from "react-spinners/BeatLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent, faArrowRight } from "@fortawesome/free-solid-svg-icons";
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
import lottie from "lottie-web";
import EmptyAnim from "../../../../public/assets/lottie/empty-data.json";
import PaymentSuccess from "../../../components/paymentSuccess";
import PromoCode from "@/components/promoCode";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { IfFeatureEnabled } from "@growthbook/growthbook-react";

const AnyReactComponent = () => (
  <Image src="/assets/map-marker.png" alt="marker" width="40" height="40" />
);

export default function Page() {
  const router = useRouter();
  const param = useSearchParams();
  const [profile, setProfile] = useState({});
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [residence, setResidence] = useState(null);
  const [residences, setResidences] = useState([]);
  const [token, setToken] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [quiz, setQuiz] = useState({});
  const params = router.query.id;
  const [isAsap, setIsAsap] = useState(false);
  const [promoList, setPromoList] = useState([]);
  const [content, setContent] = useState({});
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
  const [otp, setOtp] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomItems, setRoomItems] = useState([]);
  const [room, setRoom] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [showSendButton, setShowSendButton] = useState(true);
  const [isVerify, setIsVerify] = useState(false);
  const [country, setCountry] = useState("");
  const [expirationDate, setExpirationDate] = useState();
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
  const [center, setCenter] = useState({
    lat: 22.35551723519138,
    lng: 114.12451327158885,
  });

  const [paymentLink, setPaymentLink] = useState(null);
  const [detailPayment, setDetailPayment] = useState({});
  const [paymentId, setPaymentId] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showSendButtonLoading, setShowSendButtonLoading] = useState(false);
  const [showVerifyLoading, setShowVerifyLoading] = useState(false);
  const [language, setLanguage] = useState("");

  const [isCheckout, setIsCheckout] = useState(false);
  const [isModalPromo, setIsModalPromo] = useState(false);
  const [isPromo, setIsPromo] = useState(null);

  const usePromo = (newValue) => {
    setIsPromo(newValue);
  };

  const cancelPromo = () => {
    setIsPromo(null);
  };

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
      setModalTitle("Add New Residence");
    }

    if (type === "edit") {
      setModalTitle("Edit Residence");
    }
    setIsModal(true);
  };

  const openModalPromo = () => {
    setModalTitle("Use Promo Code");
    setIsModalPromo(true);
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
    setIsModalPromo(false);
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

  const handleDateChange = (date) => {
    const dateInput = new Date(date);
    const formattedDate = dateInput.toISOString();
    setStartDate(formattedDate);
  };

  const handleDropdownChange = (event) => {
    if (event.target.value === "true") {
      const dateInput = new Date();
      const formattedDate = dateInput.toISOString();
      setStartDate(formattedDate);
      setIsAsap(true);
    } else if (event.target.value === "false") {
      setIsAsap(false);
    }
  };

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

  const saveResidence = () => {
    setIsSaving(true);

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

            axios
              .get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/quizzes/recalculate/${params}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((res) => {
                console.log("recalculate");
                router.reload();
              });
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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCqNVISSKUXTzSUejfJfljdtAH5UEODA54",
    libraries: libs,
  });

  const onChangePhone = (value, country, e, formattedValue) => {
    setCountry(country.countryCode);
    setPhone(value);
  };

  const getPromoList = (token) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupon?is_visible=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPromoList(res.data);
      });
  };

  useEffect(() => {
    const getToken = localStorage.getItem("token");

    if (getToken) {
      setToken(getToken);
    }

    getProvince();
    getResidence(getToken);
    getPromoList(getToken);

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

    // user order detail
    if (params) {
      axios
        .get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/v1/users/quizzes/${params}?locale=${localStorage.getItem(
            "language"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          }
        )
        .then((res) => {
          setQuiz(res.data);
          setRoomTypes(res.data.roomTypes);
          setRoomItems(res.data.roomItems);
        })
        .catch((err) => {
          throw err;
        });
    }

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
      getDistrict(residence.province.id);
      setLabel(residence.name);

      // old
      // let splitStreet = residence.street.split(",");
      // let roomIdx = splitStreet.length - 1;
      // setRoom(splitStreet[roomIdx]);

      // new
      setRoom(residence?.room_no);

      setStreet(residence?.street);
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
  }, [params, residence]);

  const checkoutSuccess = async (cleaningId, quizId) => {
    const payload = {
      user_quiz_id: quizId,
      cleaning_service_id: cleaningId,
      appointment_date: new Date(new Date(startDate).toISOString()),
      is_immediate_booking: isAsap,
    };

    // update profile
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/${profile.id}`,
      {
        email: email,
        // first_name: firstName,
        // last_name: lastName,
        name: name,
      },
      {
        headers: {},
      }
    );

    let airwallexEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/orders/airwallex-link`;
    if (isPromo) {
      airwallexEndpoint = airwallexEndpoint + `?coupon=${isPromo.couponCode}`;
    }
    await axios
      .post(airwallexEndpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        setDetailPayment(resp);
        setPaymentId(resp.data.payment_link.id);
        setPaymentLink(resp.data.payment_link.url);
        setIsCheckout(false);
      });
  };

  const onCheckout = async (cleaningId, quizId) => {
    setIsCheckout(true);

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/check-verify-phone-number-checkout`,
        {
          user_id: quiz.user_id,
          phone_number: phone.slice(3),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.msg === "unverified") {
          setIsCheckout(false);
          swal(
            "Unverified Phone Number",
            `Please verify your phone number before checkout`
          );
        } else {
          checkoutSuccess(cleaningId, quizId);
        }
      });
  };

  const checkPayment = async (id) => {
    const getToken = localStorage.getItem("token");
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/orders/check-payment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status === "PAID") {
          setIsPaid(true);
          setPaymentId(null);
        }
      });
  };

  useEffect(() => {
    if (paymentId) {
      checkPayment(paymentId);

      const intervalId = setInterval(() => {
        checkPayment(paymentId);
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [paymentId]);

  const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  };

  const onOTPVerify = () => {
    setShowVerifyLoading(true);

    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        setShowVerify(false);
        setShowSendButton(true);
        setShowVerifyLoading(false);

        if (phone !== profile.phone_number) {
          onSubmitProfile();
        }

        swal("Success", `Success verify otp`, "success");
      })
      .catch((err) => {
        setShowVerify(false);
        swal("Err", `Error verify otp ${err}`, "error");
      });
  };

  const onSignup = () => {
    setShowSendButton(false);
    setShowSendButtonLoading(true);
    onCaptchVerify();
    setExpirationDate(Date.now() + 60000);

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + phone;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;

        setShowSendButtonLoading(false);
        setShowVerify(true);

        setTimeout(() => {
          setShowSendButton(true);
        }, 60000);
        swal("Success", `Success send otp`, "success");
      })
      .catch((error) => {
        throw error;
      });
  };

  const onSubmitProfile = async () => {
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

    const data = {
      phone_number: ph,
    };

    try {
      // update profile
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/${profile.id}`,
        {
          phone_number: ph,
        },
        {
          headers: {},
        }
      );

      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/verify-phone-number-checkout`,
        {
          user_id: quiz.user_id,
          phone_number: ph,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsVerify(true);
      swal("Success", `Phone number verified & updated`, "success");

      setTimeout(() => {
        // router.reload();
      }, 1200);
    } catch (error) {
      if (error?.response?.status === 400) {
        swal("Bad Request", `${error.response.data.message}`);
      } else {
        swal("Err", `Error making POST request ${error}`, "error");
      }
    }
  };

  useEffect(() => {
    if (isPromo) {
      closeModal();
    }
  }, [isPromo]);

  return (
    <>
      <Heading />
      <Navbar language={language} />
      <div className="mt-16 justify-center max-[768px]:flex">
        <div className="checkout-container flex w-full items-start justify-center gap-12 px-12 max-[768px]:flex-col max-[768px]:items-center">
          {!paymentLink && (
            <div className="w-full rounded-xl p-7 shadow-lg max-[768px]:mx-0">
              <p className="text-custom-gray-2 mb-8 text-xl font-bold">
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
                    placeholder="Type your name here"
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
                </div>
                <div className="w-full">
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
                  placeholder="Type your email address here"
                  defaultValue={profile.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-custom-gray-2 text-md mb-2 block">
                  {content.phone}
                  {/* {showVerify && (
                    <Link
                      href={`/profile`}
                      className="mb-2 ml-2 rounded-md bg-yellow-400 px-5 py-[2px] text-[12px] text-white lg:mb-0"
                    >
                      Change Phone Number Here
                    </Link>
                  )} */}
                </label>
              </div>
              <div id="recaptcha-container"></div>
              <div className="flex items-center gap-3 max-[1024px]:grid">
                <div className="w-100 flex-auto">
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
                <div className="w-100 mt-2 flex-auto lg:mt-0">
                  <a
                    onClick={onSignup}
                    className={
                      showSendButton
                        ? "btn-gradient-custom-1 w-100 flex cursor-pointer items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium capitalize text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        : "btn-gradient-custom-1 w-100 flex cursor-none items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium capitalize text-white opacity-50 shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    }
                  >
                    {/* {content.send} */}
                    {/* {showSendButton ? (
                      content.send
                    ) : (
                      <Countdown date={Date.now() + 60000} />
                    )} */}

                    {showSendButton ? (
                      "get verification code"
                    ) : showSendButtonLoading ? (
                      <BeatLoader
                        color={"white"}
                        loading={true}
                        size={11}
                        width={10}
                        aria-label="Loading"
                        data-testid="loader"
                      />
                    ) : (
                      <Countdown date={expirationDate} />
                    )}
                  </a>
                </div>
              </div>
              <div className="pt-4">
                {showVerify && (
                  <div className="flex items-center justify-start gap-4">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderSeparator={<span>-</span>}
                      renderInput={(props) => (
                        <input
                          {...props}
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "4px",
                          }}
                        />
                      )}
                      className="inner-otp"
                    />
                    <div className="">
                      <a
                        onClick={onOTPVerify}
                        className={
                          showVerifyLoading
                            ? "btn-gradient-custom-1 cursor-none items-center rounded-lg bg-blue-700 px-4 py-3 text-center text-sm text-white opacity-50 shadow-md"
                            : "btn-gradient-custom-1 cursor-pointer items-center rounded-lg bg-blue-700 px-4 py-3 text-center text-sm text-white shadow-md"
                        }
                      >
                        {/* {content.verify} */}
                        {showVerifyLoading ? (
                          <BeatLoader
                            color={"white"}
                            loading={true}
                            size={11}
                            width={10}
                            aria-label="Loading"
                            data-testid="loader"
                          />
                        ) : (
                          content.verify
                        )}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-custom-gray-2 mb-4 mt-14 text-xl font-bold">
                {content.delivery_time}
              </p>
              <div className="flex gap-5">
                <div className="mb-5 w-full">
                  {/* <select
                    id="countries"
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option selected>Mon, 16 Oct</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                  </select> */}
                  {/* <DatePicker
                    className={`mb-0 block w-full appearance-none rounded-lg border bg-white px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none`}
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    disabled={isAsap ? true: false}
                  /> */}
                  <Calendar
                    onChange={handleDateChange}
                    disabled={isAsap}
                    className="w-full"
                    placeholder={content.placeholder_select_date}
                  />
                </div>
              </div>

              {/* Residence */}
              <div className="mt-10">
                <div className="flex-1">
                  <div className="">
                    <div className="">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-custom-gray-2 mb-4 text-xl font-bold">
                          {content.address}
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
                                        style={{
                                          height: "300px",
                                          width: "100%",
                                        }}
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
                                                      setResidence(addr.id)
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
                    <Divider orientation="left">Address Details</Divider>
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
                        Save
                      </Button>
                    </div>
                  </div>
                </Skeleton>
              </Modal>
              {/* Residence */}
            </div>
          )}

          {paymentLink && (
            <div className="w-full rounded-xl p-7 shadow-lg max-[768px]:mx-4">
              {!isPaid && (
                <iframe
                  title="example-iframe"
                  width="100%"
                  height="830"
                  src={paymentLink}
                />
              )}
              {isPaid && (
                <PaymentSuccess
                  content={{
                    continue_the_app: content.continue_the_app,
                    track_your_order: content.track_your_order,
                    message_your_cleaner: content.message_your_cleaner,
                    special_in_app_offers: content.special_in_app_offers,
                  }}
                />
              )}
            </div>
          )}

          <Modal
            title={modalTitle}
            centered
            open={isModalPromo}
            onOk={() => setIsModal(false)}
            onCancel={() => closeModal()}
            footer={[]}
          >
            <PromoCode
              list={promoList}
              quiz={quiz}
              usePromo={usePromo}
              isPromo={isPromo}
            />
          </Modal>

          <div className="w-full rounded-xl p-7 shadow-lg max-[768px]:mx-0">
            <div className="mb-5 rounded-xl p-7 shadow-lg ">
              <div className="border-b border-b-gray-200 py-3">
                <p className="text-custom-gray-2 min-w-[230px] text-lg font-bold">
                  {content.cleaning_hour}
                </p>
              </div>
              <div className="border-b border-b-gray-200 py-5">
                <div className="flex items-center justify-between">
                  <p className="text-custom-gray-2 text-md">
                    {content.estimated_time}
                  </p>
                  <p className="text-custom-gray-2 text-md min-w-[35px]">
                    {(quiz?.estimatedTime || 0).toFixed(1)} {content.hours}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-auto rounded-xl p-7 shadow-lg">
              <div className="flex items-center justify-between border-b border-b-gray-200 py-3">
                <p className="text-custom-gray-2 text-lg font-bold">
                  {content.order_summary}
                </p>
                {/* <IfFeatureEnabled feature="website-promo-code"> */}
                <a
                  className="cursor-pointer text-sm font-bold text-green-400"
                  onClick={openModalPromo}
                >
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon
                      style={{ color: "inherit" }}
                      className="w-3"
                      icon={faPercent}
                    />
                    Use Promo Code
                  </span>
                </a>
                {/* </IfFeatureEnabled> */}
              </div>
              <div className="border-b border-b-gray-200 py-5">
                <div className="flex items-center justify-between">
                  <p className="text-custom-gray-2 text-md">
                    {content.service_name}
                  </p>
                  <p className="text-custom-gray-2 text-md">
                    {quiz.cleaningService?.name}
                  </p>
                </div>
              </div>
              {/* <div className="border-b border-b-gray-200 py-5">
                <div className="flex items-center justify-between gap-20">
                  <p className="text-custom-gray-2 text-md">
                    {content.base_price}
                  </p>
                  <p className="text-custom-gray-2 text-lg">
                    ${quiz.cleaningService?.base_price}
                  </p>
                </div>
              </div> */}
              <div className="border-b border-b-gray-200 py-5">
                <p className="text-custom-gray-2 text-md pb-2">
                  {content.cleaning_items}:
                </p>
                {/* Room Types */}
                {roomTypes.length > 0 &&
                  roomTypes.map((val, i) => {
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-20"
                      >
                        <p className="text-custom-gray-2 text-md">
                          {val.name} x{val.qty}
                        </p>
                        <p className="text-custom-gray-2 text-lg">
                          ${_.round(val.price, 1)}
                        </p>
                      </div>
                    );
                  })}

                {/* Room Items */}
                {roomItems.length > 0 &&
                  roomItems.map((val, i) => {
                    if (val.qty !== 0) {
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-20"
                        >
                          <p className="text-custom-gray-2 text-md">
                            {val.name} x{val.qty}
                          </p>
                          <p className="text-custom-gray-2 text-lg">
                            ${_.round(val.item_price, 1)}
                          </p>
                        </div>
                      );
                    }
                  })}
              </div>
              <div className="border-b border-b-gray-200 py-5">
                <div className="mb-4 flex items-center justify-between gap-20">
                  <p className="text-custom-gray-2 text-md">
                    {content.cleaning_supplies}
                  </p>
                  {isPromo && isPromo.tools ? (
                    <p className="text-custom-gray-2 text-md font-bold">Free</p>
                  ) : (
                    <p className="text-custom-gray-2 text-md">
                      {quiz?.cleaning_supplies ? "$200" : "-"}
                    </p>
                  )}
                </div>
                <div className="mb-4 flex items-center justify-between gap-20">
                  <p className="text-custom-gray-2 text-md">
                    {content?.insurance}
                  </p>
                  {isPromo && isPromo.insurance ? (
                    <p className="text-custom-gray-2 text-md font-bold">Free</p>
                  ) : (
                    <p className="text-custom-gray-2 text-md">
                      {quiz?.insurance ? "$30" : "-"}
                    </p>
                  )}
                </div>
                <div className="mb-4 flex items-center justify-between gap-20">
                  <p className="text-custom-gray-2 text-md">
                    {content.cleaning_solutions}
                  </p>
                  {isPromo && isPromo.solutions ? (
                    <p className="text-custom-gray-2 text-md font-bold">Free</p>
                  ) : (
                    <p className="text-custom-gray-2 text-md">
                      {quiz?.cleaning_solutions ? "$150" : "-"}
                    </p>
                  )}
                </div>
                <div className="mb-4 flex items-center justify-between gap-20">
                  <p className="text-custom-gray-2 text-md">{content.pets}</p>
                  <p className="text-custom-gray-2 text-md">
                    {quiz?.pets ? content.yes : content.no}
                  </p>
                </div>
                <div className="mb-4 flex items-center justify-between gap-20">
                  <p className="text-custom-gray-2 text-md">
                    {content.remarks}
                  </p>
                  <p className="text-custom-gray-2 text-md">
                    {quiz?.remarks ? quiz?.remarks : content.no_remarks}
                  </p>
                </div>
                {isPromo && (
                  <div className="mb-4 flex items-center justify-between gap-20">
                    <p className="text-custom-gray-2 text-md">Used Coupon</p>
                    <p className="text-lg font-bold text-green-400">
                      {isPromo.couponCode}{" "}
                      <FontAwesomeIcon
                        className="w-auto cursor-pointer text-red-400"
                        icon={faTimesCircle}
                        onClick={() => cancelPromo()}
                      />
                    </p>
                  </div>
                )}
              </div>
              <div className="py-5">
                <div className="flex items-center justify-between gap-20">
                  <p className="text-custom-gray-2 text-md">
                    {content.estimated_price}
                  </p>
                  {isPromo && isPromo.estimatedPrice ? (
                    <div>
                      <p className="text-custom-gray-2 text-s line-through">
                        {isPromo.estimatedPrice
                          ? "$" + _.round(quiz.estimatedPrice, 1)
                          : "Loading..."}
                      </p>
                      <p className="text-custom-gray-2 text-xl font-bold">
                        {isPromo.estimatedPrice
                          ? "$" + _.round(isPromo.estimatedPrice, 1)
                          : "Loading..."}
                      </p>
                    </div>
                  ) : (
                    <p className="text-custom-gray-2 text-xl font-bold">
                      {quiz.estimatedPrice
                        ? "$" + _.round(quiz.estimatedPrice, 1)
                        : "Loading..."}
                    </p>
                  )}
                </div>
              </div>
              <div className="pt-4">
                {!paymentLink && (
                  <Button
                    disabled={startDate ? false : true}
                    type="primary"
                    loading={isCheckout}
                    onClick={() => onCheckout(quiz.cleaningService.id, quiz.id)}
                    className="btn-gradient-custom-1 flex w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-blue-700 px-4 py-3 text-center text-sm text-white shadow-md"
                  >
                    {content.checkout}
                  </Button>
                )}
              </div>
              {/* <div className="pt-4 text-center">
                <a className="text-blue-500">{content.checkout_promo}</a>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <Footer language={language} />
    </>
  );
}
