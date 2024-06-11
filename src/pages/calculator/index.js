import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Select from "react-select";
import Link from "next/link";

export default function Calculator() {
  const [roomTypeForm, setRoomTypeForm] = useState(false);
  const [calcResult, setCalcResult] = useState(false);

  const [states, setStates] = useState({
    isHaveTools: false,
    isHaveSolutions: false,
    isInsurance: false,
    isHavePet: false,
  });
  const handleToggle = (key) => {
    setStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const customDropdown = {
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: "transparent", // Make the background transparent
      border: "none",
      boxShadow: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "gray", // Change the dropdown indicator color
    }),
  };

  const homeSize = [
    { value: "10", label: "10 sqft" },
    { value: "15", label: "15 sqft" },
    { value: "20", label: "20 sqft" },
  ];
  const [selectedHomseSIze, setSelectedHomeSize] = useState(null);

  return (
    <>
      <div className="">
        <div className="banner-login flex justify-between p-10">
          <a href={"/"}>
            <Image
              src="/assets/arrow-right.png"
              alt="Arrow"
              width="40"
              height="40"
              className="rounded-full bg-white p-2 shadow-md"
            />
          </a>
          <div className="flex items-center justify-center">
            <div className="text-custom-gray-1 flex h-[95vh] w-[60rem] rounded-[5%] bg-neutral-50 shadow-lg">
              <div className="calculator-background flex w-1/2 flex-col justify-center rounded-[5%] p-10">
                <p className="mb-10 text-[36px] text-white">
                  Our cost calculator make planning your cleaning that little
                  bit easier.
                </p>

                <p className="text-[30px] text-white">
                  Get a head start today!
                </p>
              </div>

              {!roomTypeForm && !calcResult && (
                <div className="mt-[-20px] w-1/2 p-10">
                  <span className="text-label">
                    Rooms
                    {/* <FontAwesomeIcon
                      icon="fa-solid fa-circle-info"
                      size="sm"
                      className="ml-2"
                    /> */}
                  </span>
                  <div className="mt-5 w-[90%] rounded-xl bg-white p-4 shadow-lg">
                    <div className="mb-3 flex flex-row items-center">
                      <Image
                        src="/assets/kitchen-icon.png"
                        alt="kitchen"
                        width={60}
                        height={60}
                      />
                      <span className="ml-5 font-bold">Kitchen</span>
                      <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-slate-200">
                        <span>1</span>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="mb-3 mt-3 flex flex-row items-center">
                      <div className="flex items-center justify-center rounded-full bg-slate-200 p-2">
                        <Image
                          src="/assets/fridge.png"
                          alt="fridge"
                          width={25}
                          height={25}
                          className="mr-2"
                        />
                        <span>Fridge</span>
                      </div>
                      <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-slate-200">
                        <span>2</span>
                      </div>
                    </div>
                    <div className="mb-3 mt-3 flex flex-row items-center">
                      <div className="flex items-center justify-center rounded-full bg-slate-200 p-2">
                        <Image
                          src="/assets/fan.png"
                          alt="fridge"
                          width={25}
                          height={25}
                          className="mr-2"
                        />
                        <span>Ventilation Fan</span>
                      </div>
                      <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-slate-200">
                        <span>2</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="item-center mt-5 flex w-[87%] cursor-pointer flex-row justify-center rounded-xl border-2 border-gray-300 bg-white p-5 shadow-lg"
                    onClick={() => setRoomTypeForm(true)}
                  >
                    <Image
                      src="/assets/plus.png"
                      alt="Add Room Type"
                      width={50}
                      height={50}
                    />
                  </div>

                  <div className="mt-5 w-[90%]">
                    <div className="item-center mb-3 flex flex-row">
                      <span>
                        Do you have cleaning tools?
                        {/* <FontAwesomeIcon
                          icon="fa-solid fa-circle-info"
                          className="ml-1"
                        /> */}
                      </span>
                      <div
                        className={`item-center relative ml-auto inline-block flex h-6 w-10 ${
                          states.isHaveTools
                            ? "gradient-background"
                            : "bg-gray-300"
                        } rounded-full shadow-inner`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          id="tools"
                          checked={states.isHaveTools}
                          onChange={() => handleToggle("isHaveTools")}
                        />
                        <label
                          htmlFor="tools"
                          className={`absolute h-5 w-5 transform cursor-pointer rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                            states.isHaveTools
                              ? "translate-x-full"
                              : "translate-x-0"
                          }`}
                        ></label>
                      </div>
                    </div>
                    <div className="item-center mb-3 flex flex-row">
                      <span>
                        Do you have cleaning solutions?
                        {/* <FontAwesomeIcon
                          icon="fa-solid fa-circle-info"
                          className="ml-1"
                        /> */}
                      </span>
                      <div
                        className={`item-center relative ml-auto inline-block flex h-6 w-10 ${
                          states.isHaveSolutions
                            ? "gradient-background"
                            : "bg-gray-300"
                        } rounded-full shadow-inner`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          id="solutions"
                          checked={states.isHaveSolutions}
                          onChange={() => handleToggle("isHaveSolutions")}
                        />
                        <label
                          htmlFor="solutions"
                          className={`absolute h-5 w-5 transform cursor-pointer rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                            states.isHaveSolutions
                              ? "translate-x-full"
                              : "translate-x-0"
                          }`}
                        ></label>
                      </div>
                    </div>
                    <div className="item-center mb-3 flex flex-row">
                      <span>
                        Add insurance
                        {/* <FontAwesomeIcon
                          icon="fa-solid fa-circle-info"
                          className="ml-1"
                        /> */}
                      </span>
                      <div
                        className={`item-center relative ml-auto inline-block flex h-6 w-10 ${
                          states.isInsurance
                            ? "gradient-background"
                            : "bg-gray-300"
                        } rounded-full shadow-inner`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          id="insurance"
                          checked={states.isInsurance}
                          onChange={() => handleToggle("isInsurance")}
                        />
                        <label
                          htmlFor="insurance"
                          className={`absolute h-5 w-5 transform cursor-pointer rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                            states.isInsurance
                              ? "translate-x-full"
                              : "translate-x-0"
                          }`}
                        ></label>
                      </div>
                    </div>
                    <div className="item-center mb-3 flex flex-row">
                      <span>
                        Do you have a pet?
                        {/* <FontAwesomeIcon
                          icon="fa-solid fa-circle-info"
                          className="ml-1"
                        /> */}
                      </span>
                      <div
                        className={`item-center relative ml-auto inline-block flex h-6 w-10 ${
                          states.isHavePet
                            ? "gradient-background"
                            : "bg-gray-300"
                        } rounded-full shadow-inner`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          id="pet"
                          checked={states.isHavePet}
                          onChange={() => handleToggle("isHavePet")}
                        />
                        <label
                          htmlFor="pet"
                          className={`absolute h-5 w-5 transform cursor-pointer rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                            states.isHavePet
                              ? "translate-x-full"
                              : "translate-x-0"
                          }`}
                        ></label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="item-center flex flex-row">
                        <span>
                          Images
                          {/* <FontAwesomeIcon
                            icon="fa-solid fa-circle-info"
                            className="ml-1"
                          /> */}
                        </span>
                      </div>
                      <div className="w-fit cursor-pointer rounded-xl bg-white p-5 shadow-lg">
                        <Image
                          src="/assets/gallery-add.png"
                          alt="Add image"
                          width={30}
                          height={30}
                        />
                      </div>
                    </div>
                    <div className="mb-5">
                      <span>Home Size</span>
                      <div className="rounded-xl bg-white p-5 shadow-lg">
                        <Select options={homeSize} styles={customDropdown} />
                      </div>
                    </div>
                    <div className="mb-5">
                      <span>Remarks</span>
                      <div className="rounded-xl bg-white p-5 shadow-lg">
                        <textarea
                          className="block h-full w-full resize-none border-none bg-transparent focus:outline-none"
                          placeholder="Add comments to freelancer"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-gradient-custom-1 flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    Calculate
                    {/* <FontAwesomeIcon
                      icon="fa-solid fa-arrow-right"
                      className="sm-icon ml-2"
                      size="sm"
                    /> */}
                  </button>
                </div>
              )}

              {roomTypeForm && (
                <div className="mt-[-20px] w-1/2 p-5">
                  <div className="mt-10 flex w-full items-center justify-center">
                    <span className="text-center text-[24px]">
                      Select your room type
                    </span>
                  </div>
                  <div className="mt-5 flex flex-row justify-around">
                    <div className="m-1 flex w-1/3 cursor-pointer flex-col items-center justify-center rounded-xl border-4 border-sky-500 bg-white p-4 shadow-lg">
                      <Image
                        src="/assets/kitchen-icon.png"
                        alt="Kitchen"
                        width={60}
                        height={60}
                      />
                      <span className="text-[14px]">Kitchen</span>
                      <span className="text-[12px]">1 hour 40 mins</span>
                      <div className="flex w-full flex-row justify-around">
                        <div className="mr-auto flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-slate-200">
                          <span>+</span>
                        </div>
                        <div className="flex h-5 w-10 cursor-text items-center justify-center rounded-full bg-slate-200">
                          <input
                            type="text"
                            className="h-full w-full border-none bg-transparent text-center focus:outline-none"
                            value={0}
                            onChange={(e) => {
                              // Handle input changes here
                            }}
                          />
                        </div>
                        <div className="ml-auto flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-slate-200">
                          <span>-</span>
                        </div>
                      </div>
                    </div>
                    <div className="m-1 flex w-1/3 flex-col items-center justify-center rounded-xl bg-white p-4 shadow-lg">
                      <Image
                        src="/assets/bedroom.png"
                        alt="Bedroom"
                        width={60}
                        height={60}
                      />
                      <span className="text-[14px]">Bedroom</span>
                      <span className="text-[12px]">30 mins</span>
                    </div>
                    <div className="m-1 flex w-1/3 flex-col items-center justify-center rounded-xl bg-white p-4 shadow-lg">
                      <Image
                        src="/assets/toilet.png"
                        alt="Bathroom"
                        width={60}
                        height={60}
                      />
                      <span className="text-[14px]">Bathroom</span>
                      <span className="text-[12px]">1 hour 30 mins</span>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-row justify-around">
                    <div className="m-1 flex w-1/3 cursor-pointer flex-col items-center justify-center rounded-xl bg-white p-4 shadow-lg">
                      <Image
                        src="/assets/living-room.png"
                        alt="Living Room"
                        width={60}
                        height={60}
                      />
                      <span className="text-[14px]">Living Room</span>
                      <span className="text-[12px]">1 hour 30 mins</span>
                    </div>
                    <div className="m-1 flex w-1/3 flex-col items-center justify-center rounded-xl bg-white p-4 shadow-lg">
                      <Image
                        src="/assets/baby-room.png"
                        alt="Baby Room"
                        width={60}
                        height={60}
                      />
                      <span className="text-[14px]">Toddlers Room</span>
                      <span className="text-[12px]">1 Hour 30 mins</span>
                    </div>
                    <div className="m-1 flex w-1/3 flex-col items-center justify-center rounded-xl bg-white p-4 shadow-lg">
                      <Image
                        src="/assets/others.png"
                        alt="Others"
                        width={60}
                        height={60}
                      />
                      <span className="text-[14px]">Others</span>
                    </div>
                  </div>

                  <hr className="mt-5"></hr>

                  <p className="mt-5">
                    Note: If no item is selected within the room, we will clean
                    surface area only.
                  </p>

                  <div className="mt-5 flex flex-row">
                    <div className="flex flex-row">
                      <div className="flex flex-col items-center">
                        <span>Fridge</span>
                        <div className="rounded-xl bg-white p-3 shadow-lg">
                          <Image
                            src="/assets/fridge.png"
                            width={40}
                            height={40}
                          />
                        </div>
                        <span className="text-[12px]">Each 30Mins</span>
                      </div>
                      <div className="ml-5 flex flex-col items-center">
                        <span>Number</span>
                        <div className="mt-2 w-20 rounded-xl bg-white p-3 shadow-lg">
                          <input
                            type="number"
                            value={0}
                            className="h-full w-full border-none bg-transparent text-center focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto flex flex-row">
                      <div className="flex flex-col items-center">
                        <span>Fridge</span>
                        <div className="rounded-xl bg-white p-3 shadow-lg">
                          <Image
                            src="/assets/fridge.png"
                            width={40}
                            height={40}
                          />
                        </div>
                        <span className="text-[12px]">Each 30Mins</span>
                      </div>
                      <div className="ml-5 flex flex-col items-center">
                        <span>Number</span>
                        <div className="mt-2 w-20 rounded-xl bg-white p-3 shadow-lg">
                          <input
                            type="number"
                            value={0}
                            className="h-full w-full border-none bg-transparent text-center focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-row">
                    <div className="flex flex-row">
                      <div className="flex flex-col items-center">
                        <span>Fridge</span>
                        <div className="rounded-xl bg-white p-3 shadow-lg">
                          <Image
                            src="/assets/fridge.png"
                            width={40}
                            height={40}
                          />
                        </div>
                        <span className="text-[12px]">Each 30Mins</span>
                      </div>
                      <div className="ml-5 flex flex-col items-center">
                        <span>Number</span>
                        <div className="mt-2 w-20 rounded-xl bg-white p-3 shadow-lg">
                          <input
                            type="number"
                            value={0}
                            className="h-full w-full border-none bg-transparent text-center focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto flex flex-row">
                      <div className="flex flex-col items-center">
                        <span>Fridge</span>
                        <div className="rounded-xl bg-white p-3 shadow-lg">
                          <Image
                            src="/assets/fridge.png"
                            width={40}
                            height={40}
                          />
                        </div>
                        <span className="text-[12px]">Each 30Mins</span>
                      </div>
                      <div className="ml-5 flex flex-col items-center">
                        <span>Number</span>
                        <div className="mt-2 w-20 rounded-xl bg-white p-3 shadow-lg">
                          <input
                            type="number"
                            value={0}
                            className="h-full w-full border-none bg-transparent text-center focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-gradient-custom-1 mt-20 flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    onClick={() => setRoomTypeForm(false)}
                  >
                    Add room type
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content One */}
    </>
  );
}
