declare module 'react' {
	interface ButtonHTMLAttributes<T> extends React.HTMLAttributes<T> {
		popovertarget?: string;
		popovertargetaction?: string;
	}

	interface HTMLAttributes<T> extends HTMLAttributes<T> {
		popover?: 'manual' | 'auto' | 'none';
	}

	interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
		closedby?: string;
		commandfor?: string;
		command?: string;
	}
}

declare global {
	namespace JSX {
		interface IntrinsicElements {
			'custom-lightbox': any;
		}
	}
}

export {};
