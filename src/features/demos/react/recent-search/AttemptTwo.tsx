export function WebComponentReact({}) {
	return (
		<section>
			<h2>Web Component in React</h2>
			<p>This is a React component example.</p>
			<template>
				<h2>Flower</h2>
				<img
					src='img_white_flower.jpg'
					width='214'
					height='204'
				/>
			</template>
			{/* <web-search>
				<input
					type='text'
					placeholder='Search...'
				/>
				<div className='results'></div>
				<template
					className='result-template'
					shadowrootmode='open'>
					<div className='result-item'>
						<h4>Title</h4>
						<p>Description</p>
					</div>
				</template>
			</web-search> */}
		</section>
	);
}
