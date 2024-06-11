/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/:lang(en|zh)?", destination: "/" },
      { source: "/:lang(en|zh)?/cleaning", destination: "/cleaning" },
      {
        source: "/:lang(en|zh)?/cleaning/:slug",
        destination: "/cleaning/:slug",
      },
      { source: "/:lang(en|zh)?/business", destination: "/business" },
      {
        source: "/:lang(en|zh)?/business/cleaning/:slug",
        destination: "/business/cleaning/:slug",
      },
      { source: "/:lang(en|zh)?/login", destination: "/login" },
      { source: "/:lang(en|zh)?/register", destination: "/register" },
      { source: "/:lang(en|zh)?/profile", destination: "/profile" },
      { source: "/:lang(en|zh)?/addressbook", destination: "/addressbook" },
      { source: "/:lang(en|zh)?/terms-of-use", destination: "/terms-of-use" },
      {
        source: "/:lang(en|zh)?/privacy-policy",
        destination: "/privacy-policy",
      },
      { source: "/:lang(en|zh)?/about-us", destination: "/about-us" },
      {
        source: "/:lang(en|zh)?/calculator/:id",
        destination: "/calculator/:id",
      },
      { source: "/:lang(en|zh)?/checkout/:id", destination: "/checkout/:id" },
      { source: "/:lang(en|zh)?/blog", destination: "/blog" },
      { source: "/:lang(en|zh)?/blog/:slug", destination: "/blog/:slug" },
      { source: "/:lang(en|zh)?/match", destination: "/match" },
      { source: "/:lang(en|zh)?/calendar", destination: "/calendar" },
    ];
  },
  images: {
    domains: [
      "renospace-photo-storage.s3.ap-east-1.amazonaws.com",
      "api.renospace.hk",
      "api.staging.renospace.hk",
      "localhost",
    ],
  },
  async headers() {
    return [
      {
        source: "/public/assets/favicon.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
