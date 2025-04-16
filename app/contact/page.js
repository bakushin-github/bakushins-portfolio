import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <>
    <div>お問い合わせフォーム</div>
    <Link href="/contact/thanks">
      <button>送信</button></Link>
      </>
  )
}

export default page