"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./styles/variables.module.scss";
import Fv from "@/components/Fv";
import Works from "@/components/Works";
import About from "@/components/About";
import Service from "@/components/Service";
import Flow from "@/components/Flow";
import Blogs from "@/components/Blogs";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Header_after from "@/components/Header_after";
import Drawer_menu from "@/components/Drawer_menu";

export default function Home() {
  const [showHeaderAfter, setShowHeaderAfter] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleMenu = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const worksSection = document.getElementById("works");
      if (worksSection) {
        const worksTop = worksSection.getBoundingClientRect().top;
        // Worksセクションが画面上部に来たときにHeader_afterを表示
        setShowHeaderAfter(worksTop <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {!showHeaderAfter && (
        <Header toggleMenu={toggleMenu} />
      )}
      {showHeaderAfter && (
        <Header_after toggleMenu={toggleMenu} />
      )}
      
      <Drawer_menu
        isOpen={isDrawerOpen}
        closeDrawer={closeDrawer}
        toggleMenu={toggleMenu}
      />
      
      <Fv />
      <div id="works">
        <Works />
      </div>
      <About />
      <Service />
      <Flow />
      <Blogs />
      <Cta />
      <Footer />
    </>
  );
}
