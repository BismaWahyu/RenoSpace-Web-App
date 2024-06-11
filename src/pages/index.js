import Navbar from "@/components/navbar";
import Image from "next/image";
import Footer from "@/components/footer";
import Link from "next/link";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { translation } from "../utils/translation";
import Heading from "../components/heading";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import * as fbq from "../utils/fpixel";
import Loader from "../components/loader";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2,
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
  const [carousell, setCarousell] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("");

  useEffect(() => {
    router.push(`${localStorage.getItem("language") || "zh"}`);
    setLanguage(localStorage.getItem("language") || "zh");

    setLoading(true);
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/carousell`)
      .then((response) => {
        setCarousell(response.data.data);
        setLoading(false);
      });
  }, []);

  const HomeClick = () => {
    fbq.event("Home_contact", { content_name: "Home Contact" });
  };
  const BusinessClick = () => {
    fbq.event("Business_contact", { content_name: "Business Contact" });
  };

  return (
    <>
      {loading ? (
        <div className="absolute left-0 right-0 top-72">
          <Loader isLoading={false} />
        </div>
      ) : (
        <>
          <Heading />
          <Navbar language={language} />
          {/* Banner */}
          <div className="flex flex-col justify-center xs:h-[85vh] ss:h-[90vh] md:flex-row lg:h-screen">
            <div className="home-banner relative flex w-full xs:h-1/2 md:h-[90vh]">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-white px-4 py-2 opacity-90">
                <p className="text-center text-xl font-bold text-black">
                  <button id="home-contact" type="button" onClick={HomeClick}>
                    <Link href={`${language}/cleaning`} className="blue-hover">
                      {content.order_now}
                    </Link>
                  </button>
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-2 opacity-70">
                <p className="text-center text-xl font-bold text-black">
                  <button>
                    {content.home_cleaning}
                    {/* <Link href="/cleaning">{content.home_cleaning}</Link> */}
                  </button>
                </p>
              </div>
            </div>
            <div className="home-banner2 relative flex w-full xs:h-1/2 md:h-[90vh]">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-blue-500 px-4 py-2 opacity-90">
                <p className="text-center text-xl font-bold text-black">
                  <button
                    id="business-contact"
                    type="button"
                    onClick={BusinessClick}
                  >
                    <Link href="/business" className="white-hover">
                      {content.order_now}
                    </Link>
                  </button>
                </p>
              </div>
              <div className="border-left absolute bottom-0 left-0 right-0 bg-blue-500 px-4 py-2 opacity-70">
                <p className="text-center text-xl font-bold text-black">
                  <button>
                    {content.business_cleaning}
                    {/* <Link href="/business">{content.business_cleaning}</Link> */}
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Carousel */}
          <div className="mx-auto mb-10 mt-6 px-4 md:container md:px-0">
            <Carousel
              responsive={responsive}
              showDots={true}
              autoPlay={true}
              infinite={true}
            >
              {carousell.map((val, i) => {
                return (
                  <a key={i} href={val.url} className="pl-2 pr-2">
                    <img
                      width="800"
                      height="500"
                      src={
                        val.image
                          ? process.env.NEXT_PUBLIC_IMAGE_URL + val.image
                          : "/assets/Website_promo3.png"
                      }
                    />
                  </a>
                );
              })}
            </Carousel>
          </div>

          {/* Content One */}
          <div className="mx-auto mb-10 mt-24 px-4 md:container md:px-0">
            <p className="text-custom-gray-1 mb-2 text-4xl font-bold">
              {content.home_content_1}
            </p>
            <p className="text-custom-gray-1 text-4xl font-bold">
              {content.home_content_2}{" "}
              <span className="text-blue-400">{content.home_content_7}</span>
            </p>
            <div className="mt-14">
              <div className="grid-cols-4 gap-8 px-4 md:grid md:px-0">
                <div className="w-full rounded-xl p-6 text-center shadow-lg">
                  <p className="text-custom-gray-1 mb-4 text-4xl">1.</p>
                  <p className="text-md text-custom-gray-2">
                    {content.home_content_8}
                  </p>
                </div>
                <div className="w-full rounded-xl p-6 text-center shadow-lg">
                  <p className="text-custom-gray-1 mb-4 text-4xl">2.</p>
                  <p className="text-md text-custom-gray-2">
                    {content.home_content_4}
                  </p>
                </div>
                <div className="w-full rounded-xl p-6 text-center shadow-lg">
                  <p className="text-custom-gray-1 mb-4 text-4xl">3.</p>
                  <p className="text-md text-custom-gray-2">
                    {content.home_content_5}
                  </p>
                </div>
                <div className="w-full rounded-xl p-6 text-center shadow-lg">
                  <p className="text-custom-gray-1 mb-4 text-4xl">4.</p>
                  <p className="text-md text-custom-gray-2">
                    {content.home_content_6}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10 text-center">
              <button
                id="home-contact"
                type="button"
                className="btn-gradient-custom-1 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={HomeClick}
              >
                <Link href="/cleaning">{content.order_now}</Link>
                {/* {content.order_now} */}
              </button>
            </div>
          </div>

          {/* Content Two */}
          <div className="mx-auto mb-10 mt-40 md:container">
            <div className="grid-cols-3 gap-10 px-4 md:grid md:px-0">
              <div className="text-center">
                <Image
                  src="/assets/001-teamwork.png"
                  alt="Home Bussiness Banner"
                  width="100"
                  height="100"
                  sizes="100vw"
                  className="m-auto"
                />
                <p className="text-custom-gray-2 my-4  text-lg">
                  {content.home_content_8}
                </p>
              </div>
              <div className="text-center">
                <Image
                  src="/assets/003-eco.png"
                  alt="Home Bussiness Banner"
                  width="100"
                  height="100"
                  sizes="100vw"
                  className="m-auto"
                />
                <p className="text-custom-gray-2 my-4 text-lg">
                  {content.home_content_10}
                </p>
              </div>
              <div className="text-center">
                <Image
                  src="/assets/002-workshop.png"
                  alt="Home Bussiness Banner"
                  width="100"
                  height="100"
                  sizes="100vw"
                  className="m-auto"
                />
                <p className="text-custom-gray-2 my-4 text-lg">
                  {content.home_content_11}
                </p>
              </div>
            </div>
          </div>

          {/* Content Three */}
          <div className="mx-auto mb-10 mt-8 p-4 md:p-28">
            <div className="flex">
              <Image
                src="/assets/frame.png"
                alt="Frame"
                width="50"
                height="50"
              />
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
                        <p className="text-custom-gray-3 text-xs">
                          August 2023
                        </p>
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
                      attention to detail! Punctual, professional, and left my
                      place spotless. Highly recommended!
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
                        <p className="text-custom-gray-3 text-xs">
                          October 2023
                        </p>
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
                      Consistently excellent service. Always on time,
                      eco-friendly products, and friendly staff. Highly
                      recommend to anyone in need of a reliable cleaning
                      company.
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
                        <p className="text-custom-gray-3 text-xs">
                          November 2023
                        </p>
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
                      Efficient and reliable service. Office cleaning was
                      thorough, and the team was respectful. Will be booking
                      them regularly.
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
                        <p className="text-custom-gray-3 text-xs">
                          November 2023
                        </p>
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
                      Used this service for months, never disappointed.
                      Punctual, effective, and eco-friendly. Recommended to
                      friends – they love it too!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Four */}
          <div className="btn-gradient-custom-1 mx-4 mt-24 rounded-xl md:mx-0">
            <div className="top-24 mx-auto rounded-xl bg-white p-8 shadow-lg md:relative md:mx-28 md:h-96 xl:h-80">
              <div className="justify-between md:flex">
                <div>
                  <p className="text-custom-gray-1 pb-4 text-2xl font-bold ">
                    {content.download_app}
                  </p>
                  <p className="text-custom-gray-2">{content.download_app_1}</p>
                  <div className="flex flex-row items-center justify-center gap-6 pt-10 md:justify-start">
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
                          className="mx-auto md:min-w-fit"
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
                          className="mx-auto md:min-w-fit"
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
      )}
    </>
  );
}
