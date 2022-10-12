const menu_height = 500;
let links = {}
window.addEventListener("load", function() {
    var sections = document.querySelectorAll('section');

    document.querySelectorAll('#menu a').forEach((el) => {
        links[el.hash] = el;
    });

    document.getElementsByTagName("main")[0].addEventListener("scroll", (ev) => { scrollHandler(ev.target, sections, links) });
    scrollHandler(document.getElementsByTagName("main")[0], sections, links);

    var schedule_container = document.querySelector('#schedule .content');

    fetch('./js/schedule.json', {cache: 'no-store'})
        .then((response) => response.json())
        .then((json) => load_schedule(json, schedule_container));
});

function scrollHandler(target, sections, links) {
    var scroll = target.scrollTop;
    for (var i in links) {
        links[i].classList.remove('active');
    }
    var current_section = '';
    sections.forEach((el) => {
        if (scroll + menu_height >= el.offsetTop) {
            if (links[`#${el.id}`]) {
                current_section = `#${el.id}`;
            }
        } 
    });
    links[current_section].classList.add('active');
}

function load_schedule(json_data, parent) {
    let years = {};
    if (json_data && json_data.length > 0) {
        json_data.forEach((event) => {
            let year = new Date(event.date).getFullYear();
            if (!years[year]) years[year] = [];
            years[year].push(event);
        });
        
        let schedule_html = "";
        for (let y in years) {
            let events_html = "";
            years[y].forEach((e) => {
                let date = new Date(e.date);
                date = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });

                let flyer = "";
                if (e.flyer) {
                    flyer = `<div class="flyer">
                        <img src="flyers/${e.flyer}" />
                    </div>`;
                }
                events_html += `
                <article>
                    <div class="header">
                        <div class="date">${date.toUpperCase()} - ${e.show_start}h</div>
                        <div class="house">
                            <a href="${e.house_link}" target="_blank">${e.house_name}</a>
                        </div>
                    </div>
                    <div class="address">
                        <a target="_blank" href="${e.house_address_link}">
                            ${e.house_address}
                        </a>
                    </div>
                    ${flyer}
                </article>
                `;
            });
    
            schedule_html += `<h2>${y}</h2>`;
            schedule_html += `<div class="year">${events_html}</div>`;
        };
        parent.innerHTML = schedule_html;
    }    
}
