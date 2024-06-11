import Image from "next/image";
import Faq from "react-faq-component";
import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { ColorRing } from "react-loader-spinner";
import Link from "next/link";
import axios from "axios";
import { translation } from "../../utils/translation";
import Head from "next/head";
import parse from "html-react-parser";
import Loader from "../../components/loader";
import { useRouter } from "next/router";

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
    router.push(`${localStorage.getItem("language") || "zh"}/cleaning`);
    setLanguage(localStorage.getItem("language") || "zh");

    axios
      .get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/v1/cleaning-services/no-auth?locale=${
          localStorage.getItem("language") || "zh"
        }`
      )
      .then((res) => {
        let cleaningServices = [];
        for (let i = 0; i < res.data.length; i++) {
          if (!res.data[i].is_business) {
            cleaningServices.push(res.data[i]);
          }
        }

        setCleaningServices(cleaningServices);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/faq/no-auth?locale=${
          localStorage.getItem("language") || "zh"
        }`
      )
      .then((res) => {
        let faqs = [];

        for (let i = 0; i < res.data.length; i++) {
          if (!res.data[i].is_business) {
            faqs.push(res.data[i]);
          }
        }

        setFaq({
          title: "",
          rows: faqs,
        });
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
      {/* Banner */}
      <div className="flex h-[60vh]">
        <div className="cleaning-banner">
          {/* <h1 className="absolute left-40 top-40 text-3xl font-bold text-white">Home Cleaning</h1> */}
        </div>
      </div>
      {/* Content One */}
      {loading ? (
        <Loader isLoading={false} />
      ) : (
        <div className="mx-auto mb-10 mt-14 flex flex-col px-16">
          {cleaningServices ? (
            cleaningServices.map((val, i) => {
              return (
                <div
                  key={i}
                  className="mb-10 flex-col justify-between rounded-lg p-8 shadow-lg lg:flex lg:flex-row"
                >
                  <div className="gap-10 lg:flex">
                    <Image
                      src={
                        val.display_image
                          ? process.env.NEXT_PUBLIC_IMAGE_URL +
                            val.display_image
                          : "/assets/frame-2.png"
                      }
                      alt="Frame"
                      width="60"
                      height="60"
                      className="m-auto rounded-md"
                    />
                    <div className="pt-4 text-center lg:pt-0 lg:text-left">
                      <div className="mb-4 items-center gap-4 lg:flex">
                        <p className="text-custom-gray-1 pb-2 text-xl lg:pb-0">
                          {val.name}
                        </p>
                        <Link
                          href={`/${language}/cleaning/${val?.slug}`}
                          className="mb-2 rounded-md bg-black px-5 py-[2px] text-sm text-white lg:mb-0"
                        >
                          {content.learn_more}
                        </Link>
                      </div>
                      <div className="text-custom-gray-2 content-ul mx-4 md:list-disc">
                        {parse(val.description)}
                      </div>
                    </div>
                  </div>
                  <div className="min-w-[120px] pt-4 text-center md:inline md:pt-0">
                    <p className="text-custom-gray-3 text-md">
                      {content.start_at}
                    </p>
                    <div className="mx-auto pt-4 ">
                      <p className="text-custom-gray-1 pb-2 text-3xl">
                        ${val.base_price}
                      </p>

                      {token ? (
                        <a
                          href={`/${language}/calculator/${val?.slug}`}
                          className="btn-gradient-custom-1 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                          {content.order_now}
                        </a>
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
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
            </div>
          )}
        </div>
      )}

      {/* Content Two */}
      <div className="mx-auto mt-28 px-16">
        <div className="border-left-gradient-custom-1 mb-4">
          <p className="text-custom-gray-1 pl-2 text-xl">{content.faq}</p>
        </div>
        <Faq data={faq} styles={styles} config={config} />
      </div>
      <Footer language={language} />
    </>
  );
}
