import Style from "./AllPosts.module.scss";
import Masonry from "react-masonry-css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loading from "../UI/Loading/Loading";

type AllPostsProps = {
	saved: any;
	loading: boolean;
	columns?: number;
	filter?: string;
};

export default function AllPosts(props: AllPostsProps) {
	const { saved, loading, columns, filter } = props;

	const [columnConfig, setColumnConfig] = useState({
		default: 5,
		2600: 4,
		2000: 3,
		1500: 2,
		1024: 2,
		768: 2,
		500: 1,
	});


	const [posts, setPosts] = useState<any>([]);
	const [currentPage, setCurrentPage] = useState(1);

	const [displayPosts, setDisplayPosts] = useState<any>([]);


	function timeSince(timestamp: number) {
		// Calculate the time difference between the timestamp and the current time
		var timeDifference = Date.now() - timestamp * 1000;

		// Calculate the number of seconds, minutes, hours, and days that have passed
		var seconds = Math.floor(timeDifference / 1000);
		var minutes = Math.floor(seconds / 60);
		var hours = Math.floor(minutes / 60);
		var days = Math.floor(hours / 24);

		// Return a string describing the amount of time that has passed
		if (days > 1) {
			return days + " days ago";
		} else if (hours > 1) {
			return hours + " hours ago";
		} else if (minutes > 1) {
			return minutes + " minutes ago";
		} else {
			return seconds + " seconds ago";
		}
	}


	useEffect(() => {
		if (!saved) return;
		const pages = [];
		for (let i = 0; i < saved.length; i += 50) {
			pages.push(saved.slice(i, i + 50));
		}
		// console.log(pages)
		setPosts(pages);
		setDisplayPosts(pages[0]);
		setCurrentPage(0);
		// console.log("====================================")
		// console.log(pages)
		// console.log("displayPosts =>", displayPosts.length)
		// console.log("savedlength =>", saved.length)
	}, [saved]);

	useEffect(() => {
		const SharePageColumns = {
			default: columns ? columns : 5,
			2600: columns ? columns : 4,
			2000: columns ? columns : 3,
			1500: columns ? columns : 2,
			1024: columns ? columns : 2,
			768: columns ? columns : 2,
			500: columns ? columns : 1,
		} as any

		const dashboardColumns = {
			default: columns ? columns : 5,
			2600: 4,
			2000: 3,
			1500: 2,
			1024: 2,
			768: 2,
			500: 1,
		} as any

		if (window.location.pathname === "/dashboard") {
			setColumnConfig(dashboardColumns);
		} else {
			setColumnConfig(SharePageColumns);
		}


	}, []);

	useEffect(() => {
		if(!displayPosts) return
		// console.log(displayPosts.length)
	}, [displayPosts])




	const handleLoadMore = () => {

		console.log("====================================")
		console.log("currentPage =>",currentPage)
		console.log("displayPosts.length =>", displayPosts.length)
		console.log("saved.length =>", saved.length)
		console.log(posts[currentPage])


		if (displayPosts.length >= saved.length) return;

		// setCurrentPage(currentPage + 1);
		// console.log(posts)

		setDisplayPosts([...displayPosts, ...posts[currentPage + 1]])

		// console.log(posts[currentPage])

		// console.log("displayPosts =>",displayPosts.length)
		// console.log("saved =>",saved.length)
	};

	// useEffect(() => {
	// 	window.addEventListener("scroll", handleScroll);
	// 	return () => window.removeEventListener("scroll", handleScroll);
	// }, [currentPage]);

	return (
		<>
			{loading || !displayPosts ? (
				<div className={Style.loadingContainer}>

					<Loading />
				</div>
			) : (
				<div className={Style.postsContainer}>
					<Masonry
						breakpointCols={
							columnConfig
						}
						className="my-masonry-grid"
						columnClassName="my-masonry-grid_column"
					>
						{displayPosts.map((post: any) => {
							return (
								<a
									href={"https://www.reddit.com" + post.data.permalink}
									target="_blank"
									rel="noopener noreferrer"
									key={post.data.id}
								>
									<div className={Style.post}>
										<div className={Style.postHeader}>
											<span>r/{post.data.subreddit}</span>•
											<span>
												{""} by u/{post.data.author}
											</span>
											•<span>{timeSince(post.data.created_utc)}</span>
										</div>
										<h3 className={Style.title}>{post.data.title}</h3>
										<div
											className={Style.content}
											style={{
												filter: post.data.over_18 ? "blur(5px)" : "none",
											}}
										>
											{post.data.is_self ? (
												<p>{post.data.selftext}</p>
											) : (
												<div>{post.data.body}</div>
											)}
											{post.data.is_video ? (
												<video

													controls
												>
													<source
														src={post.data.media.reddit_video.fallback_url}
													/>
												</video>
											) : (
												<div></div>
											)}
											{post.data.url ? (
												<img src={post.data.url} alt="" loading="lazy" />
											) : (
												<div></div>
											)}
											{post.data.gallery_data ? (
												post.data.gallery_data.items.map((item: any) => {
													return (
														<div key={item.media_id}>
															<img
																src={`
																https://i.redd.it/${item.media_id}.jpg
																`}
																alt=""
															/>
														</div>
													);
												})
											) : (
												<></>
											)}
										</div>
										<div className={Style.postFooter}>
											<div className={Style.upvote}>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="1"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M12 3l9 7h-4.99L16 21H8V10H3l9-7z" />
												</svg>
												<span>{post.data.ups}</span>
											</div>
											<div className={Style.save}>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="#898888"
													stroke="#898888"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M4 5v14.586c0 .89 1.077 1.337 1.707.707L12 14l6.293 6.293c.63.63 1.707.184 1.707-.707V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z" />
												</svg>
											</div>
										</div>
									</div>
								</a>
							);
						})}
					</Masonry>
					{
						// show load more button only if there are more posts to load

						displayPosts.length >= saved.length ? (
								<div className={Style.loadMore}>

									That{"'"}s all folks
								</div>
						) : (
							<div className={Style.loadMore}>

								<button onClick={handleLoadMore}>Load More</button>
							</div>
						)

					}

				</div>
			)}
		</>
	);
}
