// Main newsApp Object
const newsApp = {};

// Global Variables
newsApp.pagecount = 2; //iterates in order to enable infinite scroll
newsApp.nameOfCountry = 'Canada'; //QUINN #1: I added this so that the country name can be accessed
//There is probably a better way to pass it but I wanted to touch your code as little as possible
newsApp.region = ''; //this will hold user selection in order to change region. 
// These are set as global variables so that they can hold value when called by infinite scroll. 

//NEWS FUNCTIONS
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
            page: pageNumber, //First called on page 1, then iterates with infinite scroll
            country: region //Set by user. If null, displays news from all regions 
        }
    }).then(function (res) {
        let articles = res.articles; //Capture articles
        newsApp.printNews(articles); //Pass them to newsApp.printNews
    });
};

// Print News Function
newsApp.printNews = function (articles) {
    articles.forEach(function (article) {
        // could also have been written as👇
        //// const { author, description, urlToImage, url, title, publishedAt } = article;
        const author = article.author;
        const publisher = article.source.name;
        const description = article.description;
        const image = article.urlToImage;
        const webLink = article.url;
        const headline = article.title;
        const pubDate = article.publishedAt;

        //The articles vary in terms of what data they contain. 
        //We will print them all on the page selectively depending on what we get back.

        //The article to hold the information
        $('main').append(
            `<article></article>`
        );

        //If there is a headline, append it first
        if (headline !== null && headline !== undefined) {
            $('article:last-of-type').append(
                `
                <h2>${headline}</h2>
            `
            );
        }

        //Append a paragraph to hold publisher & author
        $('article:last-of-type').append(
            `<p class="atribution"></p>`
        );

        //If there is a publisher, append to the paragraph
        if (publisher !== null && publisher !== undefined) {
            $('.atribution:last-of-type').append(
                ` <span class="publication">${publisher}</span>
            `
            );
        }

        //If there is data for the author, append it to the paragraph
        if (author !== null && author !== undefined) {
            $('.atribution:last-of-type').append(
                `<span class="author">${author}</span>
            `
            );
        }

        //If there is an article discription, append it to the article
        if (description !== null && description !== undefined) {
            $('article:last-of-type').append(
                `<p class="preview-text">${description}</p>`
            );
        }

        //If there is an image, append it to the article
        if (image !== null && image !== undefined) {
            $('article:last-of-type').append(
                `<img src="${image}"/>`
            );
        }

        //Append the URL to the whole article: open in a new tab
        if (webLink !== null && webLink !== undefined) {
            $('article:last-of-type').append(
                `<p><a href="${webLink}" target="_blank">Read More</a></p>`
            );
        }

        //Append a twitter share button
        if (webLink !== null && webLink !== undefined) {
            $('article:last-of-type').append(
                `<p><a class="twitter" href="https://twitter.com/intent/tweet?text=${headline}%20${webLink}%20via%20@endless_times" target="_blank">Share on Twitter</a></p>`
            );
        }

    });

    //Passes completed articles on page to newsApp.selectArticlesToStyle
    newsApp.selectArticlesToStyle();

};

//Add classes to the articles depending on what information they contain
//This will help us choose where to place them in the CSS grid
newsApp.selectArticlesToStyle = () => {
    $('article:has(h2):has(.preview-text):has(img):has(a)').addClass('full-data-set');

    $('article:not(:has(img))').addClass('no-image');

    $('article:not(:has(h2))').addClass('no-headline');

}

newsApp.randomColor = () => {
    // QUINN #4: Please have a look and change the colour selection if you like!
    const accentColor = ['firebrick', 'cadetblue', 'pink', 'tomato', 'crimson', 'darkolivegreen', 'midnightblue', 'rosybrown',]

    //Select random color 
    const randoColorSelector = Math.floor(Math.random() * accentColor.length);
    const randomColor = accentColor[randoColorSelector]

    //Reset accent color on page
    //Using CSS variables instead of SCSS variables so that it can be changed with jQuery
    $('html').css(`--accentColor`, `${randomColor}`);
}

