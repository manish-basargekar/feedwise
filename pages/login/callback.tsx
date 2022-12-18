import { useEffect, useState } from "react"

export default function Callback() {




    useEffect(() => {
        // get the url params from the callback named code
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        // send the code to the backend

        // if no code is found, redirect to the home page
        if (!code) {
            window.location.href = '/';
        }

        console.log(code)

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        })
            .then(res => res.json())
            .then(data => {
                // save the token to local storage
                // localStorage.setItem('token', data.token);
                localStorage.setItem('token', data.access_token)
                localStorage.setItem('name', data.name)
                console.log(data.name)
                // redirect to the dashboard
                window.location.href = '/dashboard';
            }
            )

            
    }, [])


    return (
        <div>
            <h1>Loading...</h1>
        </div>
    )
}
