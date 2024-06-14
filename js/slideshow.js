class SlideShow {
    constructor(parent, slides) {
        this.parent = parent;
        this.slides = slides || [];
    }

    render() {
        let slides = ``;
        this.slides.forEach(slide => {
            slides += `<div class="slideshow_slide">${slide}</div>`;
        });
        let root_el += `<div class="slideshow_main">
                            <div class="slideshow_container">${slides}</div>
                            <button class="slideshow_ctrl_prev">&#10094;</button>
                            <button class="slideshow_ctrl_next">&#10095;</button>
                        </div>`;
        this.parent.innerHTML = root_el;
    }
}