//Handle all of our event listeners
newsApp.events = () => {

    // Dropdown toggle
    $(".option-links").click(function (event) {
        event.preventDefault();
        $("nav").toggleClass("show-menu").slideToggle();
    });

    // Dropdown toggle
    $(".mega-menu div a").click(function (event) {
        event.preventDefault();
        $(this).siblings().addClass('active');
        // $(this).siblings().removeClass('active');
    });

    // Listen for change in dropdown to prompt article changes
    $('.mega-menu div a').on('click', function () {
        // Get the value of the region selected
        newsApp.region = $(this).attr('value');
        // Find Main and clear what was previously appended
        $('main').empty();
        // Reset page counter for new dataset
        newsApp.pagecount = 2;
        // pass region as an argument when calling the function
        newsApp.getNews(1, newsApp.region);
        //When the user selects a country, the accent colour is reset to a random colour
        newsApp.randomColor();
    });

    // Listen for change in dropdown to prompt weather widget
    $('.mega-menu div a').on('click', function () {
        //variable targetting option value
        const countryCode = $(this).attr('value');
        // variable targetting option's other value
        const capCity = $(this).on('click').attr('data-othervalue');
        // QUINN #2: I added this bit that captures the country name from
        //👇 the user's dropdown selection and stores it on the global variable
        // variable for getting the name of the country selected
        newsApp.nameOfCountry = $(this).text();
        // Calling the get Weather Function with both variables to change location of widget
        newsApp.getWeather(capCity, countryCode);
    });


}

// Get Weather Function (AJAX call)
newsApp.getWeather = function (param) {
    const siteStart = "http://api.openweathermap.org/data/2.5/weather?q=";
    const siteEnd = "&APPID=3c7d03bbd65ee72adad3ae07a733859d"
    $.ajax({
        url: siteStart + param + siteEnd,
        method: 'GET',
        dataType: 'json',
    }).then(function (res) {
        newsApp.displayWeather(res);
    });
};

// function for displaying Weather
newsApp.displayWeather = function (res) {
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
    const countryName = $(".mega-menu div a").click(function (event) {
        event.preventDefault();
        $(this).text();
        // $(this).siblings().removeClass('active');
    });


    $('.mega-menu div a').find('active').text();
    // Date
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const unix = new Date();
    const unixMonth = monthNames[unix.getMonth()];
    const unixDayName = daysOfWeek[unix.getDay()];
    const unixDate = unix.getDate();
    const unixYear = unix.getFullYear();


    // Converting the data to browser 
    //QUINN #3: this is the only bit of your code I actually changed.
    //it used to be:
    //$('.region').text(`${cityName}, ${countryName}`);
    //It shouldn't break anything because this is just for display: display 
    //the contents of this variable here. Instead of displaying "Object[Object]"
    //now it displays the country name that was taken from the text of the drop-down item
    $('.region').text(`${cityName}, ${newsApp.nameOfCountry}`);
    $('.weather-type').text(`${weatherType}`);
    $('.temp').text(`Current: ${currentTemp}°C`);
    $('.low-temp').text(`Low: ${lowTemp}°C`);
    $('.high-temp').text(`High: ${highTemp}°C`);
    $('.weather-image').attr('src', weatherPhoto);
    $('.datestamp').text(`${unixDayName}, ${unixMonth} ${unixDate}, ${unixYear}`);

}

// Infinite Scroll Function
newsApp.infinite = function () {
    $(window).scroll(function () {
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            newsApp.getNews(newsApp.pagecount, newsApp.region);
            newsApp.pagecount = newsApp.pagecount + 1;
        }
    });
}

newsApp.smoothScroll = function () {
    $('a').smoothScroll({
        offset: 0
    });
}

// Initialize Function
newsApp.init = function () {
    newsApp.getNews(1); //calls news on page 1, region null on first pageload
    newsApp.events(); //event listeners
    newsApp.getWeather('Toronto,ca'); //Defaults weather to Toronto. 
    // For future: app could detect user's location and use that here on load
    newsApp.infinite(); //infinite scroll
    newsApp.smoothScroll(); //smooth scroll
    //QUINN #5
    //Do you think that a random colour should be definined on first load? If so, uncommnet this 👇
    //newsApp.randomColor();
};

$(function () {
    newsApp.init();

});
