import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    name: string,
    access_token: string,
    refresh_token: string,
    expires_in: number,

}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const code = req.body.code
    // console.log(code)
    const encodedHeader = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString("base64")

    let response = await fetch(`https://www.reddit.com/api/v1/access_token`, {
        method: 'POST',
        body: `grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/login/callback`,
        headers: { authorization: `Basic ${encodedHeader}`, 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    let body = await response.json();

    response = await fetch(`https://oauth.reddit.com/api/v1/me`, {
        method: "GET",
        headers: { authorization: `bearer ${body.access_token}` }
    })
    let user = await response.json();
    console.log("body", body)

    const Data = {
        name: user.name,
        access_token: body.access_token,
        refresh_token: body.refresh_token,
        expires_in: body.expires_in,

    }

    

    console.log(Data)

    // send Data in http only cookie to client
    



    res.send(Data)

}


