// import Image from "next/image";
// import styles from "./Figure.module.scss";
// import Link from "next/link";

// function Figure() {
//   return (
//     <>
//       <div className={styles.worksContents}>
//              <figure className={styles.figure}>
//               {post.featuredImage?.node ? (
//                 <Image 
//                   src={post.featuredImage.node.sourceUrl} 
//                   width={150} 
//                   height={150} 
//                   alt={post.featuredImage.node.altText || post.title} 
//                 />
//               ) : (
//                 <Image 
//                   src="/About/PC/Icon.webp" 
//                   width={150} 
//                   height={150} 
//                   alt="デフォルト画像" 
//                 />
//               )}
//               <figcaption className={styles.figcaption}>
//                 <h3 className={styles.title}>{post.title}</h3>
//                 <p className={styles.caption}>{post.excerpt.replace(/<[^>]*>?/gm, '').substring(0, 100)}...</p>
//                 <Link href={`/blog/${post.slug}`} className={styles.worksLink}></Link>
//               </figcaption>
//             </figure>
//       </div>
//     </>
//   );
// }

// export default Figure;
