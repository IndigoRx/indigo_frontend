import Image from "next/image";
import Navbar from "./components/Navbar/page";
import { Roboto } from "next/font/google";
import HomeContent from "./components/HomeContent/page";


const roboto = Roboto({
  weight: ["400", "500"],
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeContent />
     
      
    </>
  );
}
