import Style from "./FilterBySub.module.scss";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function FilterBySub({
	filter,
	setFilter,
	saved,
	getNsfwPosts,
	getSubreddits,
	user,
	handleLogout,
	isSidebarOpen,
	setisSidebarOpen,
}: {
	filter: string;
	setFilter: any;
	saved: [];
	getNsfwPosts: () => [];
	getSubreddits: () => any;
	user: any;
	handleLogout: () => void;
	isSidebarOpen: boolean;
	setisSidebarOpen: (arg: boolean) => void;
}) {




	const sidebarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {

		if (window.innerWidth >= 769) return

		const handleClickOutside = (event: any) => {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
				setisSidebarOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};

	}, [sidebarRef, setisSidebarOpen]);




	const handleSidebar = () => {
		if (window.innerWidth >= 769) return
		setisSidebarOpen(!isSidebarOpen)
	}



	return (
		<div className={Style.container}>
			<div
				className={Style.filterSave}
				style={{
					transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
					// boxShadow: isSidebarOpen ? "8px 0 10px -6px black" : "none",
				}}
				ref={sidebarRef}
			>
				<div className={Style.head}>
					<button onClick={() => setisSidebarOpen(!isSidebarOpen)}>
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
							<path d="M20 20L4 4m16 0L4 20" />
						</svg>
					</button>

					<Link href="/">
						<div className={Style.logo}>
							<img src="../feedwise.svg" alt="Feedwise logo" />
						</div>
					</Link>
				</div>
				<div className={Style.subs}>
					<a
						className={Style.tag}
						style={{
							backgroundColor: filter === "all" ? "#E04D01" : "#1a1a1a",
							color: filter === "all" ? "#1e1e1e" : "#a2a1a1",
						}}
						onClick={() => {
							setFilter("all")
							handleSidebar()
						}}
						href="#top"
					>
						All
						<div className={Style.num}>{saved.length}</div>
					</a>
					{getNsfwPosts().length > 0 && (
						<a
							className={Style.tag}
							style={{
								backgroundColor: filter === "nsfw" ? "#FF4500" : "#1a1a1a",
								color: filter === "nsfw" ? "#000000" : "#a2a1a1",
							}}
							href="#top"
							onClick={() => {
								setFilter("nsfw")
								handleSidebar()
							}}
						>
							NSFW
							<div className={Style.num}>{getNsfwPosts().length} </div>
						</a>
					)}
					<div
						style={{
							padding: "10px 0",
						}}
					>
						<hr />
					</div>
					{getSubreddits().map((sub: any) => {
						return (
							<a
								key={sub.subreddit}
								className={Style.tag}
								style={{
									backgroundColor: filter === sub.subreddit ? "#FF4500" : "",
									color: filter === sub.subreddit ? "#000000" : "",
								}}
								href="#top"
								onClick={() => {
									setFilter(sub.subreddit)
									handleSidebar()
								}}
							>
								r/{sub.subreddit}
								<div className={Style.num}>{sub.count}</div>
							</a>
						);
					})}
				</div>
				<div className={Style.profile}>
					<div className={Style.content}>
						<div className={Style.top}>
							<img className={Style.profileImg} src={user.snoovatar_img} />
							<div className={Style.name}>u/{user.name}</div>
						</div>

						<div>
							<button onClick={handleLogout}>Log out</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
