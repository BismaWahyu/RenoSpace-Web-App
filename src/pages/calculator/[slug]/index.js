import Image from "next/image";
import axios from "axios";
import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import ModalComponent from "@/components/modal";
// import LookingFreelancer from "../../../../public/assets/lottie/looking.json";
// import EmptyAnim from "../../../../public/assets/lottie/empty-data.json";
import {
  Alert,
  notification,
  Spin,
  Modal,
  Button,
  InputNumber,
  Input,
  Skeleton,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
// import lottie from "lottie-web";
import ResidenceForm from "@/components/residenceForm";
import Addressbook from "@/components/addressbook";
import { translation } from "../../../utils/translation";
import Heading from "../../../components/heading";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
const libs = ["places"];

const Select = dynamic(() => import("react-select"), { ssr: false });

const Context = React.createContext({
  name: "Default",
});

export default function Calculator() {
  const [token, setToken] = useState("");
  const router = useRouter();
  const { slug, is_business } = router.query;
  const [roomTypeForm, setRoomTypeForm] = useState(false);
  const [roomType, setRoomType] = useState([]);
  const [splittedRoomTypes, setSplittedRoomTypes] = useState([]);
  const [roomItems, setRoomItems] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [businessNature, setBusinessNature] = useState("");
  const [itemRows, setItemRows] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState([]);
  const [selectedRoomItem, setSelectedRoomItem] = useState([]);
  const [calcResult, setCalcResult] = useState(false);
  const [content, setContent] = useState({});
  const [isAddressbook, setIsAddressbook] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [residence, setResidence] = useState(null);
  const [areaSize, setAreaSize] = useState(0);
  const [isNoResidence, setIsNoResidence] = useState(false);
  const [orderFrequent, setOrderFrequent] = useState([]);
  const [isDesc, setIsDesc] = useState(false);
  const [language, setLanguage] = useState("");
  const [isNoMain, setIsNoMain] = useState(false);
  const [residences, setResidences] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [cleaningServiceDetail, setCleaningServiceDetail] = useState();

  const autocompleteRef = useRef(null);
  const [address, setAddress] = useState("");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCqNVISSKUXTzSUejfJfljdtAH5UEODA54",
    libraries: libs,
  });
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [selectedFrequent, setSelectedFrequent] = useState(null);
  const handleFrequentChange = (selectedOption) => {
    setSelectedFrequent(selectedOption);
  };

  const [selectedNature, setSelectedNature] = useState(null);
  const handleNatureChange = (selectedOption) => {
    setSelectedNature(selectedOption);
  };

  const [isLooking, setIsLooking] = useState(false);

  const [files, setFiles] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  const [api, contextHolder] = notification.useNotification();

  const [spinning, setSpinning] = useState(false);

  const [states, setStates] = useState({
    cleaning_supplies: false,
    cleaning_solutions: false,
    insurance: false,
    pet: false,
  });

  const [labelTitle, setLabelTitle] = useState("");
  const [labelContent, setLabelContent] = useState("");

  const labelDesc = {
    room: {
      en: "Please select the room and item type that you need to clean (Note that: Cleaners will only clean the select items and areas, if there are any additional items please contact our customer service hotline)",
      zh: "請選擇你需要清潔的房間種類和物件（注意: 清潔專員只會清潔已選擇的項目，如有額外需求請聯絡客戶服務）",
    },
    cleaning_tools: {
      en: "Cleaning tools include「a mop, a bucket and a broom or a vacuum cleaner 」(Cleaning tools will be left behind for our next visit)",
      zh: "清潔工具包括「地拖及水桶，掃把/吸塵機」(清潔完成後工具會留於下次使用)",
    },
    cleaning_solutions: {
      en: "Cleaning solutions include「Magiclean, Cif, washer fluid」(Cleaning solutions will be left behind for our next visit)",
      zh: "清潔劑包括「萬潔靈，潔而亮，玻璃水」(清潔完成後清潔劑會留於下次使用)",
    },
    insurance: {
      en: "Insurance cover a maximum of $10,000,000HKD protect all kinds of accident during the process of cleaning, Please visit our website for more detail: www.renospace.com.hk/insurance Pet: If there are any pets in the cleaning site, we will match you with a pet friendly cleaner.",
      zh: " 保險提供上限為$10,000,000港元保障工作期間所有意外, 詳情請瀏覽: www.renospace.com.hk/insurance",
    },
    pet: {
      en: "If there are any pets in the cleaning site, we will match you with a pet friendly cleaner.",
      zh: "如果客人有寵物，我們會安排對寵物有好的清潔專員",
    },
    images: {
      en: "Please attach the photo of the areas that you would like our cleaner focus on cleaning.",
      zh: "請提供照片，方便清潔專員知道需要特別注意的地方",
    },
  };

  const acceptAttribute = is_business
    ? ".mp4, .mov, .hevc"
    : ".jpg, .jpeg, .png, .tiff";

  useEffect(() => {
    setLanguage(localStorage.getItem("language") || "zh");
    setOrderFrequent([
      {
        value: "first",
        label:
          localStorage.getItem("language") === "zh" ? "首次清潔" : "First Time",
      },
      {
        value: "single",
        label:
          localStorage.getItem("language") === "zh" ? "單一清潔" : "First Time",
      },
      {
        value: "regular",
        label:
          localStorage.getItem("language") === "zh"
            ? "持續清潔"
            : "Regular Order",
      },
      {
        value: "occasionally",
        label:
          localStorage.getItem("language") === "zh"
            ? "定期清潔"
            : "Occasional Order",
      },
    ]);

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

    if (is_business === true || is_business === "true") {
      const businessNature = async () => {
        const resp = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/business-nature?locale=${
            localStorage.getItem("language") || "zh"
          }`
        );
        let list = [];
        resp.data.data.map((item) => {
          list.push({ value: item.id, label: item.label });
        });
        setBusinessNature(list);
      };

      businessNature();
    } else {
      getResidence();

      if (router.query.slug && residence) {
        getLastQuiz(router.query.slug, residence);
      }
    }
  }, [router.query.slug, residence]);

  const showLoader = (isLoading) => {
    setSpinning(isLoading);
  };

  const showLabelDesc = (title, content) => {
    setLabelTitle(title);

    if (localStorage.getItem("language") == "en") {
      setLabelContent(content.en);
    }

    if (localStorage.getItem("language") == "zh") {
      setLabelContent(content.zh);
    }

    setIsDesc(true);
  };

  const handleInputFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const newImages = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    setFiles(e.target.files);
  };

  const removeImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const renderImagePreviews = () => {
    return selectedImages.map((imageUrl, index) => (
      <div key={index} className="mb-2 flex items-center">
        <div className="w-fit cursor-pointer rounded-xl bg-white p-2 shadow-lg">
          <Image
            src={imageUrl}
            alt={`Preview ${index}`}
            width={50}
            height={50}
            className="mr-2"
          />
        </div>
        <button
          type="button"
          onClick={() => removeImage(index)}
          className="text-red-500 focus:outline-none"
        >
          Remove
        </button>
      </div>
    ));
  };

  const selectRoomType = (id) => {
    const choosen = selectedRoomType.some((item) => item.id === id);

    if (!choosen) {
      const selectedRoom = roomType.filter((item) => item.id === id);
      setRoomItems(selectedRoom[0].roomItems);
      const roomTypeData = {
        id: parseInt(id),
        qty: 1,
      };
      setSelectedRoomType([...selectedRoomType, roomTypeData]);
    } else {
      const selectedRoom = roomType.filter((item) => item.id === id);

      setRoomItems(selectedRoom[0].roomItems);

      setSelectedRoomType(selectedRoomType.filter((item) => item.id !== id));
      const itemIds = new Set(roomItems.map((item) => item.id));

      const updateSelected = selectedRoomItem.filter((selection) =>
        itemIds.has(!selection.id)
      );

      setSelectedRoomItem(updateSelected);

      setRoomItems([]);
    }
  };

  const submitQuiz = () => {
    if (
      (is_business === false || is_business === "false") &&
      selectedRoomType.length === 0
    ) {
      errNotif("bottomRight", "Please select at least one room type!");
      return;
    }

    const getToken = localStorage.getItem("token");

    if (!getToken) {
      router.push("/register", "/register");
      return;
    }

    const formData = new FormData();
    if (is_business === true || is_business === "true") {
      const area = areaSize.toString() + " sqft";
      formData.append("address", address);
      formData.append("business_nature", selectedNature.label);
      formData.append("clean_frequent", selectedFrequent.label);
      formData.append("remarks", area);
      formData.append("is_business", true);
    } else {
      formData.append("images[]", files ? files : []);
      formData.append("room_type_ids", JSON.stringify(selectedRoomType));

      const filterSelectedRoomItem = selectedRoomItem.filter(
        (item) => item.qty !== 0
      );

      formData.append("room_item_ids", JSON.stringify(filterSelectedRoomItem));
      formData.append("remarks", remarks);
    }

    if (cleaningServiceDetail && cleaningServiceDetail.data.id) {
      formData.append("cleaning_service_id", cleaningServiceDetail.data.id);
    }

    formData.append("pets", states.pet);
    formData.append("cleaning_solutions", states.cleaning_solutions);
    formData.append("cleaning_supplies", states.cleaning_supplies);
    if (states.cleaning_supplies === true) {
      formData.append("broom_and_mop", true);
    } else {
      formData.append("broom_and_mop", false);
    }
    formData.append("insurance", states.insurance);
    formData.append("cleaning_slug", slug);

    const submit = async () => {
      showLoader(true);

      /* DON'T REMOVE THIS CODE YET
       * For checking body payload pupose
       */
      // for (const [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }
      // return

      if (quizId) {
        try {
          axios
            .put(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/quizzes/${quizId}`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${getToken}`,
                },
              }
            )
            .then((res) => {
              showLoader(false);
              router.push(
                `/${language}/checkout/[id]`,
                `/${language}/checkout/${res.data.id}`
              );
            });
        } catch (err) {
          showLoader(false);
        }
      } else {
        try {
          axios
            .post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/quizzesV2`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${getToken}`,
                },
              }
            )
            .then((resp) => {
              showLoader(false);
              router.push(`/checkout/[id]`, `/checkout/${resp.data.id}`);
            })
            .catch((err) => {
              showLoader(false);

              if (err.response.data.message.msg === "Residence not found") {
                Modal.warning({
                  title: "Residence not found",
                  content: (
                    <>
                      <p>Do you want add residence now?</p>
                    </>
                  ),
                  centered: true,
                  footer: [
                    <div
                      key="buttons"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        key="button1"
                        type="primary"
                        className="btn-gradient-custom-1 mr-2 mt-5 w-1/3 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        onClick={() => {
                          Modal.destroyAll();
                          setIsAddressbook(true);
                        }}
                      >
                        Yes
                      </Button>
                      <Button
                        key="button2"
                        type="primary"
                        className="btn-gradient-custom-2 mt-5 w-1/3 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        onClick={() => Modal.destroyAll()}
                      >
                        Later
                      </Button>
                    </div>,
                  ],
                });
              } else {
                errNotif("bottomRight", err.response.data.message?.msg);
              }
            });
        } catch (err) {
          showLoader(false);
        }
      }
    };

    const submitBusinessQuiz = async () => {
      const getToken = localStorage.getItem("token");

      if (address.length === 0) {
        errNotif("bottomRight", "Please fill your address!");
        return;
      }

      if (parseInt(areaSize) === 0) {
        errNotif("bottomRight", "Area size can't be 0!");
        return;
      }

      if (!selectedFrequent) {
        errNotif("bottomRight", "Select frequency of your order!");
        return;
      }

      try {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/quizzesV2?type=business`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${getToken}`,
              },
            }
          )
          .then(() => {
            setIsLooking(true);
            setTimeout(() => {
              router.push(`/${language}/match`);
            }, 3000);
          });
      } catch (err) {
        showLoader(false);
        throw err;
      }
    };
    if (is_business === true || is_business === "true") {
      submitBusinessQuiz();
    } else {
      submit();
    }
  };

  const contextValue = useMemo(
    () => ({
      size: "Please select your home size",
    }),
    []
  );

  const errNotif = (placement, errMsg) => {
    api.error({
      message: "Submit Error",
      description: errMsg,
      placement,
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleToggle = (key) => {
    setStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const customDropdown = {
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: "transparent", // Make the background transparent
      border: "none",
      boxShadow: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "gray", // Change the dropdown indicator color
    }),
  };

  function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const hoursText =
      hours > 0 ? `${hours} ${parseInt(hours) === 1 ? "Hour" : "Hours"}` : "";
    const minutesText =
      parseInt(remainingMinutes) > 0 ? `${remainingMinutes} Mins` : "";

    return `${hoursText} ${minutesText}`.trim();
  }

  const generateRoomItemsElements = (arr, start, end) => {
    return arr.slice(start, end).map((el, idx) => (
      <div key={start + idx} className="mb-4 flex flex-row">
        <div className="flex flex-col items-center">
          <span className="pb-1">{el.name}</span>
          <div
            onClick={() => selectRoomItem(el.id)}
            className={`mb-1 cursor-pointer rounded-xl bg-white p-3 shadow-lg ${
              selectedRoomItem.some((item) => item.id === el.id)
                ? "border-4 border-sky-500"
                : ""
            }`}
          >
            <Image
              src={
                el.display_image
                  ? el.display_image.includes("https")
                    ? el.display_image
                    : process.env.NEXT_PUBLIC_IMAGE_URL + el.display_image
                  : "/assets/gallery-add.png"
              }
              alt={el.name}
              width={40}
              height={40}
            />
          </div>
          <span className="text-[12px]">
            {content.each} {el.item_price} HKD
          </span>
        </div>
      </div>
    ));
  };

  const selectRoomItem = (id) => {
    const choosen = selectedRoomItem.some((item) => item.id === id);

    if (!choosen) {
      const roomItemData = {
        id: parseInt(id),
        qty: 1,
      };
      setSelectedRoomItem([...selectedRoomItem, roomItemData]);
    } else {
      setSelectedRoomItem(selectedRoomItem.filter((item) => item.id !== id));
    }
  };

  const getLastQuiz = async (cleaning_slug, residence_id) => {
    const getToken = localStorage.getItem("token");
    const cleaningSlug = cleaning_slug ?? null;
    const residenceId = residence_id ?? null;

    const getRoomData = (slug, data) => {
      axios
        .get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/v1/room-types?cleaningServiceSlug=${slug}&locale=${
            localStorage.getItem("language") || "zh"
          }`,
          {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          }
        )
        .then((resp) => {
          setRoomType(resp.data);
          let roomData = resp.data;
          let selectedRoom = [];
          let roomTypeList = [];
          let roomItemList = [];
          if (roomData.length > 0) {
            roomData.forEach((el) => {
              el.min_cleaning_time = formatTime(el.min_cleaning_time);
              if (data) {
                data.roomTypes.forEach((roomType) => {
                  roomTypeList.push({
                    id: roomType.id,
                    qty: 1,
                  });
                });

                data.roomItems.forEach((roomItem) => {
                  roomItemList.push({
                    id: roomItem.id,
                    qty: 1,
                  });
                });

                const defaultRoom = roomData.filter(
                  (item) => item.id === data.roomTypes[0].id
                );
                setRoomItems(defaultRoom[0].roomItems);
              } else {
                const roomTypeDefault = roomData.filter(
                  (item) => item.roomTypeCleaningService[0]?.is_default === true
                );
                const roomTypeId = roomData
                  .filter(
                    (item) =>
                      item.roomTypeCleaningService[0]?.is_default === true
                  )
                  .map((item) => item.id);
                const roomItemId = roomData
                  .filter((item) => item.roomItems.length > 0)
                  .flatMap((item) =>
                    item.roomItems.map((roomItem) => roomItem.id)
                  );

                roomData.map((el, idx) => {
                  if (roomTypeId.includes(el.id)) {
                    el.qty = 1;
                    if (!selectedRoom.includes(idx)) {
                      selectedRoom.push(idx);
                      roomTypeList.push({ id: el.id, qty: 1 });
                    }
                    el.roomItems.forEach((itm) => {
                      if (roomItemId.includes(itm.id)) {
                        const getVal = el.roomItems.filter(
                          (slct) => slct.id === itm.id
                        );
                        if (getVal[0].qty === undefined) {
                          itm.qty = 0;
                        } else {
                          itm.qty = getVal[0].qty;
                        }
                      } else {
                        itm.qty = 0;
                      }

                      const existing = roomItemList.find(
                        (item) => item.id === itm.id
                      );
                      if (!existing) {
                        roomItemList.push({ id: itm.id, qty: itm.qty });
                      }
                    });
                  } else {
                    el.roomItems.forEach((itm) => {
                      itm.qty = 0;
                    });
                  }
                });

                setItemRows(Math.ceil(roomData[0].roomItems.length / 2));

                if (roomTypeId.length > 0) {
                  const defaultItems = roomData.filter(
                    (item) => item.name === roomTypeDefault[0].name
                  );

                  if (
                    defaultItems.length > 0 &&
                    defaultItems[0].roomItems.length > 0
                  ) {
                    const updateRoomItem = defaultItems[0].roomItems.map(
                      (item) => ({
                        ...item,
                        roomId: roomData[0].id,
                      })
                    );
                    setRoomItems(updateRoomItem);
                  } else {
                    const updateRoomItem = [];
                    setRoomItems(updateRoomItem);
                  }
                }
              }
            });
            const uniqeRoomType = Object.values(
              roomTypeList.reduce((acc, item) => {
                acc[item.id] = item; // The most recent object with the same id will replace the previous one
                return acc;
              }, {})
            );
            setSelectedRoomType(uniqeRoomType);

            const uniqeRoomItem = Object.values(
              roomItemList.reduce((acc, item) => {
                acc[item.id] = item;
                return acc;
              }, {})
            );
            setSelectedRoomItem(uniqeRoomItem);
            setItemRows(Math.ceil(roomData[0].roomItems.length / 2));
            setRoomItems(roomData[0].roomItems);
          }
        });
    };

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/quizzes/latest?cleaning_service_slug=${cleaningSlug}&residence_id=${residenceId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      )
      .then((res) => {
        if (res.data.images.length > 0) {
          setFiles(res.data.images);
        }
        setQuizId(res.data.id);
        setStates({
          cleaning_supplies: res.data.cleaning_supplies,
          cleaning_solutions: res.data.cleaning_solutions,
          insurance: res.data.insurance,
          pet: res.data.pets,
        });
        getRoomData(res.data.cleaningService.slug, res.data);
      })
      .catch((err) => {
        getRoomData(cleaningSlug, null);
      })
      .catch((err) => {
        throw err;
      });
  };

  const getResidence = async () => {
    const getToken = localStorage.getItem("token");
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/residences`, {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      })
      .then((res) => {
        if (res.data.length === 0) {
          setIsAddressbook(true);
          return;
        }

        setResidences(res.data);
        let main = res.data.filter((data) => data.is_current_residence);

        if (main.length > 0) {
          setResidence(main[0].id);
        }

        if (main.length === 0) {
          setIsNoMain(true);
          return;
        }

        if (main[0].cleaningAreaSize === null) {
          Modal.warning({
            title: "Please define your area size first!",
            content: (
              <>
                <p>Access addressbook now? </p>
              </>
            ),
            centered: true,
            footer: [
              <div
                key="buttons"
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  key="button1"
                  type="primary"
                  className="btn-gradient-custom-1 mr-2 mt-5 w-1/3 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  onClick={() => {
                    Modal.destroyAll();
                    router.push("/addressbook");
                  }}
                >
                  Yes
                </Button>
                <Button
                  key="button2"
                  type="primary"
                  className="btn-gradient-custom-2 mt-5 w-1/3 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  onClick={() => Modal.destroyAll()}
                >
                  Later
                </Button>
              </div>,
            ],
          });
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          router.push("/register");
        }
      });
  };

  const roomTypesContent = () => {
    return (
      <div className="flex flex-row flex-wrap justify-around">
        {roomType.slice(5).map((el, idx) => (
          <div
            key={idx + 5}
            className="flex flex-col items-center justify-center"
          >
            <div
              className={`m-1 flex w-1/3 cursor-pointer flex-col items-center justify-center rounded-xl bg-white p-4 shadow-lg ${
                selectedIdx.includes(idx + 5) ? "border-4 border-sky-500" : "" // Apply border color if selected
              }`}
              style={{ width: "140px", height: "140px" }}
              onClick={() => handleSelectedRoom(idx + 5, true, el.id)}
            >
              <Image
                src={
                  el.display_image
                    ? el.display_image.includes("https")
                      ? el.display_image
                      : process.env.NEXT_PUBLIC_IMAGE_URL + el.display_image
                    : "/assets/gallery-add.png"
                }
                alt={el.name}
                width={40}
                height={40}
              />
              <span className="pb-1 pt-1 text-center text-[14px]">
                {el.name}
              </span>
              <span className="text-[12px]">{el.min_cleaning_time}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const RoomTypeCard = ({ item, idx }) => {
    return (
      <div>
        <div
          className={`mb-3 flex cursor-pointer flex-col items-center justify-center rounded-lg bg-white p-4 shadow-md ${
            selectedRoomType.some((room) => room.id === item.id)
              ? "border-4 border-sky-500"
              : ""
          }`}
          onClick={() => selectRoomType(item.id)}
        >
          <Image
            src={
              item.display_image
                ? item.display_image.includes("https")
                  ? item.display_image
                  : process.env.NEXT_PUBLIC_IMAGE_URL + item.display_image
                : "/assets/gallery-add.png"
            }
            alt={item.name}
            width={40}
            height={40}
          />
          <h3 className="pb-1 pt-1 text-center text-[14px]">{item.name}</h3>
          <p className="text-[12px]">{item.price} HKD</p>
        </div>
      </div>
    );
  };

  const CardList = ({ data }) => {
    return (
      <div className="grid max-h-[400px] grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 md:grid-cols-3">
        {data.map((item, index) =>
          item.price !== null ? (
            <RoomTypeCard key={index} item={item} idx={index} />
          ) : null
        )}
      </div>
    );
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
    setAddress(address);
  };

  const setMainResidence = (id) => {
    const getToken = localStorage.getItem("token");
    setLoadingSubmit(true);
    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/residences/${id}/use`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      )
      .then((res) => {
        setLoadingSubmit(false);
        setIsNoMain(false);
        getResidence(token);
      });
  };

  const editResidence = () => {
    router.push("/addressbook");
  };

  const removeResidence = (id) => {
    const getToken = localStorage.getItem("token");
    setIsDelete(true);
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/residences/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      )
      .then((res) => {
        setIsDelete(false);
        getResidence(token);
      });
  };

  const saveResidence = () => {
    getResidence();
    getLastQuiz(router.query.slug, residence);
    setIsAddressbook(false);
  };

  const SelectedRoomList = () => {
    return (
      <div>
        {roomType.map((item) => {
          const roomTypeItem = selectedRoomType.find(
            (room) => room.id === item.id
          );

          if (roomTypeItem) {
            return (
              <div key={item.id} className="mb-3">
                <div className="flex-rom mb-3 flex items-center">
                  <Image
                    src={
                      item.display_image
                        ? item.display_image.includes("https")
                          ? item.display_image
                          : process.env.NEXT_PUBLIC_IMAGE_URL +
                            item.display_image
                        : "/assets/gallery-add.png"
                    }
                    alt={item.name}
                    width={40}
                    height={40}
                  />
                  <span className="ml-5 font-bold">{item.name}</span>
                  <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px]">
                    <span>1</span>
                  </div>
                </div>

                <hr></hr>

                {item.roomItems.map((el, idx) => {
                  const roomItem = selectedRoomItem.find(
                    (item) => item.id === el.id
                  );

                  if (roomItem) {
                    return (
                      <div
                        key={idx}
                        className="mb-3 mt-3 flex flex-row items-center"
                      >
                        <div className="flex items-center justify-center rounded-full bg-slate-200 p-2 text-[11px]">
                          <Image
                            src={
                              el.display_image
                                ? el.display_image.includes("https")
                                  ? el.display_image
                                  : process.env.NEXT_PUBLIC_IMAGE_URL +
                                    el.display_image
                                : "/assets/gallery-add.png"
                            }
                            alt={el.name}
                            width={15}
                            height={15}
                            className="mr-2"
                          />
                          <span>{el.name}</span>
                        </div>
                        <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px]">
                          <span>1</span>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  if (!isLoaded) {
    return <Skeleton />;
  }

  return (
    <>
      <Heading />
      <Context.Provider value={contextValue}>
        {contextHolder}

        {isLooking && (
          <div className="flex h-screen items-center justify-center">
            <div id="lottie-container" className="w-80">
              {/* <LottieAnimation /> */}
            </div>
          </div>
        )}

        <div className={isLooking ? "hidden" : ""}>
          <div className="banner-login flex justify-between p-10">
            <a
              href={
                is_business === true || is_business === "true"
                  ? "/business/cleaning"
                  : "/cleaning"
              }
              className="hidden md:block lg:block"
            >
              <Image
                src="/assets/arrow-right.png"
                alt="Arrow"
                width="40"
                height="40"
                className="rounded-full bg-white p-2 shadow-md"
              />
            </a>
            <div className="flex items-center justify-center">
              <div className="text-custom-gray-1 flex h-[95vh] w-[90vw] min-w-[20rem] rounded-[2%] bg-neutral-50 shadow-lg lg:w-[60rem] lg:rounded-[5%]">
                <div className="calculator-background hidden w-1/2 flex-col justify-center rounded-[5%] p-10 lg:flex">
                  <p className="mb-10 text-[36px] text-white">
                    {is_business
                      ? content.content_banner_calculator_business
                      : content.content_banner_calculator_cleaning}
                  </p>

                  <p className="text-[30px] text-white">
                    {content.calculator_2}
                  </p>
                </div>

                {!roomTypeForm && !calcResult && (
                  <div className="mt-[-20px] w-full p-10 lg:w-1/2">
                    <span className="text-label">{content.rooms}</span>
                    <InfoCircleOutlined
                      className="ml-2"
                      onClick={() => showLabelDesc("Rooms", labelDesc.room)}
                    />
                    <div className="mb-2 flex h-[80vh] flex-col">
                      <div className="flex-grow overflow-y-auto">
                        <div
                          className={
                            is_business === true || is_business === "true"
                              ? "hidden"
                              : ""
                          }
                        >
                          <div className="mt-5 max-h-[200px] w-[90%] overflow-y-auto rounded-xl bg-white p-4 shadow-lg">
                            {selectedRoomType.length > 0 ? (
                              <SelectedRoomList />
                            ) : (
                              <Alert
                                message={
                                  is_business === true || is_business === "true"
                                    ? content.calculator_4
                                    : content.calculator_3
                                }
                                description={content.calculator_5}
                                type="info"
                                showIcon
                              />
                            )}
                          </div>
                          <div
                            className="item-center mt-5 flex w-[90%] cursor-pointer flex-row justify-center rounded-xl border-2 border-gray-300 bg-white p-2 shadow-lg"
                            onClick={() => setRoomTypeForm(true)}
                          >
                            <Image
                              src="/assets/plus.png"
                              alt="Add Room Type"
                              width={30}
                              height={30}
                            />
                          </div>
                        </div>

                        <div className="mt-5 w-[90%]">
                          <div
                            className={
                              is_business === true || is_business === "true"
                                ? "hidden"
                                : ""
                            }
                          >
                            <div className="item-center mb-3 flex flex-row items-center gap-2">
                              <span>{content.calculator_6}</span>
                              <InfoCircleOutlined
                                className=""
                                onClick={() =>
                                  showLabelDesc(
                                    "Cleaning Tools",
                                    labelDesc.cleaning_tools
                                  )
                                }
                              />
                              <div
                                className={`item-center relative ml-auto inline-block flex h-6 min-w-10 ${
                                  states.cleaning_supplies
                                    ? "gradient-background"
                                    : "bg-gray-300"
                                } rounded-full shadow-inner`}
                              >
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  id="tools"
                                  checked={states.cleaning_supplies}
                                  onChange={() =>
                                    handleToggle("cleaning_supplies")
                                  }
                                />
                                <label
                                  htmlFor="tools"
                                  className={`absolute h-6 w-6 transform cursor-pointer rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                                    states.cleaning_supplies
                                      ? "translate-x-3/4"
                                      : "translate-x-0"
                                  }`}
                                ></label>
                              </div>
                            </div>
                            <div className="item-center mb-3 flex flex-row items-center gap-2">
                              <span>{content.calculator_7}</span>
                              <InfoCircleOutlined
                                className=""
                                onClick={() =>
                                  showLabelDesc(
                                    "Cleaning Solutions",
                                    labelDesc.cleaning_solutions
                                  )
                                }
                              />
                              <div
                                className={`item-center relative ml-auto inline-block flex h-6 min-w-10 ${
                                  states.cleaning_solutions
                                    ? "gradient-background"
                                    : "bg-gray-300"
                                } rounded-full shadow-inner`}
                              >
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  id="solutions"
                                  checked={states.cleaning_solutions}
                                  onChange={() =>
                                    handleToggle("cleaning_solutions")
                                  }
                                />
                                <label
                                  htmlFor="solutions"
                                  className={`absolute h-6 w-6 transform cursor-pointer rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                                    states.cleaning_solutions
                                      ? "translate-x-3/4"
                                      : "translate-x-0"
                                  }`}
                                ></label>
                              </div>
                            </div>
                            <div className="item-center mb-3 flex flex-row items-center gap-2">
                              <span>{content.calculator_8}</span>
                              <InfoCircleOutlined
                                className=""
                                onClick={() =>
                                  showLabelDesc(
                                    "Insurance",
                                    labelDesc.insurance
                                  )
                                }
                              />
                              <div
                                className={`item-center relative ml-auto inline-block flex h-6 min-w-10 ${
                                  states.insurance
                                    ? "gradient-background"
                                    : "bg-gray-300"
                                } rounded-full shadow-inner`}
                              >
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  id="insurance"
                                  checked={states.insurance}
                                  onChange={() => handleToggle("insurance")}
                                />
                                <label
                                  htmlFor="insurance"
                                  className={`absolute h-6 w-6 transform cursor-pointer rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                                    states.insurance
                                      ? "translate-x-3/4"
                                      : "translate-x-0"
                                  }`}
                                ></label>
                              </div>
                            </div>
                            <div className="item-center mb-3 flex flex-row items-center gap-2">
                              <span>{content.calculator_9}</span>
                              <InfoCircleOutlined
                                className=""
                                onClick={() =>
                                  showLabelDesc("Pet", labelDesc.pet)
                                }
                              />
                              <div
                                className={`item-center relative ml-auto inline-block flex h-6 min-w-10 ${
                                  states.pet
                                    ? "gradient-background"
                                    : "bg-gray-300"
                                } rounded-full shadow-inner`}
                              >
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  id="pet"
                                  checked={states.pet}
                                  onChange={() => handleToggle("pet")}
                                />
                                <label
                                  htmlFor="pet"
                                  className={`absolute h-6 w-6 transform cursor-pointer rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                                    states.pet
                                      ? "translate-x-3/4"
                                      : "translate-x-0"
                                  }`}
                                ></label>
                              </div>
                            </div>
                          </div>

                          {is_business === true ||
                            (is_business === "true" && (
                              <div className="mb-3 mt-3">
                                <span>{content.business_nature}</span>
                                <div className="rounded-xl bg-white p-3 shadow-lg">
                                  <Select
                                    options={businessNature}
                                    styles={customDropdown}
                                    value={selectedNature}
                                    onChange={handleNatureChange}
                                  />
                                </div>
                                {/* <div className="rounded-xl bg-white p-5 shadow-lg">
                                  <input
                                    className="block h-full w-full resize-none border-none bg-transparent focus:outline-none"
                                    placeholder="Input your business nature"
                                    value={businessNature}
                                    onChange={(e) =>
                                      setBusinessNature(e.target.value)
                                    }
                                  />
                                </div> */}
                              </div>
                            ))}

                          <div className="mb-3">
                            <div className="item-center flex flex-row items-center gap-2 pb-1">
                              <span>
                                {is_business === true || is_business === "true"
                                  ? content.calculator_15
                                  : content.calculator_10}
                              </span>
                              <InfoCircleOutlined
                                className=""
                                onClick={() =>
                                  showLabelDesc("Images", labelDesc.images)
                                }
                              />
                            </div>
                            <div className="flex">
                              <div
                                className="w-fit cursor-pointer rounded-xl bg-white p-5 shadow-lg"
                                onClick={handleInputFile}
                              >
                                <Image
                                  src="/assets/gallery-add.png"
                                  alt="Add image"
                                  width={30}
                                  height={30}
                                />
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  style={{ display: "none" }}
                                  onChange={handleFileChange}
                                  accept={acceptAttribute}
                                />
                              </div>
                              {selectedImages.length > 0 && (
                                <div className="ml-4">
                                  {renderImagePreviews()}
                                </div>
                              )}
                            </div>
                          </div>

                          <div
                            className={
                              is_business === true || is_business === "true"
                                ? "mb-5"
                                : "hidden"
                            }
                          >
                            <span>{content.order_frequency}</span>
                            <div className="rounded-xl bg-white p-3 shadow-lg">
                              <Select
                                options={orderFrequent}
                                styles={customDropdown}
                                value={selectedFrequent}
                                onChange={handleFrequentChange}
                              />
                            </div>
                          </div>
                          <div
                            className={
                              is_business === true || is_business === "true"
                                ? "mb-5"
                                : "hidden"
                            }
                          >
                            <span>{content.area_size}</span>
                            <div className="rounded-xl bg-white p-5 shadow-lg">
                              <InputNumber
                                addonAfter={"sqft"}
                                defaultValue={0}
                                onChange={(e) => setAreaSize(e)}
                                className="block w-full resize-none border-none bg-transparent focus:outline-none"
                              />
                              {/* <input 
                                className="block w-full resize-none border-none bg-transparent focus:outline-none" 
                                placeholder="Area Size"
                              /> */}
                            </div>
                          </div>
                          <div
                            className={
                              is_business === true || is_business === "true"
                                ? "hidden"
                                : "mb-5"
                            }
                          >
                            <span>{content.calculator_12}</span>
                            <div className="mt-1 rounded-xl bg-white p-5 shadow-lg">
                              <textarea
                                className="block h-full w-full resize-none border-none bg-transparent focus:outline-none"
                                placeholder={content.calculator_13}
                                // {
                                //   is_business == true || is_business === "true"
                                //     ? content.calculator_14
                                //     : content.calculator_13
                                // }
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                              />
                            </div>
                          </div>

                          <div
                            className={
                              is_business === true || is_business === "true"
                                ? "mb-5"
                                : "hidden"
                            }
                          >
                            <span>{content.address}</span>
                            <div className="rounded-xl bg-white p-5 shadow-lg">
                              <Autocomplete
                                onLoad={(autocomplete) => {
                                  autocompleteRef.current = autocomplete;
                                }}
                                onPlaceChanged={handlePlaceChanged}
                                options={{
                                  fields: [
                                    "address_component",
                                    "geometry",
                                    "name",
                                  ],
                                  componentRestrictions: { country: "HK" },
                                }}
                              >
                                <Input
                                  size="large"
                                  value={address}
                                  onChange={(e) => setAddress(e.target.value)}
                                  type="text"
                                  placeholder="Search for a location"
                                  className="block h-full w-full resize-none border-none bg-transparent focus:outline-none"
                                />
                              </Autocomplete>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-gradient-custom-1 flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      onClick={(e) => submitQuiz()}
                    >
                      {content.calculate}
                    </button>
                  </div>
                )}

                {roomTypeForm && (
                  <div className="mt-[-20px] flex h-[95vh] w-full flex-col p-5 lg:w-1/2">
                    <div className="mt-10 flex w-full items-center justify-center">
                      <span className="text-center text-[20px]">
                        {content.calculator_17}
                      </span>
                    </div>

                    <CardList data={roomType} />

                    <hr className="mt-5"></hr>

                    <p className="mt-5">{content.calculator_note}</p>

                    {selectedIdx.length === 0 && (
                      <div className="align-center mt-5 flex justify-center">
                        <span>{content.select_room}</span>
                      </div>
                    )}

                    <div className="mb-2 flex max-h-[40%] flex-col overflow-y-auto">
                      <div className="flex-grow overflow-y-auto">
                        {Array.from({ length: itemRows }, (_, index) => (
                          <div
                            key={index}
                            className="mt-5 flex flex-col items-center gap-2 lg:flex-row"
                          >
                            {generateRoomItemsElements(
                              roomItems,
                              index * 2,
                              index * 2 + 2
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* {roomItems.length === 0 && selectedIdx.length !== 0 && (
                      <div className="align-center flex justify-center">
                        <span>{content.no_items}</span>
                      </div>
                    )} */}

                    <button
                      type="button"
                      id="quiz_submission"
                      className="btn-gradient-custom-1 mt-10 flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      onClick={() => {
                        setRoomTypeForm(false);
                      }}
                    >
                      {content.calculator_18}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Modal
          title="No Residence Available"
          centered
          open={isNoResidence}
          closeIcon={null}
          footer={[]}
        >
          {/* <LottieNoResidence className="w-1/3" /> */}

          <Button
            onClick={() => {
              setIsNoResidence(false);
              setIsAddressbook(true);
            }}
            className="btn-gradient-custom-1 ml-auto mt-5 inline-block w-full rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Add New One
          </Button>
        </Modal>

        <Modal
          title="Add New Residence"
          centered
          open={isAddressbook}
          closeIcon={null}
          footer={[]}
        >
          <ResidenceForm onDataSubmit={() => saveResidence()} editData={null} />
        </Modal>

        <Modal
          title="Select a Residence"
          centered
          open={isNoMain}
          footer={[]}
          onCancel={() => setIsNoMain(false)}
          style={{ maxHeight: "80vh", overflow: "hidden", overflowY: "auto" }}
        >
          <Addressbook
            type={"modal"}
            residences={residences}
            content={content}
            setDefault={setMainResidence}
            onEdit={editResidence}
            onRemove={removeResidence}
          />
        </Modal>

        <Modal
          title={`${labelTitle} Description`}
          centered
          open={isDesc}
          footer={[]}
          onCancel={() => setIsDesc(false)}
        >
          <p>{labelContent}</p>
        </Modal>

        <ModalComponent
          isOpen={isModalOpen}
          onClose={closeModal}
          content={roomTypesContent()}
        />
        <Spin tip="Calculating" size="large" spinning={spinning} fullscreen />
      </Context.Provider>
    </>
  );
}
