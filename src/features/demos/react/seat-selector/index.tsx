import { createContext, useContext, useState, type ReactNode } from 'react';
import { useStore } from 'zustand';
import { createStore, type StoreApi } from 'zustand/vanilla';
import { SeatMap } from './Seats';

interface Passenger {
	id: number;
	name: string;
	currentSeatId?: number;
}

interface Props {
	passengers: Passenger[];
}

export function SeatSelector({ passengers }: Props) {
	if (!passengers) return null;
	return (
		<SeatSelectorProvider passengers={passengers}>
			<section>
				<PassengersList />
				<SeatMap />
			</section>
		</SeatSelectorProvider>
	);
}

const SeatSelectorContext = createContext<StoreApi<SeatSelectorState> | null>(
	null,
);

type SeatSelectorState = {
	passengers: Passenger[];
	activePassenger: Passenger | undefined;
	actions: {
		setActivePassenger: (value: Passenger) => void;
	};
};

function SeatSelectorProvider({
	children,
	passengers = [],
}: {
	children: ReactNode;
	passengers: Passenger[];
}) {
	const [store] = useState<StoreApi<SeatSelectorState>>(() =>
		createStore<SeatSelectorState>()((set) => ({
			passengers: passengers,
			activePassenger: passengers[0],
			selectedSeats: [],
			actions: {
				setActivePassenger: (value: Passenger) =>
					set({ activePassenger: value }),
			},
		})),
	);
	return (
		<SeatSelectorContext.Provider value={store}>
			{children}
		</SeatSelectorContext.Provider>
	);
}

const useSeatSelector = <T,>(selector: (state: SeatSelectorState) => T): T => {
	const store = useContext(SeatSelectorContext);
	if (!store) {
		throw new Error('Missing SeatSelectorContext');
	}
	return useStore(store, selector);
};

export const useGetPassengers = () =>
	useSeatSelector((store) => store.passengers);

export const useActivePassenger = () =>
	useSeatSelector((store) => store.activePassenger);

export const useSeatSelectorActions = () =>
	useSeatSelector((store) => store.actions);

function PassengersList() {
	const passengers = useGetPassengers();
	const activePassenger = useActivePassenger();

	return (
		<ul>
			{passengers.map((passenger) => (
				<li key={passenger.id}>
					<Passenger
						passenger={passenger}
						isActive={activePassenger?.id === passenger.id}
					/>
				</li>
			))}
		</ul>
	);
}

function Passenger({
	passenger,
	isActive,
}: {
	passenger: Passenger;
	isActive: boolean;
}) {
	const { setActivePassenger } = useSeatSelectorActions();
	return (
		<button
			type='button'
			aria-pressed={isActive}
			onClick={() => setActivePassenger(passenger)}>
			{passenger.name} {isActive.toString()}
		</button>
	);
}
