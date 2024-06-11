import axiosInstance from "../../utils/axiosConfig";
import { useRouter } from "next/navigation";
import swal from "sweetalert";
import * as fbq from "../../utils/fpixel";
import Image from "next/image";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import Link from "next/link";
// import Link from "next/link";
import axios from "axios";
import { translation } from "../../utils/translation";
import Heading from "../../components/heading";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { IfFeatureEnabled, FeatureString } from "@growthbook/growthbook-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [content, setContent] = useState({});
  const { push } = useRouter();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleBlur = () => {
    const isValidEmail = validateEmail(email);
    setIsValid(isValidEmail);
  };

  let allowCountryCodeDev = "";
  let allowCountryCodeProd = "";
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "development") {
    allowCountryCodeDev = "website-allow-country-code-hongkong-indonesia";
  } else if (process.env.NEXT_PUBLIC_ENVIRONMENT === "production") {
    allowCountryCodeProd = "website-allow-country-code-hongkong";
  } else {
    allowCountryCodeDev = "website-allow-country-code-hongkong-indonesia";
  }

  useEffect(() => {
    push(`${localStorage.getItem("language") || "zh"}/register`);
    localStorage.removeItem("phone_number");
    localStorage.removeItem("country_code");

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

  const onChangePhone = (value, country, e, formattedValue) => {
    setCountry(country.countryCode);
    setPhone(value);
  };

  const handleKeyPress = async (e) => {
    setPhone(e.target.value.replace(/[+ ]/g, ""));

    await handleSubmit(e);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    fbq.event("Register", { status: true });
    const data = {
      // first_name: firstName,
      // last_name: lastName,
      name: name,
      email: email,
      phone_number: phone,
    };

    if (country === "hk") {
      data.phone_number = data.phone_number.slice(3);
    }

    if (country === "id") {
      data.phone_number = data.phone_number.slice(2);
    }

    if (country === "us") {
      data.phone_number = data.phone_number.slice(1);
    }

    try {
      if (data.phone_number === "" || data.phone_number === null) {
        swal("Please Try Again", `Phone number cannot be empty`, "error");
      } else if (data.email === "" || data.email === null) {
        swal("Please Try Again", `Email cannot be empty`, "error");
      } else {
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v2/users/register?agent=hybrid`,
          data
        );

        localStorage.setItem("phone_number", phone);
        localStorage.setItem("country_code", country);

        swal("Success", `Success register`, "success");
        setTimeout(() => {
          push(`/login?phone=${phone}`);
        }, 1000);
      }
    } catch (error) {
      console.error("Error making POST request:", error.response?.data);

      if (error.response?.data.status === 400) {
        if (error.response?.data.message.email) {
          swal("Bad Request", error.response?.data.message.email);
        } else {
          swal("Bad Request", error.response?.data.message);
        }
      } else {
        swal(
          "Error",
          "Please contact our development team for more information. +85260624191",
          "error"
        );
        // swal("Err", `Error making POST request ${error}`, "error");
      }
    }
  };

  return (
    <>
      <Heading />
      <div className="">
        <div className="banner-register mt-4 inline justify-between max-[412px]:p-4 md:mt-0 md:flex md:p-10">
          <Link href="/">
            <Image
              src="/assets/arrow-right.png"
              alt="Arrow"
              width="40"
              height="40"
              className="rounded-full bg-white p-2 shadow-md"
            />
          </Link>
          <div className="items-center justify-center px-4 pt-4 md:flex md:px-0 md:pt-0">
            <div className="md:text-custom-gray-1 h-[92vh] h-auto w-[30rem] rounded-xl bg-white p-10 shadow-lg">
              <p className="text-title mb-6 capitalize">{content.sign_up}</p>
              <form
                className="w-full max-w-lg"
                id="register_form"
                onSubmit={handleSubmit}
              >
                <div className="mb-5">
                  <div className="w-full">
                    <label className="mb-2 block text-[18px] font-bold text-gray-700">
                      {content.name}
                    </label>
                    <input
                      className="mb-3 block w-full appearance-none rounded-lg border bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      placeholder={content.name}
                      required
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <div className="w-full">
                    <label className="mb-2 block text-[18px] font-bold text-gray-700">
                      {content.phone}
                    </label>

                    <IfFeatureEnabled feature={allowCountryCodeDev}>
                      <PhoneInput
                        country={"hk"}
                        onlyCountries={["hk", "id"]}
                        value={phone}
                        onChange={(value, country, e, formattedValue) =>
                          onChangePhone(value, country, e, formattedValue)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleKeyPress(e);
                        }}
                        copyNumbersOnly={true}
                        inputStyle={{
                          width: "100%",
                          height: "39px",
                          borderRadius: "0.5rem",
                        }}
                      />
                    </IfFeatureEnabled>

                    <IfFeatureEnabled feature={allowCountryCodeProd}>
                      <PhoneInput
                        country={"hk"}
                        onlyCountries={["hk"]}
                        value={phone}
                        onChange={(value, country, e, formattedValue) =>
                          onChangePhone(value, country, e, formattedValue)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleKeyPress(e);
                        }}
                        copyNumbersOnly={true}
                        inputStyle={{
                          width: "100%",
                          height: "39px",
                          borderRadius: "0.5rem",
                        }}
                      />
                    </IfFeatureEnabled>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="w-full">
                    <label className="mb-2 block text-[18px] font-bold text-gray-700">
                      {content.email}
                    </label>
                    <input
                      className={`mb-0 block w-full appearance-none rounded-lg border ${
                        isValid ? "bg-gray-200" : "border-red-500"
                      } px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none`}
                      type="email"
                      placeholder={content.email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={handleBlur}
                    />
                    {!isValid && (
                      <p className="text-red-500">Invalid email format</p>
                    )}
                  </div>
                </div>
                <div className="mb-2">
                  <button
                    type="submit"
                    className="btn-gradient-custom-1 flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    {content.continue}
                    {/* <FontAwesomeIcon
                      icon="fa-solid fa-arrow-right"
                      className="sm-icon ml-2"
                      size="sm"
                    /> */}
                  </button>
                  <p className="text-md mt-3 pb-4 text-center text-sm">
                    {content.sign_up_1}{" "}
                    <Link href="/login" className="text-sky-400">
                      {content.sign_up_2}
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Content One */}
    </>
  );
}
