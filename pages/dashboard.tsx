import { useEffect, useMemo, useState } from "react";

import Style from "../styles/Dashboard.module.scss";

import React from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar/Navbar";

type user = {
	name: string;
	snoovatar_img: string;
};

export default function Callback() {
	const router = useRouter();

	const [user, setUser] = useState({} as user);
	const [saved, setSaved] = useState([] as any);


	const[loading,setLoading] = useState(true)


	useEffect(() => {
		fetch("/api/getUser", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				// console.log(data)
				setUser(data);
			});


		getSaved("");
			
		

	}, []);


	useEffect(() => {
		console.log("savedd",saved);
	}, [saved]);

	async function getSaved(after: string) {
		await fetch(`api/getSaved?after=${after}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				// console.log(data.data.children);
				setSaved((prev: any) => [...prev, ...data.data.children]);

				if (data.data.after == null) {
					setLoading(false);
				}

				if (data.data.after) {
					console.log(data.data);
					getSaved(data.data.after);
					
				}
			})
			.catch((err) => {
				console.log(err);
				router.push("/");
			});

			
	}






	return (
		<>
			{user ? (
				<div className={Style.container}>
					<Navbar />

					<div className={Style.options}>
						<select name="" id="">
							<option value="">Filter by sub reddit</option>
						</select>
						<button>nsfw only</button>

						{/* <input type="text" placeholder="Search for posts" /> */}
						<button>Share</button>
					</div>
					<div className={Style.content}>
						{/* {saved ? (
							saved.map((post: any) => {
								return (
									<div className={Style.post} key={post.data.id}>
										{
											post.data.id
										}
										<div className={Style.postHeader}>
											<img
												src={
													post.data.url ? post.data.url : post.data.thumbnail
												}
											/>

											<div className={Style.postInfo}>
												<h3>
													{post.data.title
														? post.data.title
														: post.data.link_title}
												</h3>
												<h3>Posted by /u/{post.data.author}</h3>
												<h3>r/{post.data.subreddit}</h3>
												<a
													href={`http://www.reddit.com${post.data.permalink}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													Link
												</a>
											</div>
										</div>
										<div className={Style.postBody}>
											<p>{post.data.selftext}</p>
											<p>{post.data.body}</p>
										</div>
									</div>
								);
							})
						) : (
							<div>loading</div>
						)} */}

						{
							loading ? <div>loading</div> : JSON.stringify(saved)
						}
					</div>
				</div>
			) : (
				<div>loading</div>
			)}
		</>
	);
}
