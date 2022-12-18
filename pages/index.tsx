

import { useEffect } from 'react'
import Style from '../styles/Home.module.css'


export default function Home() {

useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      window.location.href = '/dashboard'
    }
},[])



  function openLogin() {
    window.open(
      `https://www.reddit.com/api/v1/authorize?
							client_id=${process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID}&response_type=code
							&state=savedbySavedit
							&redirect_uri=http://localhost:3000/login/callback
							&duration=permanent&scope=save,history,identity`,
      "_self"
    )
  }


  return (
    <>
      <h1>Savedit</h1>
      <button onClick={openLogin}>login with Reddit</button>
    </>
  )
}


