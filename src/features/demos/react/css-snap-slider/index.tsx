import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
	Children,
	type ReactNode,
	type Ref,
	type RefObject,
} from 'react';
import styles from './styles.module.scss';
import { VscArrowLeft, VscArrowRight } from 'react-icons/vsc';

const SliderContext = createContext<{
	sliderRef: null | RefObject<HTMLDivElement>;
}>({
	sliderRef: null,
});

interface SliderRootProps {
	children: React.ReactNode;
	sliderControls: React.ReactNode;
}

const SliderRoot = ({ children, sliderControls }: SliderRootProps) => {
	const ref = useRef<HTMLDivElement>(null);
	console.log('SliderRoot ref', ref.current);
	return (
		<SliderContext.Provider value={{ sliderRef: ref }}>
			<div className={styles.sliderContainer}>
				<Slider sliderRef={ref}>{children}</Slider>
				{sliderControls}
			</div>
		</SliderContext.Provider>
	);
};

const useSliderContext = () => {
	const context = useContext(SliderContext);
	if (!context) {
		throw new Error('useSlider must be used within a SliderProvider');
	}
	return context;
};

function handleScrollSnapChange({
	slider,
	callback,
}: {
	slider: HTMLDivElement;
	callback: (number: number) => void;
}) {
	if ('onscrollsnapchanging' in window) {
		slider.addEventListener('scrollsnapchanging', (event: SnapEvent) => {
			console.log('scrollsnapchanging', event);
			const newIndex = Number(event.snapTargetInline.dataset.index);
			callback(newIndex);
		});
		return () => {
			console.log('disconnecting observer');
			slider.removeEventListener('scrollsnapchanging', (event: SnapEvent) => {
				const newIndex = Number(
					(event.snapTargetInline as const).target.dataset.index
				);
				callback(newIndex);
			});
		};
	} else {
		const instersectionCallback = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const newIndex = Number((entry.target as HTMLElement)?.dataset.index);
					callback(newIndex);
				}
			});
		};
		const observer = new IntersectionObserver(instersectionCallback, {
			root: slider,
			rootMargin: '0px',
			threshold: 0.8,
		});
		const slides = [...slider.children];
		slides.forEach((slide) => observer.observe(slide));
		return () => {
			console.log('disconnecting observer');
			observer.disconnect();
		};
	}
}

const useSlider = () => {
	const context = useSliderContext();
	const [currentSlide, setCurrentSlide] = useState(1);
	const [length, setLength] = useState(0);
	const { sliderRef } = context;

	useEffect(() => {
		if (!sliderRef?.current) return;
		const length = sliderRef?.current?.children.length;
		setLength(length);
	}, [sliderRef]);

	useEffect(() => {
		if (!sliderRef?.current) return;
		const slider = sliderRef?.current;
		const cleanup = handleScrollSnapChange({
			slider,
			callback: (number: number) => {
				setCurrentSlide(number);
			},
		});
		return () => {
			cleanup();
		};
	}, [sliderRef]);

	const isFirstSlide = currentSlide === 1;
	const isLastSlide = currentSlide === length;

	const scrollToSlide = useCallback(
		(index: number) => {
			if (!sliderRef?.current) return;
			const slides = sliderRef?.current?.children;
			const targetSlide = slides[index - 1];
			if (targetSlide) {
				targetSlide.scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
					inline: 'start',
				});
			}
		},
		[sliderRef]
	);

	return {
		currentSlide,
		length,
		sliderRef,
		isFirstSlide,
		isLastSlide,
		slideToRight: () => {
			if (isLastSlide) scrollToSlide(1);
			else scrollToSlide(currentSlide + 1);
		},
		slideToLeft: () => {
			if (isFirstSlide) scrollToSlide(length);
			else scrollToSlide(currentSlide - 1);
		},
	};
};

interface SliderProps {
	children: ReactNode;
	sliderRef: RefObject<HTMLDivElement>;
}

const Slider = ({ children, sliderRef }: SliderProps) => {
	return (
		<div
			className={styles.slider}
			ref={sliderRef}>
			{children}
		</div>
	);
};

const SliderControls = () => {
	const { currentSlide, length, slideToRight, slideToLeft } = useSlider();
	return (
		<div className={styles.sliderControls}>
			<button
				onClick={slideToLeft}
				className={styles.icons}>
				<VscArrowLeft />
			</button>
			<p>
				{currentSlide} / {length}
			</p>
			<button
				onClick={slideToRight}
				className={styles.icons}>
				<VscArrowRight aria-label='Right' />
			</button>
		</div>
	);
};

const image = [
	'https://plus.unsplash.com/premium_photo-1680346551652-556c2b7f7b64?q=80&w=1000&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1674854272283-ad31463a4f48?q=80&w=1000&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1673457751858-8369e6a8069a?q=80&w=1000&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1670238058331-6c7139fc2bed?q=80&w=1000&auto=format&fit=crop',
	'https://plus.unsplash.com/premium_photo-1680346551652-556c2b7f7b64?q=80&w=1000&auto=format&fit=crop',
	'https://plus.unsplash.com/premium_photo-1680346551652-556c2b7f7b64?q=80&w=1000&auto=format&fit=crop',
];

export default function SliderDemo() {
	const [enabled, setEnabled] = useState(true);

	return (
		<>
			{enabled && (
				<SliderRoot sliderControls={<SliderControls />}>
					{image.map((src, index) => (
						<img
							src={src}
							alt={`Slide ${index + 1}`}
							loading={index > 0 ? 'lazy' : 'eager'}
							className={styles.slide}
							key={index}
							data-index={index + 1}
							fetchPriority={index > 0 ? 'low' : 'high'}
						/>
					))}
				</SliderRoot>
			)}
			<button onClick={() => setEnabled(!enabled)}>
				{enabled ? 'Disable' : 'Enable'} Scroll Snap
			</button>
		</>
	);
}
