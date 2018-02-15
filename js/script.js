// Main newsApp Object
const newsApp = {};

// Global Variable 
newsApp.pagecount = 2;

// Get News Function
newsApp.getNews = (pageNumber) => {
    $.ajax({
        url: 'https://newsapi.org/v2/top-headlines',
        method: 'GET',
        dataType: 'json',
        data: {
            apiKey: 'c6efa387136e459096d7201bab344662',
            language: 'en',
            pageSize: 10,
            page: pageNumber
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

// Initialize Function
newsApp.init = function(){
    newsApp.getNews(1);
    
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


 




