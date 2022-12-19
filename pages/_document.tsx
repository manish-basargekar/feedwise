import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<title>Feedwise</title>
			<Head />
			<body>
				<Main />
				<link
					href="https://api.fontshare.com/v2/css?f[]=supreme@2,1&display=swap"
					rel="stylesheet"
				/>
				<NextScript />
			</body>
		</Html>
	);
}
