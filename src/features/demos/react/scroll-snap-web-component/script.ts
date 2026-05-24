class StickyContainer extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		if (CSS.supports('container-type: scroll-state')) {
			console.log('Browser Supported');

			console.log(this);
			return;
		}

		const sentinel = document.createElement('div');
		sentinel.setAttribute('data-sticky-sentinel', '');
		sentinel.style.cssText = 'position: relative; height: 1px;';

		this.parentElement?.insertBefore(sentinel, this);
		const observer = new IntersectionObserver(
			([entry]) => {
				// sentinel not visible => we scrolled past it => sticky is stuck
				this.classList.toggle('is-stuck', !entry.isIntersecting);
			},
			{ root: null, threshold: 0 },
		);

		observer.observe(sentinel);
	}
}

customElements.define('scroll-stuck', StickyContainer);
export {};
