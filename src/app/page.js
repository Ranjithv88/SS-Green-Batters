import Navbar from "@/components/Navbar"
import StockSummary from "@/components/StockSummary"
import Footer from "@/components/Footer"
import StockSummarye from "@/components/testing"

export default function Home() {
  return (
    <>
      {/* <Navbar/> */}
      <StockSummary name={"Atharv"} api={"stock"}/>
      <StockSummarye name={"Atharv"} api={"stock"}/>
      {/* <Footer/> */}
    </>
  )
}

