import Style from "./Navbar.module.scss";

export default function Navbar() {
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
		<nav className={Style.navbar}>
			<h1 className={Style.logo}>Feedwise</h1>
			<div className={Style.right}>
				<button className={Style.userOptions} onClick={handleLogout}>
					{/* <img src={user.snoovatar_img} alt={`${user.name}'s reddit avatar`} /> */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						className={`${Style["w-5"]} ${Style["h-5"]}`}
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
	);
}
