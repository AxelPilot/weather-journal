/* Global Variables */

const baseURL = 'https://api.openweathermap.org/data/2.5/weather';
let apiKey = {};

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
];

// Create a new date instance dynamically with JS.
const d = new Date();
const newDate = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

/**
 * Retrieve data from the server.
 * @param {string} url 
 * @returns data retrieved from the server.
 */
const retrieveData = async (url = '') => {
    const res = await fetch(url);
    try {
        return await res.json();
    } catch (error) {
        console.log('error', error);
    }
};

/**
 * Post data to the server.
 * @param {string} url 
 * @param {Object} data to be posted to the server.
 * @returns server response.
 */
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    try {
        return await response.json();
    } catch (error) {
        console.log(error);
    }
};

/**
 * Retrieve OpenWeatherMap API Data.
 * @param {string} baseURL 
 * @param {number} zipCode 
 * @param {string} country 
 * @param {string} apiKey 
 * @returns weather data for the specified location.
 */
const retrieveWeatherData = async (baseURL, zipCode, country, apiKey) => {
    return await retrieveData(
        `${baseURL}?zip=${zipCode},${country}&appid=${apiKey}`
    );
}

/**
 * Retrieve OpenWeatherMap API key from server.
 */
(() => {
    retrieveData('/apiKeys')
    .then(apiKeys => apiKey = apiKeys);
})();

/**
 * Build dropdown list with all the countries in the world.
 */
(() => {
    retrieveData('/countryCodes')
        .then((countryCodes) => {
            const fragment = document.createDocumentFragment();
            countryCodes.forEach((country) => {
                const newElement = document.createElement('option');
                newElement.value = country.code;
                newElement.innerHTML = country.name;
                fragment.appendChild(newElement);
            });
            document.getElementById('country').appendChild(fragment);
        });
})();

/**
 * Retrieve weather data from the OpenWeatherMap API, and generate
 * a new weather journal post when the 'Generate' button is clicked.
 */
(() => {
    document.getElementById('generate').addEventListener('click', (evt) => {
        evt.preventDefault();
        // Set default country to 'US' if no country is selected.
        if (document.getElementById('country').value == '') {
            document.getElementById('country').value = 'US';
        }

        // Retrieve weather data from the OpenWeatherMap API.
        retrieveWeatherData(
            baseURL, document.getElementById('zip').value,
            document.getElementById('country').value, `${apiKey.API_KEY}&units=metric`)
            .then((data) => {
                if (data.cod != 200) {
                    alert(
                        data.message.charAt(0).toUpperCase() +
                        data.message.slice(1) + '. Please try again.');
                } else {
                    // Send weather journal data to the server.
                    postData('/addWeatherJournal', {
                        temp: `${data.main.temp}°C`,
                        zip: document.getElementById('zip').value,
                        city: data.name, country: data.sys.country, date: newDate,
                        content: document.getElementById('feelings').value
                    })
                        .then(() => {
                            // Retrieve weather journal data from the server,
                            // and display the data on the screen.
                            retrieveData('/weatherJournal')
                                .then((data) => {
                                    document.getElementById('date').innerHTML = data.date;
                                    document.getElementById('temp').innerHTML =
                                        `${data.temp} in ${data.city}, ${data.country}`;
                                    document.getElementById('content').innerHTML = data.content;
                                });

                        });
                }
            });
    });
})();
