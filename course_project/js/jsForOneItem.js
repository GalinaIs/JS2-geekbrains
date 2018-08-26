/**
 * Функция - конструктор класса OneItem - один продукт. 
 * @param {string} id Идентификатор продукта.
 * @param {Cart} myCart Экземпляр класса Cart.
 * @param {string} myPath Относительный путь для экземляра класса.
 * @param {Product} myProduct Экземпляр класса Product.
 */
var OneItem = function (id, myCart, myPath = '', myProduct) {
    this.idItem = id;
    this.cart = myCart;
    this.pathHtml = myPath;
    this.product = myProduct;
    this.renderItem();
    this.createCarusel();
}

/**
 * Метод класса, который по номеру идентификатору категории возвращает название категории.
 * @param {string} idCategory  Идентификатор категории.
 */
OneItem.prototype.chooseCollection = function (idCategory) {
    switch (idCategory) {
        case 1:
            return 'WOMEN COLLECTION';
        case 2:
            return 'MEN COLLECTION';
    }
}

/**
 * Метод класса, который отрисовывает элемент select на странице с нужными option.
 * @param {Object} $select Элемент select на странице.
 * @param [{string}] arrayValue Массив с параетрами для option.
 */
OneItem.prototype.renderSelect = function ($select, arrayValue) {
    for (var ind = 0; ind < arrayValue.length; ind++) {
        $select.append($('<option />', {
            value: arrayValue[ind],
            text: arrayValue[ind]
        }));
    }
}

/**
 * Метод класса, который пытается добавить элемент в корзину.
 */
OneItem.prototype.clickAddToCard = function () {
    this.product.addToCart(this.idItem, $('.item_select_size').val(), $('.item_select_color').val(), +$('#count_item').val(), $('#count_item').val() >= 1, 'Quality item must be more than 0');
}

/**
 * Метод класса, который отрисовывает информацию о продукте на странице.
 */
OneItem.prototype.renderItem = function () {
    $.ajax({
        context: this,
        url: 'http://localhost:3000/product/' + this.idItem,
        success: function (data) {
            var $itemDiv = $('#item_product');
            $itemDiv.empty();

            $('.template_item .img_one_item').attr('src', this.pathHtml + data.path_img);
            $('.template_item .collection').html(this.chooseCollection(+data.id_category));
            $('.template_item h2').html(data.name);

            var star = new Star(data.range);
            $('.template_item .div_star').html(star.starString);

            $('.template_item .info_item').html(data.info);
            $('.template_item .item_material').html(data.material.join(',  '));
            $('.template_item .item_designer').html(data.designer.join(',  '));
            $('.template_item .item_cost').html('$' + (+data.cost));

            this.renderSelect($('.template_item .item_select_color'), data.color);
            this.renderSelect($('.template_item .item_select_size'), data.size);

            var $appendDiv = $('.template_item').clone();
            $appendDiv.removeClass('template_item');
            $itemDiv.append($appendDiv);

            var self = this;
            $('.div_button_add').on('click', '.button_d_f', function (event) {
                self.clickAddToCard();
                event.preventDefault();
            })
        }
    })
}

/**
 * Метод класса, который создает и отрисовывает карусель с товарами на странице.
 */
OneItem.prototype.createCarusel = function () {
    $.ajax({
        url: 'http://localhost:3000/product',
        context: this,
        success: function (data) {
            var $ul = $('div .jcarousel ul');
            var $caruselItem;

            this.product.setIdCategory('1');
            var dataAfterSearch = this.product.getItemForPrint(data);
            
            for (var ind = 0; ind < dataAfterSearch.length; ind++) {
                $('.template_carusel .img_prod').attr('src', this.pathHtml + dataAfterSearch[ind].path_img);
                $('.template_carusel .unit_name').html(dataAfterSearch[ind].name);
                $('.template_carusel .unit_cost').html('$' + (+dataAfterSearch[ind].cost));

                var star = new Star(dataAfterSearch[ind].range);
                $('.template_carusel .div_star').html(star.starString);

                $caruselItem = $('.template_carusel').clone();
                $caruselItem.removeClass('template_carusel');
                $ul.append($('<li />').append($caruselItem));
            }
        }
    })
}

$(document).ready(function () {
    var cart = new Cart('../');
    var product = new Product(cart, 'browse_all', '');
    new OneItem(15, cart, '../', product);
    new User(cart);
});