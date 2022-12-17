import { useEffect, useState } from "react"

export default function Callback() {


    const [token, setToken] = useState('' as string)

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
                localStorage.setItem('token', data.token.access_token)
                console.log(data.token.access_token)
                // redirect to the home page
                window.location.href = '/';
            }
            )

            
    }, [])


    return (
        <div>
            <h1>Callback</h1>
        </div>
    )
}
