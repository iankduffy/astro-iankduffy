import styles from './seat.module.scss';
interface Seat {
	id: string;
	label: string;
	type: 'normal' | 'extra-leg-room';
	isAvailable: boolean;
}

const seatMaps: Seat[] = [
	{ id: '1A', label: '1A', type: 'extra-leg-room', isAvailable: true },
	{ id: '1B', label: '1B', type: 'extra-leg-room', isAvailable: false },
	{ id: '1C', label: '1C', type: 'normal', isAvailable: true },
	{ id: '1D', label: '1D', type: 'normal', isAvailable: true },
	{ id: '2A', label: '2A', type: 'normal', isAvailable: true },
	{ id: '2B', label: '2B', type: 'normal', isAvailable: false },
	{ id: '2C', label: '2C', type: 'normal', isAvailable: true },
	{ id: '2D', label: '2D', type: 'normal', isAvailable: true },
];

export function SeatMap() {
	return (
		<div className={styles.seatmap}>
			{seatMaps.map((seat) => (
				<span key={seat.id}>{getSeatType(seat)}</span>
			))}
		</div>
	);
}

function getSeatType(seat: Seat) {
	if (!seat.isAvailable) return <UnavailableSeat label={seat.label} />;
	switch (seat.type) {
		case 'normal': {
			return <AvailableSeat label={seat.label} />;
		}
		case 'extra-leg-room': {
			return <AvailableSeat label={seat.label} />;
		}
	}
}

function UnavailableSeat({ label }: { label: string }) {
	return (
		<button
			type='button'
			disabled
			aria-label={`${label}, unavailable`}>
			{label} unavailable
		</button>
	);
}

function AvailableSeat({ label }) {
	return (
		<button
			type='button'
			aria-label={`${label}, available`}>
			{label} available
		</button>
	);
}
