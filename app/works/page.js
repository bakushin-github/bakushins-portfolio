import Image from "next/image";
import variablestyles from "../styles/variables.module.scss";
import Styles from "./page.module.scss";
import Header from "@/components/Header";

function Works() {
  return (
    <>
    <Header/>
    <div className={Styles.works}> Works</div>
    </>
  )
}

export default Works