const schedule_year_template = document.querySelector('#schedule_year_template').content;
const schedule_month_template = document.querySelector('#schedule_month_template').content;
const schedule_date_template = document.querySelector('#schedule_date_template').content;

export class Schedule {
    constructor(parent, dates) {
        this.parent = parent;
        this.dates = dates || [];
        this.curr_date = new Date();
    }

    setData(data) {
        this.dates = data;
        this.render();
    }

    template(data) {
        return document.createElement('div');
    }

    _connectControls() {
        let years = this.parent.querySelectorAll('.year_label');
        years.forEach((label) => {
            label.addEventListener("click", (el) => {
                let container =  el.target.nextElementSibling;
                container.classList.toggle('closed');
            });
        });

        let months = this.parent.querySelectorAll('.month_label');
        months.forEach((label) => {
            label.addEventListener("click", (el) => {
                el.target.nextElementSibling.classList.toggle('closed');
            });
        });
    }

    _sortDates(dates, ascending) {
        let dates_copy = dates.slice()
        dates_copy.sort((a, b) => {
            let a_date = new Date(a.date);
            let b_date = new Date(b.date);

            if (ascending)
                return a_date-b_date;
            else
                return b_date-a_date;
        });

        return dates_copy;
    }

    render() {
        this.parent.replaceChildren();

        let ordered_dates = {};
        let sorted_dates = this._sortDates(this.dates);
        
        sorted_dates.forEach((e) => {
            let date = new Date(e.date);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            if (ordered_dates[year] == undefined) {
                ordered_dates[year] = {}
            }
            if (ordered_dates[year][month] == undefined) {
                ordered_dates[year][month] = [];
            }

            ordered_dates[year][month].push(e);
        });

        let years = Object.keys(ordered_dates)
        years.reverse();
        let curr_year = ''+this.curr_date.getFullYear();
        let curr_month = ''+(this.curr_date.getMonth() + 1);
        curr_month = (curr_month < 10) ? '0'+curr_month : curr_month;
        let curr_month_year = `${curr_year}-${curr_month}`;
        
        for (let y in years) {
            let year_templ = schedule_year_template.cloneNode(true);
            let year_container = year_templ.querySelector('.schedule_year_container')
            year_container.dataset.year = years[y];
            if (years[y] == curr_year) {
                year_container.classList.remove('closed');
            }

            year_templ.querySelector('.year_label').innerText = years[y];

            let months = Object.keys(ordered_dates[years[y]]);
            months.reverse();
            for (let m in months) {
                let month_templ = schedule_month_template.cloneNode(true);
                let month_container = month_templ.querySelector('.schedule_month_container');
                let this_month = (months[m] < 10) ? '0'+months[m] : months[m];
                let this_month_year =`${years[y]}-${this_month}`;
                month_container.dataset.month = this_month_year;
                if (this_month_year >= curr_month_year) {
                    month_container.classList.remove('closed');
                }

                for (let date_idx in ordered_dates[years[y]][months[m]]) {
                    let row = ordered_dates[years[y]][months[m]][date_idx];
                    let day_container = schedule_date_template.cloneNode(true);
                    let date = new Date(row.date)
                    
                    month_templ.querySelector('.month_label').innerText = date.toLocaleString('default', { month: 'long' });
                    
                    let date_str = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
                    if (row.show_start) date_str += ` - ${row.show_start}h`;
                    day_container.querySelector('.date').innerText = date_str;

                    let house_str = row.house_name;
                    if (row.house_link) house_str = `<a href="${row.house_link}" target="_blank">${row.house_name}</a>`;
                    day_container.querySelector('.house').innerHTML = house_str;

                    let house_addr_str = row.house_address || '';
                    if (row.house_address_link) {
                        house_addr_str = `<a target="_blank" href="${row.house_address_link}">
                                                ${row.house_address}
                                            </a>`;
                    }
                    day_container.querySelector('.address').innerHTML = house_addr_str;

                    if (row.flyer) {
                        let flyer_link = row.flyer_link || row.house_link || row.house_address_link;
                        let flyer_link_el = day_container.querySelector(".flyer a");
                        if (flyer_link) {
                            flyer_link_el.href = flyer_link;
                        } else {
                            flyer_link_el.classList.add('disabled');
                        }
                        day_container.querySelector('.flyer img').src = `flyers/${row.flyer}`;
                    }
                    month_container.appendChild(day_container);
                }
                year_container.appendChild(month_templ);
            } // for m in months
            this.parent.appendChild(year_templ);
        } // for y in years

        this._connectControls();
    }
}