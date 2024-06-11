import React from "react";
import BarLoader from "react-spinners/BarLoader";

function LoaderComponent({ isLoading }) {
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  return (
    <>
      <div className="">
        <div className="mx-auto">
          <img
            src="/assets/loader.gif"
            alt="Image Loader"
            className="mx-auto h-auto w-72"
          />
          <BarLoader
            color={"#3275F7"}
            loading={true}
            cssOverride={override}
            size={150}
            width={200}
            aria-label="Loading"
            data-testid="loader"
          />
        </div>
      </div>
    </>
  );
}

export default LoaderComponent;
