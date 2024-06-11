import Image from "next/image";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { translation } from "../../utils/translation";
import Heading from "../../components/heading";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();
  const [content, setContent] = useState({});
  const [language, setLanguage] = useState("");

  useEffect(() => {
    router.push(`${localStorage.getItem("language") || "zh"}/match`);
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
      <Heading />
      <div className="flex h-screen items-center justify-center">
        <div className="mx-auto">
          <p className="text-gradient-custom-1 text-center">{content.match}</p>
          <div className="pt-6">
            <div className="max-w-sm rounded-[42px] border border-gray-200 bg-white shadow-xl">
              <a href="#">
                <img
                  className="rounded-t-lg"
                  src="/assets/match.png"
                  alt="matching"
                />
              </a>
              <a>
                <img
                  style={{ top: "-72px" }}
                  className="absolute bottom-0 left-0 right-0 m-auto h-16 w-16 rounded-full"
                  src="/assets/thumbnail-profile.png"
                  alt="renospace-sales"
                />
              </a>
              <div className="mb-1 px-4 py-6 text-center">
                <Link href="#">
                  <h5 className="mb-2 pt-4 text-xl font-bold tracking-tight text-gray-700">
                    Leo Wan
                  </h5>
                </Link>
                <Link href="#">
                  <h5 className="text-md mb-3 font-bold tracking-tight text-gray-500">
                    Business Development Manager
                  </h5>
                </Link>
                <p className="mb-5 font-normal text-gray-500">
                  {content.match_1}
                </p>
                <Link
                  href={`${language}/calendar`}
                  className="btn-gradient-custom-1 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  {content.schedulle}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
