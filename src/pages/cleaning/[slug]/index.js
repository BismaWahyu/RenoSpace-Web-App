import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { translation } from "../../../utils/translation";
import Loader from "../../../components/loader";
import parse from "html-react-parser";

export default function Index() {
  const router = useRouter();
  const slug = router.query.slug;

  const [cleaningService, setCleaningService] = useState({});
  const [cleaningServiceDetail, setCleaningServiceDetail] = useState([]);
  const [cleaningServiceImages, setCleaningServiceImages] = useState([]);
  const [imageBanner, setImageBanner] = useState();
  const [token, setToken] = useState("");
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("");

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    setLanguage(localStorage.getItem("language") || "zh");

    setLoading(true);
    if (getToken) {
      setToken(getToken);
    }

    if (slug) {
      axios
        .get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/v1/cleaning-service/no-auth/${slug}?locale=${
            localStorage.getItem("language") ?? "zh"
          }`
        )
        .then((res) => {
          setCleaningService(res.data);
          setCleaningServiceDetail(res.data.content_detail);
          setCleaningServiceImages(res.data.images);
          if (res.data.service_banner) {
            setImageBanner(
              process.env.NEXT_PUBLIC_IMAGE_URL + res.data.service_banner
            );
          } else {
            setImageBanner("/assets/not-found.png");
          }
          setLoading(false);
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
  }, [slug]);

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
        <div
          className="cleaning-banner-detail"
          style={{
            // backgroundImage: `url('${process.env.NEXT_PUBLIC_IMAGE_URL}${cleaningService.display_image}')`,
            backgroundImage: `url(${imageBanner})`,
          }}
        >
          <h1 className="absolute left-0 right-0 top-72 text-center text-3xl font-bold text-white">
            {cleaningService.name}
          </h1>
        </div>
      </div>
      {loading ? (
        <div className="absolute left-0 right-0 top-72">
          <Loader isLoading={false} />
        </div>
      ) : (
        <div className="mx-auto mb-10 mt-14 flex flex-col px-20">
          <div className="justify-between md:flex">
            <div className="mb-7 md:mb-0">
              <h3 className="pb-2 text-2xl font-bold">
                {cleaningService.name}:{" "}
              </h3>
              <div className="mt-2">
                {cleaningService.content ? (
                  <p className="text-custom-gray-2 text-md pb-1">
                    {parse(cleaningService.content)}
                  </p>
                ) : (
                  <p className="text-md text-blue-400">no content yet</p>
                )}
              </div>
            </div>
            <div className="min-w-[120px] text-center md:text-right">
              {token ? (
                <a
                  href={`/${language}/calculator/${cleaningService?.slug}`}
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
          <div className="mx-auto mt-10">
            {cleaningServiceImages && cleaningServiceImages.length > 0 ? (
              <div className="grid-cols-3 gap-8 md:grid">
                {cleaningServiceImages.map((val, i) => {
                  return (
                    <img
                      key={i}
                      src={process.env.NEXT_PUBLIC_IMAGE_URL + val.path}
                      className="mb-4 h-80 w-full rounded-lg"
                      alt="cleaning-serivce"
                    />
                  );
                })}
              </div>
            ) : (
              <p>no images yet</p>
            )}
          </div>
        </div>
      )}

      <Footer language={language} />
    </>
  );
}
