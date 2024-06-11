/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Checkbox, Col, Row } from "antd";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Heading from "@/components/heading";
import { useRouter } from "next/router";
import BlogCard from "@/components/blogCard";
import Loader from "@/components/loader";
import { translation } from "@/utils/translation";

export default function Index() {
  const router = useRouter();
  const [language, setLanguage] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});

  const onChange = (checkedValues) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs?locale=${
          localStorage.getItem("language") || "zh"
        }&categories=${checkedValues.join(",")}`,
        {
          headers: {},
        }
      )
      .then((res) => {
        setLoading(false);
        setBlogs(res.data);
      });
  };

  useEffect(() => {
    router.push(`${localStorage.getItem("language") || "zh"}/blog`);
    setLanguage(localStorage.getItem("language") || "zh");

    setLoading(true);

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs?locale=${
          localStorage.getItem("language") || "zh"
        }`,
        {
          headers: {},
        }
      )
      .then((res) => {
        setLoading(false);
        setBlogs(res.data);
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

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/blog?locale=${
          localStorage.getItem("language") || "zh"
        }`,
        {
          headers: {},
        }
      )
      .then((res) => {
        let result = [];
        res.data.forEach((val) => {
          result.push({
            label: val.name,
            value: val.id,
          });
        });

        setCategories(result);
      });
  }, []);

  return (
    <>
      <Heading />
      <Navbar language={language} />
      <div className="mx-12 pt-2">
        <section className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-screen-xl px-0 py-8 lg:px-6 lg:py-16">
            <div className="mx-auto mb-8 max-w-screen-sm text-center lg:mb-16">
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl dark:text-white">
                {content.blog_page_title}
              </h2>
              <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
                {content.blog_page_title_child}
              </p>
            </div>
            <div className="mb-8 mt-4">
              <p className="sm:text-md mb-2 font-bold text-gray-700 dark:text-gray-400">
                Filter Categories
              </p>
              <Checkbox.Group
                options={categories}
                defaultValue={["food"]}
                onChange={onChange}
              />
            </div>
            {loading ? (
              <div className="text-center">
                <Loader isLoading={false} />
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-3">
                {blogs.map((val, i) => {
                  return (
                    <Link key={i} href={`${language}/blog/${val.slug}`}>
                      <BlogCard content={val} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer language={language} />
    </>
  );
}
