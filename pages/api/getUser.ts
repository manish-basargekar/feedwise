// api route to fetch the user from reddit api


import { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'

const getUser = async (access_token: string) => {
    const data = await fetch("https://oauth.reddit.com/api/v1/me", {
        headers: {
            Authorization: `Bearer ${access_token}`,
            content_type: "application/json",
        },
    });

    return data.json();
};


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const access_token = getCookie("access_token", {
        req,
        res,
        maxAge: 60 * 60,
        httpOnly: true,
    }) as string
    const refresh_token = getCookie("refresh_token")

    const user = await getUser(access_token)

    console.log(user)

    if (!user) {
        res.status(401).json({ message: "unauthorized" })
    }

    else {

        res.status(200).json(user)
    }



}


