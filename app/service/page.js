import Image from "next/image";
import variablestyles from "../styles/variables.module.scss";
import Styles from "./page.module.scss";
import Header from "@/components/Header";

function Service() {
  return (
    <>
    <Header/>
    <div className={Styles.service}> Service</div>
    </>
  )
}

export default Service