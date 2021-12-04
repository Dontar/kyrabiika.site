import React, { Fragment, useState } from 'react';
import Head from 'next/head'
import Header from './Header'



export interface LayoutProps {
  navLinks?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Layout(props: React.PropsWithChildren<LayoutProps>) {


  return (
    <Fragment>
      <Head>
        <title>Kyrabiika</title>
      </Head>

      <Header />

      {props.children}



    </Fragment>
  );
}
