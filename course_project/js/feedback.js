/**
 * Функция - конструктор класса отзывов - добавляет возможность переключения между отзывами на сайте.
 */
var Feedback = function(){
    $('#feedback1').addClass('display_flex_fb');
    $('#fb_div_flex a:first').addClass('active_fb_div_member');

    $('#fb_div_flex').on('click', 'a', function(event){
        $('.active_fb_div_member').removeClass('active_fb_div_member');
        $(this).addClass('active_fb_div_member');
        $('.display_flex_fb').removeClass('display_flex_fb');
        $($(this).attr('href')).addClass('display_flex_fb');
        event.preventDefault();
    });
}

$(document).ready(function () {
    new Feedback();
});