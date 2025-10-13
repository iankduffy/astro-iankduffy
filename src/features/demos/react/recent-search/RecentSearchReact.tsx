export function RecentSearchReact({
	fallbackOffers,
}: {
	fallbackOffers: Array<{ name: string; description: string; img?: string }>;
}) {
	return (
		<section>
			<h2>Recent Searches (React)</h2>
			<p>This is a React component example.</p>
			<recent-search>
				<div>
					<h3 className='skeleton'>Recent Search</h3>
				</div>
				<div className='row content'>
					<div className='skeleton'></div>
					<div className='skeleton'></div>
					<div className='skeleton'></div>
				</div>
				<div
					className='fallback'
					style={{ display: 'none' }}>
					<div className='row'>
						{fallbackOffers.map((offer) => (
							<div
								className='search-item'
								key={offer.name}>
								<img
									src={offer.img ?? null}
									alt={offer.name}
									width='150'
									height='100'
								/>
								<div className='search-content'>
									<h5>{offer.name}</h5>
									<p>{offer.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</recent-search>
		</section>
	);
}
