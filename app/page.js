"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./styles/_variables.module.scss";
import Fv from "@/components/SSG/Fv/Fv";
import Works from "@/components/SSG/Works/Works";
import About from "@/components/SSG/About/About";
import Service from "@/components/SSG/Service/Service";
import Flow from "@/components/SSG/Flow/Flow";
import Blogs from "@/components/SSG/Blogs/Blogs";
import Cta from "@/components/SSG/Cta/Cta";
import Footer from "@/components/SSG/Footer/Footer";
import Header from "@/components/SSG/Header/Header/Header";
import Header_after from "@/components/SSG/Header/Header_after/Header_after";
import Drawer_menu from "@/components/SSG/Drawer/Drawer_menu/Drawer_menu";
import ScrollToHash from "@/components/SSG/ScrollToHash";

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
      <ScrollToHash />
      {!showHeaderAfter && <Header toggleMenu={toggleMenu} />}
      {showHeaderAfter && <Header_after toggleMenu={toggleMenu} />}

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
    </>
  );
}
