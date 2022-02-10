import React from "react";
import Router from "next/router";
import { useSession } from "next-auth/react";


import Layout from "../lib/comps/Layout";


export default function Map() {

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      Router.push("/login");
    }
  });

  if (status === "loading") {
    console.log('inside MAP index')
    return <h1>Is Loading</h1>;
  }

  return (
    <Layout>
      <div style={{ marginTop: "5rem", marginLeft: "5rem", }}>
        <h1>This is a MAP PAge</h1>
        <button onClick={() => Router.back()}>GO BACK</button>
      </div>

    </Layout>
  );
}
