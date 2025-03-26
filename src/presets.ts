import { ITextOptions } from "./components/AvaGen.vue";
import stencilUrl from "@/assets/basf-stencil.webp?inline";

interface IPreset {
    title: string;
    textOptions: ITextOptions;
    stencilUrl?: string;
    canvasOptions?: {
        circleStrokeWidth: number,
        circleStrokeColor: string,
        rot: number,
    }
}

const presets: IPreset[] = [
    {
        title: "BasfPreset",
        textOptions: {
            up: "",
            down: "#OurPlasticsJourney",
            rotUp: 65,
            rotDown: 42,
            colorUp: "#ffffff",
            colorDown: "#ffffff",
            fontName: "Helvetica",
            fontSize: 40,
        },
        stencilUrl: stencilUrl,
        canvasOptions: {
            circleStrokeColor: "transparent",
            circleStrokeWidth: 57,
            rot: 0,
        },
    },
];

export type { IPreset }
export { presets };
