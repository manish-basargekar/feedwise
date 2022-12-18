import {deleteCookie} from "cookies-next"
// write a logout function that clears the cookie

import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    deleteCookie("access_token", {
        req,
        res,
        maxAge: 60 * 60,
        httpOnly: true,
    })
    deleteCookie("refresh_token", {
        req,
        res,
        maxAge: 60 * 60,
        httpOnly: true,
    })
    deleteCookie("name", {
        req,
        res,
        maxAge: 60 * 60,
        httpOnly: true,
    })

    
    res.status(200).json({message: "logged out"})
}