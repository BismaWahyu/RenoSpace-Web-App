import Image from "next/image";
// import Faq from "react-faq-component";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Link from "next/link";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { translation } from "../../utils/translation";
import Loader from "../../components/loader";
import Head from "next/head";
import parse from "html-react-parser";
import { useRouter } from "next/router";
import { FloatingWhatsApp } from "react-floating-whatsapp";

const styles = {
  titleTextColor: "#474D56",
  rowTitleColor: "#242B35",
};

const config = {};

export default function Index() {
  const router = useRouter();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const [content, setContent] = useState({});
  const [cleaningServices, setCleaningServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [carousell, setCarousell] = useState([]);
  const [language, setLanguage] = useState("");

  useEffect(() => {
    router.push(`${localStorage.getItem("language") || "zh"}/business`);
    setLanguage(localStorage.getItem("language") || "zh");

    axios
      .get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/v1/cleaning-services/no-auth?is_business=1&locale=${
          localStorage.getItem("language") ?? "zh"
        }`
      )
      .then((res) => {
        // let cleaningServices = [];
        // for (let i = 0; i < res.data.length; i++) {
        //   if (res.data[i].is_business) {
        //     cleaningServices.push(res.data[i]);
        //   }
        // }

        setCleaningServices(res.data);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });

    const getToken = localStorage.getItem("token");

    if (getToken) {
      setToken(getToken);
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

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/carousell?is_business=1`)
      .then((response) => {
        setCarousell(response.data.data);
      });
  }, []);

  return (
    <>
      <Head>
        <title>【優居 Renospace】- 家居、裝修後、除蟲、大掃除清潔服務</title>
        <meta
          name="description"
          content="為各種商業模式的客戶提供專業、認真和靈活的商業清潔方案，確保我們的企業客戶能安排適合的清潔計劃，包括日常清潔、深層清潔、裝修後清潔、滅蟲、除甲醛、洗冷氣機、家政、除甲醛等。立即聯絡優居，了解我們如何為您提供出色的清潔服務。"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar language={language} />
      <FloatingWhatsApp
        phoneNumber={+85260108050}
        accountName={content.floating_wa_name}
        statusMessage={content.floating_wa_status_message}
        chatMessage={content.floating_wa_chat_message}
        placeholder={content.floating_wa_placeholder}
        darkMode={true}
        id="whatsapp-btn"
      />
      {/* Banner */}
      <div className="flex h-[90vh] flex-col justify-end bg-white">
        <div className="flex flex flex-col items-end justify-between lg:flex-row lg:items-center">
          <div className="banner-business pb-10 pl-4 pr-4 pt-24 sm:pb-0 sm:pl-24 sm:pr-8 sm:pt-10">
            <h3 className="text-custom-gray-1 mb-2 mr-[20vw] min-w-60 text-4xl font-bold sm:mr-[50vw] lg:mr-0">
              {content.bussiness_content_1}
              <span className="text-blue-400">
                {content.bussiness_content_2}
              </span>
            </h3>
            <p className="mb-8 text-lg">{content.bussiness_content_7}</p>
            <Link
              href="/business/cleaning"
              className="btn-gradient-custom-1 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm text-white shadow-md"
            >
              {content.get_started}
            </Link>
          </div>
          <div className="relative mt-0 max-w-[450px] sm:mt-10 lg:max-w-fit">
            <img
              src="/assets/reno-business-promobg.png"
              alt="Vector"
              width="750"
              height="750"
              className="responsive-img-1 object-cover"
            />
            {/* <div className="absolute top-[-72px] right-[0] md:top-[-60px] ">
              <Image
                src="/assets/person-cleaner.png"
                alt="Vector"
                width="320"
                height="320"
              />
            </div> */}
          </div>
        </div>
        <div className="bg-banner-business relative z-40 justify-center gap-28 p-4 sm:flex">
          {/* <Image
            src="/assets/subway.png"
            alt="Vector"
            width="120"
            height="120"
            className="mx-auto mb-4 object-contain sm:mb-0"
          />
          <Image
            src="/assets/own-square.png"
            alt="Vector"
            width="120"
            height="120"
            className="mx-auto mb-4 object-contain sm:mb-0"
          />
          <Image
            src="/assets/swire.png"
            alt="Vector"
            width="120"
            height="120"
            className="mx-auto mb-4 object-contain sm:mb-0"
          />
          <Image
            src="/assets/tane.png"
            alt="Vector"
            width="120"
            height="120"
            className="mx-auto mb-4 object-contain sm:mb-0"
          /> */}
          <div className="container mx-auto mb-2 mt-2 px-0 px-4">
            <Carousel
              responsive={responsive}
              swipeable={false}
              draggable={false}
              showDots={false}
              autoPlay={true}
              infinite={true}
              removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
            >
              {carousell.map((val, i) => {
                return (
                  <div key={i} className="pl-2 pr-2">
                    <img
                      className="mx-auto h-10 w-40"
                      src={
                        val.image
                          ? process.env.NEXT_PUBLIC_IMAGE_URL + val.image
                          : "/assets/Website_promo3.png"
                      }
                    />
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-28 px-16 text-center">
        <h3 className="text-custom-gray-1 mb-2 text-4xl">
          {content.bussiness_content_3}
        </h3>
        <p className="text-custom-gray-2 text-lg">
          {content.bussiness_content_8}
        </p>
      </div>

      <div className="mx-4 mt-36 text-center">
        <h3 className="text-custom-gray-1 mb-12 text-4xl">
          {content.bussiness_content_11}
        </h3>
        <div className="grid grid-cols-3 gap-10 px-6 md:grid-cols-4 md:px-16">
          <div className="mb-8">
            <div className="flex items-center justify-center object-contain">
              <Image
                src="/assets/business-center.png"
                alt="Image"
                width="120"
                height="120"
                className="object-image"
              />
            </div>
            <p className="text-custom-gray-2 pt-4 text-lg">
              {content.bussiness_content_4}
            </p>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-center object-contain">
              <Image
                src="/assets/airbnb.png"
                alt="Image"
                width="120"
                height="120"
                className="object-image"
              />
            </div>
            <p className="text-custom-gray-2 pt-4 text-lg">
              {content.bussiness_content_5}
            </p>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-center object-contain">
              <Image
                src="/assets/bank.png"
                alt="Image"
                width="120"
                height="120"
                className="object-image"
              />
            </div>
            <p className="text-custom-gray-2 pt-4 text-lg">
              {content.bussiness_content_6}
            </p>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-center object-contain">
              <Image
                src="/assets/bed.png"
                alt="Image"
                width="120"
                height="120"
                className="object-image"
              />
            </div>
            <p className="text-custom-gray-2 pt-4 text-lg">
              {content.bussiness_content_12}
            </p>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-center object-contain">
              <Image
                src="/assets/church.png"
                alt="Image"
                width="120"
                height="120"
                className="object-image"
              />
            </div>
            <p className="text-custom-gray-2 pt-4 text-lg">
              {content.bussiness_content_13}
            </p>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-center object-contain">
              <Image
                src="/assets/dumbbells.png"
                alt="Image"
                width="120"
                height="120"
                className="object-image"
              />
            </div>
            <p className="text-custom-gray-2 pt-4 text-lg">
              {content.bussiness_content_14}
            </p>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-center object-contain">
              <Image
                src="/assets/food-service.png"
                alt="Image"
                width="120"
                height="120"
                className="object-image"
              />
            </div>
            <p className="text-custom-gray-2 pt-4 text-lg">
              {content.bussiness_content_15}
            </p>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-center object-contain">
              <Image
                src="/assets/graduation-hat.png"
                alt="Image"
                width="120"
                height="120"
                className="object-image"
              />
            </div>
            <p className="text-custom-gray-2 pt-4 text-lg">
              {content.bussiness_content_16}
            </p>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-center object-contain">
              <Image
                src="/assets/hospital-building.png"
                alt="Image"
                width="120"
                height="120"
                className="object-image"
              />
            </div>
            <p className="text-custom-gray-2 pt-4 text-lg">
              {content.bussiness_content_17}
            </p>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-center object-contain">
              <Image
                src="/assets/pet-house.png"
                alt="Image"
                width="120"
                height="120"
                className="object-image"
              />
            </div>
            <p className="text-custom-gray-2 pt-4 text-lg">
              {content.bussiness_content_18}
            </p>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-center object-contain">
              <Image
                src="/assets/warehouse.png"
                alt="Image"
                width="120"
                height="120"
                className="object-image"
              />
            </div>
            <p className="text-custom-gray-2 pt-4 text-lg">
              {content.bussiness_content_19}
            </p>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-center object-contain">
              <Image
                src="/assets/social-justice.png"
                alt="Image"
                width="120"
                height="120"
                className="object-image"
              />
            </div>
            <p className="text-custom-gray-2 pt-4 text-lg">
              {content.bussiness_content_20}
            </p>
          </div>
        </div>
      </div>

      {/* Content Two */}

      {/* Content Three */}
      {loading ? (
        <Loader isLoading={false} />
      ) : (
        <div>
          <div className="mx-auto mb-10 mt-14 flex flex-col px-6 md:px-16">
            {cleaningServices ? (
              cleaningServices.map((val, i) => {
                return (
                  <div
                    key={i}
                    className="mb-10 justify-between rounded-lg p-8 shadow-lg max-[412px]:grid lg:flex"
                  >
                    <div className="gap-10 lg:flex">
                      <img
                        src={
                          val.display_image
                            ? process.env.NEXT_PUBLIC_IMAGE_URL +
                              val.display_image
                            : "/assets/frame-2.png"
                        }
                        alt="Frame"
                        width="60"
                        height="60"
                        className="m-auto"
                      />
                      <div className="pt-4 text-center lg:pt-0 lg:text-left">
                        <div className="mb-4 items-center gap-4 lg:flex">
                          <p className="text-custom-gray-1 pb-2 text-xl">
                            {val.name}
                          </p>
                          <a
                            href={`/${language}/business/cleaning/${val?.slug}`}
                            className="mb-2 rounded-md bg-black px-5 py-[2px] text-sm text-white"
                          >
                            {content.learn_more}
                          </a>
                        </div>
                        <div className="text-custom-gray-2 content-ul mx-4 md:list-disc">
                          {parse(val.description)}
                        </div>
                      </div>
                    </div>
                    <div className="min-w-[120px] pt-4 text-center sm:pt-0 md:inline">
                      <div className="mx-auto pt-4">
                        {token ? (
                          <Link
                            href={{
                              pathname: `/${language}/calculator/[slug]`,
                              query: { is_business: true },
                            }}
                            as={`/${language}/calculator/${val?.slug}?is_business=true`}
                            className="btn-gradient-custom-1 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                          >
                            {content.order_now}
                          </Link>
                        ) : (
                          <Link
                            className="btn-gradient-custom-1 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            href="/register"
                          >
                            {content.order_now}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <ColorRing
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="mx-auto"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Four */}
      {/* <div className="container mx-auto mt-28 px-4 md:px-0">
        <div className="border-left-gradient-custom-1 mb-4">
          <p className="text-custom-gray-1 pl-2 text-xl">{content.faq}</p>
        </div>
        <Faq data={faq} styles={styles} config={config} />
      </div> */}

      {/* Content Five */}
      <div className="mx-auto mb-10 mt-14 flex flex-col px-6 md:px-16">
        <div className="flex">
          <Image src="/assets/frame.png" alt="Frame" width="50" height="50" />
          <p className="text-custom-gray-2 relative right-2.5 top-7 text-xl">
            {content.home_content_9}
          </p>
        </div>
        <div className="mt-14">
          <div className="gap-8 px-4 md:grid md:px-0 xl:grid-cols-4">
            <div className="rounded-xl p-6 shadow-lg">
              <div className="flex gap-4">
                <Image
                  src="/assets/IMG_7969.jpg"
                  alt="Frame"
                  width="50"
                  height="50"
                  className="rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-custom-gray-1 text-sm">Andrew</p>
                    <p className="text-custom-gray-3 text-xs">August 2023</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Ratings */}
                    <div className="flex items-center space-x-1">
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-3.5 w-3.5 text-yellow-300"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="304.1243 232.4531 17.5649 19.1757"
                        width="17.5649"
                        height="19.1757"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M 321.682 243.032 C 321.734 242.375 321.486 239.337 321.487 238.763 L 317.762 237.886 L 315.503 233.309 C 314.981 232.25 313.508 232.153 312.852 233.134 C 312.815 233.19 312.781 233.249 312.751 233.309 L 310.492 237.886 L 305.441 238.62 C 304.272 238.789 303.724 240.161 304.455 241.089 C 304.497 241.142 304.542 241.192 304.59 241.239 L 308.246 244.802 L 307.383 249.833 C 307.182 250.995 308.313 251.939 309.42 251.533 C 309.485 251.509 309.548 251.481 309.609 251.449 L 314.127 249.072 L 318.645 251.447 C 319.69 251.997 320.939 251.209 320.892 250.029 C 320.889 249.962 320.882 249.896 320.871 249.83 L 320.008 244.8 L 321.682 243.032 Z" />
                      </svg>
                    </div>
                    <p className="text-custom-gray-2 text-xl">4.9</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <p className="text-custom-gray-2">
                  Used this company for home cleaning – impressed with their
                  attention to detail! Punctual, professional, and left my place
                  spotless. Highly recommended!
                </p>
              </div>
            </div>
            <div className="rounded-xl p-6 shadow-lg">
              <div className="flex gap-4">
                <Image
                  src="/assets/IMG_7966.jpg"
                  alt="Frame"
                  width="50"
                  height="50"
                  className="rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-custom-gray-1 text-sm">Jacqueline</p>
                    <p className="text-custom-gray-3 text-xs">October 2023</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Ratings */}
                    <div className="flex items-center space-x-1">
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-3.5 w-3.5 text-yellow-300"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="304.1243 232.4531 17.5649 19.1757"
                        width="17.5649"
                        height="19.1757"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M 321.682 243.032 C 321.734 242.375 321.486 239.337 321.487 238.763 L 317.762 237.886 L 315.503 233.309 C 314.981 232.25 313.508 232.153 312.852 233.134 C 312.815 233.19 312.781 233.249 312.751 233.309 L 310.492 237.886 L 305.441 238.62 C 304.272 238.789 303.724 240.161 304.455 241.089 C 304.497 241.142 304.542 241.192 304.59 241.239 L 308.246 244.802 L 307.383 249.833 C 307.182 250.995 308.313 251.939 309.42 251.533 C 309.485 251.509 309.548 251.481 309.609 251.449 L 314.127 249.072 L 318.645 251.447 C 319.69 251.997 320.939 251.209 320.892 250.029 C 320.889 249.962 320.882 249.896 320.871 249.83 L 320.008 244.8 L 321.682 243.032 Z" />
                      </svg>
                    </div>
                    <p className="text-custom-gray-2 text-xl">4.8</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <p className="text-custom-gray-2">
                  Consistently excellent service. Always on time, eco-friendly
                  products, and friendly staff. Highly recommend to anyone in
                  need of a reliable cleaning company.
                </p>
              </div>
            </div>
            <div className="rounded-xl p-6 shadow-lg">
              <div className="flex gap-4">
                <Image
                  src="/assets/IMG_7967.jpg"
                  alt="Frame"
                  width="50"
                  height="50"
                  className="rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-custom-gray-1 text-sm">Catherine</p>
                    <p className="text-custom-gray-3 text-xs">November 2023</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Ratings */}
                    <div className="flex items-center space-x-1">
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-3.5 w-3.5 text-yellow-300"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="304.1243 232.4531 17.5649 19.1757"
                        width="17.5649"
                        height="19.1757"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M 321.682 243.032 C 321.734 242.375 321.486 239.337 321.487 238.763 L 317.762 237.886 L 315.503 233.309 C 314.981 232.25 313.508 232.153 312.852 233.134 C 312.815 233.19 312.781 233.249 312.751 233.309 L 310.492 237.886 L 305.441 238.62 C 304.272 238.789 303.724 240.161 304.455 241.089 C 304.497 241.142 304.542 241.192 304.59 241.239 L 308.246 244.802 L 307.383 249.833 C 307.182 250.995 308.313 251.939 309.42 251.533 C 309.485 251.509 309.548 251.481 309.609 251.449 L 314.127 249.072 L 318.645 251.447 C 319.69 251.997 320.939 251.209 320.892 250.029 C 320.889 249.962 320.882 249.896 320.871 249.83 L 320.008 244.8 L 321.682 243.032 Z" />
                      </svg>
                    </div>
                    <p className="text-custom-gray-2 text-xl">4.9</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <p className="text-custom-gray-2">
                  Efficient and reliable service. Office cleaning was thorough,
                  and the team was respectful. Will be booking them regularly.
                </p>
              </div>
            </div>
            <div className="rounded-xl p-6 shadow-lg">
              <div className="flex gap-4">
                <Image
                  src="/assets/IMG_7968.jpg"
                  alt="Frame"
                  width="50"
                  height="50"
                  className="rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-custom-gray-1 text-sm">Michelle</p>
                    <p className="text-custom-gray-3 text-xs">November 2023</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Ratings */}
                    <div className="flex items-center space-x-1">
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-4 w-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                      <svg
                        className="h-3.5 w-3.5 text-yellow-300"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="304.1243 232.4531 17.5649 19.1757"
                        width="17.5649"
                        height="19.1757"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M 321.682 243.032 C 321.734 242.375 321.486 239.337 321.487 238.763 L 317.762 237.886 L 315.503 233.309 C 314.981 232.25 313.508 232.153 312.852 233.134 C 312.815 233.19 312.781 233.249 312.751 233.309 L 310.492 237.886 L 305.441 238.62 C 304.272 238.789 303.724 240.161 304.455 241.089 C 304.497 241.142 304.542 241.192 304.59 241.239 L 308.246 244.802 L 307.383 249.833 C 307.182 250.995 308.313 251.939 309.42 251.533 C 309.485 251.509 309.548 251.481 309.609 251.449 L 314.127 249.072 L 318.645 251.447 C 319.69 251.997 320.939 251.209 320.892 250.029 C 320.889 249.962 320.882 249.896 320.871 249.83 L 320.008 244.8 L 321.682 243.032 Z" />
                      </svg>
                    </div>
                    <p className="text-custom-gray-2 text-xl">4.7</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <p className="text-custom-gray-2">
                  Used this service for months, never disappointed. Punctual,
                  effective, and eco-friendly. Recommended to friends – they
                  love it too!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Five */}
      {/* <div className="flex items-center justify-center gap-12">
        <div>
          <Image
            src="/assets/referral.png"
            alt="Vector"
            width="340"
            height="340"
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-custom-gray-2 mb-5 text-xl">
            {content.bussiness_content_9}
          </h1>
          <Link
            href=""
            className="btn-gradient-custom-1 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm text-white shadow-md"
          >
            {content.bussiness_content_10}
          </Link>
        </div>
      </div> */}

      {/* Content Six */}
      <div className="btn-gradient-custom-1 mx-4 mt-24 rounded-xl md:mx-0">
        <div className="top-24 mx-auto rounded-xl bg-white p-8 shadow-lg md:relative md:mx-28 md:h-96 xl:h-80">
          <div className="justify-between md:flex">
            <div>
              <p className="text-custom-gray-1 pb-4 text-2xl font-bold ">
                {content.download_app}
              </p>
              <p className="text-custom-gray-2">{content.download_app_1}</p>
              <div className="flex flex-row items-center gap-6 pt-10">
                <div className="flex flex-col justify-center pr-10 xs:mb-0">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.renospace.client_app"
                    className="mb-4 flex items-center xs:mb-0"
                  >
                    <Image
                      src="/assets/google-play.png"
                      alt="Logo"
                      width={140}
                      height={100}
                      className="mx-auto w-auto md:min-w-fit"
                    />
                  </a>
                  <a
                    href="https://apps.apple.com/hk/app/%E5%84%AA%E5%B1%85-renospace/id6446650681"
                    className="mb-4 flex items-center xs:mb-0"
                  >
                    <Image
                      src="/assets/app-store.png"
                      alt="Logo"
                      width={140}
                      height={100}
                      className="mx-auto w-auto md:min-w-fit"
                    />
                  </a>
                </div>
                <Image
                  src="/assets/qrcode.png"
                  alt="QR"
                  width="50"
                  height="50"
                  className="h-20 w-20"
                />
              </div>
            </div>
            <div className="invisible relative bottom-20 md:visible md:left-28 md:-ml-20 md:min-w-fit">
              <Image
                src="/assets/phone.png"
                alt="Phone"
                width="280"
                height="80"
                className="hidden md:block"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer language={language} />
    </>
  );
}
