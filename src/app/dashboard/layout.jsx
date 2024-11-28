import React from 'react'
import Header from '../components/Header'

export default function ProtectedLayout({children}) {
  return (
  <>
    <Header></Header>
    {children}
  </>
  )

}
