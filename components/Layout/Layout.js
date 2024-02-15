import Head from "next/head";
import React from "react";
import Header from "./Header";
const Layout = ({ children, color, borderBottom, hideHeader }) => {
  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="width-device-width, inital-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <Header />
    </React.Fragment>
  );
};
