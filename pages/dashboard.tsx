import { useEffect, useMemo, useState } from "react";

import Style from "../styles/Dashboard.module.scss";

import React from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar/Navbar";

import Modal from "react-modal";

import { doc, setDoc, Timestamp, getDocs } from "firebase/firestore";
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

	const [nsfw, setNsfw] = useState([] as any);

	const [id, setId] = useState("" as string);

	const [hasSaves, setHasSaves] = useState(false);

	const [dbSaved, setDbSaved] = useState([] as any);

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
		if (!user) return;
		checkUserSaves();
	}, [user]);

	useEffect(() => {
		console.log("savedd", saved);
	}, [saved]);

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

		const nsfw = saved.filter((post: any) => {
			return post.data.over_18;
		});

		console.log(nsfw);
		setNsfw(nsfw);

		const newId = nanoid();
		setId(newId);

		// Check if user has already saved posts

		if (dbSaved.length === 0) {
			console.log("saving to firebase");
			saveToFirebase(nsfw, newId);
		}
	};

	async function checkUserSaves() {
		// const docRef = doc(db, "saved-nsfw", user.name);
		// const docSnap = await getDoc(docRef);
		console.log("checking user saves", user.name);

		const collectionRef = collection(
			db,
			"saved-nsfw",
			`${user.name}`,
			"shared"
		);

		const querySnapshot = await getDocs(collectionRef);

		const dbDocs = [] as any;

		querySnapshot.forEach((doc) => {
			dbDocs.push(doc.data());
		});

		setDbSaved(dbDocs);
	}

	const saveToFirebase = async (nsfwPosts: any, newId: string) => {
		// const collectionRef = collection(db, "saved-nsfw", `${user.name}`, id);
		await setDoc(doc(db, `saved-nsfw`, `${user.name}`, "shared", newId), {
			nsfw: nsfwPosts,
			savedBy: user.name,
			createdAt: Timestamp.now(),
			tags: [],
			id: newId,
		});

		await setDoc(doc(db, `saved-nsfw`, `${user.name}`), {
			savedBy: user.name,
			createdAt: Timestamp.now(),
			tags: [],
		});
	};

	// make an array of all subreddits along with the number of posts saved from each subreddit

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

		return subredditsWithCount;
	};


	const getNsfwPosts = () => {
		const nsfwPosts = saved.filter((post: any) => {
			return post.data.over_18;
		});

		return nsfwPosts;
	}

	return (
		<>
			{user ? (
				<div className={Style.container}>
					<Navbar user={user} handleShare={handleShare} />

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
								<div className={Style.shared}>
									<div className={Style.head}>
										<span className={Style.title}>Recently Shared</span>
										<span>Show All</span>
									</div>

									{dbSaved.length > 0 ? (
										<div className={Style.items}>
											{/* {dbSaved.map((post: any) => ( */}
											<div className={Style.sharedItem}>
												<div className={Style.link}>
													www.localhost:3000/shared/{dbSaved[0].id}
												</div>
												<button>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="20"
														height="20"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path d="M15.5 4H18a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2.5" />
														<path d="M8.621 3.515A2 2 0 0 1 10.561 2h2.877a2 2 0 0 1 1.94 1.515L16 6H8l.621-2.485z" />
														<path d="M9 12h6" />
														<path d="M9 16h6" />
													</svg>
												</button>
											</div>
											{/* ))} */}
										</div>
									) : (
										<div className={Style.noshares}>
											You dont Have Any shares, create a new share by using
											generate button
										</div>
									)}
								</div>
								<div className={Style.head}>
									<span className={Style.title}>New Share</span>
								</div>
								<div className={Style.subs}>
									<div className={Style.tag}>ALL</div>
									<div className={Style.tag}>NSFW</div>
									{getSubreddits().map((sub: any) => {
										return (
											<div key={sub.subreddit} className={Style.tag}>
												r/{sub.subreddit} {sub.count}
											</div>
										);
									})}
								</div>
								<div className={Style.preview}>
									<div className={Style.currentLink}>
										<div className={Style.link}></div>
										<button>Generate Link</button>
									</div>
									<div className={Style.previewHover}>
										<div className={Style.previewTag}>PREVIEW</div>
									</div>
									<div className={Style.previewContent}>
										{/* <svg>
											<line x1="0" y1="100%" x2="100%" y2="0" />
											<line x1="0" y1="0" x2="100%" y2="100%" />
										</svg> */}
										{/* <button>PREVIEW</button> */}
										<AllPosts saved={saved} loading={loading} columns={2} />
									</div>
								</div>
							</div>
						</div>
					</Modal>

					<div className={Style.center}>
						<div className={Style.subs}>
							<div className={Style.tag}>All {saved.length}</div>
							<div className={Style.tag}>NSFW {getNsfwPosts().length} </div>
							{getSubreddits().map((sub: any) => {
								return (
									<div key={sub.subreddit} className={Style.tag}>
										r/{sub.subreddit} {sub.count}
									</div>
								);
							})}
						</div>
						<div className={Style.content}>
							<div className={Style.head}>
								<span className={Style.title}>All saves</span>
							</div>

							<AllPosts saved={saved} loading={loading} />
						</div>
					</div>
				</div>
			) : (
				<div>loading</div>
			)}
		</>
	);
}
