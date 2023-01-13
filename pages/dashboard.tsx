import { useEffect, useMemo, useState } from "react";

import Style from "../styles/Dashboard.module.scss";

import React from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar/Navbar";

import Modal from "react-modal";

import { doc, setDoc, Timestamp, getDoc, arrayUnion } from "firebase/firestore";
import { collection } from "firebase/firestore";

import { db } from "../Firebase.js";
import { nanoid } from "nanoid";

import AllPosts from "../components/AllPosts/AllPosts";
import FilterBySub from "../components/FilterBySub/FilterBySub";

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

	const [filter, setFilter] = useState("all");

	const [filterShareID, setFilterShareID] = useState("");

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

	// useEffect(() => {
	// 	if (!user.name) return;
	// 	checkUserSaves();
	// }, [user]);

	// useEffect(() => {
	// 	console.log("savedd", saved);
	// }, [saved]);

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

		saveToFirebase(newId);
	};

	// async function checkUserSaves() {
	// 	// const docRef = doc(db, "saved-nsfw", user.name);
	// 	// const docSnap = await getDoc(docRef);

	// 	console.log("checking user saves", user.name);

	// 	// check if user document in saved/username exists

	// 	const docRef = doc(db, "saved", user.name);

	// 	const docSnap = await getDoc(docRef);

	// 	if (docSnap.exists()) {
	// 		console.log("Document data:", docSnap.data());
	// 	} else {
	// 		console.log("No such document!");
	// 	}
	// }

	const getFilteredPosts = () => {
		return filter === "all"
			? saved
			: filter === "nsfw"
			? getNsfwPosts()
			: getSubPosts(filter);
	};

	const saveToFirebase = async (newId: string) => {
		// const collectionRef = collection(db, "saved-nsfw", `${user.name}`, id);

		console.log("filtered", getFilteredPosts());

		const filtered = getFilteredPosts();

		// check if user has already saved current filtered posts
		await getDoc(doc(db, "saved", user.name)).then((docSnap) => {
			if (docSnap.exists()) {
				// console.log("Document data:", docSnap.data().saved);

				const savedFilters = docSnap.data().saved;

				const filterExists = savedFilters.find(
					(obj: { filter: string }) => obj.filter === filter
				);

				if (filterExists) {
					console.log("filter exists", filterExists);

					setFilterShareID(filterExists.id);
				} else {
					setFilterShareID("CREATE NEW");
				}
			} else {
				console.log("No such document!");
			}
		});

		// filtered.forEach(async (post: any) => {
		// 	const docRef = doc(db, "saved", user.name, newId, post.data.id);
		// 	await setDoc(docRef, {
		// 		...post.data,
		// 		created_at: Timestamp.fromDate(new Date()),
		// 	});

		// 	console.log("Document written with ID: ", docRef.id);
		// });

		// const currentFilter =
		// 	filter === "all" ? "all" : filter === "nsfw" ? "nsfw" : filter;

		// await setDoc(doc(db, "saved", user.name), {
		// 	created_at: Timestamp.fromDate(new Date()),
		// 	saved: arrayUnion({ id: newId, filter: currentFilter }),
		// },{
		// 	merge: true
		// });

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
								<div className={Style.preview}>
									<div className={Style.currentLink}>
										<div className={Style.link}>
											{`www.localhost:3000/saves/${
												filterShareID ? filterShareID : "..."
											}`}
										</div>
										<button>Copy</button>
									</div>
								</div>
								<span>
									To share posts from a particular subreddit, select that
									subreddit from the list. If you select 'All,' all posts will
									be shared.
									<p>
										If you select 'NSFW posts,' only posts marked as NSFW will
										be shared. These are posts that may contain explicit or
										inappropriate content.
									</p>
								</span>
							</div>
						</div>
					</Modal>

					<main className={Style.dash}>
						<div className={Style.content}>
							<div className={Style.mainDash}>
								<div className={Style.postsWrapper}>
									<div className={Style.head}>
										<span className={Style.title}>{filter} saves</span>
										{/* <button>Share</button> */}
									</div>
									<AllPosts saved={getFilteredPosts()} loading={loading} />
								</div>

								<FilterBySub
									getSubreddits={getSubreddits}
									filter={filter}
									setFilter={setFilter}
									getNsfwPosts={getNsfwPosts}
									saved={saved}
								/>
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
