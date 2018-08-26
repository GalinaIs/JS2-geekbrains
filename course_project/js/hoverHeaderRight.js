/**
 * Функця - конструктор класса HeaderRight, который отвечает за правильное отображение блоков при наведении на корзину
 * или кнопку My Account в правой части header сайта.
 */
var HeaderRight = function(){
    $('.ref_to_cart').hover(function () {
        $('.div_cart').addClass('div_cart_hover');
    }, function () {
        $('.div_cart').hover(function () {
            $('.div_cart').addClass('div_cart_hover');
        }, function(){
            $('.div_cart').removeClass('div_cart_hover');
        });
        $('.div_cart').removeClass('div_cart_hover');
    });


    $('.menu_account').hover(function () {
        $('.div_account').addClass('div_cart_hover');
    }, function () {
        $('.div_account').hover(function () {
            $('.div_account').addClass('div_cart_hover');
        }, function(){
            $('.div_account').removeClass('div_cart_hover');
        });
        $('.div_account').removeClass('div_cart_hover');
    });
}

$(document).ready(function () {
    new HeaderRight;
});