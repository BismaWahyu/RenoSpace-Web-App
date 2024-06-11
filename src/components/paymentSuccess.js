import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";

export default function PaymentSuccess(props) {
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="mx-auto">
          <div className="mb-6">
            <img src="/assets/payment-success-1.png" className="w-42 mx-auto" />
          </div>
          <h3 className="pb-2 text-2xl font-bold">
            {props.content.continue_the_app}
          </h3>
          <div className="mb-2 mt-2">
            <p className="text-custom-gray-2 text-md pb-1">
              <FontAwesomeIcon
                style={{ color: "#4baffe" }}
                className="w-4 text-white"
                icon={faCheckCircle}
              />{" "}
              {props.content.track_your_order}
            </p>
            <p className="text-custom-gray-2 text-md pb-1">
              <FontAwesomeIcon
                style={{ color: "#4baffe" }}
                className="w-4 text-white"
                icon={faCheckCircle}
              />{" "}
              {props.content.message_your_cleaner}
            </p>
            <p className="text-custom-gray-2 text-md pb-1">
              <FontAwesomeIcon
                style={{ color: "#4baffe" }}
                className="w-4 text-white"
                icon={faCheckCircle}
              />{" "}
              {props.content.special_in_app_offers}
            </p>
          </div>
          <div className="mt-8 items-center">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <a
                  target="_blank"
                  href="https://play.google.com/store/apps/details?id=com.renospace.client_app"
                >
                  <img
                    src="/assets/google-play.png"
                    className="w-32 rounded-lg"
                  />
                </a>
                <a
                  target="_blank"
                  href="https://play.google.com/store/apps/details?id=com.renospace.client_app"
                >
                  <img
                    src="/assets/app-store.png"
                    className="w-32 rounded-lg"
                  />
                </a>
              </div>
              <img src="/assets/bardcode.png" className="w-32" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
