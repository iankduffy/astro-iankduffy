import React from 'react';
declare module React {
	interface ButtonHTMLAttributes<T> extends React.HTMLAttributes<T> {
		popovertarget?: string;
		popovertargetaction?: string;
	}

	interface HTMLAttributes<T> extends HTMLAttributes<T> {
		popover?: 'manual' | 'auto' | 'none';
	}

	type UpdateCallback = undefined | (() => void | Promise<void>);
	type StartViewTransitionParameter = {
		types?: string[];
		update?: UpdateCallback;
	};

	interface Document {
		startViewTransition(
			param?: StartViewTransitionParameter | UpdateCallback
		): ViewTransition;
	}
}
