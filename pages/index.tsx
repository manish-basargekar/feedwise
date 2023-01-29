import { useEffect, useState } from "react";
import Style from "../styles/Home.module.scss";
import Link from "next/link";
import LoginButton from "../components/UI/LoginButton/LoginButton";



export default function Home() {
	const [userExists, setUserExists] = useState(false);
	const [URI, setURI] = useState("");

	// check if user is logged in
	useEffect(() => {
		const getUserName = async () => {
			const res = await fetch("/api/getUser");
			const data = await res.json();
			// console.log(data);

			if (data.name) {
				setUserExists(true);
			} else {
				setUserExists(false);
			}
		};

		const env = process.env.NODE_ENV;

		if (env === "development") {
			setURI(process.env.NEXT_PUBLIC_DEV_URL as string);
		} else if (env === "production") {
			setURI(process.env.NEXT_PUBLIC_PROD_URL as string);
		}

		getUserName();
	}, []);

	function openLogin() {
		window.open(
			`https://www.reddit.com/api/v1/authorize?
							client_id=${process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID}&response_type=code
							&state=savedbySavedit
							&redirect_uri=${URI}callback
							&duration=permanent&scope=save,history,identity`,
			"_self"
		);
	}

	return (
		<div className={Style.container}>
			<nav>
				<Link href="/">
					<div className={Style.logo}>
						<img src="../feedwise.svg" alt="Feedwise logo" />
					</div>
				</Link>
				{userExists ? (
					<Link href="/dashboard">
						<button className={Style.gotodashboard}>Go to Dashboard</button>
					</Link>
				) : (
					<div className={Style.navLogin}>
						<LoginButton openLogin={openLogin} />
					</div>
				)}
			</nav>
			<main className={Style.main}>
				<h1 className={Style.title}>
					Organize & Share your Reddit saved posts.
				</h1>
				<p className={Style.description}>
					Feedwise is a simple dashboard to manage and share your saved posts
					from Reddit.
				</p>
				{userExists ? (
					<Link href="/dashboard">
						<button className={Style.gotodashboard}>Go to Dashboard</button>
					</Link>
				) : (
					<div className={Style.navLogin}>
						<LoginButton openLogin={openLogin} />
					</div>
				)}
			</main>
		</div>
	);
}
