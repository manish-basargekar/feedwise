import { useEffect, useState } from "react";

import Style from "../styles/Dashboard.module.scss";

import React from "react";
import { useRouter } from "next/router";

type user = {
	name: string;
	snoovatar_img: string;
};

export default function Callback() {
	const router = useRouter();

	const [user, setUser] = useState({} as user);
	const [saved, setSaved] = useState([] as any[]);

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

		fetch("api/getSaved", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data.data);
				setSaved(data.data.children);
			})
			.catch((err) => {
				console.log(err);
				router.push("/");
			});
	}, []);

	const handleLogout = () => {
		fetch("/api/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		}).then((res) => {
			if (res.status === 200) {
				window.location.href = "/";
			}
		});
	};

	return (
		<>
			{user ? (
				<div className={Style.container}>
					<nav>
						<h1 className={Style.logo}>My Saved Posts</h1>
						<div className={Style.right}>
							<button className={Style.userOptions} onClick={handleLogout}>
								{/* <img src={user.snoovatar_img} alt={`${user.name}'s reddit avatar`} /> */}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="w-5 h-5"
								>
									<path
										fillRule="evenodd"
										d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
										clipRule="evenodd"
									/>
									<path
										fillRule="evenodd"
										d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
										clipRule="evenodd"
									/>
								</svg>

								<h3>Log out</h3>
							</button>
						</div>
						{/* <div className={Style.menu}>
                                    <div className={Style.user}>
                                        <img src={user.snoovatar_img} />
                                        <h3>

                                            /u/{user.name}
                                        </h3>

                                    </div>
                                    <button onClick={handleLogout}>logout</button>
                                </div> */}
					</nav>
					<div className={Style.content}>
						{saved.map((post: any) => {
							return (
								<div className={Style.post} key={post.data.id}>
									<div className={Style.postHeader}>
										<img
											src={post.data.url ? post.data.url : post.data.thumbnail}
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
										{/* {
											console.log(post.data.title)
										} */}
									</div>
									<div className={Style.postBody}>
										<p>{post.data.selftext}</p>
										<p>{post.data.body}</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			) : (
				<div>loading</div>
			)}
		</>
	);
}
