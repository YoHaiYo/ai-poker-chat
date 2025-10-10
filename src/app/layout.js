import Footer from "./component/Footer";
import Navbar from "./component/Navbar";
import "./globals.css";

export const metadata = {
  title: "AI Poker Chat",
  description: "AI 아바타와 함께하는 포커 게임",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* fontawesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        {/* font : pretendard */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="">
        {/* <Navbar /> */}
        <main className="">{children}</main>

        {/* <Footer /> */}
      </body>
    </html>
  );
}
