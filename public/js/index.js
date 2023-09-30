/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from "./mapbox";
import { login, logout } from "./login";
import { updateSettings } from "./updateSettings";


//DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');

//VALUES


//DELEGATION
if (mapBox) {
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    })
}

if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        updateSettings(name, email);
        // console.log(name, email);

    })
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}