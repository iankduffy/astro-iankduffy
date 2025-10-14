import React from 'react';
declare module React {
	interface ButtonHTMLAttributes<T> extends React.HTMLAttributes<T> {
		popovertarget?: string;
		popovertargetaction?: string;
	}

	interface HTMLAttributes<T> extends HTMLAttributes<T> {
		popover?: 'manual' | 'auto' | 'none';
	}
}

declare global {
	namespace JSX {
		interface IntrinsicElements {
			'custom-lightbox': any;
			'recent-search': React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			> & {
				'data-status'?: string;
			};
			'web-search': React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			> & {
				'data-status'?: string;
			};
		}
	}
}
