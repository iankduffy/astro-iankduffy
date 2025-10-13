// export function RecentSearchReact({
// 	fallbackOffers,
// }: {
// 	fallbackOffers: Array<{ name: string; description: string; img?: string }>;
// }) {
// 	return (
// 		<section>
// 			<h2>Recent Searches (React)</h2>
// 			<p>This is a React component example.</p>
// 			<recent-search>
// 				<div>
// 					<h3 className='skeleton'>Recent Search</h3>
// 				</div>
// 				<div className='row content'>
// 					<div className='skeleton'></div>
// 					<div className='skeleton'></div>
// 					<div className='skeleton'></div>
// 				</div>

// 				<template className='recent-search-template'>
// 					<div className='search-item'>
// 						<img
// 							src={undefined}
// 							alt=''
// 							width='150'
// 							height='100'
// 						/>
// 						<div className='search-content'>
// 							<h5>Name</h5>
// 							<p></p>
// 						</div>
// 					</div>
// 				</template>
// 				<div
// 					className='fallback row'
// 					style={{ display: 'none' }}>
// 					{fallbackOffers.map((offer) => {
// 						return (
// 							<div
// 								className='search-item'
// 								key={offer.name}>
// 								<img
// 									src={offer.img ?? null}
// 									alt={offer.name}
// 									width='150'
// 									height='100'
// 								/>
// 								<div className='search-content'>
// 									<h5>{offer.name}</h5>
// 									<p>{offer.description}</p>
// 								</div>
// 							</div>
// 						);
// 					})}
// 				</div>
// 			</recent-search>
// 		</section>
// 	);
// }
