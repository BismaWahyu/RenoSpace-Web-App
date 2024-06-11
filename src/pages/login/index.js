import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import swal from "sweetalert";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { translation } from "../../utils/translation";
import Heading from "../../components/heading";
import Countdown from "react-countdown";
import OtpInput from "react-otp-input";
import { auth } from "../../../firebase-auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import BeatLoader from "react-spinners/BeatLoader";
import { IfFeatureEnabled, FeatureString } from "@growthbook/growthbook-react";

export default function Login() {
  let [phone, setPhone] = useState("");
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const phoneQuery = searchParams.get("phone");

  const [content, setContent] = useState({});
  const [showVerify, setShowVerify] = useState(false);
  const [showVerifyLoading, setShowVerifyLoading] = useState(false);
  const [showSendButton, setShowSendButton] = useState(true);
  const [showSendButtonLoading, setShowSendButtonLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [country, setCountry] = useState("");
  const [expirationDate, setExpirationDate] = useState();

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
    const phoneNumber = localStorage.getItem("phone_number");
    const countryCode = localStorage.getItem("country_code");

    if (phoneNumber && countryCode) {
      setPhone(phoneNumber);
      setCountry(countryCode);
    }

    push(`${localStorage.getItem("language") || "zh"}/login`);

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

  const checkPhoneNumber = async () => {
    let ph = "";
    if (country === "hk") {
      ph = phone.slice(3);
    }

    if (country === "id") {
      ph = phone.slice(2);
    }

    if (country === "us") {
      ph = phone.slice(1);
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/check-phone-number`,
      {
        phone_number: ph,
      }
    );

    return response.data.msg;
  };

  const login = async () => {
    let ph = "";
    if (country === "hk") {
      ph = phone.slice(3);
    }

    if (country === "id") {
      ph = phone.slice(2);
    }

    if (country === "us") {
      ph = phone.slice(1);
    }

    const data = {
      phone_number: ph,
    };

    try {
      if (data.phone_number === "" || data.phone_number === null) {
        swal("Err", `Phone number cannot be empty`, "error");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/users/login?agent=hybrid`,
        data
      );

      localStorage.setItem("language", "zh");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("email", response.data.email);
      localStorage.removeItem("phone_number");
      localStorage.removeItem("country_code");

      swal("Success", `Success login`, "success");
      setTimeout(() => {
        push("/cleaning");
      }, 1000);
    } catch (error) {
      if (error.response.status === 400) {
        swal("Bad Request", `${error.response.data.message}`);
      } else {
        swal("Err", `Error making POST request ${error}`, "error");
      }
    }
  };

  const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            if (response) {
              /**
               * problem if we set function onSignin as a callback function
               */
              // onSignin();

              console.log("success recaptcha");
              return true;
            }

            return false;
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  };

  const onOTPVerify = () => {
    setShowVerifyLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        setShowVerify(false);
        setShowSendButton(true);
        setShowVerifyLoading(false);
        swal("Success", `Success verify otp`, "success");

        setTimeout(() => {
          login();
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        setShowVerifyLoading(false);
        swal("Err", `Otp is invalid`, "error");
      });
  };

  const handleKeyPress = async (e) => {
    setPhone(e.target.value.replace(/[+ ]/g, ""));

    await onSignin();
  };

  const onSignin = async () => {
    if ((await checkPhoneNumber()) === "Unregistered") {
      swal("Bad Request", `Phone Number Unregistered, Please Sign Up`);
    } else {
      setShowSendButton(false);
      setShowSendButtonLoading(true);
      onCaptchVerify();
      setExpirationDate(Date.now() + 60000);

      const appVerifier = window.recaptchaVerifier;

      const formatPh = "+" + phone;

      signInWithPhoneNumber(auth, formatPh, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;

          setShowSendButtonLoading(false);
          setShowVerify(true);

          setTimeout(() => {
            setShowSendButton(true);
            setShowVerify(false);
          }, 60000);

          swal("Success", `Success send otp`, "success");
        })
        .catch((error) => {
          console.log("Error: " + error);
          setShowSendButton(true);
          swal("Err", `Try again later`, "error");
        });
    }
  };

  return (
    <>
      <Heading />
      <div className="">
        <div className="banner-login inline justify-between p-10 max-[412px]:p-4 md:flex">
          <Link href="/">
            <Image
              src="/assets/arrow-right.png"
              alt="Arrow"
              width="40"
              height="40"
              className="max-[412px]:none rounded-full bg-white p-2 shadow-md"
            />
          </Link>
          <div className="flex items-center justify-center">
            <div className="text-custom-gray-1 mx-5 mt-5 h-[76vh] w-[30rem] rounded-xl bg-white p-10 shadow-lg sm:mt-0 md:mx-0">
              <p className="text-title mb-6">{content.sign_in}</p>
              <form className="w-full max-w-lg" id="login_form">
                <div id="recaptcha-container"></div>
                <div className="mb-6">
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
                        inputStyle={{
                          width: "100%",
                          height: "39px",
                          borderRadius: "0.5rem",
                        }}
                      />
                    </IfFeatureEnabled>{" "}
                  </div>
                </div>
                <div className="mb-6">
                  <a
                    onClick={onSignin}
                    className={
                      showSendButton
                        ? "btn-gradient-custom-1 flex w-full cursor-pointer items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium capitalize text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        : "btn-gradient-custom-1 flex w-full cursor-none items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium capitalize text-white opacity-50 shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    }
                  >
                    {/* {content.submit} */}
                    {/* <FontAwesomeIcon
                      icon="arrow-right"
                      className="sm-icon ml-2"
                      size="sm"
                    /> */}
                    {showSendButton ? (
                      content.send
                    ) : showSendButtonLoading ? (
                      <BeatLoader
                        color={"white"}
                        loading={true}
                        size={11}
                        width={10}
                        aria-label="Loading"
                        data-testid="loader"
                      />
                    ) : (
                      <Countdown date={expirationDate} />
                    )}
                  </a>
                  {/* Verify */}
                  <div className="pt-4">
                    {showVerify && (
                      <div className="flex items-center justify-center gap-4 pb-2 pt-2">
                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          numInputs={6}
                          renderSeparator={<span>-</span>}
                          renderInput={(props) => (
                            <input
                              {...props}
                              style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "4px",
                              }}
                            />
                          )}
                          className="inner-otp"
                        />
                        <div className="">
                          <a
                            onClick={onOTPVerify}
                            className={
                              showVerifyLoading
                                ? "btn-gradient-custom-1 cursor-none items-center rounded-lg bg-blue-700 px-4 py-3 text-center text-sm text-white opacity-50 shadow-md"
                                : "btn-gradient-custom-1 cursor-pointer items-center rounded-lg bg-blue-700 px-4 py-3 text-center text-sm text-white shadow-md"
                            }
                          >
                            {showVerifyLoading ? (
                              <BeatLoader
                                color={"white"}
                                loading={true}
                                size={11}
                                width={10}
                                aria-label="Loading"
                                data-testid="loader"
                              />
                            ) : (
                              "Verify"
                            )}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-md pb-4 text-center text-sm">
                    {content.not_have_content}{" "}
                    <Link href="/register" className="text-sky-400">
                      {content.sign_in_1}
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
