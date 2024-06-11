import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { translation } from "../utils/translation";

export default function Footer(props) {
  const [footerContent, setFooterContent] = useState({});

  useEffect(() => {
    axios
      .get(
        translation.url + `?type=${localStorage.getItem("language") || "zh"}`
      )
      .then((response) => {
        let obj = {};
        response.data.data.forEach((v, i) => {
          obj[`${v.title_code}`] = v.text;
        });

        setFooterContent(obj);
      });
  }, []);

  return (
    <footer className="mt-40 bg-gray-900">
      <div className="mx-auto w-full">
        <div className="items-center justify-between gap-10 px-4 pb-6 pt-8 text-center sm:flex sm:px-24 sm:text-left">
          <div className="mb-4 sm:mb-0">
            <a
              href={`${props.language}/`}
              className="mb-2 inline items-center sm:mb-4 sm:flex"
            >
              <Image
                src="/assets/logo_white.png"
                alt="Logo"
                className="mx-auto"
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
          {/* <div className="mb-2 sm:mb-0">
            <a href="#" className="text-white hover:underline">
              {footerContent.contact_us}
            </a>
          </div> */}
          <div className="z-10 flex flex-col gap-3 sm:flex-row">
            <div className="mx-2 mb-2 sm:mb-0">
              <Link
                href={`${props.language}/terms-of-use`}
                className="text-white hover:underline"
              >
                {footerContent.term_of_us}
              </Link>
            </div>
            <div className="mx-2 mb-2 sm:mb-0">
              <Link
                href={`${props.language}/privacy-policy`}
                className="text-white hover:underline"
              >
                {footerContent.privacy_policy}
              </Link>
            </div>
            {footerContent.blog && (
              <div className="mx-2 mb-2 sm:mb-0">
                <Link
                  href={`${props.language}/blog`}
                  className="text-white hover:underline"
                >
                  {footerContent.blog}
                </Link>
              </div>
            )}
          </div>
          {/* <div className="mb-2 sm:mb-0">
            <a href="#" className="text-white hover:underline">
              {footerContent.accessbility}
            </a>
          </div> */}
        </div>
        <div className="items-center justify-between gap-4 px-4 pb-6 sm:flex sm:px-24">
          <div className="mb-10 items-center sm:mb-0 sm:flex">
            <a
              href="https://play.google.com/store/apps/details?id=com.renospace.client_app"
              className="mb-4 flex items-center sm:mb-0"
            >
              <Image
                src="/assets/google-play.png"
                alt="Logo"
                width={140}
                height={100}
                className="mx-auto"
                priority
              />
            </a>
            <a
              href="https://apps.apple.com/hk/app/%E5%84%AA%E5%B1%85-renospace/id6446650681"
              className="mb-4 flex items-center sm:mb-0"
            >
              <Image
                src="/assets/app-store.png"
                alt="Logo"
                width={140}
                height={100}
                className="mx-auto"
                priority
              />
            </a>
          </div>
          <div className="inline items-center gap-6 text-center sm:flex">
            <div className="mb-2 sm:mb-0">
              <span className="items-center gap-2 sm:flex">
                <FontAwesomeIcon
                  style={{ color: "#56bbf9" }}
                  className="w-4 text-white"
                  icon={faPhone}
                />{" "}
                <Link className="text-white" href="https://wa.me/+85260108050">
                  +85260108050
                </Link>
              </span>
            </div>
            <div className="mb-2 sm:mb-0">
              <span className="items-center gap-2 sm:flex">
                <FontAwesomeIcon
                  style={{ color: "#56bbf9" }}
                  className="w-4 text-white"
                  icon={faEnvelope}
                />{" "}
                <a className="text-white" href="mailto: contact@renospace.app">
                  contact@renospace.app
                </a>
              </span>
            </div>
          </div>
        </div>
        <hr className="border-gray-200 dark:border-gray-700" />
        <span className="block p-6 text-center text-sm text-gray-500">
          {footerContent.copyright}
        </span>
      </div>
    </footer>
  );
}
