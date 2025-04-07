import { createContext, useContext, useEffect, useRef, useState } from "react";
import styles from './styles.module.scss'

const SliderContext = createContext({})

const SliderRoot = ({children, sliderControls}) => {
    const ref = useRef(null)
    console.log('SliderRoot ref', ref)
    return (
    <SliderContext.Provider value={{sliderRef: ref}}>
        <Slider sliderRef={ref}>
            {children}
        </Slider>
        {sliderControls}
    </SliderContext.Provider>
    )
}

const useSliderContext = () => {
    const context = useContext(SliderContext)
    if (!context) {
        throw new Error("useSlider must be used within a SliderProvider")
    }
    return context
}

const useSlider = () => {
    const context = useSliderContext()
    const [currentSlide, setCurrentSlide] = useState(0)
    const { sliderRef } = context

    console.log('useSlider', context)

    useEffect(() => {
        if (!sliderRef.current) return
        const slider = sliderRef.current
        slider.addEventListener('scrollend', (e) => {
            console.log(e)
        })
        // sliderRef.current.addEventListner('scrollend', (e) => {
        //     console.log(e)
        // })
    }, [sliderRef])
    return context
}

const Slider = ({children}) => {
    const { sliderRef } = useSlider()
    return (
        <div className={styles.slider} ref={sliderRef}>
            {children}
        </div>
    )
}

const SliderControls = () => {
    const context = useSlider()
    return (
        <div className="slider-controls">
            <button onClick={() => alert('awui')}>Previous</button>
            <p>Slide Number / Slider Length</p>
            <button>Next</button>
        </div>
    )
}

export function SliderDemo() {

    return (
        <SliderRoot sliderControls={<SliderControls />}>
            <div className={styles.slide}>Slide 1</div>
            <div className={styles.slide}>Slide 2</div>
            <div className={styles.slide}>Slide 3</div>
            <div className={styles.slide}>Slide 4</div>
            <div className={styles.slide}>Slide 5</div>
            <div className={styles.slide}>Slide 6</div>
            <div className={styles.slide}>Slide 7</div>
            <div className={styles.slide}>Slide 8</div>  
        </SliderRoot>
    )
}
