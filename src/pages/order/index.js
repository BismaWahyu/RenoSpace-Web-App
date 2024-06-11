// Import required modules
import Image from "next/image";
import React, { useState } from "react";
import Calendar from "../../components/calendar";
import Link from "next/link";
import Heading from "../../components/heading";

// Order component
export default function Order() {
  // State for selected date
  const [selectedDate, setSelectedDate] = useState(null);

  // Handle date change
  const handleDateChange = (date) => {
    const dateInput = new Date(date);
    const formattedDate = dateInput.toISOString();
    setSelectedDate(formattedDate);
  };

  return (
    <>
      <Heading />
      <div className="banner-login flex justify-between p-10">
        {/* Back button */}
        <Link href="/">
          <Image
            src="/assets/arrow-right.png"
            alt="Arrow"
            width="40"
            height="40"
            className="cursor-pointer rounded-full bg-white p-2 shadow-md"
          />
        </Link>

        {/* Order form */}
        <div className="flex items-center justify-center">
          <div className="h-[76vh] w-[30rem] rounded-xl bg-white p-10 shadow-lg">
            <p className="text-title mb-6">Order Form</p>

            {/* Calendar component */}
            <Calendar onChange={handleDateChange} />

            {/* Display selected date */}
            <span>
              {selectedDate ? selectedDate.toString() : "No date selected"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
