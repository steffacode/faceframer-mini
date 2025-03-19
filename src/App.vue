<template>
    <main>
        <!--
        <img src="@/assets/user.jpg" ref="userimg" class="preloaded-img" />
        -->
        <img src="@/assets/stencil.webp" ref="stencil" class="preloaded-img" />

        <section v-if="!finished && !imageElement">
            <div class="btn custom-file">
                <input type="file" accept="image/*" class="custom-file-input labeladjust" @change="onImageChanged"
                    id="customFilePre">
                <label class="custom-file-label labeladjust btn-primary" for="customFilePre">Select your image…</label>
            </div>
        </section>

        <section v-if="imageElement">
            <AvaGen ref="avagen" :image="imageElement" :textOptions="textOptions" :image-options="imageOptions"
                :canvas-options="canvasOptions" :mode="imageOptions.stencilImage ? 'mixed' : 'custom_circle'" />

            <div>
                <a class="btn" @click.stop="onButtonClicked" :href="imageUrl" :download="downloadFileName">Download…</a>
            </div>
        </section>

        <section v-if="finished">
            Thank you! Your image has been downloaded.
        </section>

    </main>
</template>

<style lang="scss" scoped>
main {
    text-align: center;
}

.btn,
.custom-file {
    text-decoration: none;
    position: relative;
    display: inline-block;
    font: inherit;
    font-weight: bold;
    text-align: center;
    background-color: #333;
    color: white;
    padding: 0.4em;
    border-radius: 0.25em;
    border-color: transparent;
    padding-left: 1em;
    padding-right: 1em;
    cursor: auto;
}

.btn:hover {
    background-color: #999;
    color: black;
}

.custom-file {
    cursor: pointer;
    margin-top: 0.5em;

    input[type="file"] {
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    >* {
        z-index: 0;
        cursor: inherit;
    }
}

.preloaded-img {
    position: absolute;
    display: none;
    z-index: -1;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import AvaGen, { ICanvasOptions, IImageOptions, ITextOptions } from '@/components/AvaGen.vue';

export default defineComponent({
    name: "App",
    data: () => ({
        finished: false,
        downloadFileName: "",
        imageUrl: "",
        imageElement: undefined as undefined | HTMLImageElement,
        textOptions: {
            up: "I'm on top",
            down: "… and I'm at the bottom!",
            rotUp: 65,
            rotDown: 28,
            colorUp: "#ffffff",
            colorDown: "#ffffff",
            fontName: "Arial",
            fontSize: 40,
        } as ITextOptions,
        imageOptions: {
            scale: 1,
            x: null,
            y: 0,
            minScale: 0.5,
            maxScale: 3,
            rotation: 0,
            stencilImage: undefined,
        } as IImageOptions,
        canvasOptions: {
            w: 500,
            h: 500,
            circleStrokeWidth: 57,
            circleStrokeColor: "transparent",
            rot: 0,
        } as ICanvasOptions,
    }),
    mounted() {
        if (this.$refs.userimg) {
            this.imageElement = this.$refs.userimg as HTMLImageElement;
        }
        if (this.$refs.stencil) {
            this.imageOptions.stencilImage = this.$refs.stencil as HTMLImageElement;
        }
    },
    methods: {
        onButtonClicked() {
            this.downloadFileName = `avatar-${Date.now()}.png`;
            this.imageUrl = (this.$refs.avagen as typeof AvaGen).getImageDownloadUrl("image/png");
            this.$nextTick(() => {
                this.finished = true;
            });
        },
        onImageChanged(ev: Event) {
            var input = ev.target as HTMLInputElement;
            if (!input.files?.length) return;
            var file = input.files[0];
            var me = this;

            if (!file) return;

            var reader = new FileReader();
            reader.onload = function () {
                var dataURL = reader.result?.toString();
                if (!dataURL) return;
                var output = new Image();
                output.onload = function () {
                    me.imageElement = output;
                };
                output.src = dataURL;
            };
            reader.readAsDataURL(file);
        },
    },
    watch: {
        finished(newV) {
            if (newV) {
                this.imageElement = undefined;
            }
        },
    },
    components: {
        AvaGen,
    }
})
</script>
