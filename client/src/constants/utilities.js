import React from "react";
import { Slide, toast } from "react-toastify";

let keysToRemove = ["token", "loginUserData", "shippingInfo","cartItems"];

export const getJWTToken = () => localStorage.getItem('token');
export let authorizationToken = `Bearer ${getJWTToken()}`;
export const isLoggedIn = getJWTToken();

const setJWTToken = (token) => {
    localStorage.setItem('token', token);
};

export const setUserData = (userData) => {
    localStorage.setItem('loginUserData', JSON.stringify(userData));
}

export const storeTokenInLS = (serverToken) => {
    setJWTToken(serverToken);
    return localStorage.setItem("token", serverToken);
};

const clearLocalStorage = () => {
    localStorage.removeItem("shippingInfo");
    for (let key of keysToRemove) {
        localStorage.removeItem(key);
    }
}
export const LogoutUser = () => {
    setJWTToken(null);
    return clearLocalStorage();
};

export const getThemeColor = () => {
    const user = localStorage.getItem("loginUserData") ? JSON.parse(localStorage.getItem("loginUserData")) : {};
    return user && user.themeColor ? user.themeColor : "light";
}

export const checkPassword = (password) => {
    const strength = {
        1: "weak",
        2: "medium",
        3: "strong",
        4: "strong",
    };

    const getIndicator = (password, strengthValue) => {
        strengthValue.upper = /[A-Z]/.test(password);
        strengthValue.lower = /[a-z]/.test(password);
        strengthValue.numbers = /\d/.test(password);
        strengthValue.length = password.length > 7;

        let strengthIndicator = 0;

        for (let metric in strengthValue) {
            if (strengthValue[metric] === true) {
                strengthIndicator++;
            }
        }

        return strength[strengthIndicator] ?? "";
    };

    const getStrength = (password) => {
        let strengthValue = {
            upper: false,
            numbers: false,
            lower: false,
        };

        return getIndicator(password, strengthValue);
    };

    return getStrength(password);

}

/**
 * only allow number with maxlength
 * @param {*} e input element
 * @returns element
 */
const handleNumberValidation = (e) => {
    if (e.target.value === e.target.maxLength) {
        e.preventDefault();
    }
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    return e;
}

const  setThemeAttributes = (
    theme,
    darkDisplay,
    lightDisplay,
    sunDisplay,
    moonDisplay
)  => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    if (document.getElementById(`${theme}-layout`)) {
        document.getElementById(`${theme}-layout`).checked = true;
    }

    document
        .querySelectorAll(`.${darkDisplay}`)
        .forEach((el) => (el.style.display = "none"));
    document
        .querySelectorAll(`.${lightDisplay}`)
        .forEach((el) => (el.style.display = "flex"));
    document
        .querySelectorAll(`.${sunDisplay}`)
        .forEach((el) => (el.style.display = "none"));
    document
        .querySelectorAll(`.${moonDisplay}`)
        .forEach((el) => (el.style.display = "flex"));
}

export const addToCartInfoToast = () => {
    toast.info(
        "Item added to cart!",
        {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            closeButton: false,
            theme: "colored",
            icon: React.createElement(
                'span',
                { className: 'fs-6 text-center' },
                React.createElement('i', { className: 'ti ti-circle-check' })
            ),
            className: "custom-toast",
            style: {
                backgroundColor: "#635BFF",
                color: "white",
                fontSize: "1rem",
            },
            toastId: "unique-toast-id",
            transition: Slide,
        }
    );
}

export const formatToINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

export const formatDate =(isoString) =>{
    const date = new Date(isoString);

    // Helper function to pad single digits with leading zero
    const pad = (num) => (num < 10 ? "0" + num : num);

    // Extract date components
    const day = pad(date.getUTCDate());
    const month = pad(date.getUTCMonth() + 1); // Months are zero-indexed
    const year = date.getUTCFullYear().toString().slice(-2); // Get last two digits of the year
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const indiaTimeString = date.toLocaleString('en-IN', options);

    // Array of weekday names
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const weekday = weekdays[date.getUTCDay()];

    // Format date and time
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}`;

    return `${indiaTimeString} ${weekday}`;
  }

export { handleNumberValidation, setThemeAttributes };