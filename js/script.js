// Main newsApp Object
const newsApp = {};

// Global Variable 
newsApp.pagecount = 2;

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
        console.log(articles);
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


        $('main').append(
            `<article>
                <h2>${headline}</h2>
                <p class="atribution">
                    <span class="publication">${publisher}</span>
                    <span class="author">${author}</span>
                </p>
                <p class="preview-text">${description}</p>
                <img src="${image}"/>
                <p><a href="${webLink}">Read More</a></p>
            </article>`
        );
    });
};

//creates a function to handle all of our event listeners
newsApp.events = () => {
    // Listen for change in region in the form
    $('#country').on('change', function () {
        // Get the value of the region selected
        const region = $(this).val();
        // pass region as an argument when calling the function
        newsApp.getNews(1,region);
        // Find Main and clear what was previously appended
        $('main').empty();
        console.log(region);
        // newsApp.updateArticles();
    });
}


newsApp.updateArticles = () => {
    // Variable that refers to the selected
    const choice = $('select option:selected')
    
    console.log(choice, 'made a choice');
}





// Initialize Function
newsApp.init = function(){
    newsApp.getNews(1);
    newsApp.events();    
};

$(function () {
    newsApp.init();

    // Infinite Scroll Function
        const infinite = function(){
            $(window).scroll(function () {
                if($(window).scrollTop() == $(document).height() - $(window).height()){
                    newsApp.getNews(newsApp.pagecount);
                    newsApp.pagecount = newsApp.pagecount + 1;
                    // console.log("scroll");
                }    
            });
        }

        infinite();

        // console.log(infinite());
});


 




