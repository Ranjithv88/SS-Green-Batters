import Navbar from "@/components/Navbar"
import StockSummary from "@/components/StockSummary"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <Navbar/>
      <StockSummary name={"Atharv"} api={"stock"}/>
      <Footer/>
    </>
  )
}

