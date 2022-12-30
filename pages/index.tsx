import { useEffect } from "react";
import Style from "../styles/Home.module.scss";

export default function Home() {
	// useEffect(() => {
	//     fetch("/api/getUser",{
	//       method: "GET",
	//       headers: {
	//         "Content-Type": "application/json",
	//       },
	//     }).then((res) => {
	//       console.log(res)

	//     })
	// },[])

	function openLogin() {
		window.open(
			`https://www.reddit.com/api/v1/authorize?
							client_id=${process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID}&response_type=code
							&state=savedbySavedit
							&redirect_uri=http://localhost:3000/callback
							&duration=permanent&scope=save,history,identity`,
			"_self"
		);
	}

	return (
		<div className={Style.container}>
			<h1>Feedwise</h1>
			<button onClick={openLogin}>login with Reddit</button>
		</div>
	);
}
