import { useEffect, useMemo, useState } from "react";

import Style from "../styles/Dashboard.module.scss";

import React from "react";
import { useRouter } from "next/router";
// import Navbar from "../components/Navbar/Navbar";

import Modal from "react-modal";

import { Tooltip } from "react-tooltip";

import "react-tooltip/dist/react-tooltip.css";

import { doc, setDoc, Timestamp, getDocs } from "firebase/firestore";
import { collection } from "firebase/firestore";

import { db } from "../Firebase.js";

import AllPosts from "../components/AllPosts/AllPosts";
import FilterBySub from "../components/FilterBySub/FilterBySub";
import Loading from "../components/UI/Loading/Loading";

type user = {
	name: string;
	snoovatar_img: string;
	id: string;
};

Modal.setAppElement("#modal");

export default function Callback() {
	const router = useRouter();

	const [user, setUser] = useState({} as user);
	const [saved, setSaved] = useState([] as any);

	const [loading, setLoading] = useState(true);

	const [modalIsOpen, setModalIsOpen] = useState(false);

	const [filter, setFilter] = useState("all");

	const [filterShareURL, setFilterShareURL] = useState(false);

	const [copySuccess, setCopySuccess] = useState("");

	const [refetch, setRefetch] = useState(false);

	const [isFetching, setIsFetching] = useState(false);

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	function openModal() {
		setModalIsOpen(true);
	}

	function closeModal() {
		setModalIsOpen(false);
		setFilterShareURL(false);
	}

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
			})
			.catch((err) => {
				console.log(err);
			});

		getSavedFromReddit(""); //TODO: add after
	}, []);

	// useEffect(() => {
	// 	if (!user.name) return;
	// 	checkUserSaves();
	// }, [user]);

	// useEffect(() => {
	// 	console.log("savedd", saved);
	// }, [saved]);

	// open sidebar when window size is > 500px

	useEffect(() => {
		if (window.innerWidth > 768) {
			setIsSidebarOpen(true);
		}
	}, []);

	const getSubPosts = (sub: string) => {
		return saved.filter((post: any) => post.data.subreddit === sub);
	};

	async function getSavedFromReddit(after: string) {
		// setIsFetching(true);
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
				setSaved((prev: any) => [...prev, ...data.data.children]);

				setLoading(false);

				if (data.data.after) {
					console.log(data.data.after);
					getSavedFromReddit(data.data.after);
					setIsFetching(true);
				}else{
					setIsFetching(false);
				}
			})
			.catch((err) => {
				console.log(err);
				router.push("/");
			});
	}

	// lazy load saved posts

	const handleShare = () => {
		openModal();

		// const newId = nanoid();
		const filtered = getFilteredPosts();

		if (filtered.length === 1) {
			console.log("filtered", filtered.length);
		} else {
			console.log("Saving to firebase");
			saveToFirebase();
		}
	};

	const getFilteredPosts = () => {
		return filter === "all"
			? saved
			: filter === "nsfw"
				? getNsfwPosts()
				: getSubPosts(filter);
	};

	const saveToFirebase = async () => {
		console.log("filtered", getFilteredPosts());

		const filtered = getFilteredPosts();
		const querySnapshot = await getDocs(
			collection(db, "users", user.id, filter)
		);

		if (querySnapshot.size === 0) {
			console.log("Creating new share");
			createShare(filtered);
		} else {
			console.log("Updating share");
			setFilterShareURL(true);
			setRefetch(true);
		}

		// createShare(filtered, newId);
	};

	const createShare = async (filtered: any[]) => {
		filtered.forEach(async (post: any) => {
			const docRef = doc(db, "users", user.id, filter, post.data.id);
			await setDoc(docRef, {
				...post,
				created_at: Timestamp.fromDate(new Date()),
			});

			console.log("Document written with ID: ", docRef.id);
		});

		// const currentFilter =
		// filter === "all" ? "all" : filter === "nsfw" ? "nsfw" : filter;

		await setDoc(
			doc(db, "users", user.id),
			{
				last_updated: Timestamp.fromDate(new Date()),
				username: user.name,
			},
			{
				merge: true,
			}
		);

		setFilterShareURL(true);
		setRefetch(false);
	};

	const getSubreddits = () => {
		const subreddits = saved.map((post: any) => {
			return post.data.subreddit;
		});

		const uniqueSubreddits = [...new Set(subreddits)];

		const subredditsWithCount = uniqueSubreddits.map((subreddit: any) => {
			return {
				subreddit,
				count: subreddits.filter((sub: any) => sub === subreddit).length,
			};
		});

		// sort by count

		subredditsWithCount.sort((a: any, b: any) => {
			return b.count - a.count;
		});

		return subredditsWithCount;
	};

	const getNsfwPosts = () => {
		const nsfwPosts = saved.filter((post: any) => {
			return post.data.over_18;
		});

		return nsfwPosts;
	};

	const CopyToClipboard = () => {
		// const [copied, setCopied] = useState(false);

		if (getFilteredPosts().length === 1) {
			navigator.clipboard.writeText(
				"https://www.reddit.com" + getFilteredPosts()[0].data.permalink
			);
		} else {
			navigator.clipboard.writeText(
				`${process.env.NEXT_PUBLIC_PROD_URL}saves/${user.id}/${filter}`
			);
		}

		setCopySuccess("Copied!");

		setTimeout(() => {
			setCopySuccess("");
		}, 2000);

		// setCopied(true);
	};

	const handleRefetch = () => {
		setFilterShareURL(false);
		createShare(getFilteredPosts());
		// setRefetch(false);
	};

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


	const handleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	}

	return (
		<>
			{user ? (
				<div className={Style.container}>
					{/* <Navbar user={user} handleShare={handleShare} filter={filter} /> */}

					<Modal
						isOpen={modalIsOpen}
						onRequestClose={closeModal}
						style={{
							overlay: {
								backgroundColor: "rgba(0, 0, 0, 0.661)",
							},
						}}
						className={Style.modal}
					>
						<div className={Style.modalContent}>
							<div className={Style.header}>
								{/* <h2>Sharing {filter} posts</h2> */}
								<h2>Share</h2>
								<div></div>
								<button onClick={closeModal} className={Style.closeBtn}>
									Close
								</button>
							</div>
							<div className={Style.infoTop}>
								<div className={Style.preview}>
									{refetch && (
										<button
											onClick={handleRefetch}
											className={Style.refetch}
											id="refetch-button"
											data-tooltip-content="
								refetch my saves from reddit
								"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="M22 12c0 6-4.39 10-9.806 10C7.792 22 4.24 19.665 3 16" />
												<path d="M2 12C2 6 6.39 2 11.806 2 16.209 2 19.76 4.335 21 8" />
												<path d="M7 17l-4-1-1 4" />
												<path d="M17 7l4 1 1-4" />
											</svg>
											<span className={Style.refetchDesc}>Refetch</span>
										</button>
									)}

									<div className={Style.currentLink}>
										<div className={Style.link}>
											{filterShareURL
												? `www.feedwise.vercel.app/saves/${user.id}/${filter}`
												: getFilteredPosts().length === 1
													? "https://www.reddit.com" +
													getFilteredPosts()[0].data.permalink
													: "Loading..."}
										</div>
										<button
											onClick={CopyToClipboard}
											style={{
												backgroundColor: copySuccess && "rgb(4, 235, 4)",
												color: copySuccess && "black",
											}}
											id="copy-button"
											data-tooltip-content="Copy link to clipboard"
										>
											{copySuccess ? copySuccess : "Copy"}
										</button>
										<Tooltip
											anchorId="copy-button"
											content="hello world"
											place="top"
										/>
									</div>
								</div>
								<Tooltip
									anchorId="refetch-button"
									content="hello world"
									place="top"
								/>
								<span
									style={{
										color: "#a2a1a1",
									}}
								>
									To share posts from a particular subreddit, select that
									subreddit from the sidebar. If you select &apos;All,&apos; all
									posts will be shared.
								</span>
							</div>
						</div>
					</Modal>

					<FilterBySub
						getSubreddits={getSubreddits}
						filter={filter}
						setFilter={setFilter}
						getNsfwPosts={getNsfwPosts}
						saved={saved}
						user={user}
						handleLogout={handleLogout}
						isSidebarOpen={isSidebarOpen}
						setisSidebarOpen={setIsSidebarOpen}
					/>

					<div className={Style.sidebarHead}>
						<button onClick={handleSidebar}>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="28"
								height="28"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M5 6h14M5 12h14M5 18h14" />
							</svg>
						</button>
						<h1 className={Style.logo}>FEEDWISE</h1>
					</div>
					<div className={Style.content} style={{
						pointerEvents: isSidebarOpen && window.innerWidth < 769 ? "none" : "auto"
					}}>
						<div className={Style.mainDash}>
							<div className={Style.postsWrapper}>
								<div className={Style.head}>
									<span className={Style.title}>{filter} saves</span>
									<div className={Style.right}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
											className={isFetching ? Style.rotate : Style.rotateOff}
										>
											<path d="M22 12c0 6-4.39 10-9.806 10C7.792 22 4.24 19.665 3 16" />
											<path d="M2 12C2 6 6.39 2 11.806 2 16.209 2 19.76 4.335 21 8" />
											<path d="M7 17l-4-1-1 4" />
											<path d="M17 7l4 1 1-4" />
										</svg>
										{user && (
											isFetching ? "Fetching..." : <button onClick={handleShare} className={Style.shareBtn}>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<circle cx="18" cy="5" r="3" />
													<circle cx="18" cy="19" r="3" />
													<circle cx="6" cy="12" r="3" />
													<path d="M15.408 6.512l-6.814 3.975m6.814 7.001l-6.814-3.975" />
												</svg>


												<div>
													Share{" "}
													{filter === "all"
														? "All"
														: filter === "nsfw"
															? "nsfw"
															: `r/${filter}`}{" "}
													Posts
												</div>

											</button>
										)}
									</div>
								</div>
								<AllPosts saved={getFilteredPosts()} loading={loading} columns={
									isSidebarOpen ? 2 : 3
								}
									filter={filter}
								/>
								{/* <div className={Style.load}>
									<button>Load more</button>
								</div> */}
							</div>
						</div>
					</div>
				</div>
			) : (
				<Loading />
			)}
		</>
	);
}
