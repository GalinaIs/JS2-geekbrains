$(document).ready(function () {
    var cart = new Cart();
    var product = new Product(cart, 'browse_all', '', '');
    product.renderProduct(8);
    new User(cart);
});