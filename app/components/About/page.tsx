"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Roboto } from "next/font/google";
import Navbar from "../Navbar/page";




export default function About(){
      const [token, setToken] = useState("");
      const [username, setUsername] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
    setUsername(localStorage.getItem("username") || "");
  }, []);


 
    return <>
    <Navbar />
    <h1>This is About page</h1>
    <p>Email: {username}</p>
      <p>Token: {token}</p>

    



    </>
}