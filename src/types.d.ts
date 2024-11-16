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
