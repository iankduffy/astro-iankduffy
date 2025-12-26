export function WebComponentReact({}) {
	return (
		<section>
			<h2>Web Component in React</h2>
			<p>This is a React component example.</p>
			<web-search>
				<input
					type='text'
					placeholder='Search...'
				/>
				<div className='results'></div>
			</web-search>
		</section>
	);
}
