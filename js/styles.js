console.log("Styles link is working");

newsApp.selectArticlesToStyle = () => {
    $('article:has(h2):has(.publication):has(.author):has(.preview-text):has(img):has(a)').addClass('full-data-set');

    $('article:not(:has(img))').addClass('no-image');

}