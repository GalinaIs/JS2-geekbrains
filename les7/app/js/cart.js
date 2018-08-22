var Cart = function (path = '') {
    this.pathHtml = path;
    this.renderCart();
}

Cart.prototype.renderCart = function () {
    $.ajax({
        url: 'http://localhost:3000/cart',
        context: this,
        dataType: 'json',

        success: function (data) {
            var $divProductCart;
            var $divCart = $('#product_cart');
            $divCart.empty();
            var total = 0;
            var count = 0;
            var self = this;

            data.forEach(function (item) {
                $('.template_cart .cart_product img').attr('src', self.pathHtml+item.path_img);
                $('.template_cart .cart_member_label p').html(item.name);
                $('.template_cart .cart_member_label span').html(item.quantity + '  x   $' + item.cost);
                $('.template_cart .cart_product').attr('data-id', item.id);
                $('.template_cart .cart_product').attr('data-quantity', item.quantity);
                total += (+item.quantity) * (+item.cost);
                count += +item.quantity;

                var star = new Star(item.range);
                $('.template_cart .div_star').html(star.starString);

                $divProductCart = $('.template_cart').clone();
                $divProductCart.removeClass('template_cart');
                $divCart.append($divProductCart);
            });

            $('.button_delete').on('click', function (event) {
                self.deleteElement(event);
                event.preventDefault();
            });

            $('div .elipse_card').html(count);
            $('div .total_price p').eq(1).html('$' + total);
        }
    })
}

Cart.prototype.deleteElement = function (event) {
    var idProduct = $(event.currentTarget).parent().children().attr('data-id');
    var quantityProduct = $(event.currentTarget).parent().children().attr('data-quantity');

    if (quantityProduct > 1) {
        $.ajax({
            type: 'PATCH',
            url: 'http://localhost:3000/cart/' + idProduct,
            context: this,
            data: {
                quantity: $(event.currentTarget).parent().children().attr('data-quantity') - 1
            },
            success: function () {
                this.renderCart();
            }
        });
    } else {
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:3000/cart/' + idProduct,
            context: this,
            success: function () {
                this.renderCart();
            }
        })
    }
}