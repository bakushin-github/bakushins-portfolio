import Image from "next/image";
import variablestyles from "../styles/variables.module.scss";
import Styles from "./page.module.scss";
import Header from "@/components/Header";

function Flow() {
  return (
    <>
    <Header/>
    <div className={Styles.flow}> flow</div>
    </>
  )
}

export default Flow