import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <title>Raven Express</title>
        <meta name="description" content="The only express that you need." />
        <link
          rel="icon"
          type="image/svg+xml"
          href="https://test-for-aws-course-only.s3.ap-southeast-2.amazonaws.com/icons8-bird-48+(1).png"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
