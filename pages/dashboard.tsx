import { useEffect, useMemo, useState } from "react";

import Style from "../styles/Dashboard.module.scss";

import React from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar/Navbar";

import Modal from "react-modal";

import { doc, setDoc, Timestamp, getDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";

import { db } from "../firebase";
import { nanoid } from "nanoid";

import AllPosts from "../components/AllPosts/AllPosts";

type user = {
	name: string;
	snoovatar_img: string;
};

Modal.setAppElement("#modal");

export default function Callback() {
	const router = useRouter();

	const [user, setUser] = useState({} as user);
	const [saved, setSaved] = useState([] as any);

	const [loading, setLoading] = useState(true);

	const [modalIsOpen, setModalIsOpen] = useState(false);

	const [dbSaved, setDbSaved] = useState([] as any);

	const [filter, setFilter] = useState("all");

	function openModal() {
		setModalIsOpen(true);
	}

	function closeModal() {
		setModalIsOpen(false);
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
			});

		getSavedFromReddit(""); //TODO: add after
	}, []);

	useEffect(() => {
		if (!user.name) return;
		checkUserSaves();
	}, [user]);

	useEffect(() => {
		console.log("savedd", saved);
	}, [saved]);

	useEffect(() => {
		console.log("filter", filter);

		// if (filter === "all") {
		// 	setFilterList(saved);
		// 	return;
		// }

		// if (filter === "nsfw") {
		// 	setFilterList(saved.filter((post: any) => post.data.over_18 === true));
		// 	return;
		// }
	}, [filter]);

	const getSubPosts = (sub: string) => {
		return saved.filter((post: any) => post.data.subreddit === sub);
	};

	async function getSavedFromReddit(after: string) {
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

				// if (data.data.after == null) {
				setLoading(false);
				// }

				// if (data.data.after) {
				// 	console.log(data.data.after);
				// 	getSavedFromReddit(data.data.after);

				// }
			})
			.catch((err) => {
				console.log(err);
				router.push("/");
			});
	}

	// lazy load saved posts

	const handleShare = () => {
		openModal();

		// setNsfw(nsfw);

		const newId = nanoid();
		// setId(newId);

		// Check if user has already saved posts

		console.log("saving to firebase");
		if (!loading && !dbSaved) {
			saveToFirebase(newId);
			console.log(saved);
		}
	};

	async function checkUserSaves() {
		// const docRef = doc(db, "saved-nsfw", user.name);
		// const docSnap = await getDoc(docRef);

		console.log("checking user saves", user.name);

		// check if user document in saved/username exists

		const docRef = doc(db, "saved", user.name);

		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log("Document data:", docSnap.data());
			setDbSaved(docSnap.data());
		} else {
			console.log("No such document!");
		}
	}

	const saveToFirebase = async (newId: string) => {
		// const collectionRef = collection(db, "saved-nsfw", `${user.name}`, id);
		saved.forEach(async (post: any) => {
			const docRef = doc(db, "saved", user.name, newId, post.data.id);
			await setDoc(docRef, {
				...post.data,
				created_at: Timestamp.fromDate(new Date()),
			});

			console.log("Document written with ID: ", docRef.id);
		});

		await setDoc(doc(db, "saved", user.name), {
			created_at: Timestamp.fromDate(new Date()),
			id: newId,
		});

		//
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

	const handleSavedRefresh = () => {
		setLoading(true);
		const newId = nanoid();
		saveToFirebase(newId);
	};

	return (
		<>
			{user ? (
				<div className={Style.container}>
					<Navbar user={user} handleShare={handleShare} filter={filter} />

					<Modal
						isOpen={modalIsOpen}
						onRequestClose={closeModal}
						style={{
							overlay: {
								backgroundColor: "rgba(0, 0, 0, 0.661)",
							},
							content: {
								backgroundColor: "rgb(24, 24, 24)",
								color: "#e0e0e0",
								border: "none",
								width: "40rem",
								height: "20rem",
								margin: "auto",
								borderRadius: "15px",
								padding: "0",
								animation: "slideIn 0.5s ease-in-out",
							},
						}}
					>
						<div className={Style.modalContent}>
							<div className={Style.header}>
								<h2>Share</h2>
								<div></div>
								<button onClick={closeModal} className={Style.closeBtn}>
									Close
								</button>
							</div>
							<div className={Style.infoTop}>
								{/* <div className={Style.head}>
									<span className={Style.title}>New Share</span>
									<button onClick={handleSavedRefresh}>refresh</button>
								</div> */}

								<div className={Style.preview}>
									<div className={Style.currentLink}>
										<div className={Style.link}>
											{`www.localhost:3000/shared/${dbSaved ? dbSaved.id : ""}`}
										</div>
										<button>Copy Link</button>
									</div>
								</div>
							</div>
						</div>
					</Modal>

					<main className={Style.dash}>
						<div className={Style.center}>
							<div className={Style.content}>
								<div className={Style.mainDash}>
									<div className={Style.postsWrapper}>
										<div className={Style.head}>
											<span className={Style.title}>{filter} saves</span>
											{/* <button>Share</button> */}
										</div>
										<AllPosts
											saved={
												filter === "all"
													? saved
													: filter === "nsfw"
													? getNsfwPosts()
													: getSubPosts(filter)
											}
											loading={loading}
										/>
									</div>

									<div className={Style.filterSave}>
										<div className={Style.subs}>
											<div
												className={Style.tag}
												style={{
													backgroundColor: filter === "all" ? "#ff006e" : "",
													color: filter === "all" ? "#000000" : "",
												}}
												onClick={() => setFilter("all")}
											>
												All
												<div className={Style.num}>{saved.length}</div>
											</div>
											<div
												className={Style.tag}
												style={{
													backgroundColor: filter === "nsfw" ? "#ff006e" : "",
													color: filter === "nsfw" ? "#000000" : "",
												}}
												onClick={() => setFilter("nsfw")}
											>
												NSFW
												<div className={Style.num}>
													{getNsfwPosts().length}{" "}
												</div>
											</div>
											{getSubreddits().map((sub: any) => {
												return (
													<div
														key={sub.subreddit}
														className={Style.tag}
														style={{
															backgroundColor:
																filter === sub.subreddit ? "#ff006e" : "",
															color: filter === sub.subreddit ? "#000000" : "",
														}}
														onClick={() => setFilter(sub.subreddit)}
													>
														r/{sub.subreddit}
														<div className={Style.num}>{sub.count}</div>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</div>
						</div>
					</main>
				</div>
			) : (
				<div>loading</div>
			)}
		</>
	);
}
