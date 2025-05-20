'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ScrollToHashContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const id = hash.substring(1)
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 100) // 少し遅らせると安定する
      }
    }
  }, [pathname, searchParams])

  return null
}

export default function ScrollToHash() {
  return (
    <Suspense fallback={null}>
      <ScrollToHashContent />
    </Suspense>
  )
}