import { useEffect, useState } from 'react';

export function ScrollStuckExample() {
	const [count, setCount] = useState(1);

	useEffect(() => {
		async function loadCSSScrollPolyfill() {
			if (!CSS.supports('container-type: scroll-state')) {
				await import('./script.js');
			}
		}
		loadCSSScrollPolyfill();
	}, []);

	return (
		<section style={{ minHeight: '500vh' }}>
			<header style={{ height: '100vh' }}></header>
			<scroll-stuck>
				<h2>Hello I am Stuck</h2>
				<button onClick={() => setCount((prev) => ++prev)}>{count}</button>
			</scroll-stuck>
		</section>
	);
}
