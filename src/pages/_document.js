import { Html, Head, Main, NextScript } from "next/document";
import * as fbq from "../utils/fpixel";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>【優居 Renospace】- 家居、裝修後、除蟲、大掃除清潔服務</title>
        <meta
          name="description"
          content="提供專業家居及商業清潔服務，包括日常清潔、深層清潔、吉屋清潔、裝修後清潔、除甲醛、洗冷氣機，豐富經驗團隊受到全面的訓練及課程。【已完成過萬次家居清潔服務，約97%客人用後給予滿分好評】立即享受高質素及方便的清潔服務。"
        />

        <meta
          property="og:title"
          content="【優居 Renospace】- 家居、裝修後、除蟲、大掃除清潔服務"
        />
        <meta property="og:url" content="https://renospace.com.hk" />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="提供專業家居及商業清潔服務，包括日常清潔、深層清潔、吉屋清潔、裝修後清潔、除甲醛、洗冷氣機，豐富經驗團隊受到全面的訓練及課程。【已完成過萬次家居清潔服務，約97%客人用後給予滿分好評】立即享受高質素及方便的清潔服務。"
        />
        <meta
          property="og:image"
          content="https://renospace-photo-storage.s3.ap-east-1.amazonaws.com/icon.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="renospace.com.hk" />
        <meta property="twitter:url" content="https://renospace.com.hk" />
        <meta
          name="twitter:title"
          content="【優居 Renospace】- 家居、裝修後、除蟲、大掃除清潔服務"
        />
        <meta
          name="twitter:description"
          content="提供專業家居及商業清潔服務，包括日常清潔、深層清潔、吉屋清潔、裝修後清潔、除甲醛、洗冷氣機，豐富經驗團隊受到全面的訓練及課程。【已完成過萬次家居清潔服務，約97%客人用後給予滿分好評】立即享受高質素及方便的清潔服務。"
        />
        <meta
          name="twitter:image"
          content="https://renospace-photo-storage.s3.ap-east-1.amazonaws.com/icon.png"
        />

        <link src="/favicon.ico" rel="icon" />
        <link src="https://fonts.cdnfonts.com/css/campton" rel="stylesheet" />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${fbq.FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
