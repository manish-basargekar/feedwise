import { useEffect, useState } from "react"





import React from "react";


type user = {
    name: string;
    snoovatar_img: string;
}


export default function Callback() {



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
                (<div className="profile">
                    <h3>Welcome {user.name} </h3>
                    <img src={user.snoovatar_img} style={{ maxWidth: "200px" }} />
                    <button onClick={handleLogout}>logout</button>
                </div>) : (<div>loading</div>)
            }

        </>
    )
}

