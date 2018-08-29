/**
 * Функция - конструктор класса OneViewProduct - определяет параметры для отображения одного вида продуктов сайта 
 * (мужская одежда, женская, детская и т.д.) и определяет функции-обработчики для элементов выбора параметров
 * отображения товаров на странице (размер, цена, тренды, дизайнер и т.д.)
 * @param {Product} myProduct Экземпляр объекта класса Product.
 * @param {string} idCategoty Идентификатор категории.
 * @param {int} countElementInPage Количество продуктов на странице.
 */
var OneViewProduct = function(myProduct, idCategoty, countElementInPage) {
    this.product = myProduct;
    this.product.setIdCategory(idCategoty);
    this.product.renderProduct(countElementInPage);

    var self = this;

    $('#details_category').on('click', 'input', function () {
        self.handlerSelect($(this), 'category');
    });

    $('#details_brand').on('click', 'input', function () {
        self.handlerSelect($(this), 'brand');
    });

    $('#details_designer').on('click', 'input', function () {
        self.handlerSelect($(this), 'designer');
    });

    $('#size_product').on('click', 'input', function () {
        self.handlerSelect($(this), 'size');
    });

    $('#trend_product').on('click', 'a', function (event) {
        self.product.setParam($(this).html(), 'trend');
        event.preventDefault();
        self.product.renderProduct(+$('#count_item_man select').val());
    });

    $('#count_item_man select').change(function () {
        self.product.renderProduct(+$('#count_item_man select').val());
    });

    $('#sort_by select').change(function () {
        self.product.setParam($('#sort_by select').val(), 'valueSortBy')
        self.product.renderProduct(+$('#count_item_man select').val());
    });

    $('#slider').slider({
        range: true,
        max: 400,
        min: 52,
        values: [52, 400],
        change: function () {
            self.product.setPrice($('#slider').slider('values'), 'price');
            self.product.renderProduct(+$('#count_item_man select').val());
        }
    });
}

/**
 * Метод класса, который определяет как и какой параметр в выборке продуктов с сервера нужно изменить.
 * @param {Object} $element Элемент страницы.
 * @param {string} paramName Название объекта
 */
OneViewProduct.prototype.handlerSelect = function ($element, paramName) {
    if ($element.prop('checked')) {
        this.product.setParam($element.attr('name'), paramName);
    } else {
        this.product.deleteParam($element.attr('name'), paramName);
    }

    this.product.renderProduct(+$('#count_item_man select').val());
}