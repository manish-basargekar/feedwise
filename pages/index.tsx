

import Style from '../styles/Home.module.scss'
import { useSession, signIn, signOut } from "next-auth/react"


export default function Home() {

  const { data: session } = useSession()


  console.log(session)

  if (session) {
    return (
      <div className={Style.container}>
        Signed in as {session.user?.name}
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )

}
