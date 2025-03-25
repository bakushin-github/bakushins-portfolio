import Image from "next/image";
import variablestyles from "../styles/variables.module.scss";
import Styles from "./page.module.scss";
import Header from "@/components/Header";

function Blog() {
  return (
    <>
    <Header/>
    <div className={Styles.blog}> blog</div>
    </>
  )
}

export default Blog