import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Alert } from "antd";

export default function Index(props) {
  const list = props.list;
  const quiz = props.quiz;
  const promo = props.isPromo;
  const [inputCoupon, setInputCoupon] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [usedCoupon, setUsedCoupon] = useState(null);
  const [openedTerms, setOpenedTerms] = useState(null);
  const [terms, setTerms] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(new Date(dateString).toISOString());
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const formatTime = (string) => {
    const date = new Date(new Date(string).toISOString());
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedTime}`;
  };

  const formatFreeOptions = (options) => {
    const free_options = options.split(",");

    return free_options;
  };

  const getTerms = (id) => {
    setTerms(null);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupon/${id}`)
      .then((res) => {
        setTerms(res.data.terms);
      });
  };

  const toggleTerms = (idx, id) => {
    if (idx === openedTerms) {
      setOpenedTerms(null);
    } else {
      getTerms(id);
      setOpenedTerms(idx);
    }
  };

  const selectCoupon = (status, id, idx) => {
    const coupon = list.filter((item) => item.id === id);
    const userLimit = coupon[0].limitation.filter((l) => l.type === "user");
    const codeLimit = coupon[0].limitation.filter((l) => l.type === "code");

    if (status) {
      if (coupon[0].limitation.length === 0) {
        setSelectedCoupon(idx);
        setUsedCoupon(id);
      }
      if (
        codeLimit.length > 0 &&
        userLimit.length > 0 &&
        (codeLimit[0]?.used === codeLimit[0]?.limit ||
          userLimit[0]?.used === userLimit[0]?.limit)
      ) {
        return;
      }
      if (codeLimit.length > 0 && codeLimit[0]?.used < codeLimit[0]?.limit) {
        setSelectedCoupon(idx);
        setUsedCoupon(id);
      }
      if (userLimit.length > 0 && userLimit[0]?.used < userLimit[0]?.limit) {
        setSelectedCoupon(idx);
        setUsedCoupon(id);
      }
    }
  };

  const cancelCoupon = () => {
    setSelectedCoupon(null);
    setUsedCoupon(null);
  };

  const applyCoupon = (method, coupon) => {
    const token = localStorage.getItem("token");

    if (method === "input") {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupon/apply`,
          {
            coupon_code: inputCoupon,
            insurance: quiz.insurance,
            broom_and_mop: quiz.broom_and_mop,
            cleaning_solutions: quiz.cleaning_solutions,
            estimatedTime: quiz.estimatedTime,
            estimatedPrice: quiz.estimatedPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.status) {
            setIsNotFound(true);
            setErrMsg(res.data.msg);
            const intervalId = setInterval(() => {
              setIsNotFound(false);
            }, 5000);
          } else {
            props.usePromo(res.data);
          }
        });
    } else if (method === "select") {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupon/${coupon}`,
          {
            insurance: quiz.insurance,
            broom_and_mop: quiz.broom_and_mop,
            cleaning_solutions: quiz.cleaning_solutions,
            estimatedTime: quiz.estimatedTime,
            estimatedPrice: quiz.estimatedPrice,
            cleaning_time: quiz.estimatedTime.toFixed(1),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("🚀 ~ .then ~ res:", res);
          if (res.data.status) {
            setIsError(true);
            setErrMsg(res.data.msg);
            const intervalId = setInterval(() => {
              setIsError(false);
            }, 5000);

            return () => clearInterval(intervalId);
          }
          props.usePromo(res.data);
        });
    }
  };

  const QuotaDisplay = ({ item }) => {
    const hasLimitation = item !== null;
    const isCodeType = hasLimitation && item.type === "code";
    const available = isCodeType && item.used < item.limit;

    return (
      <div className={`${!isCodeType ? "hidden" : ""}`}>
        {isCodeType && (
          <div className={!available ? "text-red-500" : ""}>
            Quota: {item.used} / <span className="font-bold">{item.limit}</span>
          </div>
        )}
      </div>
    );
  };

  const UsageDisplay = ({ item }) => {
    const hasLimitation = item !== null;
    const isUserType = hasLimitation && item.type === "user";
    const available = isUserType && item.used < item.limit;

    return (
      <div className={`${!isUserType ? "hidden" : ""}`}>
        {isUserType && (
          <div className={!available ? "text-red-500" : ""}>
            Your usage: {item.used} /{" "}
            <span className="font-bold">{item.limit}</span>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!promo) {
      setSelectedCoupon(null);
      setUsedCoupon(null);
    }
  }, [promo]);

  return (
    <div className="mt-6">
      <div className="flex gap-2">
        <input
          type="text"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Input Promo Code"
          onInput={(e) => {
            const uppercased = e.target.value.toUpperCase();
            e.target.value = uppercased;
            setInputCoupon(uppercased);
          }}
        />
        <button
          type="button"
          disabled={!inputCoupon}
          className={`rounded-md px-6 text-white ${
            inputCoupon ? "bg-green-500" : "bg-gray-500"
          }`}
          onClick={() => applyCoupon("input", inputCoupon)}
        >
          Apply
        </button>
      </div>
      <div className="mt-3 max-h-96 overflow-y-auto pt-4">
        {list
          .filter((item) => item.forYou)
          .map((item, idx) => (
            <div
              key={idx}
              onClick={() => selectCoupon(item.is_active, item.id, idx)}
            >
              <div
                className={`border-gray-2 mb-2 rounded-md border px-4 py-2 ${
                  selectedCoupon === idx ? "border-2 border-teal-500" : ""
                } ${
                  !item.is_active
                    ? "border-3 border-gray-2 cursor-not-allowed bg-zinc-400 text-slate-200"
                    : ""
                }
              ${
                item.is_active &&
                (item.limitation.length === 0 ||
                  (item.limitation.some(
                    (l) => l.type === "user" && l.used < l.limit
                  ) &&
                    item.limitation.some(
                      (l) => l.type === "code" && l.used < l.limit
                    )))
                  ? "cursor-pointer"
                  : ""
              }`}
              >
                <div className="mb-3 flex justify-between">
                  <div>
                    <p>
                      <span className="font-bold">{item.code}</span> -{" "}
                      <span className={item.is_active ? "text-gray-400" : ""}>
                        {item.name}
                      </span>
                    </p>
                  </div>

                  {item.limitation.map((el, idx) => (
                    <QuotaDisplay key={idx} item={el} />
                  ))}
                </div>
                <ul className="ml-5 list-disc">
                  <li>
                    Promo period:
                    <span className="ml-1 font-bold">
                      {formatDate(item.actived_at)} -{" "}
                      {formatDate(item.expired_at)} at{" "}
                      {formatTime(item.expired_at)}
                    </span>
                  </li>
                  <li>
                    Discount up to{" "}
                    <span className="font-bold">
                      {item.amount}
                      {item.type === "percentage" ? "%" : " HKD"}
                    </span>{" "}
                    for your transaction
                  </li>
                  {item.free_options
                    ? formatFreeOptions(item.free_options).map(
                        (option, idx) => (
                          <li key={idx}>
                            Get free{" "}
                            <span className="font-bold">
                              {option === "tools"
                                ? "Cleaning Tools"
                                : option === "insurance"
                                  ? "Insurance"
                                  : "Cleaning Solutions"}
                            </span>
                          </li>
                        )
                      )
                    : ""}
                </ul>
                <div className="flex justify-between">
                  <div>
                    <p
                      className={`mt-5 underline ${
                        item.is_active ? "text-sky-500" : "text-black"
                      }`}
                      onClick={() => toggleTerms(idx, item.id)}
                    >
                      Terms and Conditions
                    </p>
                  </div>
                  {item.limitation.length === 0 && item.used && (
                    <span className="font-bold text-red-500">Already Used</span>
                  )}
                  {item.limitation.map((el, idx) => (
                    <UsageDisplay key={idx} item={el} />
                  ))}
                </div>
                {openedTerms !== null && openedTerms === idx && (
                  <div
                    className={`${
                      openedTerms !== null
                        ? "h-auto transition-all duration-500 ease-in"
                        : "h-0 transition-all duration-500 ease-out"
                    } mt-2 overflow-hidden rounded-md border border-gray-200 bg-gray-100 p-4 text-black`}
                  >
                    {terms ? (
                      <div>
                        <ul className="ml-3 list-disc">
                          {terms.map((item, idx) => (
                            <li key={idx}>
                              {item.type === "min_hours"
                                ? "Minimum cleaning time "
                                : item.type === "min_amounts"
                                  ? "Minimum order amount "
                                  : item.type === "max_discount"
                                    ? "Get maximum discount up to "
                                    : item.type === "total_orders"
                                      ? "Total orders: "
                                      : item.type === "total_hours"
                                        ? "Total hours: "
                                        : item.type === "total_ref"
                                          ? "Total referrals: "
                                          : ""}
                              {item.type === "max_discount"
                                ? parseInt(item.amount) + " HKD"
                                : item.type === "min_hours"
                                  ? item.amount + " Hours"
                                  : item.type === "min_amounts"
                                    ? item.amount + " HKD"
                                    : item.type === "total_orders"
                                      ? item.amount + " Times"
                                      : item.type === "total_hours"
                                        ? item.amount + " Hours"
                                        : item.type === "total_ref"
                                          ? item.amount
                                          : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      "Not Terms Required"
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-between">
        <div className="mt-4">
          <button
            type="button"
            className={`flex items-center gap-1 rounded-md ${
              selectedCoupon !== null ? "bg-red-500" : "hidden"
            } px-6 py-2 text-white`}
            onClick={() => cancelCoupon()}
            disabled={selectedCoupon === null ? true : false}
          >
            Cancel Promo {""}
            <FontAwesomeIcon
              style={{ color: "inherit" }}
              className="w-auto"
              icon={faTimes}
            />
          </button>
        </div>

        <div className="mt-4 text-right">
          <button
            type="button"
            className={`flex items-center gap-1 rounded-md ${
              selectedCoupon !== null ? "bg-blue-500" : "bg-gray-500"
            } px-6 py-2 text-white`}
            onClick={() => applyCoupon("select", usedCoupon)}
            disabled={selectedCoupon === null ? true : false}
          >
            Use Promo {""}
            <FontAwesomeIcon
              style={{ color: "inherit" }}
              className="w-auto"
              icon={faArrowRight}
            />
          </button>
        </div>
      </div>
      <div className={`mt-3 ${!isError ? "hidden" : ""}`}>
        <Alert
          message="Does not meet the terms and conditions"
          description={errMsg}
          type="error"
          showIcon
        />
      </div>
      <div className={`mt-3 ${!isNotFound ? "hidden" : ""}`}>
        <Alert
          message="Code you input is invalid"
          description={errMsg}
          type="error"
          showIcon
        />
      </div>
    </div>
  );
}
