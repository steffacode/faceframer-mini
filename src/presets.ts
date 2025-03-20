import { ITextOptions } from "./components/AvaGen.vue";
import stencilUrl from "@/assets/stencil.webp";

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
        title: "DemoPreset",
        textOptions: {
            up: "I'm on top",
            down: "… and I'm at the bottom!",
            rotUp: 65,
            rotDown: 28,
            colorUp: "#ffffff",
            colorDown: "#ffffff",
            fontName: "Arial",
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
