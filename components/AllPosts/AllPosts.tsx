import Style from "./AllPosts.module.scss";
import Masonry from "react-masonry-css";

type AllPostsProps = {
    saved: any;
    loading: boolean;
	columns?: number;
}

export default function AllPosts(props: AllPostsProps) {
	const { saved, loading, columns } = props;

	return (
		<>
			{loading ? (
				<div>loading</div>
			) : (
				<div className={Style.postsContainer}>
					<Masonry
						breakpointCols={
							{
								default: columns ? columns : 3,
								1100: 2,
								700: 1,
							} as any
						}
						className={Style["my-masonry-grid"]}
						columnClassName="my-masonry-grid_column"
					>
						{saved.map((post: any) => {
							return (
								<div className={Style.post} key={post.data.id}>
									<div className={Style.postHeader}>
										<img
											src={post.data.url ? post.data.url : post.data.thumbnail}
										/>

										<div className={Style.postInfo}>
											<span>
												{post.data.title
													? post.data.title
													: post.data.link_title}
											</span>
											<span
												style={{
													color: "gray",
												}}
											>
												Posted by /u/{post.data.author}
											</span>
											<br />
											<span>r/{post.data.subreddit}</span>
											<a
												href={`http://www.reddit.com${post.data.permalink}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												Link
											</a>
										</div>
									</div>
									<div className={Style.postBody}>
										<p>{post.data.selftext}</p>
										<p>{post.data.body}</p>
									</div>
								</div>
							);
						})}
					</Masonry>
				</div>
			)}
		</>
	);
}
