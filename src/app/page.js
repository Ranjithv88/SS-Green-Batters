import Navbar from "@/components/Navbar"
import StockSummary from "@/components/StockSummary"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <Navbar/>
      <StockSummary name={"Dust"} style={"rgba(159, 226, 191, 1)"}/>
      <StockSummary name={"WaterSoluble"} style={"rgba(255, 191, 0, 1)"}/>
      <StockSummary name={"Bio"} style={"rgba(255, 127, 80, 1)"}/>
      <StockSummary name={"Micronutrients"} style={"rgba(222, 49, 99, 1)"}/>
      <StockSummary name={"LiquidFertilizers"} style={"rgba(159, 226, 191, 1)"}/>
      <StockSummary name={"Granules"} style={"rgba(64, 224, 208, 1)"}/>
      <StockSummary name={"Ratol"} style={"rgba(100, 149, 237, 1)"}/>
      <StockSummary name={"Atharv"} style={"rgba(204, 204, 255, 1)"}/>
      <StockSummary name={"Others"} style={"rgba(71, 147, 227, 1)"}/>
      <Footer/>
    </>
  )
}

