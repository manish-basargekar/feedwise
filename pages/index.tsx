import { useEffect, useState } from "react";
import Style from "../styles/Home.module.scss";
import Link from "next/link";
import LoginButton from "../components/UI/LoginButton/LoginButton";
import Image from "next/image";



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
					<div className={`${Style.navLogin} ${Style["cta-login"]}`}>
						<LoginButton openLogin={openLogin} />
					</div>
				)}
			</main>
			<div className={Style.screenshot}>
				<img src="https://res.cloudinary.com/dcs9uuu5m/image/upload/q_50/v1675062323/Frame_20_fu3ufq.jpg" />
			</div>

			<div className={Style.features}>
				<div className={Style.featureContainer}>

					<div className={Style.feature}>
						<img src="https://res.cloudinary.com/dcs9uuu5m/image/upload/c_scale,h_529,q_30/v1675508429/Filter_by_subreddit_rkxmir.png" alt="Filter by subreddit" />
					</div>
					<div className={Style.content}>
						<h3>Filter by Subreddit</h3>
						<p>Filter your saved posts by subreddit.</p>
					</div>
				</div>
				<div className={Style.featureContainer}>

					<div className={Style.feature}>
						<img src="https://res.cloudinary.com/dcs9uuu5m/image/upload/c_scale,h_529,q_42/v1675508429/masonry-layout_b2q2wr.png" alt="Masonry layout" />
					</div>
					<div className={Style.content}>
						<h3>Masonry layout</h3>
						<p>
							All your saved posts in a masonry layout.
						</p>
					</div>
				</div>
				<div className={Style.featureContainer}>
					<div className={Style.feature}>
						<img src="https://res.cloudinary.com/dcs9uuu5m/image/upload/c_scale,h_529,q_46/v1675508429/Share_all_post_by_subreddit_aleejt.png" alt="Share All posts with a single link" />
					</div>
					<div className={Style.content}>
						<h3>Share All posts with a single link</h3>
						{/* <p>
							Share all your saved posts with a single link.
						</p> */}
					</div>

				</div>
				<div className={Style.feature}></div>
			</div>

			<div className={Style.tagline}>

				<h3>A Dashboard  just for saved posts</h3>
				<div className={Style.desc}>
					<p>
						Feedwise is a simple dashboard to manage and share your saved posts from Reddit.
						You can filter your saved posts by subreddit, organize them in a masonry layout and share all your saved posts with a single link.
					</p>

				</div>
				<LoginButton openLogin={openLogin} />
			</div>
			<footer>
				<div className="left">
					© 2023 Feedwise
				</div>
				<div className="right">
					Made by <a href="https://mnsh.me"
						target="_blank" rel="noopener noreferrer"
					>Manish</a>
				</div>

			</footer>
		</div>
	);
}
