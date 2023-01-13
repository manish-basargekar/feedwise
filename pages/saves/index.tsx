import { useRouter } from "next/router";

export default function Saved() {

	const router = useRouter()

	// get the id from the url
	const { id } = router.query as { id: string };


	return (
		<div>
			<h1>Gallery of saved posts</h1>
		</div>
	);
}
