import { SliderRoot, useSlider } from '../index';
import styles from './styles.module.scss';
import { VscArrowLeft, VscArrowRight } from 'react-icons/vsc';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';

export function SliderWithGrid({ images }: { images: string[] }) {
	return (
		<div className={styles.container}>
			<SliderRoot
				sliderControls={<SliderControls />}
				thumbnails={<Thumbnails images={images} />}>
				{images.map((src, index) => (
					<img
						src={src}
						alt={`Slide ${index + 1}`}
						loading='lazy'
						className={styles.slide}
						key={index}
						data-index={index + 1}
						fetchPriority={index > 0 ? 'low' : 'high'}
						style={{ display: 'block' }}
					/>
				))}
			</SliderRoot>
		</div>
	);
}

function createThumbnailSrc(src: string) {
	const url = new URL(src);
	url.searchParams.set('w', '200');
	url.searchParams.set('h', '200');
	url.searchParams.set('fit', 'crop');
	return url.toString();
}

function Thumbnails({ images }: { images: string[] }) {
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
		<div>
			<div
				className={styles.thumbnails}
				ref={thumbnailsRef}>
				{images.map((src, index) => (
					<img
						src={createThumbnailSrc(src)}
						alt={`Slide ${index + 1}`}
						className={clsx(
							styles.slide,
							index + 1 === currentSlide && styles.active,
						)}
						key={index}
						data-index={index + 1}
						style={{ display: 'block' }}
						onClick={() => {
							scrollToSlide(index + 1);
						}}
						loading='lazy'
					/>
				))}
			</div>
		</div>
	);
}

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
