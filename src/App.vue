<template>
    <header>
        MyFaceFramer
    </header>

    <main>
        <!--
        <img src="@/assets/stencil.webp" ref="stencil" class="preloaded-img" />
        <img src="@/assets/user.jpg" ref="userimg" class="preloaded-img" />
        -->
        <img ref="stencil" class="preloaded-img" />

        <article>

            <section v-if="!finished && !imageElement">
                <h1>
                    Hello!
                </h1>

                <p>
                    Decorate your profile image with
                    a nice frame :)
                </p>

                <p>
                    No registration, no login, no upload - just select your photo & choose the frame color that suits
                    you!
                </p>

                <div class="btn custom-file">
                    <input type="file" accept="image/*" class="custom-file-input labeladjust" @change="onImageChanged"
                        id="customFilePre">
                    <label class="custom-file-label labeladjust btn-primary" for="customFilePre">Select your
                        image…</label>
                </div>
            </section>

            <section v-if="imageElement">
                <div v-if="presets && (presets.length > 1)">
                    Preset:<br />
                    <select v-model="selectedPreset">
                        <option v-for="p in presets" :key="p.title" :value="p">{{ p.title }}</option>
                    </select>
                </div>

                <AvaGen class="avagen" ref="avagen" :image="imageElement" :textOptions="textOptions"
                    :image-options="imageOptions" :canvas-options="canvasOptions"
                    :mode="imageOptions.stencilImage ? 'mixed' : 'custom_circle'" />

                <div>
                    <p>
                        Click and drag the picture to fit it to the frame.
                    </p>

                    <p>
                        Hover over the picture and scroll (e.g., via mousewheel) to zoom in our out of the image.
                    </p>

                    <p>
                        When you're happy with the result, click "download" to save it on your device.
                    </p>

                    <p>
                        <a class="btn" id="download-btn" @click.stop="onButtonClicked" :href="imageUrl"
                            :download="downloadFileName">Download…</a>
                    </p>

                    <p>
                        If you'd like to frame another picture or start over, just reload the website.
                    </p>
                </div>
            </section>

            <section v-if="finished">
                <p>
                    Thank you! Your image has been downloaded.
                </p>

                <p>
                    If you'd like to frame another picture, just reload the website.
                </p>
            </section>

        </article>
    </main>

    <footer>
        <span>
        </span>

        <span>
            based on <a href="https://github.com/simmscmi/faceframer-mini" target="_blank">FaceFramer-mini</a>
        </span>
    </footer>
</template>

<style lang="scss" scoped>
a {
    color: inherit;
}

header {
    background-color: #004A96;
    color: white;
    border-bottom: solid 1px black;
    padding: 0.5rem;
    font-weight: bold;
}

main {
    text-align: center;
    flex-grow: 1;
    padding-bottom: 1rem;
    padding-top: 1rem;
    overflow-y: auto;
}

footer {
    display: flex;
    background-color: #004A96;
    color: white;
    font-size: small;
    justify-content: space-between;
    padding-left: 1em;
    padding-right: 1em;
    border-top: solid 1px black;

}

article {
    max-width: 50rem;
    margin: auto;
}

.avagen {
    margin: 1rem;
}

select,
.btn,
.custom-file {
    text-decoration: none;
    position: relative;
    display: inline-block;
    font: inherit;
    font-weight: bold;
    text-align: center;
    background-color: #00793A;
    color: white;
    padding: 0.4em;
    border-radius: 0.5em;
    border-color: transparent;
    padding-left: 1em;
    padding-right: 1em;
    cursor: pointer;
}

.btn:hover {
    background-color: #65AC1E;
    color: white;
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

#download-btn {
    margin: 1rem;
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
import { IPreset, presets } from '@/presets';

export default defineComponent({
    name: "App",
    data: () => ({
        presets,
        selectedPreset: null as null | IPreset,
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
        presetUrl: null as null | string,
    }),
    created() {
        this.getPresetUrlFromLocation();
    },
    mounted() {
        if (this.presets && this.presets.length) {
            this.selectedPreset = this.presets[0];
        }
        if (this.$refs.userimg) {
            this.imageElement = this.$refs.userimg as HTMLImageElement;
        }
        if (this.$refs.stencil) {
            this.imageOptions.stencilImage = this.$refs.stencil as HTMLImageElement;
        }
    },
    methods: {
        getPresetUrlFromLocation() {
            const p = new URLSearchParams(document.location.search);
            this.presetUrl = p.get("presetUrl");
        },
        loadPresetsFromSearchUrl() {
            if (!this.presetUrl) return;
            fetch(this.presetUrl, {
                method: "GET",
                cache: "no-cache",
            })
                .then(d => d.json())
                .then((data) => {
                    this.presets = data;
                })
                .catch(e => console.error(e));
        },
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
        selectedPreset(newV: null | IPreset) {
            if (!newV) return;
            this.textOptions = { ...this.textOptions, ...newV.textOptions };
            if (newV.canvasOptions) {
                this.canvasOptions.circleStrokeColor = newV.canvasOptions.circleStrokeColor;
                this.canvasOptions.circleStrokeWidth = newV.canvasOptions.circleStrokeWidth
                this.canvasOptions.rot = newV.canvasOptions.rot;
            }
            if (newV.stencilUrl) {
                (this.$refs.stencil as HTMLImageElement).src = newV.stencilUrl;
            } else {
                (this.$refs.stencil as HTMLImageElement).src = "";
            }
        },
        "document.location.search"(newV, oldV) {
            if (newV === oldV) return;
            this.getPresetUrlFromLocation();
        },
        presetUrl(newV, oldV) {
            if (newV == oldV) return;
            this.loadPresetsFromSearchUrl();
        },
        presets(newV) {
            this.selectedPreset = null;
            if (!newV || (newV.length == 0)) {
                return;
            }
            this.selectedPreset = newV[0];
        },
    },
    components: {
        AvaGen,
    }
})
</script>
