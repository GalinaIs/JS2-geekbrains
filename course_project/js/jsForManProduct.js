$(document).ready(function () {
    var cart = new Cart('../');
    new User(cart);

    var manProduct = new Product(cart, 'browse_all', 'page_product', '../', 'page_count', 'Name');
    new OneViewProduct(manProduct, '2', +$('#count_item_man select').val());
});