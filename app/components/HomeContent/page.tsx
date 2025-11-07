"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Roboto } from "next/font/google";
import Navbar from "../Navbar/page";
import ImageCard from "../SubComponents/HomeCard";
const roboto = Roboto({
  weight: ["400", "500"],
  subsets: ["latin"],
});


export default function HomeContent(){
      
  const Carditems = [
    {
      image: "/images/card/cardSample.jpg",
      description:
        "Patient Management: Keep all patient records organized and accessible, so you can provide personalized care without the clutter.",
    },
    {
      image: "/images/card/card1.jpg",
      description:
        "Prescription Tracking: Create, update, and manage prescriptions digitally, reducing errors and saving time.",
    },
    {
      image: "/images/card/card3.jpg",
      description:
        "Analytics & Reports: Gain insights into patient trends and treatment outcomes to make informed decisions faster.",
    },
  ];
    return <>
    <Navbar />
    

    <div className="md:h-screen flex flex-col pt-16 md:pt-0">
      
      <div className="md:flex-1 bg-white flex flex-col items-center justify-center">
        <h1 className="text-lg md:text-xl font-medium text-gray-700 text-center mb-1  pt-5 md:pt-0">
          Download now
        </h1> <br />
        <h1 className="text-2xl md:text-4xl text-[#5A9B5A] text-center font-semibold mb-2 -mt-5 ">
          Streamline Patient Care, Effortlessly
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pb-16 md:pb-0">
                  <button
                    className="flex items-center bg-black text-white rounded-lg px-3 py-2 hover:opacity-90 transition-all"
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    <img
                    src="/images/logo/appstore.png"
                     alt="App Store"
                    className="mr-2 w-6 h-auto" 
                    />
                    <div className="flex flex-col items-start leading-tight text-left">
                      <span className="text-[9px]">Download on the</span>
                      <span className="text-xs font-semibold">App Store</span>
                    </div>
                  </button>
        
                  <button
                    className={`flex items-center bg-black text-white rounded-lg px-3 py-2 hover:opacity-90 transition-all ${roboto.className}`}
                  >
                    <Image
                      src="/images/logo/playstore.png"
                      alt="Google Play"
                      width={30}
                      height={30}
                      className="mr-2"
                    />
                    <div className="flex flex-col items-start leading-tight text-left">
                      <span className="text-[9px]">Get it on</span>
                      <span className="text-xs font-medium">Google Play</span>
                    </div>
                  </button>
                </div>
      </div>
   
      <div className="md:flex-1 bg-green-700  flex flex-col items-center justify-center -mt-15 ">
        <h2 className="text-base md:text-2xl font-bold mb-3 mt-5">
         EXPLORE THE FEATURES OF INDIGORX
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-5">
           {Carditems.map((item,index)=>
           <ImageCard 
           key={index}
           image={item.image}
           description={item.description}
           />
          )}
                      
        </div>
        
      </div>
    </div>


    </>
}