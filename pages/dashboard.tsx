import { useEffect, useState } from "react"

import Style from "../styles/Dashboard.module.scss"



import React from "react";
import { useRouter } from "next/router";


type user = {
    name: string;
    snoovatar_img: string;
}


export default function Callback() {

    const router = useRouter()

    const [user, setUser] = useState({} as user)

    useEffect(() => {
        fetch("/api/getUser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            return res.json()
        }).then((data) => {
            // console.log(data)
            setUser(data)
        }
        );

        fetch("api/getSaved", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            return res.json()
        }).then((data) => {
            console.log(data)


        }).catch((err) => {
            console.log(err)
            router.push("/")

        }
        )

    }, [])


    const handleLogout = () => {
        fetch("/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        }).then((res) => {
            if (res.status === 200) {
                window.location.href = "/";
            }
        }
        );
    };


    return (
        <>
            {
                user ?
                    (
                        <div className={Style.container}>
                            <nav>
                                <h1 className={Style.logo}>
                                    Feedwise
                                </h1>
                                <div className={Style.right}>
                                    <div className={Style.userOptions}>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" ><path d="M5 6h14M5 12h14M5 18h14" /></svg>
                                        <h3>Menu</h3>
                                    </div>




                                    {/* <img src={user.snoovatar_img} alt={`${user.name}'s reddit avatar`} /> */}
                                </div>
                                {/* <div className={Style.menu}>
                                    <div className={Style.user}>
                                        <img src={user.snoovatar_img} />
                                        <h3>

                                            /u/{user.name}
                                        </h3>

                                    </div>
                                    <button onClick={handleLogout}>logout</button>
                                </div> */}


                            </nav>
                            <div className={Style.content}>
                                <div className={Style.post}></div>
                                <div className={`${Style.post} ${Style.post2}`}></div>
                                <div className={Style.post}></div>
                                <div className={Style.post}></div>
                            </div>


                        </div>) : (<div>loading</div>
                    )
            }

        </>
    )
}

