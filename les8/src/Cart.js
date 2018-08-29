var Cart = function () {
    this.renderGoodsList();
    this.renderCart();
    var self = this;

    $('#cart').on('click', 'li button', function (event) {
        self.deleteProduct(event.currentTarget);
        event.preventDefault();
    });

    $('#goods').on('click', 'li button', function (event) {
        self.addProduct(event.currentTarget);
        event.preventDefault();
    })
}

Cart.prototype.deleteProduct = function (currentTarget) {
    $.ajax({
        type: 'DELETE',
        context: this,
        url: 'http://localhost:3000/cart/' + $(currentTarget).attr('data-id'),
        success: function () {
            this.renderCart();
        }
    });
}

Cart.prototype.addProduct = function (currentTarget) {
    var $element = $(currentTarget);
    var good = {
        id: $element.attr('data-id'),
        price: $element.attr('data-price'),
        name: $element.attr('data-name'),
        quantity: 1
    }

    if ($('#cart li button[data-id="' + good.id + '"]').length) {
        var $good = $('#cart li button[data-id="' + good.id + '"]');

        $.ajax({
            type: 'PATCH',
            url: 'http://localhost:3000/cart/' + good.id,
            context: this,
            data: {
                quantity: +$good.attr('data-quantity') + 1
            },
            success: function () {
                this.renderCart();
            }
        });
    } else {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/cart',
            context: this,
            data: good,
            success: function () {
                this.renderCart();
            }
        });
    }
}

Cart.prototype.renderGoodsList = function () {
    $('#goods').empty();
    $.get('http://localhost:3000/goods', {}, function (goods) {
        var $ul = $('<ul />');
        goods.forEach(function (item) {
            $ul.append(
                $('<li />', {
                    text: item.name + ' ' + item.price + ' rub.'
                })
                .append(
                    $('<button />', {
                        text: 'Buy',
                        'data-id': item.id,
                        'data-price': item.price,
                        'data-name': item.name
                    })
                )
            )
        });
        $('#goods').append($ul);
    }, 'json');
}

Cart.prototype.renderCartProduct = function (goods) {
    var $ul = $('<ul />');
    var total = 0;
    goods.forEach(function (item) {
        $ul.append(
            $('<li />', {
                text: item.name + ' (' + item.quantity + ')'
            })
            .append(
                $('<button />', {
                    text: 'Remove',
                    'data-id': item.id,
                    'data-price': item.price,
                    'data-name': item.name,
                    'data-quantity': item.quantity
                })
            )
        );
        total += +item.quantity * +item.price;
    });
    $('#cart').append($ul);
    $('#cart').append($('<div />', {
        text: 'Total: ' + total + ' rub.'
    }));
    return total;
}

Cart.prototype.renderCart = function () {
    $('#cart').empty();
    $.ajax({
        url: 'http://localhost:3000/cart',
        context: this,
        success: function (goods) {
            this.renderCartProduct(goods);
        }
    });
}

$(document).ready(function () {
    new Cart();
})