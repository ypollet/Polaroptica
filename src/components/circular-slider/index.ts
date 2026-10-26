export { default as CircularSlider } from './CircularSlider.vue'

export interface CircularSliderProps {
    name?: string;
    /** The value of the slider when initially rendered. Use when you do not need to control the state of the slider. */
    defaultValue?: number;
    /** The controlled value of the slider. Can be bind as `v-model`. */
    modelValue?: number;
    /** When `true`, prevents the user from interacting with the slider. */
    disabled?: boolean;
    /** The orientation of the circular slider. */
    orientation?: 'clockwise' | 'anti-clockwise';
    /** The minimum value for the range. */
    min?: number;
    /** The maximum value for the range. */
    max?: number;
    /** The stepping interval. */
    steps?: Set<number>;
    /** The minimum permitted steps between multiple thumbs. */
    minStepsBetweenThumbs?: number;
}

export type CircularSliderEmits = {
    /**
     * Event handler called when the slider value changes
     */
    'update:modelValue': [payload: number | undefined];
    /**
     * Event handler called when the value changes at the end of an interaction.
     *
     * Useful when you only need to capture a final value e.g. to update a backend service.
     */
    'valueCommit': [payload: number];
};
