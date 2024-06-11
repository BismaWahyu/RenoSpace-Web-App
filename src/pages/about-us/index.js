import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import axios from "axios";
import { translation } from "../../utils/translation";
import Head from "next/head";
import GoogleMapReact from "google-map-react";
import { useRouter } from "next/router";

const AnyReactComponent = () => (
  <Image src="/assets/map-marker.png" alt="marker" width="40" height="40" />
);

const styles = {
  titleTextColor: "#474D56",
  rowTitleColor: "#242B35",
};

const config = {};

export default function Index() {
  const router = useRouter();
  const [faq, setFaq] = useState([]);
  const [cleaningServices, setCleaningServices] = useState([]);
  const [token, setToken] = useState("");
  const [content, setContent] = useState({});
  const [showMoreDetail, setShowMoreDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("");

  useEffect(() => {
    router.push(`${localStorage.getItem("language") || "zh"}/about-us`);
    setLanguage(localStorage.getItem("language") || "zh");

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
  }, []);

  return (
    <>
      <Head>
        <title>
          提供專業家居及商業清潔服務，包括日常清潔、深層清潔、吉屋清潔、裝修後清潔、除甲醛、洗冷氣機，豐富經驗團隊受到全面的訓練及課程。【已完成過萬次家居清潔服務，約97%客人用後給予滿分好評】立即享受高質素及方便的清潔服務。
        </title>
        <meta
          name="description"
          content="為各種商業模式的客戶提供專業、認真和靈活的商業清潔方案，確保我們的企業客戶能安排適合的清潔計劃，包括日常清潔、深層清潔、裝修後清潔、滅蟲、除甲醛、洗冷氣機、家政、除甲醛等。立即聯絡優居，了解我們如何為您提供出色的清潔服務。"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar language={language} />
      {/* Banner */}
      <div className="flex h-[60vh]">
        <div className="about-us-banner">
          <h1 className="absolute left-0 right-0 top-64 text-center text-3xl font-bold text-white">
            {content.about_us_title}
          </h1>
        </div>
      </div>
      {/* Content 1 */}
      <div className="mx-14 mt-28 flex flex-col items-center justify-center">
        <h1 className="text-custom-blue-1 pl-2 text-xl font-bold">
          {content.vision_title}
        </h1>
        <p className="text-custom-gray-1 mt-10 pl-2 text-xl">
          {content.vision_description}
        </p>
      </div>
      <div className="mx-14 mt-28 flex flex-col items-center justify-center">
        <h1 className="text-custom-blue-1 pl-2 text-xl font-bold">
          {content.history_title}
        </h1>
        <p className="text-custom-gray-1 mt-10 pl-2 text-xl">
          {content.history_description}
        </p>
      </div>
      <div className="mx-14 mt-28 flex flex-col items-center justify-center">
        <h1 className="text-custom-blue-1 pl-2 text-xl font-bold">
          {content.our_team_title}
        </h1>
        <p className="text-custom-gray-1 mt-10 pl-2 text-xl">
          {content.our_team_description}
        </p>
      </div>
      <div className="mx-14 mt-28 flex flex-col items-center justify-center">
        <h1 className="text-custom-blue-1 pl-2 text-xl font-bold">
          {content.professionalism_title}
        </h1>
        <p className="text-custom-gray-1 mt-10 pl-2 text-xl">
          {content.professionalism_description}
        </p>
      </div>

      {/* Content 2 */}
      <div
        className="mx-auto mt-28 flex flex-col items-center justify-center overflow-hidden rounded-xl"
        style={{ height: "450px", width: "80%" }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyCqNVISSKUXTzSUejfJfljdtAH5UEODA54",
          }}
          defaultCenter={{
            lat: 22.321630283978873,
            lng: 114.21070521614148,
          }}
          defaultZoom={17}
        >
          <AnyReactComponent
            lat={22.321630283978873}
            lng={114.21070521614148}
            text="📍"
          />
        </GoogleMapReact>
        <div className="mx-14 mt-10 flex flex-col items-center justify-center">
          <h1 className="text-custom-blue-1 pl-2 text-xl font-bold">
            {content.our_location_title}
          </h1>
          <p className="text-custom-gray-1 mt-10 pl-2 text-xl">
            {content.our_location_description}
          </p>
        </div>
      </div>

      <Footer language={language} />
    </>
  );
}
