var CartTable = function (myCart, path = '') {
    this.cart = myCart;
    this.pathHtml = path;

    this.renderTableCart();
}

CartTable.prototype.renderTableCart = function () {
    $.ajax({
        url: 'http://localhost:3000/cart',
        context: this,
        dataType: 'json',
        success: function (data) {
            var $tableCart = $('#table_cart');
            $tableCart.empty();
            $tableCart.append($('#header_card'));
            var $trItemCart;
            var total = 0;
            console.log(data);
            for (var ind = 0; ind < data.length; ind++) {
                $('.tr_template_cart img').attr('src', this.pathHtml + data[ind].path_img);
                $('.tr_template_cart h4').html(data[ind].name);
                $('.tr_template_cart .cost').html('$' + (+data[ind].cost));
                $('.tr_template_cart input').val(data[ind].quantity);
                $('.tr_template_cart .item_total_price').html('$' + data[ind].cost * +data[ind].quantity);
                $('.tr_template_cart .delete_button a').attr('data-id', data[ind].id);
                $('.tr_template_cart .count_td').attr('data-id', data[ind].id);
                $('.tr_template_cart .color_item').html(data[ind].color);
                $('.tr_template_cart .size_item').html(data[ind].size);
                total += +data[ind].cost * +data[ind].quantity;

                $trItemCart = $('.tr_template_cart').clone();
                console.log($trItemCart);
                $trItemCart.removeClass('tr_template_cart');
                $tableCart.append($trItemCart);
            }

            $('.grand_total').html('$' + total);
            $('.sub_total').html('$' + total);

            var self = this;
            $('.delete_button').on('click', 'a', function (event) {
                self.deleteElement(event);
                event.preventDefault();
            });

            if (data.length === 0) {
                $('#clear_cart').addClass('opacity_yes');
                $tableCart.addClass('opacity_yes');
                $('.cart_is_empty').removeClass('opacity_yes');
            } else {
                $('#clear_cart').removeClass('opacity_yes');
                $tableCart.removeClass('opacity_yes');
                $('.cart_is_empty').addClass('opacity_yes');
            }

            $('.count_td').change(function () {
                self.changeCountItem(event);
            });
        }
    })
}

CartTable.prototype.changeCountItem = function (event) {
    var idProduct = $(event.currentTarget).attr('data-id');
    $.ajax({
        type: 'PATCH',
        context: this,
        url: 'http://localhost:3000/cart/' + idProduct,
        data: {
            quantity: $(event.currentTarget).val()
        },
        success: function () {
            this.renderTableCart('../');
            this.cart.renderCart();
        }
    })
}

CartTable.prototype.deleteElement = function (event) {
    var idProduct = $(event.currentTarget).parent().children().attr('data-id');

    $.ajax({
        type: 'DELETE',
        context: this,
        url: 'http://localhost:3000/cart/' + idProduct,
        success: function () {
            this.renderTableCart('../');
            this.cart.renderCart();
        }
    })
}

CartTable.prototype.clearAllCart = function () {
    $.ajax({
        url: 'http://localhost:3000/cart',
        context: this,
        success: function (data) {
            for (var ind = 0; ind < data.length; ind++) {
                $.ajax({
                    type: 'DELETE',
                    context: this,
                    url: 'http://localhost:3000/cart/' + data[ind].id,
                    success: function () {
                        this.renderTableCart('../');
                        this.cart.renderCart();
                    }
                });
            }
        }
    });
}

$(document).ready(function () {
    var cart = new Cart('../');
    var tableCart = new CartTable(cart, '../');

    $('#clear_cart').on('click', function (event) {
        clearAllCart();
        event.preventDefault();
    });
});