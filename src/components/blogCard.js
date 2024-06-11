import React, { useState, useEffect } from "react";
import moment from "moment";

export default function BlogCard(props) {
  return (
    <>
      <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6">
          {props.content.display_image ? (
            <img
              src={props.content.display_image}
              className="h-56 w-full rounded-md object-cover"
            />
          ) : (
            <img
              src="/assets/dummy-blog.png"
              className="h-56 w-full rounded-md object-cover"
            />
          )}
        </div>
        <div className="mb-5 flex items-center justify-between text-gray-500">
          <div className="flex gap-2">
            {props.content.blog_categories.map((val, i) => {
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
            {moment(props.content.created_at).fromNow(true)} ago
          </span>
        </div>
        <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          <a href="#">{props.content.title}</a>
        </h2>
      </article>
    </>
  );
}
