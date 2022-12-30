import Style from "./Navbar.module.scss";
import { useState, useRef, useEffect } from "react";

type user = {
	name: string;
	snoovatar_img: string;
};

type handleShare = () => void;

type NavbarProps = {
	user: user;
	handleShare: handleShare;
	filter: string;
};

export default function Navbar({ user, handleShare, filter }: NavbarProps) {
	const [dropdownActive, setDropdownActive] = useState(false);
	const dropDownRef = useRef() as React.MutableRefObject<HTMLDivElement>;

	useEffect(() => {
		const checkIfClickedOutside = (e: { target: any }) => {
			if (
				dropdownActive &&
				dropDownRef.current &&
				!dropDownRef.current.contains(e.target)
			) {
				setDropdownActive(false);
			}
		};

		document.addEventListener("mousedown", checkIfClickedOutside);

		return () => {
			document.removeEventListener("mousedown", checkIfClickedOutside);
		};
	}, [dropdownActive]);

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
			<div className={Style.content}>
				<h1 className={Style.logo}>Feedwise</h1>
				<div className={Style.right}>
					<button onClick={handleShare} className={Style.shareBtn}>
						Share{" "}
						{filter === "all"
							? "All"
							: filter === "nsfw"
							? "nsfw"
							: `r/${filter}`}{" "}
						Posts
					</button>

					{/* <img src={user.snoovatar_img} alt={`${user.name}'s reddit avatar`} /> */}
					{/* <div className={Style.modal}>
						<button className={Style.userOptions} onClick={handleLogout}>
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

							<span>Log out</span>
						</button>
					</div> */}
					<div className={Style["profile-right"]}>
						<div ref={dropDownRef}>
							<img
								className={Style.profile}
								src={user.snoovatar_img}
								onClick={() => setDropdownActive(!dropdownActive)}
							></img>
							<div
								className={
									dropdownActive
										? `${Style["dropdownWrapper"]} 
						${Style.active}
						`
										: `${Style["dropdownWrapper"]} `
								}
								id="dropdownWrapper"
								style={{ width: "max-content" }}
							>
								<div className={Style["dropdown-profile-details"]}>
									<span className={Style["dropdown-profile-details--name"]}>
										/u/{user.name}
									</span>
								</div>
								<div className={Style["dropdown-links"]}>
									<button onClick={handleLogout}>Log out</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
