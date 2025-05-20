"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import NavBar from "@/components/Navbar";
import Loading from "@/components/Loading";
import NotFound from "@/components/404NotFound";
import StockSummary from "@/components/StockSummary";
import Footer from "@/components/Footer";

const UserInformation = () => {
  const { data: session, status } = useSession();
  const [loadingDone, setLoadingDone] = useState(false);

  useEffect(() => {
    if (status !== 'loading') 
      setLoadingDone(true)
  }, [status, session]);

  if (!loadingDone) {
    return <Loading />;
  }

  if (!session) {
    return <NotFound />;
  }

  return (
    <>
      <NavBar/>
      <StockSummary name={"Dust"} style={"rgba(159, 226, 191, 1)"}/>
      <StockSummary name={"WaterSoluble"} style={"rgba(255, 191, 0, 1)"}/>
      <StockSummary name={"Bio"} style={"rgba(255, 127, 80, 1)"}/>
      <StockSummary name={"Micronutrients"} style={"rgba(222, 49, 99, 1)"}/>
      <StockSummary name={"LiquidFertilizers"} style={"rgba(159, 226, 191, 1)"}/>
      <StockSummary name={"Granules"} style={"rgba(64, 224, 208, 1)"}/>
      <StockSummary name={"Ratol"} style={"rgba(100, 149, 237, 1)"}/>
      <StockSummary name={"Atharv"} style={"rgba(204, 204, 255, 1)"}/>
      <StockSummary name={"Others"} style={"rgba(0, 0, 128, 1)"}/>
      <Footer/>
    </>
  );
};

export default UserInformation;

