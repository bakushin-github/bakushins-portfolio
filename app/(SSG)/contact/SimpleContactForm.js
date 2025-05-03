// // 新しいファイル: SimpleContactForm.js（完全にreCAPTCHAに依存しない）
// "use client";

// import { useState } from "react";
// import styles from "./page.module.scss";
// import Link from "next/link";

// export default function SimpleContactForm() {
//   const [formData, setFormData] = useState({
//     company: "",
//     name: "",
//     email: "",
//     inquiry: [],
//     detail: "",
//     privacy: false,
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitResult, setSubmitResult] = useState(null);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox" && name === "inquiry") {
//       setFormData((prev) => ({
//         ...prev,
//         inquiry: checked
//           ? [...prev.inquiry, value]
//           : prev.inquiry.filter((v) => v !== value),
//       }));
//     } else if (type === "checkbox") {
//       setFormData((prev) => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitResult(null);
//     console.log('フォーム送信開始', formData);

//     try {
//       // APIに送信するデータを構築
//       const submitData = {
//         name: formData.name,
//         email: formData.email,
//         company: formData.company,
//         detail: formData.detail,
//         inquiry: formData.inquiry,
//         // ダミートークン
//         token: "dummy_token_for_testing_12345"
//       };
      
//       console.log('送信データ:', submitData);

//       const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(submitData),
//       });

//       console.log('APIレスポンスステータス:', res.status);
      
//       // レスポンステキストを取得
//       const responseText = await res.text();
//       console.log('APIレスポンステキスト:', responseText);
      
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         console.error('JSONパースエラー:', e);
//         setSubmitResult({
//           success: false,
//           message: 'レスポンスの解析に失敗しました'
//         });
//         return;
//       }
      
//       if (data.success) {
//         setSubmitResult({
//           success: true,
//           message: '送信完了しました！'
//         });
//         // フォームリセット
//         setFormData({
//           company: "",
//           name: "",
//           email: "",
//           inquiry: [],
//           detail: "",
//           privacy: false,
//         });
//       } else {
//         setSubmitResult({
//           success: false,
//           message: data.message || '詳細不明のエラーが発生しました'
//         });
//       }
//     } catch (error) {
//       console.error("フォーム送信エラー:", error);
//       setSubmitResult({
//         success: false,
//         message: `エラーが発生しました: ${error.message}`
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form className={styles.contact__form} onSubmit={handleSubmit}>
//       <div className={styles.form__contentWrap}>
//         {/* 結果メッセージ表示 */}
//         {submitResult && (
//           <div style={{ 
//             margin: '10px 0', 
//             padding: '10px', 
//             backgroundColor: submitResult.success ? '#e8f5e9' : '#ffebee',
//             borderRadius: '4px',
//             fontSize: '14px'
//           }}>
//             <p>{submitResult.message}</p>
//           </div>
//         )}

//         <div className={styles.form__content}>
//           <label className={styles.labelName} htmlFor="company">
//             会社名
//           </label>
//           <input
//             className={styles.contact__personalInformation}
//             type="text"
//             id="company"
//             name="company"
//             placeholder="会社名"
//             value={formData.company}
//             onChange={handleChange}
//           />
//         </div>

//         <div className={styles.form__content}>
//           <label className={styles.labelName} htmlFor="name">
//             お名前<span className={styles.required}>必須</span>
//           </label>
//           <input
//             className={styles.contact__personalInformation}
//             type="text"
//             id="name"
//             name="name"
//             placeholder="お名前"
//             required
//             value={formData.name}
//             onChange={handleChange}
//           />
//         </div>

//         <div className={styles.form__content}>
//           <label className={styles.labelName} htmlFor="email">
//             メールアドレス<span className={styles.required}>必須</span>
//           </label>
//           <input
//             className={styles.contact__personalInformation}
//             type="email"
//             id="email"
//             name="email"
//             placeholder="Email@address"
//             required
//             value={formData.email}
//             onChange={handleChange}
//           />
//         </div>

//         <div className={styles.form__content}>
//           <label className={styles.labelName} htmlFor="inquiry">
//             お問い合わせ内容<span className={styles.required}>必須</span>
//           </label>

//           <div className={styles.checkboxWrap}>
//             {["ホームページ制作", "ホームページ修正", "ECサイト制作・修正", "その他"].map((label) => (
//               <label key={label} className={styles.checkbox}>
//                 <input
//                   className={styles.contact__checkbox}
//                   type="checkbox"
//                   name="inquiry"
//                   value={label}
//                   checked={formData.inquiry.includes(label)}
//                   onChange={handleChange}
//                 />
//                 <span className={styles.custom__checkbox}></span>
//                 {label}
//               </label>
//             ))}
//           </div>

//           <textarea
//             id="detail"
//             name="detail"
//             placeholder="お問い合わせ内容の詳細をご記入ください"
//             className={styles.contact__textarea}
//             value={formData.detail}
//             onChange={handleChange}
//           />
//         </div>

//         <div className={styles.form__pp}>
//           <label className={styles.form__ppLabel}>
//             <input
//               className={styles.contact__checkbox}
//               type="checkbox"
//               id="privacy"
//               name="privacy"
//               checked={formData.privacy}
//               onChange={handleChange}
//               required
//             />
//             <span className={styles.custom__pp}></span>{" "}
//             <Link className={styles.contact__pp} href="/privacy_policy">
//               プライバシーポリシーに同意する
//             </Link>
//           </label>
//         </div>

//         {/* テストモード表示 */}
//         <div style={{ 
//           margin: '10px 0', 
//           padding: '5px', 
//           backgroundColor: '#fff3e0',
//           borderRadius: '4px',
//           fontSize: '14px'
//         }}>
//           <p>テストモード: ダミーreCAPTCHAでフォーム送信します</p>
//         </div>

//         <div className={styles.contact__click}>
//           <button 
//             type="submit" 
//             disabled={isSubmitting || !formData.privacy}
//           >
//             {isSubmitting ? "送信中..." : "送信する →"}
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// }