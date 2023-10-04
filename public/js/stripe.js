/* eslint-disable */
import stripe from 'stripe';
import axios from "axios";
import { showAlert } from './alert';

var stripInstance = stripe('pk_test_ugeZEXKeNhE1pZ5o4ndYihk0004zWQ6dZN');


export const bookTour = async tourId => {
    try {
        // 1) Get checkout session from API
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

        console.log("🚀 ~ file: stripe.js:10 ~ bookTour ~ session:", session)
        console.log("🚀 ~ file: stripe.js:16 ~ bookTour ~ stripInstance:", stripInstance)

        if (session.data.session.url)
            location.assign(session.data.session.url);
        // 2) Create checkout form + charge credit card
        // const stripe = await stripInstance.redirectToCheckout({
        //     sessionId: session.data.session.url
        // });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
}