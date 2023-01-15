import Style from "./FilterBySub.module.scss";

export default function FilterBySub({
	filter,
	setFilter,
	saved,
	getNsfwPosts,
	getSubreddits,
}: {
	filter: string;
	setFilter: any;
	saved: [];
	getNsfwPosts: () => [];
	getSubreddits: () => any;
}) {
	return (
		<>
			<div className={Style.filterSave}>
				<div className={Style.subs}>
					<div
						className={Style.tag}
						style={{
							backgroundColor: filter === "all" ? "#FF4500" : "#1a1a1a",
							color: filter === "all" ? "#000000" : "#a2a1a1",
						}}
						onClick={() => setFilter("all")}
					>
						All
						<div className={Style.num}>{saved.length}</div>
					</div>
					{
                        getNsfwPosts().length > 0 && <div
                            className={Style.tag}
                            style={{
                                backgroundColor: filter === "nsfw" ? "#FF4500" : "#1a1a1a",
                                color: filter === "nsfw" ? "#000000" : "#a2a1a1",
                            }}
                            onClick={() => setFilter("nsfw")}
                        >
                            NSFW
                            <div className={Style.num}>{getNsfwPosts().length} </div>
                        </div>
                    }
					<div
						style={{
							padding: "10px 0",
						}}
					>
						<hr />
					</div>
					{getSubreddits().map((sub: any) => {
						return (
							<div
								key={sub.subreddit}
								className={Style.tag}
								style={{
									backgroundColor: filter === sub.subreddit ? "#FF4500" : "",
									color: filter === sub.subreddit ? "#000000" : "",
								}}
								onClick={() => setFilter(sub.subreddit)}
							>
								r/{sub.subreddit}
								<div className={Style.num}>{sub.count}</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
