var generatedTA = document.getElementById;

generatedTA.onclick = function(){
    console.log('copied to keyboard');
    generatedTA.select();
}

$(function() {
    $(window).on('load',function() {
        $('.article-header').addClass('fadein');
        $('.article').addClass('fadein');
    })

});