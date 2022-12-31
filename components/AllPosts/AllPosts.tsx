import Style from "./AllPosts.module.scss";
import Masonry from "react-masonry-css";
import Image from "next/image";
import { useEffect } from "react";

type AllPostsProps = {
	saved: any;
	loading: boolean;
	columns?: number;
};

export default function AllPosts(props: AllPostsProps) {
	const { saved, loading, columns } = props;

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
		console.log(saved);
	}, [saved]);

	return (
		<>
			{loading ? (
				<div>loading</div>
			) : (
				<div className={Style.postsContainer}>
					<Masonry
						breakpointCols={
							{
								default: columns ? columns : 2,
								1100: 1,
								700: 1,
							} as any
						}
						className="my-masonry-grid"
						columnClassName="my-masonry-grid_column"
					>
						{saved.map((post: any) => {
							return (
								<a
									href={"https://www.reddit.com" + post.data.permalink}
									target="_blank"
									rel="noopener noreferrer"
								>
									<div className={Style.post} key={post.data.id}>
										<div className={Style.postHeader}>
											<span>r/{post.data.subreddit}</span>•
											<span>
												{""}Posted by /u/{post.data.author}
											</span>
											•<span>{timeSince(post.data.created_utc)}</span>
										</div>
										<h3 className="title">{post.data.title}</h3>
										<div className="tag">
											{post.data.over_18 ? (
												<span className="over18">NSFW</span>
											) : (
												<span></span>
											)}
										</div>
										<div
											className="content"
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
													src={post.data.media.reddit_video.fallback_url}
													controls
												></video>
											) : (
												<div></div>
											)}
											{post.data.url ? (
												<img src={post.data.url} alt="" />
											) : (
												<div></div>
											)}
											{post.data.gallery_data ? (
												post.data.gallery_data.items.map((item: any) => {
													return (
														<div>
															<img src={
																`
																https://i.redd.it/${item.media_id}.jpg
																`
															} alt="" />
														</div>
													)
												})
											) : (
												
												<></>
											)}
										
										</div>
										<div className="postFooter">
											ups:
											{post.data.ups}
										</div>

										{/* <div className={Style.postHeader}>
										<img
											src={post.data.url ? post.data.url : post.data.thumbnail}
											alt="post image"
											// width={100}
											// height={100}
										/>

										<div className={Style.postInfo}>
											<span>
												{post.data.title
													? post.data.title
													: post.data.link_title}
											</span>
											
											<a
												href={`http://www.reddit.com${post.data.permalink}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												Link
											</a>
										</div>
									</div> */}
										{/* <div className={Style.postBody}>
										<p>{post.data.selftext}</p>
										<p>{post.data.body}</p>
									</div> */}
									</div>
								</a>
							);
						})}
					</Masonry>
				</div>
			)}
		</>
	);
}
