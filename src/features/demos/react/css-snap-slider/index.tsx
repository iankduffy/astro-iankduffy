import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
	Children,
	type ReactNode,
	type RefObject,
} from 'react';
import styles from './styles.module.scss';
import { VscArrowLeft, VscArrowRight } from 'react-icons/vsc';
import clsx from 'clsx';

const SliderContext = createContext<{
	sliderRef: null | RefObject<HTMLDivElement>;
	count: number;
}>({
	sliderRef: null,
	count: 0,
});

interface SliderRootProps {
	children: React.ReactNode;
	sliderControls: React.ReactNode;
	thumbnails?: React.ReactNode;
}

const SliderRoot = ({
	children,
	sliderControls,
	thumbnails,
}: SliderRootProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const count = Children.count(children);
	return (
		<SliderContext.Provider value={{ sliderRef: ref, count }}>
			<div className={styles.sliderContainer}>
				<Slider sliderRef={ref}>{children}</Slider>
				{sliderControls}
			</div>
			{thumbnails}
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

interface ScrollSnapChangingEvent extends Event {
	snapTargetInline: HTMLElement;
}

function handleScrollSnapChange({
	slider,
	callback,
}: {
	slider: HTMLDivElement;
	callback: (number: number) => void;
}) {
	if ('onscrollsnapchanging' in window) {
		slider.addEventListener('scrollsnapchanging', (event) => {
			console.log('scrollsnapchanging', event);
			const newIndex = Number(
				(event as ScrollSnapChangingEvent)?.snapTargetInline.dataset.index
			);
			callback(newIndex);
		});
		return () => {
			console.log('disconnecting observer');
			slider.removeEventListener('scrollsnapchanging', (event) => {
				const newIndex = Number(
					(event as ScrollSnapChangingEvent)?.snapTargetInline.dataset.index
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
	const length = context.count;
	const { sliderRef } = context;

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
			const targetSlide = slides[index - 1] as HTMLElement;
			if (!targetSlide) return;
			sliderRef.current.scrollTo({
				left: targetSlide?.offsetLeft,
				behavior: 'smooth',
			});
		},
		[sliderRef]
	);

	return {
		currentSlide,
		length: context.count,
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
		scrollToSlide,
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
	'https://images.unsplash.com/photo-1581886038633-4c46f67b0e3d?q=80&w=1000&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1674854272283-ad31463a4f48?q=80&w=1000&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1673457751858-8369e6a8069a?q=80&w=1000&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1670238058331-6c7139fc2bed?q=80&w=1000&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1587812063827-3d36e5c5b8e3?q=80&w=1000&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1611237147279-a98066529cdb?q=80&w=1000&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1673457749223-b47a95a3dde6?q=80&w=1000&auto=format&fit=crop',
];

export default function SliderDemo() {
	return (
		<SliderRoot
			sliderControls={<SliderControls />}
			thumbnails={<Thumbnail images={image} />}>
			{image.map((src, index) => (
				<img
					src={src}
					alt={`Slide ${index + 1}`}
					loading={index > 0 ? 'lazy' : 'eager'}
					className={styles.slide}
					key={index}
					data-index={index + 1}
					fetchPriority={index > 0 ? 'low' : 'high'}
					style={{ display: 'block' }}
				/>
			))}
		</SliderRoot>
	);
}

function Thumbnail({ images }: { images: string[] }) {
	const { currentSlide, scrollToSlide } = useSlider();
	const thumbnailsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!thumbnailsRef?.current) return;
		const thumbnails = thumbnailsRef?.current?.children;
		const currentThumbnail = thumbnails[currentSlide - 1] as HTMLElement;
		if (!currentThumbnail) return;
		thumbnailsRef.current.scrollTo({
			left: currentThumbnail?.offsetLeft,
			behavior: 'smooth',
		});
	}, [currentSlide, thumbnailsRef]);

	return (
		<div
			ref={thumbnailsRef}
			className={styles.thumbnails}>
			{images.map((src, index) => (
				<img
					src={src}
					alt={`Slide ${index + 1}`}
					loading={index > 0 ? 'lazy' : 'eager'}
					className={clsx(
						styles.slide,
						index + 1 === currentSlide && styles.active
					)}
					key={index}
					data-index={index + 1}
					fetchPriority={index > 0 ? 'low' : 'high'}
					style={{ display: 'block' }}
					onClick={() => {
						scrollToSlide(index + 1);
					}}
				/>
			))}
		</div>
	);
}
