/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import moment from "moment";
import parse from "html-react-parser";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Heading from "@/components/heading";
import { translation } from "@/utils/translation";

export default function Index() {
  const router = useRouter();
  const [language, setLanguage] = useState("");
  const [blog, setBlog] = useState({});
  const [recomendation, setRecomendation] = useState([]);
  const [content, setContent] = useState({});

  const { slug } = router.query;

  useEffect(() => {
    setLanguage(localStorage.getItem("language") || "zh");

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog/${slug}?locale=${
          localStorage.getItem("language") || "zh"
        }`,
        {
          headers: {},
        }
      )
      .then((res) => {
        if (res.data.data) {
          const categories = res.data.data.blog_categories.map(
            (val) => val.category.id
          );
          setBlog(res.data.data);

          // recomendation feature
          axios
            .get(
              `${
                process.env.NEXT_PUBLIC_API_URL
              }/api/v1/blog/categories/${categories.join(",")}?locale=${
                localStorage.getItem("language") || "zh"
              }`,
              {
                headers: {},
              }
            )
            .then((res) => {
              setRecomendation(res.data);
            });
        }
      });

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
  }, [slug]);

  return (
    <>
      <Heading />
      <Navbar language={language} />
      <div className="mx-12 pt-2">
        <main class="bg-white pb-0 pt-8 antialiased md:pb-16 md:pt-2 lg:pb-24 lg:pt-16 dark:bg-gray-900">
          <div class="mx-auto justify-between md:px-16 lg:flex">
            <div className="mt-10 w-auto flex-initial lg:mt-0">
              <article class="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert mx-auto w-full">
                <header class="not-format mb-4 lg:mb-6">
                  <h1 class="text-3xl font-extrabold leading-tight text-gray-900 lg:mb-4 lg:text-4xl dark:text-white">
                    {blog?.title}
                  </h1>
                  <p class="text-base text-gray-500 dark:text-gray-400">
                    <time
                      pubdate
                      datetime="2022-02-08"
                      title="February 8th, 2022"
                    >
                      {moment(blog?.created_at).format("MMMM DD, YYYY")}
                    </time>
                  </p>
                </header>
                <div className="pt-4">
                  <div class="ql-container ql-snow" style={{ border: "none" }}>
                    <div class="ql-editor">{parse(String(blog?.content))}</div>
                  </div>
                </div>
              </article>
            </div>
            <div className="w-100 mt-14 flex-initial lg:mt-0 lg:w-72">
              <h4 className="mb-5 font-bold">
                {content.blog_page_recomended_title}
              </h4>
              <div className="w-100 grid grid-cols-2 gap-4 lg:grid-cols-1">
                {recomendation.map((val, i) => {
                  return (
                    <Link key={i} href={`/blog/${val.blog.slug}`}>
                      <article className="mb-5 rounded-lg border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-6">
                          {val.blog.display_image ? (
                            <img
                              src={val.blog.display_image}
                              className="h-44 w-full rounded-md object-cover"
                            />
                          ) : (
                            <img
                              src="/assets/dummy-blog.png"
                              className="h-44 w-full rounded-md object-cover"
                            />
                          )}
                        </div>
                        <div className="mb-5 flex items-center justify-between text-gray-500">
                          <div className="flex gap-2">
                            {val.blog.blog_categories.map((val, i) => {
                              return (
                                <span
                                  key={i}
                                  className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                >
                                  {val.category.name}
                                </span>
                              );
                            })}
                          </div>
                          <span className="text-sm">
                            {moment(val.created_at).fromNow(true)} ago
                          </span>
                        </div>
                        <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                          <a href="#">{val.blog.title}</a>
                        </h2>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer language={language} />
    </>
  );
}
