import Image from "next/image";
import variablestyles from "../styles/variables.module.scss";
import Styles from "./page.module.scss";
import Header from "@/components/Header";

function About() {
  return (
    <>
    <Header/>
    <div className={Styles.about}> about</div>
    </>
  )
}

export default About