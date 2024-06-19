const slideshow_template = document.querySelector('#slideshow_template').content;
const slideshow_slide_template = document.querySelector('#slideshow_slide_template').content;

export class SlideShow {
    constructor(parent, slides) {
        this.parent = parent;
        this.slides = slides || [];
        this.curr_page = 1;
        this.total_pages = 1;

        this.container = null;
        this._prev_button = null;
        this._next_button = null;
        this._slide_count = null;
    }

    setData(data) {
        this.slides = data;
        this.curr_page = 1;
        this.total_pages = 1;
        this._prev_button = null;
        this._next_button = null;
        this._slide_count = null;

        this.render();
    }

    template(data) {
        return document.createElement('div');
    }

    changePage(delta) {
        let new_page = this.curr_page + delta;
        if (new_page < 1) new_page = 1;
        if (new_page > this.total_pages) new_page = this.total_pages;

        this.curr_page = new_page;

        this.refresh();
    }

    _connectControls() {
        this._prev_button = this.container.querySelector('.slideshow_prev_button');
        this._next_button = this.container.querySelector('.slideshow_next_button');
        this._slide_count = this.container.querySelector('.slideshow_count');
        
        this._prev_button.addEventListener("click", (ev) => this.changePage(-1));
        this._next_button.addEventListener("click", (ev) => this.changePage(1));
    }

    _refreshButtons() {
        if (this.curr_page == 1) {
            this._prev_button.classList.add('disabled');
        } else {
            this._prev_button.classList.remove('disabled');
        }

        if (this.curr_page < this.total_pages) {
            this._next_button.classList.remove('disabled');
        } else {
            this._next_button.classList.add('disabled');
        }
    }

    refresh() {
        let slides_container = this.container.querySelector('.slideshow_slides');
        let total_width = slides_container.scrollWidth;
        let show_width = slides_container.getBoundingClientRect().width;
        let pages = Math.ceil(total_width / show_width);
        
        this.total_pages = pages;
        if (this.curr_page > pages) {
            this.curr_page = pages;
        }
        this._slide_count.innerText = `${this.curr_page} / ${pages}`;
        slides_container.scroll({ left: (this.curr_page - 1) * show_width, behavior: "smooth" });

        this._refreshButtons();
    }

    render() {
        let container = slideshow_template.cloneNode(true).querySelector('.slideshow_container');
        this.container = container;
        let slides_container = container.querySelector('.slideshow_slides');

        this.slides.forEach(slide_data => {
            let slide = slideshow_slide_template.cloneNode(true).querySelector('.slideshow_slide');
            slide.appendChild(this.template(slide_data));
            slides_container.appendChild(slide);
        });

        this.parent.replaceChildren(container);
        
        // instagram loader injection
        let insta_script = document.createElement('script');
        insta_script.src = "https://www.instagram.com/embed.js";
        this.parent.appendChild(insta_script)
        
        if (this._prev_button == null) {
            this._connectControls();
        }
        this.refresh();
    }
}
