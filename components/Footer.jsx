import { useContext, useState } from "react"
import Link from "next/link"

import authContext from "../context/AuthContext"

const Footer = () => {
  const { user } = useContext(authContext)

  return (
    <footer className="py-4">
      {
        user &&
        <h6 className="user-info">
          <Link href="/cuenta"><a>Iniciaste como {user.email}</a></Link>
        </h6>
      }
      <h6 className="m-0">Tutor universitario - copyright 2021</h6>
    </footer>
  )
}

export default Footer