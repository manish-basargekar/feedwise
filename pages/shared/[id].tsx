import { useRouter } from "next/router";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase.js";

export default function Saved() {
	const router = useRouter();

	const { id } = router.query as { id: string };

	console.log(id);

	useEffect(() => {
		if (id) {
			getSaved(id);
		}
	}, [id]);

	const getSaved = async (id: string) => {
		const docRef = doc(db, "saved-nsfw", id);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log("Document data:", docSnap.data());
		} else {
			// doc.data() will be undefined in this case
			console.log("No such document!");
		}
	};

	return (
		<div>
			<h1>saved</h1>
		</div>
	);
}
