import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	collection,
	doc,
	DocumentData,
	getDoc,
	getDocs,
} from "firebase/firestore";
import { db } from "../../Firebase.js";
import AllPosts from "../../components/AllPosts/AllPosts";
import Style from "../../styles/SavesPage.module.scss"
import Link from "next/link";

export default function Saved() {
	const router = useRouter();

	const [posts, setPosts] = useState([]) as any;

	console.log(router.query.id);

	useEffect(() => {
		if (!router.query.id) return;

		console.log(router.query)

		getSaved(router.query.id[0], router.query.id[1]);

		// const user = router.query.id[0]
		// const id = router.query.id[1]
	}, [router]);

	const getSaved = async (user: string, id: string) => {
		const docRef = collection(db, "users", user, id);
		const docSnap = await getDocs(docRef);

		let allPosts: DocumentData[] = [];

		docSnap.forEach((doc) => {
			console.log(doc.id, " => ", doc.data());
			allPosts.push(doc.data());
		});

		allPosts.sort((a: any, b: any) => {
			return a.created_at - b.created_at;
		});

		setPosts(allPosts);
		console.log(allPosts.length);
	};

	return (
		<div className={Style.container}>
			<nav>
				<Link href="/">
					<h1>Feedwise</h1>
				</Link>
			</nav>
			<div className={Style.content}>
				{posts && <AllPosts saved={posts} loading={false} columns={1} />}
			</div>
		</div>
	);
}
