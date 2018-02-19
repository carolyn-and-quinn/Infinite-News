// Main newsApp Object
const newsApp = {};

// Infinite Scroll Function
newsApp.infinite = function () {
    $(window).scroll(function () {
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            newsApp.getNews(newsApp.pagecount);
            newsApp.pagecount = newsApp.pagecount + 1;
            console.log("scroll");
        }
    });
}

// Global Variable 
newsApp.pagecount = 2;

// Smooth Scroll
$('a').smoothScroll({
    offset: 0
});

// Get News Function
newsApp.getNews = (pageNumber, region) => {
    $.ajax({
        url: 'https://newsapi.org/v2/top-headlines',
        method: 'GET',
        dataType: 'json',
        data: {
            apiKey: 'c6efa387136e459096d7201bab344662',
            language: 'en',
            pageSize: 10,
            page: pageNumber,
            country: region
        }
    }).then(function(res) {
        let articles = res.articles;
        // console.log(articles);
        newsApp.printNews(articles);
    });
};

// Print News Function
newsApp.printNews = function(articles) {
    // console.log(articles);
    articles.forEach(function(article) {
        // console.log('number of articles', articles.length);
        // const { author, description, urlToImage, url, title, publishedAt } = article;
        const author = article.author;
        const publisher = article.source.name;
        const description = article.description;
        const image = article.urlToImage;
        const webLink = article.url;
        const headline = article.title;
        const pubDate = article.publishedAt;
        // console.log(image);
        $('main').append(
            `<article></article>`
        );
        if (headline !== null && headline !== undefined) {
            $('article:last-of-type').append(
                `
                <h2>${headline}</h2>
            `
            );
        }
        $('article:last-of-type').append(
            `<p class="atribution"></p>`
        );
        if (publisher !== null && publisher !== undefined) {
            $('.atribution:last-of-type').append(
                ` <span class="publication">${publisher}</span>
            `
            );
        }
        if (author !== null && author !== undefined) {
            $('.atribution:last-of-type').append(
                `<span class="author">${author}</span>
            `
            );
        }
        if (description !== null && description !== undefined) {
            $('article:last-of-type').append(
                `<p class="preview-text">${description}</p>`
            );
        }
        if (image !== null && image !== undefined) {
            $('article:last-of-type').append(
                `<img src="${image}"/>`
            );
        }
        if (webLink !== null && webLink !== undefined) {
            $('article:last-of-type').append(
                `<p><a href="${webLink}">Read More</a></p>`
            );
        }
    });

    newsApp.selectArticlesToStyle();

};

//creates a function to handle all of our event listeners
newsApp.events = () => {
    // Listen for change in dropdown to prompt article changes
    $('#country').on('change', function() {
        // Get the value of the region selected
        const region = $(this).val();
        // pass region as an argument when calling the function
        newsApp.getNews(1, region);
        // Find Main and clear what was previously appended
        $('main').empty();
        console.log(region);
    });

    // Listen for change in dropdown to prompt weather widget
    $('#country').on('change', function() {
        //variable targetting option value
        const countryCode = $(this).val();
        // variable targetting option's other value
        const capCity = $(this).find('option:selected').attr('data-othervalue');
        // Calling the get Weather Function with both variables to change location of widget
        newsApp.getWeather(capCity, countryCode);
    });
}

// Get Weather Function (AJAX call)
newsApp.getWeather = function(param) {
    const siteStart = "http://api.openweathermap.org/data/2.5/weather?q=";
    const siteEnd = "&APPID=3c7d03bbd65ee72adad3ae07a733859d"
    $.ajax({
        url: siteStart + param + siteEnd,
        method: 'GET',
        dataType: 'json',
    }).then(function(res) {
        newsApp.displayWeather(res);
    });
};

// function for displaying Weather
newsApp.displayWeather = function(res) {
    // City Name
    const cityName = res.name;
    // Weather Type
    const weatherType = res.weather[0].description;
    // Current Temp (Celsius)
    const currentTemp = Math.round(res.main.temp - 273.15);
    // Min Temp (Celsius)
    const lowTemp = Math.round(res.main.temp_min - 273.15);
    // Max Temp (Celsius)
    const highTemp = Math.round(res.main.temp_max - 273.15);
    // Weather Code
    const weatherCode = res.weather[0].icon;
    // Weather Photo
    const weatherPhoto = "http://openweathermap.org/img/w/" + weatherCode + ".png";
    // Country Name
    const countryName = $('#country').find('option:selected').text();
    // Date
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const unix = new Date();
    const unixMonth = monthNames[unix.getMonth()];
    const unixDayName = daysOfWeek[unix.getDay()];
    const unixDate = unix.getDate();
    const unixYear = unix.getFullYear();


    // Converting the data to browser 
    $('.region').text(`${cityName}, ${countryName}`);
    $('.weather-type').text(`${weatherType}`);
    $('.temp').text(`Current: ${currentTemp}°C`);
    $('.low-temp').text(`Low: ${lowTemp}°C`);
    $('.high-temp').text(`High: ${highTemp}°C`);
    $('.weather-image').attr('src', weatherPhoto);
    $('.datestamp').text(`${unixDayName}, ${unixMonth} ${unixDate}, ${unixYear}`);

}

// Initialize Function
newsApp.init = function() {
    newsApp.getNews(1);
    newsApp.events();
    newsApp.getWeather('Toronto,ca');
    newsApp.infinite();
};

$(function() {
    newsApp.init();
    
});