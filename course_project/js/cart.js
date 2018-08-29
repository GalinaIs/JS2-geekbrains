/**
 * Функция - конструктор класса Корзина. 
 * @param {string} path Относительный путь для экземляра класса.
 * @param {boolean} myIsCartTable Уставаливаем признак - отрисовывать ли на странице полную информацию о корзине.
 */
var Cart = function (path = '', myIsCartTable = false) {
    this.pathHtml = path;
    this.isCartTable = myIsCartTable;
    this.renderCart();

    var self = this;
    if (this.isCartTable) {
        this.renderTableCart();
        $('#clear_cart').on('click', function (event) {
            self.clearCart();
            event.preventDefault();
        });
    }
}

/**
 * Метод класса - отрисовка корзины. Получает с сервера коризну и отрисовывает ее на странице.
 */
Cart.prototype.renderCart = function () {
    $.ajax({
        url: 'http://localhost:3000/cart',
        context: this,

        success: function (data) {
            var $divProductCart;
            var $divCart = $('#product_cart');
            $divCart.empty();
            var total = 0;
            var count = 0;
            var self = this;

            data.forEach(function (item) {
                $('.template_cart .cart_product img').attr('src', self.pathHtml + item.path_img);
                $('.template_cart .cart_member_label p').html(item.name);
                $('.template_cart .cart_member_label span').html(item.quantity + '  x   $' + item.cost);
                $('.template_cart .cart_product').attr('data-id', item.id);
                $('.template_cart .cart_product').attr('data-id-product', item.id_product);
                $('.template_cart .cart_product').attr('data-quantity', item.quantity);
                $('.template_cart .cart_product').attr('data-color', item.color);
                $('.template_cart .cart_product').attr('data-size', item.size);
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

/**
 * Метод класса - удаление элемента из корзины.
 * @param {Object} event Событие, которое вызвало удаление элемента из корзины.
 */
Cart.prototype.deleteElement = function (event) {
    var idProductCart = $(event.currentTarget).parent().children().attr('data-id');
    var quantityProduct = $(event.currentTarget).parent().children().attr('data-quantity');

    if (quantityProduct > 1) {
        $.ajax({
            type: 'PATCH',
            url: 'http://localhost:3000/cart/' + idProductCart,
            context: this,
            data: {
                quantity: $(event.currentTarget).parent().children().attr('data-quantity') - 1
            },
            success: function () {
                this.renderCart();
                if (this.isCartTable) {
                    this.renderTableCart();
                }
            }
        });
    } else {
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:3000/cart/' + idProductCart,
            context: this,
            success: function () {
                this.renderCart();
                if (this.isCartTable) {
                    this.renderTableCart();
                }
            }
        })
    }
}

/**
 * Метод класса - очищение корзины - удаление всех элементов из корзины.
 */
Cart.prototype.clearCart = function () {
    $.ajax({
        url: 'http://localhost:3000/cart',
        context: this,
        success: function (data) {
            var idProductCart;

            for (var ind = 0; ind < data.length; ind++) {
                idProductCart = data[ind].id;

                $.ajax({
                    type: 'DELETE',
                    url: 'http://localhost:3000/cart/' + idProductCart,
                    context: this,
                    success: function () {
                        this.renderCart();
                        if (this.isCartTable) {
                            this.renderTableCart();
                        }
                    }
                });
            }
        }
    })
}

/**
 * Метод класса - чтение корзины пользователя и запись этой корзины в качестве текущей на сервер.
 * @param {string} idUser Идентификатор пользователя.
 */
Cart.prototype.readCartInUserProfile = function (idUser) {
    this.clearCart();

    $.ajax({
        url: 'http://localhost:3000/user/' + idUser,
        context: this,
        success: function (dataUser) {
            var newCard = dataUser.userCart;

            for (var ind = 0; ind < newCard.length; ind++) {
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:3000/cart',
                    context: this,
                    data: newCard[ind],
                    success: function () {
                        this.renderCart();
                        if (this.isCartTable) {
                            this.renderTableCart();
                        }
                    }
                });
            }
        }
    });
}

/**
 * Метод класса - запись текущей корзины в данные пользователя на сервер.
 * @param {string} idUser Идентификатор пользователя. 
 */
Cart.prototype.writeCartInUserProfile = function (idUser) {
    $.ajax({
        url: 'http://localhost:3000/cart',
        context: this,
        success: function (cartData) {
            var myCard = JSON.stringify(cartData);

            $.ajax({
                url: 'http://localhost:3000/user/' + idUser,
                type: 'PATCH',
                contentType: 'application/json',
                data: JSON.stringify({
                    userCart: cartData
                })
            });
        }
    });
}

/**
 * Метод класса - отрисовка полной информации об элементах в корзине.
 */
Cart.prototype.renderTableCart = function () {
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
                $trItemCart.removeClass('tr_template_cart');
                $tableCart.append($trItemCart);
            }

            $('.grand_total').html('$' + total);
            $('.sub_total').html('$' + total);

            var self = this;
            $('.delete_button').on('click', 'a', function (event) {
                self.cartTableDeleteElement(event);
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
                self.cartTableChangeCountItem(event);
            });
        }
    })
}

/**
 * Метод класса - изменение количества элемента в корзине с помощью интерфейса полной отрисовки корзины.
 * @param {Object} event Событие, которое вызвало функцию.
 */
Cart.prototype.cartTableChangeCountItem = function (event) {
    var idProductCart = $(event.currentTarget).attr('data-id');
    $.ajax({
        type: 'PATCH',
        context: this,
        url: 'http://localhost:3000/cart/' + idProductCart,
        data: {
            quantity: $(event.currentTarget).val()
        },
        success: function () {
            this.renderTableCart();
            this.renderCart();
        }
    })
}

/**
 * Метод класса - удаление элемента из корзины с помощью интерфейса полной отрисовки корзины.
 * @param {Object} event Событие, которое вызвало функцию.
 */
Cart.prototype.cartTableDeleteElement = function (event) {
    var idProductCart = $(event.currentTarget).parent().children().attr('data-id');

    $.ajax({
        type: 'DELETE',
        context: this,
        url: 'http://localhost:3000/cart/' + idProductCart,
        success: function () {
            this.renderTableCart();
            this.renderCart();
        }
    })
}