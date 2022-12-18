import { type } from 'os'
import { useEffect } from 'react'




export default function Dashboard() {


    const fetchSaved = async (token: string) => {
        const res = await fetch('https://oauth.reddit.com/user/NoRadish5302/saved', {
            headers: {
                'Authorization': `bearer ${token}`,


            }
        })

        const data = await res.json()
        console.log(data)


    }

    useEffect(() => {
        const token = localStorage.getItem('token') as string
        if (!token) {
            window.location.href = '/'
        }
        // console.log(token)
        fetchSaved(token)
    }, [])


    const handleLogout = () => {
        localStorage.removeItem('token')
        window.location.href = '/'
    }


    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Log out</button>
        </div>
    )
}