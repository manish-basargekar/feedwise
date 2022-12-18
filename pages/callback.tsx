import { GetServerSideProps } from "next";
import axios from "axios";
import querystring from "querystring";
import { setCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function Callback({ user }: { user: any }) {


    const router = useRouter()

    useEffect(() => {
        if(user) {
            router.push('/dashboard')
        }
    }, [])


    return (
        <div>
            <h1>Loading...</h1>
        </div>
    )
}





const REDIRECT_URI = "http://localhost:3000/callback";
const RANDOM_STRING = "savedbySavedit";
const CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;

const getToken = async (body: {
    refresh_token?: string | boolean;
    code?: string;
    grant_type: string;
    redirect_uri?: string;
}) => {
    const data = await axios.post(
        "https://www.reddit.com/api/v1/access_token",
        querystring.stringify(body),
        {
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `${CLIENT_ID}:${CLIENT_SECRET}`
                ).toString("base64")}`,
                "content-type": "application/x-www-form-urlencoded",
            },
        }
    );
    return data.data;
};

export const getServerSideProps: GetServerSideProps = async ({ query, req, res }) => {
    const refresh_token = getCookie("refresh_token", { req, res });
    const access_token = getCookie("access_token", { req, res });

    if (refresh_token) {
        if (access_token) {
            const user = await getUser(access_token as string);
            return { props: { user } };
        } else {
            const token = await getToken({
                refresh_token: refresh_token,
                grant_type: "refresh_token",
            });
            setCookie("refresh_token", token.refresh_token, {
                req,
                res,
                maxAge: 60 * 60,
                httpOnly: true,
            });
            setCookie("access_token", token.access_token, {
                req,
                res,
                maxAge: 60 * 60 * 24,
                httpOnly: true,
            });
            const user = await getUser(token.access_token);
            setCookie('name', user.name, {
                req,
                res,
                maxAge: 60 * 60 * 24,
                httpOnly: true,
            })

            return { props: { user } };
        }
    } else if (query.code && query.state === RANDOM_STRING) {
        try {
            const token = await getToken({
                code: query.code as string,
                grant_type: "authorization_code",
                redirect_uri: REDIRECT_URI,
            });
            setCookie("refresh_token", token.refresh_token, {
                req,
                res,
                maxAge: 60 * 60,
                httpOnly: true,
            });
            setCookie("access_token", token.access_token, {
                req,
                res,
                maxAge: 60 * 60 * 24,
                httpOnly: true,
            });
            const user = await getUser(token.access_token);
            setCookie('name', user.name, {
                req,
                res,
                maxAge: 60 * 60 * 24,
                httpOnly: true,
            })
            return { props: { user } };
        } catch (e) {
            console.log(e);
            return { props: { user: null } };
        }
    } else {
        return { props: { user: null } };
    }
};

const getUser = async (access_token: string) => {
    const data = await axios.get("https://oauth.reddit.com/api/v1/me", {
        headers: {
            Authorization: `Bearer ${access_token}`,
            content_type: "application/json",
        },
    });

    return data.data;
};
