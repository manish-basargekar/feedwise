import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en" style={{ scrollBehavior: 'smooth' }}>
			<title>Feedwise</title>
			<Head > 
				<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
				<link rel="manifest" href="/favicon/site.webmanifest" /></Head>
			<body>
				<Main />
				<div id="modal"></div>


				<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap" rel="stylesheet"></link>



				<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet" />
				<NextScript />
			</body>
		</Html>
	);
}
