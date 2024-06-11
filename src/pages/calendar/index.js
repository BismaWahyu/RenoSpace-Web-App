import Image from "next/image";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { translation } from "../../utils/translation";
import Heading from "../../components/heading";
import Loader from "../../components/loader";

export default function Index() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useCalendlyEventListener({
    onEventScheduled: (e) => {},
    onProfilePageViewed: (e) => {},
    onDateAndTimeSelected: (e) => {},
    onEventTypeViewed: () => {},
  });

  useEffect(() => {
    router.push(`${localStorage.getItem("language") || "zh"}/calendar`);

    setName(localStorage.getItem("name"));
    setEmail(localStorage.getItem("email"));

    setTimeout(() => {
      setLoading(false);
    }, 2000);

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
      <div>
        <div className="flex h-screen items-center justify-center">
          <div className="mx-auto">
            <div className="pt-6">
              <div className="border-gray-200 bg-white shadow-xl">
                <a href="#">
                  <img className="" src="/assets/match.png" alt="matching" />
                </a>
                <div className="mb-1 px-4 py-6 text-center">
                  <a href="#">
                    <h5 className="mb-2 pt-4 text-xl font-bold tracking-tight text-gray-700">
                      Leo Wan
                    </h5>
                  </a>
                  <a href="#">
                    <h5 className="text-md mb-3 font-bold tracking-tight text-gray-500">
                      Business Development Manager
                    </h5>
                  </a>
                  <div className="mt-8">
                    {!loading ? (
                      <InlineWidget
                        url="https://calendly.com/renospace-business/inquiry"
                        prefill={{
                          email: email || "test@test.com",
                          name: name || "Jon Snow",
                        }}
                      />
                    ) : (
                      <Loader isLoading={false} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
