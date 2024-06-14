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
    let today = new Date()

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
                date_str = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });

                let flyer = "";
                if (e.flyer) {
                    let flyer_link = e.flyer_link || e.house_link || e.house_address_link;
                    flyer = `<div class="flyer">
                        <a target="_blank" href="${flyer_link}">
                            <img src="flyers/${e.flyer}" />
                        </a>
                    </div>`;
                }
                let date_text = date_str.toUpperCase()
                if (e.show_start) {
                    date_text += ` - ${e.show_start}h`
                }
                let house_text = e.house_name;
                if (e.house_link) {
                    house_text = `<a href="${e.house_link}" target="_blank">${e.house_name}</a>`
                }
                let house_addr_text = e.house_address || '';
                if (e.house_address_link) {
                    house_addr_text = `<a target="_blank" href="${e.house_address_link}">
                                            ${e.house_address}
                                        </a>`;
                }
                events_html += `
                <article>
                    <div class="header">
                        <div class="date">${date_text}</div>
                        <div class="house">
                            ${house_text}
                        </div>
                    </div>
                    <div class="address">
                        ${house_addr_text}
                    </div>
                    ${flyer}
                </article>
                `;
            });
    
            // schedule_html += `<h2><a class="toggle_year" href="#">${y}</a></h2>`;
            schedule_html += `<h2>${y}</h2>`;
            let is_closed = y < today.getFullYear() ? true : false;
            schedule_html += `<div class="year ${closed ? 'closed' : ''}" data-year="${y}">${events_html}</div>`;
        };
        parent.innerHTML = schedule_html;
    }    
}

function load_videos(json_data, parent) {

}
