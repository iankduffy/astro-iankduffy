import React, {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import styles from './style.module.scss';
import { SliderWithGrid } from '../css-snap-slider/example/SliderWithGrid';

interface UncontrolledDialog {
	trigger: React.ReactElement | null;
	children: React.ReactNode;
	title: string;
	isOpen?: never;
	onOpenChange?: never;
	resetOnClose?: boolean;
	renderChildrenOnOpen?: never;
	type: 'modal' | 'drawer';
}

interface ControlledDialog {
	trigger?: never;
	children: React.ReactNode;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	title: string;
	resetOnClose?: boolean;
	renderChildrenOnOpen?: boolean;
	type?: 'modal' | 'drawer';
}

type DialogProps = ControlledDialog | UncontrolledDialog;

const useCountDown = () => {
	const [count, setCount] = useState<number>(0);

	useEffect(() => {
		setInterval(() => {
			setCount((prev) => prev + 1);
		}, 200);
	}, []);

	return count;
};

const images = [
	'https://cdn.sanity.io/images/hpnwtus3/production/67cebfa5236d91845a9d445e10b9f4e184d74475-4032x3024.jpg?w=1000&h=667&q=80&fit=crop&auto=format',
	'https://cdn.sanity.io/images/hpnwtus3/production/f83941d069e3b77f9c0da6f40dd463e432b3d55c-3024x4032.jpg?w=1000&h=667&q=80&fit=crop&auto=format',
	'https://cdn.sanity.io/images/hpnwtus3/production/3827428e3d3ad9bc9949d3fc2e33dab22c1802d8-4722x3148.jpg?w=1000&h=667&q=80&fit=crop&auto=format',
	'https://cdn.sanity.io/images/hpnwtus3/production/084b46405c6f613efd285040d014c697b2588a9a-4032x3024.jpg?w=1000&h=667&q=80&fit=crop&auto=format',
	'https://cdn.sanity.io/images/hpnwtus3/production/fc873326e44726cf304643db538a2d0d28d827bd-4317x2878.jpg?w=1000&h=667&q=80&fit=crop&auto=format',
	'https://cdn.sanity.io/images/hpnwtus3/production/8d7c6f4e5c56da37874220780751b3c932a62d6e-5935x3957.jpg?w=1000&h=667&q=80&fit=crop&auto=format',
	'https://images.unsplash.com/photo-1587896674919-6d6e91751318?w=1000&h=667&q=80&fit=crop&auto=format',
];

export function ParentComponent() {
	const [isOpen, setIsDialogOpen] = useState(false);
	// const count = useCountDown();
	return (
		<div>
			<button onClick={() => setIsDialogOpen((prev) => !prev)}>
				Open Drawer
			</button>
			<DialogExample
				isOpen={isOpen}
				onOpenChange={setIsDialogOpen}
				renderChildrenOnOpen={false}
				// trigger={<button>Hello Trigger</button>}
				title='Hello'>
				<SliderWithGrid images={images} />
				<SliderWithGrid images={images} />
				<SliderWithGrid images={images} />

				{/* {count} */}
			</DialogExample>
		</div>
	);
}

export function ParentDialogComponent() {
	// const [isOpen, setIsDialogOpen] = useState(false);
	return (
		<div>
			{/* <button onClick={() => setIsDialogOpen((prev) => !prev)}>
				Open Dialog
			</button> */}
			<DialogExample
				// isOpen={isOpen}
				// onOpenChange={setIsDialogOpen}
				// renderChildrenOnOpen={false}
				trigger={<button>Hello Trigger</button>}
				title='Hello'
				type='modal'>
				<h2>Hello I am children </h2>
				<input type='text' />
				<details>
					\<summary>Accordion</summary>
					Hello I am gere
				</details>
				{/* {count} */}
			</DialogExample>
		</div>
	);
}

export function DialogExample({
	children,
	title,
	trigger = null,
	isOpen,
	onOpenChange,
	resetOnClose = false,
	renderChildrenOnOpen = false,
	type = 'drawer',
}: DialogProps) {
	const dialogID = useId();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [number, setNumbers] = useState(0);
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

	// const isControlled = Boolean(onOpenChange);

	useLayoutEffect(() => {
		console.time('useLayoutEffect');
		if (dialogRef.current?.open && !isOpen) {
			dialogRef.current.close();
		} else if (!dialogRef.current?.open && isOpen) {
			dialogRef.current?.showModal();
		}
		console.timeEnd('useLayoutEffect');
	}, [isOpen]);

	useEffect(() => {
		console.time('useEffect');
		for (let i = 0; i < 100_000; i++) {
			Math.random();
		}
		console.timeEnd('useEffect');
	}, [isOpen]);

	const handleTriggerClick = useCallback(() => {
		const dialog = dialogRef.current;
		if (dialog && !dialog.open) {
			dialog.showModal();
			setUncontrolledOpen(true);
		}
	}, []);

	const shouldShowContent =
		(isOpen && renderChildrenOnOpen) || !renderChildrenOnOpen;

	const classNames = `${type === 'drawer' ? styles.drawer : styles.modal}`;

	return (
		<>
			{trigger &&
				React.cloneElement(trigger, {
					onClick: handleTriggerClick,
					'aria-expanded': uncontrolledOpen,
				})}
			<dialog
				closedby='any'
				className={classNames}
				id={dialogID}
				aria-label={title}
				onClose={() => {
					if (onOpenChange) {
						onOpenChange(false);
					}
					setUncontrolledOpen(false);
					if (resetOnClose) {
						setNumbers((prev) => prev + 1);
					}
				}}
				ref={dialogRef}>
				<header style={{ display: 'flex', justifyContent: 'space-between' }}>
					<h2>{title}</h2>
					<button
						autoFocus
						onClick={() => {
							dialogRef.current?.close();
						}}>
						X
					</button>
				</header>
				<div key={`reset-${number}`}>{shouldShowContent && children}</div>
			</dialog>
		</>
	);
}
