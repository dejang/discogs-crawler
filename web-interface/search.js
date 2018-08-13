import ws from './socket';
import { renderReleases } from "./releases";

const decades = [1950, 1960, 1970, 1980, 1990, 2000, 2010];

const tpl = document.querySelector('#form-year-decade');
const searchCx = document.querySelector('#search');
const submit = document.querySelector('#submit');
const currentPage = document.querySelector('#currentPage');
const prev = document.querySelector("#previous");
const next = document.querySelector('#next');
const styleEl = document.querySelector('#style-input');

const formValues = {
    genre: 'Electronic',
    decade: 2010,
    year: 2010,
    style: 'Minimal',
    format: 'Vinyl',
    page: 1,
};

Object.defineProperty(formValues, 'toString', {
    enumerable: false,
    value() {
        const propNames = Object.getOwnPropertyNames(this);
        const params = [];
        propNames.forEach((p) => {
            const self = this;
            if (p === 'toString') return
            if (self[p] !== null || self[p] !== undefined) {
                params.push(`${p}=${self[p]}`);
            } else {
                params.push(`${p}=`);
            }
        });
        return params.join('&');
    }
})

const decadeInput = tpl.querySelector('#decade-input');
decadeInput.addEventListener('change', onChangeDecade);

const yearEl = searchCx.querySelector('#year-input');
yearEl.addEventListener('change', onChangeYear);

styleEl.addEventListener('change', (ev) => {
    formValues.style = ev.target.value;
})

prev.addEventListener('click', () => {
    if (formValues.page == 1) {
        return;
    }

    formValues.page--;
    currentPage.innerHTML = `Page: ${formValues.page}`;
    submit.click();
});

next.addEventListener('click', () => {
    formValues.page++;
    currentPage.innerHTML = `Page: ${formValues.page}`;
    submit.click();
});


function renderDecade() {
    decadeInput.innerHTML = '';
    decades.forEach(decade => {
        const opt = document.createElement('option');
        opt.innerHTML = `${decade}`;
        opt.value = `${decade}`;
        decadeInput.appendChild(opt);
    });
}

function onChangeYear(ev) {
    formValues.year = Number(ev.target.value);
}

function onChangeDecade(ev) {
    formValues.decade = Number(ev.target.value);
    yearEl.innerHTML = '';
    const start = decades[decades.indexOf(formValues.decade)];

    for (let i = start; i <= start + 9; i++) {
        const opt = document.createElement('option');
        opt.innerHTML = String(i);
        opt.value = String(i);
        opt.addEventListener('change', onChangeYear);
        yearEl.appendChild(opt);
    }
}

submit.addEventListener('click', () => {
    const params = formValues.toString();
    fetch(`releases/search?${params}`).then((res) => res.json()).then((releases) => {
        renderReleases(releases, document.querySelector('#content'));
    });
});

renderDecade();
decadeInput.value = formValues.decade;
onChangeDecade({ target: { value: formValues.decade } });
yearEl.value = formValues.year;
styleEl.value = formValues.style;
submit.click();