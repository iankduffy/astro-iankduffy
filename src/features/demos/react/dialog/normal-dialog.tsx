import React, {
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import styles from './style.module.scss';

interface UncontrolledDialog {
	trigger: React.ReactElement | null;
	children: React.ReactNode;
	title: string;
	isOpen?: never;
	onOpenChange?: never;
	resetOnClose?: boolean;
	renderChildrenOnOpen: never;
	type: 'modal' | 'drawer';
}

interface ControlledDialog {
	trigger?: never;
	children: React.ReactNode;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	title: string;
	resetOnClose?: boolean;
	renderChildrenOnOpen: boolean;
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
				renderChildrenOnOpen={true}
				// trigger={<button>Hello Trigger</button>}
				title='Hello'>
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

export function ParentDialogComponent() {
	const [isOpen, setIsDialogOpen] = useState(false);
	return (
		<div>
			<button onClick={() => setIsDialogOpen((prev) => !prev)}>
				Open Dialog
			</button>
			<DialogExample
				isOpen={isOpen}
				onOpenChange={setIsDialogOpen}
				renderChildrenOnOpen={false}
				// trigger={<button>Hello Trigger</button>}
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

	// const isControlled = Boolean(onOpenChange);

	useLayoutEffect(() => {
		if (dialogRef.current?.open && !isOpen) {
			dialogRef.current.close();
		} else if (!dialogRef.current?.open && isOpen) {
			dialogRef.current?.showModal();
		}
	}, [isOpen]);

	const shouldShowContent =
		(isOpen && renderChildrenOnOpen) || !renderChildrenOnOpen;

	const classNames = `${type === 'drawer' ? styles.drawer : styles.modal}`;

	return (
		<>
			{trigger &&
				React.cloneElement(trigger, {
					commandfor: dialogID,
					command: 'show-modal',
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
