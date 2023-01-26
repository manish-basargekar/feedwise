import Style from "./Navbar.module.scss";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type user = {
	name?: string;
	snoovatar_img?: string;
};

type handleShare = () => void;

type NavbarProps = {
	user?: user;
	handleShare?: handleShare;
	filter?: string;
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
				<Link href="/" className={Style.link}>
					<h1 className={Style.logo}>Feedwise</h1>
				</Link>
				{user && (
					<div className={Style.right}>
						<button onClick={handleShare} className={Style.shareBtn}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="18" cy="5" r="3" />
								<circle cx="18" cy="19" r="3" />
								<circle cx="6" cy="12" r="3" />
								<path d="M15.408 6.512l-6.814 3.975m6.814 7.001l-6.814-3.975" />
							</svg>
							<div>
								Share{" "}
								{filter === "all"
									? "All"
									: filter === "nsfw"
									? "nsfw"
									: `r/${filter}`}{" "}
								Posts
							</div>
						</button>
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
				)}
			</div>
		</nav>
	);
}
