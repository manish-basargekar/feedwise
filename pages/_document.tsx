import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<title>Savedit</title>
			<Head />
			<body>
				<Main />
				<div id="modal"></div>
				<link
					href="https://api.fontshare.com/v2/css?f[]=switzer@600,700,400,401,500&display=swap"
					rel="stylesheet"
				/>



				<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap" rel="stylesheet"></link>
				<NextScript />
			</body>
		</Html>
	);
}
