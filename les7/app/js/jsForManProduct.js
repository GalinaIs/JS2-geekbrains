var handlerSelect = function (manProduct, $element, paramName) {
    if ($element.prop('checked')) {
        manProduct.set($element.attr('name'), paramName);
    } else {
        manProduct.delete($element.attr('name'), paramName);
    }
    manProduct.renderProduct(+$('#count_item_man select').val());
}

$(document).ready(function () {
    var cart = new Cart('../');

    var manProduct = new Product(cart, 'browse_all', 'page_product', '../', 'page_count', 'Name');
    manProduct.setIdCategory('2');
    manProduct.renderProduct(+$('#count_item_man select').val(), 1, false, true);

    $('#details_category').on('click', 'input', function () {
        handlerSelect(manProduct, $(this), 'category');
    });

    $('#details_brand').on('click', 'input', function () {
        handlerSelect(manProduct, $(this), 'brand');
    });

    $('#details_designer').on('click', 'input', function () {
        handlerSelect(manProduct, $(this), 'designer');
    });

    $('#size_product').on('click', 'input', function () {
        handlerSelect(manProduct, $(this), 'size');
    });

    $('#trend_product').on('click', 'a', function (event) {
        manProduct.set($(this).html(), 'trend');
        event.preventDefault();
        manProduct.renderProduct(+$('#count_item_man select').val());
    });

    $('#count_item_man select').change(function () {
        manProduct.renderProduct(+$('#count_item_man select').val());
    });

    $('#sort_by select').change(function () {
        manProduct.set($('#sort_by select').val(), 'valueSortBy')
        manProduct.renderProduct(+$('#count_item_man select').val());
    });

    $('#slider').slider({
        range: true,
        max: 400,
        min: 52,
        values: [52, 200],
        change: function () {
            manProduct.setPrice($('#slider').slider('values'), 'price');
            manProduct.renderProduct(+$('#count_item_man select').val());
        }
    });
});