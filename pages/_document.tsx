import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<title>saved-it</title>
			<Head />
			<body>
				<Main />
				<div id="modal"></div>
				<link
					href="https://api.fontshare.com/v2/css?f[]=switzer@600,700,400,401,500&display=swap"
					rel="stylesheet"
				/>
				<NextScript />
			</body>
		</Html>
	);
}
