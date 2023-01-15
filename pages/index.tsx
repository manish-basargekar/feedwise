import { useEffect } from "react";
import Style from "../styles/Home.module.scss";
import Link from "next/link";

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
			<nav>
				<Link href="/">

					<h1>savedit</h1>


				</Link>
				<button onClick={openLogin} className={Style.loginReddit}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="currentColor"
						strokeWidth="2"
					>
						<g clip-path="url(#clip0_67_13)">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-4.312-.942c.194.277.304.604.316.942a1.751 1.751 0 0 1-.972 1.596c.014.176.014.352 0 .528 0 2.688-3.132 4.872-6.996 4.872-3.864 0-6.996-2.184-6.996-4.872a3.444 3.444 0 0 1 0-.528 1.75 1.75 0 1 1 1.932-2.868 8.568 8.568 0 0 1 4.68-1.476l.888-4.164a.372.372 0 0 1 .444-.288l2.94.588a1.2 1.2 0 1 1-.156.732L13.2 5.58l-.78 3.744a8.544 8.544 0 0 1 4.62 1.476 1.751 1.751 0 0 1 2.648.258zM8.206 12.533a1.2 1.2 0 1 0 1.996 1.334 1.2 1.2 0 0 0-1.996-1.334zm3.806 4.891c1.065.044 2.113-.234 2.964-.876a.335.335 0 1 0-.468-.48A3.936 3.936 0 0 1 12 16.8a3.924 3.924 0 0 1-2.496-.756.324.324 0 0 0-.456.456 4.608 4.608 0 0 0 2.964.924zm2.081-3.178c.198.132.418.25.655.25a1.199 1.199 0 0 0 1.212-1.248 1.2 1.2 0 1 0-1.867.998z"
							/>
						</g>
						<defs>
							<clipPath id="clip0_67_13">
								<rect width="24" height="24" />
							</clipPath>
						</defs>
					</svg>
					<div>Login with Reddit</div>
				</button>
			</nav>
			<main className={Style.main}>
				<h1 className={Style.title}>Manage, Organize & Share your Reddit saved posts.</h1>
				<p className={Style.description}>
					savedit is a simple dashboard to manage and share your saved posts from Reddit.
				</p>
				{/* <button onClick={openLogin} className={Style.loginReddit}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="currentColor"
						strokeWidth="2"
					>
						<g clip-path="url(#clip0_67_13)">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-4.312-.942c.194.277.304.604.316.942a1.751 1.751 0 0 1-.972 1.596c.014.176.014.352 0 .528 0 2.688-3.132 4.872-6.996 4.872-3.864 0-6.996-2.184-6.996-4.872a3.444 3.444 0 0 1 0-.528 1.75 1.75 0 1 1 1.932-2.868 8.568 8.568 0 0 1 4.68-1.476l.888-4.164a.372.372 0 0 1 .444-.288l2.94.588a1.2 1.2 0 1 1-.156.732L13.2 5.58l-.78 3.744a8.544 8.544 0 0 1 4.62 1.476 1.751 1.751 0 0 1 2.648.258zM8.206 12.533a1.2 1.2 0 1 0 1.996 1.334 1.2 1.2 0 0 0-1.996-1.334zm3.806 4.891c1.065.044 2.113-.234 2.964-.876a.335.335 0 1 0-.468-.48A3.936 3.936 0 0 1 12 16.8a3.924 3.924 0 0 1-2.496-.756.324.324 0 0 0-.456.456 4.608 4.608 0 0 0 2.964.924zm2.081-3.178c.198.132.418.25.655.25a1.199 1.199 0 0 0 1.212-1.248 1.2 1.2 0 1 0-1.867.998z"
							/>
						</g>
						<defs>
							<clipPath id="clip0_67_13">
								<rect width="24" height="24" />
							</clipPath>
						</defs>
					</svg>
					<div>Login with Reddit</div>
				</button> */}
			</main>
		</div>
	);
}
