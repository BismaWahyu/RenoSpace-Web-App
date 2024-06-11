import Image from "next/image";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { translation } from "../utils/translation";
import { Avatar, Dropdown } from "flowbite-react";

export default function Navbar(props) {
  const [token, setToken] = useState("");
  // const { push } = useRouter();
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState({});
  const [countryCode, setCountryCode] = useState();

  const [navbarContent, setNavbarContent] = useState({});

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    setLang(localStorage.getItem("language"));

    if (getToken) {
      setToken(getToken);
    }

    setName(localStorage.getItem("name"));
    setEmail(localStorage.getItem("email"));

    axios
      .get(
        translation.url + `?type=${localStorage.getItem("language") || "zh"}`
      )
      .then((response) => {
        let obj = {};
        response.data.data.forEach((v, i) => {
          obj[`${v.title_code}`] = v.text;
        });

        setNavbarContent(obj);
      });

    if (getToken !== null) {
      // my profile
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/my-profile`, {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        })
        .then((res) => {
          setProfile(res.data);
        });
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem("token");

    swal("Success", `Success logout`, "success");

    setTimeout(() => {
      router.push("/");

      setTimeout(() => {
        location.reload();
      }, 1000);
    }, 1200);
  };

  const onChangeLanguage = async (e) => {
    localStorage.setItem("language", e);

    router.reload();
  };

  return (
    <nav className="relative left-0 top-0 z-20 z-50 w-full border-b bg-white">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-center p-4 sm:justify-between md:h-[10vh]">
        <Link href="/" className="mx-5 mb-3 flex items-center lg:hidden">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            className=""
            width={84}
            height={24}
            priority
          />
        </Link>
        <div
          className="hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto"
          id="navbar-sticky"
        >
          <Link href="/" className="mx-5 flex items-center">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              className=""
              width={84}
              height={24}
              priority
            />
          </Link>
          <ul className="mx-20 mt-4 flex flex-col items-center rounded-lg border border-gray-100 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0">
            <li>
              <Link
                type="button"
                id="home-contact"
                href="/cleaning"
                className="blue-hover text-black"
              >
                {navbarContent.home_cleaning}
              </Link>
            </li>
            <li>
              <Link
                type="button"
                id="business-contact"
                href="/business"
                className="blue-hover text-black"
              >
                {navbarContent.business_cleaning}
              </Link>
            </li>
            {navbarContent.blog_title && (
              <li>
                <Link
                  type="button"
                  href="/blog"
                  className="blue-hover text-black"
                >
                  {navbarContent.blog_title}
                </Link>
              </li>
            )}
            <li>
              <Link
                type="button"
                href="/about-us"
                className="blue-hover text-black"
              >
                {navbarContent.about_us_title}
              </Link>
            </li>
          </ul>
        </div>

        {token ? (
          <div className="flex items-center gap-4 lg:order-2">
            <div className="flex items-center gap-4 lg:invisible md:visible lg:order-2">
              <div className="">
                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.94971 11.9497H39.9497"
                        stroke="#333"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.94971 23.9497H39.9497"
                        stroke="#333"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.94971 35.9497H39.9497"
                        stroke="#333"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                >
                  <Dropdown.Item
                    type="button"
                    id="home-contact"
                    href="/cleaning"
                  >
                    {navbarContent.home_cleaning}
                  </Dropdown.Item>
                  <Dropdown.Item
                    type="button"
                    id="business-contact"
                    href="/business"
                  >
                    {navbarContent.business_cleaning}
                  </Dropdown.Item>
                  <Dropdown.Item type="button" href="/blog">
                    {navbarContent.blog_title}
                  </Dropdown.Item>
                  <Dropdown.Item type="button" href="/about-us">
                    {navbarContent.about_us_title}
                  </Dropdown.Item>
                </Dropdown>
              </div>
            </div>
            <div className="">
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt="User Icon"
                    img="/assets/renospace-logo-blue.png"
                    rounded
                    className="profile-icon"
                  >
                    <span className="profile-dropdown">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M36 19L24 31L12 19H36Z"
                          fill="#FFFFFF"
                          stroke="#FFFFFF"
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Avatar>
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">
                    {/* {profile.first_name !== "" || profile.last_name !== ""
                      ? `${profile?.first_name} ${profile?.last_name}`
                      : "No Name"} */}
                    {profile.first_name !== "" ? `${profile?.name}` : "No Name"}
                  </span>
                  {/* <span className="block truncate text-sm font-medium">
                    {email || "mail@mail.com"}
                  </span> */}
                </Dropdown.Header>
                <Dropdown.Item href="/profile">
                  {navbarContent.profile}
                </Dropdown.Item>
                <Dropdown.Item href="/addressbook">
                  {navbarContent.addressbook}
                </Dropdown.Item>
                {/* <Dropdown.Item href="https://wa.me/+85291337272">{navbarContent.home_cleaning}</Dropdown.Item> */}
                {/* <Dropdown.Item href="https://wa.me/+85260162029">{navbarContent.business_cleaning}</Dropdown.Item> */}
                <Dropdown.Item
                  onClick={onLogout}
                  className="cursor-pointe"
                  aria-current="page"
                >
                  {navbarContent.logout}
                </Dropdown.Item>
              </Dropdown>
            </div>
            {lang && lang === "zh" ? (
              <select
                name="languange"
                className="rounded-md outline-none"
                onChange={(e) => onChangeLanguage(e.target.value)}
              >
                <option value="zh">中文</option>
                <option value="en">en</option>
              </select>
            ) : (
              <select
                name="languange"
                className="rounded-md outline-none"
                onChange={(e) => onChangeLanguage(e.target.value)}
              >
                <option value="en">en</option>
                <option value="zh">中文</option>
              </select>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4 lg:order-2">
            <div className="flex items-center gap-4 lg:invisible md:visible lg:order-2">
              <div className="">
                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.94971 11.9497H39.9497"
                        stroke="#333"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.94971 23.9497H39.9497"
                        stroke="#333"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.94971 35.9497H39.9497"
                        stroke="#333"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                >
                  <Dropdown.Item href="/cleaning">
                    {navbarContent.home_cleaning}
                  </Dropdown.Item>
                  <Dropdown.Item href="/business">
                    {navbarContent.business_cleaning}
                  </Dropdown.Item>
                  <Dropdown.Item type="button" href="/blog">
                    {navbarContent.blog_title}
                  </Dropdown.Item>
                  <Dropdown.Item href="/about-us">
                    {navbarContent.about_us_title}
                  </Dropdown.Item>
                </Dropdown>
              </div>
            </div>
            <Link href="/login" className="text-blue-500" aria-current="page">
              {navbarContent.sign_in}
            </Link>
            <Link
              href="/register"
              className="btn-gradient-custom-1 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm text-white shadow-md"
            >
              {navbarContent.sign_up}
            </Link>
            {lang && lang === "en" ? (
              <select
                name="languange"
                className="rounded-md outline-none"
                onChange={(e) => onChangeLanguage(e.target.value)}
              >
                <option value="en">en</option>
                <option value="zh">中文</option>
              </select>
            ) : (
              <select
                name="languange"
                className="rounded-md outline-none"
                onChange={(e) => onChangeLanguage(e.target.value)}
              >
                <option value="zh">中文</option>
                <option value="en">en</option>
              </select>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
