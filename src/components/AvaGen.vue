<template>
    <div class="ava-gen">
        <div class="ava-canvas" ref="c"></div>
    </div>
</template>

<style lang="scss" scoped>
.ava-gen {
    text-align: center;

    .ava-canvas {
        display: inline-block;
    }
}
</style>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Konva from 'konva';

interface ITextOptions {
    up: string,
    down: string,
    rotUp: number,
    rotDown: number,
    colorUp: string,
    colorDown: string,
    fontName: string,
    fontSize: number,
}

interface ICanvasOptions {
    w: number,
    h: number,
    circleStrokeWidth: number,
    circleStrokeColor: string,
    rot: number,
}

interface IImageOptions {
    scale: number,
    x: null | number,
    y: number,
    minScale: number,
    maxScale: number,
    rotation: number,
    stencilImage: undefined | HTMLImageElement,
}

export type { ITextOptions, ICanvasOptions, IImageOptions }

export default defineComponent({
    name: "AvaGen",
    props: {
        image: {
            type: Image,
            default: () => null
        },
        textOptions: {
            type: Object as PropType<ITextOptions>,
            default: () => null
        },
        imageOptions: {
            type: Object as PropType<IImageOptions>,
            default: () => null
        },
        canvasOptions: {
            type: Object as PropType<ICanvasOptions>,
            default: () => null
        },
        mode: {
            type: String as PropType<"custom_circle" | "premade_stencils" | "mixed">,
            default: "custom_circle"
        },
    },
    data: () => ({
        stage: null as null | Konva.Stage,
    }),
    mounted: function () {
        this.konva();
    },
    methods: {
        konva: function () {
            if (!this.image || !this.$refs.c) return;
            const me = this;
            const stage = new Konva.Stage({
                container: this.$refs.c as HTMLDivElement,
                width: this.canvasOptions.w,
                height: this.canvasOptions.h
            });
            this.stage = stage;

            const layer = new Konva.Layer();

            // user image scaling
            const dh = this.canvasOptions.h * this.imageOptions.scale;
            const dw = (this.image.width / this.image.height) * dh;
            if (this.imageOptions.x == null) {
                this.imageOptions.x = (this.canvasOptions.w - dw) / 2;
            }
            const image = new Konva.Image({
                height: dh,
                width: dw,
                x: this.imageOptions.x,
                y: this.imageOptions.y,
                image: this.image,
                draggable: true
            });

            image.on('mouseover', function () {
                document.body.style.cursor = 'move';
            });
            image.on('mouseout', function () {
                document.body.style.cursor = 'default';
            });

            image.on("dragend", function () {
                me.imageOptions.x = image.attrs.x;
                me.imageOptions.y = image.attrs.y;
            });

            image.on("wheel", function (ev) {
                if (ev.evt.deltaY > 0) {
                    me.imageOptions.scale = Math.round((me.imageOptions.scale - 0.02) * 100) / 100;
                    me.imageOptions.scale = Math.max(me.imageOptions.minScale, me.imageOptions.scale);
                }
                if (ev.evt.deltaY < 0) {
                    me.imageOptions.scale = Math.round((me.imageOptions.scale + 0.02) * 100) / 100;
                    me.imageOptions.scale = Math.min(me.imageOptions.maxScale, me.imageOptions.scale);
                }
            });

            // user image clipping & rotation
            const group = new Konva.Group({
                x: me.canvasOptions.w / 2,
                y: me.canvasOptions.h / 2,
                rotation: me.imageOptions.rotation,
                offsetX: me.canvasOptions.w / 2,
                offsetY: me.canvasOptions.h / 2,
                clipFunc: function (ctx) {
                    ctx.arc(me.canvasOptions.w / 2,
                        me.canvasOptions.h / 2,
                        (me.canvasOptions.w / 2), // - (1 * me.canvasOptions.circleStrokeWidth),
                        0, Math.PI * 2,
                        false);
                },
                draggable: false,
            });
            group.add(image);

            layer.add(group);

            if (((this.mode == "mixed") || (this.mode == 'premade_stencils')) && (this.imageOptions.stencilImage)) {
                const stencilImage = new Konva.Image({
                    height: me.canvasOptions.h,
                    width: me.canvasOptions.w,
                    x: 0,
                    y: 0,
                    image: this.imageOptions.stencilImage,
                    listening: false,
                });
                layer.add(stencilImage);
            }

            if ((this.mode == "mixed") || (this.mode == 'custom_circle')) {
                const circle = new Konva.Circle({
                    x: me.canvasOptions.w / 2,
                    y: me.canvasOptions.h / 2,
                    radius: (me.canvasOptions.w / 2) - (0.5 * me.canvasOptions.circleStrokeWidth),
                    stroke: me.canvasOptions.circleStrokeColor,
                    strokeWidth: me.canvasOptions.circleStrokeWidth,
                    listening: false
                });
                layer.add(circle);

                const lowerArc = function () {
                    const center = { x: me.canvasOptions.w / 2, y: me.canvasOptions.h / 2 };
                    const coord = (center.x - me.canvasOptions.circleStrokeWidth / 2);
                    return `m-${coord},0 a ${coord},${coord} 0 1,0 ${2 * coord},0 a ${coord},${coord} 0 1,0 -${2 * coord},0`;
                }
                let textpath = new Konva.TextPath({
                    x: me.canvasOptions.w / 2,
                    y: me.canvasOptions.h / 2,
                    rotation: -me.textOptions.rotDown,
                    fill: me.textOptions.colorDown,
                    fontSize: me.textOptions.fontSize,
                    fontStyle: "bold",
                    fontFamily: me.textOptions.fontName,
                    text: me.textOptions.down,
                    data: lowerArc(),
                });
                layer.add(textpath);

                const upperArc = function () {
                    const center = { x: me.canvasOptions.w / 2, y: me.canvasOptions.h / 2 };
                    const coord = (center.x - me.canvasOptions.circleStrokeWidth / 2);
                    return `m-${coord},0 a ${coord},${coord} 0 1,1 ${2 * coord},0 a ${coord},${coord} 0 1,1 -${2 * coord},0`;
                };
                textpath = new Konva.TextPath({
                    x: me.canvasOptions.w / 2,
                    y: me.canvasOptions.h / 2,
                    rotation: me.textOptions.rotUp,
                    fill: me.textOptions.colorUp,
                    fontSize: me.textOptions.fontSize,
                    fontStyle: "bold",
                    fontFamily: me.textOptions.fontName,
                    text: this.textOptions.up,
                    data: upperArc(),
                });
                layer.add(textpath);
            }

            stage.add(layer);
        },
        getImageDownloadUrl(mimeType: string): undefined | string {
            return this.stage?.toDataURL({
                mimeType: mimeType
            });
        }
    },
    watch: {
        textOptions: {
            deep: true,
            handler: function () {
                this.konva();
            }
        },
        imageOptions: {
            deep: true,
            handler: function () {
                this.konva();
            }
        },
        canvasOptions: {
            deep: true,
            handler: function () {
                this.konva();
            }
        },
        image(newV) {
            if (!newV) return;
            this.imageOptions.x = null;
            this.imageOptions.y = 0;
            this.konva();
        },
        mode() {
            this.konva();
        },
    },
});
</script>
