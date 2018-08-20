var Star = function (range) {
    this.starString = '';
    var ind, countEmptyStar, countFullStar;

    if ((/\./).test(range)) {
        this.starString = '';
        countFullStar = parseInt(range);
        for (ind = 0; ind < countFullStar; ind++) {
            this.starString += '<i class="fa fa-star" aria-hidden="true"></i>';
        }

        this.starString += '<i class="fa fa-star-half-o" aria-hidden="true"></i>';

        countEmptyStar = 4 - countFullStar;
        for (ind = 0; ind < countEmptyStar; ind++) {
            this.starString += '<i class="fa fa-star-o" aria-hidden="true"></i>';
        }
    } else {
        this.starString = '';
        countFullStar = parseInt(range);
        for (ind = 0; ind < countFullStar; ind++) {
            this.starString += '<i class="fa fa-star" aria-hidden="true"></i>';
        }

        countEmptyStar = 5 - countFullStar;
        for (ind = 0; ind < countEmptyStar; ind++) {
            this.starString += '<i class="fa fa-star-o" aria-hidden="true"></i>';
        }
    }
}
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
var Feedback = function(){
    $('#feedback1').addClass('display_flex_fb');
    $('#fb_div_flex a:first').addClass('active_fb_div_member');

    $('#fb_div_flex').on('click', 'a', function(event){
        $('.active_fb_div_member').removeClass('active_fb_div_member');
        $(this).addClass('active_fb_div_member');
        $('.display_flex_fb').removeClass('display_flex_fb');
        $($(this).attr('href')).addClass('display_flex_fb');
        event.preventDefault();
    });
}

$(document).ready(function () {
    new Feedback();
});
var Product = function (cart, idBrowseAll, idElementHide, path = '', idElementHtml = '', sortBy = '') {
    this.pathHtml = path;
    this.cart = cart;
    this.initSettingForSearch(sortBy);
    this.idElementPagesProduct = idElementHtml;
    this.idChooseAll = idBrowseAll;
    this.idElementForHide = idElementHide;

    var self = this;
    $('#' + this.idChooseAll).on('click', function (event) {
        self.renderProduct(0, 1, true);
        $('#' + self.idChooseAll).addClass('opacity_yes');
        if (self.idElementForHide !== '') {
            $('#' + self.idElementForHide).addClass('opacity_yes');
        }
        event.preventDefault();
    });
}

Product.prototype.initSettingForSearch = function (valueSortBy) {
    this.settingForSearch = {
        idCategory: '',
        category: [],
        brand: [],
        designer: [],
        size: [],
        trend: '',
        price: {
            upPrice: '',
            toPrice: ''
        },
        sortBy: valueSortBy
    }
}

Product.prototype.set = function (value, paramName) {
    switch (paramName) {
        case 'idCategory':
            this.setIdCategory(value);
            break;
        case 'category':
            this.setCategory(value);
            break;
        case 'brand':
            this.setBrand(value);
            break;
        case 'designer':
            this.setDesigner(value);
            break;
        case 'size':
            this.setSize(value);
            break;
        case 'trend':
            this.setTrend(value);
            break;
        case 'price':
            this.setPrice(value);
            break;
        case 'valueSortBy':
            this.setValueSortBy(value);
    }
}

Product.prototype.setIdCategory = function (idProduct) {
    this.settingForSearch.idCategory = idProduct;
}

Product.prototype.setCategory = function (newCategory) {
    this.settingForSearch.category.push(newCategory);
}

Product.prototype.setBrand = function (newBrand) {
    this.settingForSearch.brand.push(newBrand);
}

Product.prototype.setDesigner = function (newDesigner) {
    this.settingForSearch.designer.push(newDesigner);
}

Product.prototype.setSize = function (newSize) {
    this.settingForSearch.size.push(newSize);
}

Product.prototype.setTrend = function (newTrend) {
    this.settingForSearch.trend = newTrend;
}

Product.prototype.setPrice = function (arrayPrice) {
    this.settingForSearch.price.upPrice = arrayPrice[0];
    this.settingForSearch.price.toPrice = arrayPrice[1];
}

Product.prototype.setValueSortBy = function (valueSortBy) {
    this.settingForSearch.sortBy = valueSortBy;
}

Product.prototype.delete = function (value, paramName) {
    switch (paramName) {
        case 'category':
            this.deleteCategory(value);
            break;
        case 'brand':
            this.deleteBrand(value);
            break;
        case 'designer':
            this.deleteDesigner(value);
            break;
        case 'size':
            this.deleteSize(value);
            break;
    }
}

Product.prototype.deleteElementFromArray = function (array, arrayElement) {
    var position = array.indexOf(arrayElement);
    array.splice(position, 1);
}

Product.prototype.deleteCategory = function (delCategory) {
    this.deleteElementFromArray(this.settingForSearch.category, delCategory);
}

Product.prototype.deleteBrand = function (delBrand) {
    this.deleteElementFromArray(this.settingForSearch.brand, delBrand);
}

Product.prototype.deleteDesigner = function (delDesigner) {
    this.deleteElementFromArray(this.settingForSearch.designer, delDesigner);
}

Product.prototype.deleteSize = function (delSize) {
    this.deleteElementFromArray(this.settingForSearch.size, delSize);
}

Product.prototype.equalElement = function (paramEqual, array) {
    if (paramEqual === '') {
        return true;
    }

    return array.includes(paramEqual);
}

Product.prototype.equalArray = function (paramEqual, array) {
    if (paramEqual.length === 0) {
        return true;
    }

    return array.some(element => paramEqual.includes(element));
}

Product.prototype.equalPrice = function (price, item) {
    if ((price.upPrice === '') || (price.toPrice === '')) {
        return true;
    }

    return (price.upPrice <= item) && (item <= price.toPrice);
}

Product.prototype.sortByValue = function (data) {
    switch (this.settingForSearch.sortBy) {
        case 'Name':
            return data.sort(function (a, b) {
                return (a.name > b.name);
            });
        case 'Cost':
            return data.sort(function (a, b) {
                return (+a.cost > +b.cost);
            });
        case 'Range':
            return data.sort(function (a, b) {
                return (+a.range > +b.range);
            });
        default:
            return data;
    }
}

Product.prototype.getItemForPrint = function (data) {
    var dataForPrint = [];
    for (var ind = 0; ind < data.length; ind++) {
        if ((this.equalElement(this.settingForSearch.idCategory, data[ind].id_category)) &&
            (this.equalArray(this.settingForSearch.category, data[ind].category_name)) &&
            (this.equalArray(this.settingForSearch.brand, data[ind].brand)) &&
            (this.equalArray(this.settingForSearch.designer, data[ind].designer)) &&
            (this.equalArray(this.settingForSearch.size, data[ind].size)) &&
            (this.equalElement(this.settingForSearch.trend, data[ind].trend)) &&
            (this.equalPrice(this.settingForSearch.price, +data[ind].cost))) {
            dataForPrint.push(data[ind]);
        }
    }

    console.log(this.sortByValue(dataForPrint));
    return this.sortByValue(dataForPrint);
}

Product.prototype.renderOnePage = function (dataAfterSearch, count, numberPage) {
    var $divProduct;
    var $productPreview = $('.preview_menu_flex');
    $productPreview.empty();

    for (var ind = (numberPage - 1) * count; ind < numberPage * count; ind++) {
        if (ind >= dataAfterSearch.length) {
            break;
        }
        $('.template .img_prod').attr('src', this.pathHtml + dataAfterSearch[ind].path_img);
        $('.template .unit_name').html(dataAfterSearch[ind].name);
        $('.template .unit_cost').html('$' + dataAfterSearch[ind].cost);
        $('.template .button_to_card').attr('data-id', dataAfterSearch[ind].id);

        var star = new Star(dataAfterSearch[ind].range);
        $('.template .div_star').html(star.starString);

        $divProduct = $('.template').clone();
        $divProduct.removeClass('template');
        $productPreview.append($divProduct);
    }
}

Product.prototype.hideNextPreviousPage = function (valueRef, countPage) {
    $('#page_previous').removeClass('opacity_yes');
    $('#page_next').removeClass('opacity_yes');

    if (valueRef === 1) {
        $('#page_previous').addClass('opacity_yes');
    }

    if (valueRef === countPage) {
        $('#page_next').addClass('opacity_yes');
    }
}

Product.prototype.handlerDivPage = function () {
    var self = this;
    $('.ref_page').on('click', function (event) {
        $('.href_active').removeClass('href_active');
        $(this).addClass('href_active');
        self.renderProduct(+$('#count_item_man select').val(), +$(this).html());
        self.hideNextPreviousPage(+$(this).html(), $('.class_bottom_preview .ref_page').length);
        event.preventDefault();
    });

    $('#page_previous').on('click', 'i', function (event) {
        var numberActivePage = +$('.href_active').html();
        if (numberActivePage > 1) {
            $('.href_active').removeClass('href_active');
            $('.class_bottom_preview .ref_page').eq(numberActivePage - 2).addClass('href_active');
            self.renderProduct(+$('#count_item_man select').val(), numberActivePage - 1);
            self.hideNextPreviousPage(numberActivePage - 1, $('.class_bottom_preview .ref_page').length);
        }
        event.preventDefault();
    });

    $('#page_next').on('click', 'i', function () {
        var numberActivePage = +$('.href_active').html();
        var countPage = $('.class_bottom_preview .ref_page').length;
        if (numberActivePage < countPage) {
            $('.href_active').removeClass('href_active');
            $('.class_bottom_preview .ref_page').eq(numberActivePage).addClass('href_active');
            self.renderProduct(+$('#count_item_man select').val(), numberActivePage + 1);
            self.hideNextPreviousPage(numberActivePage + 1, countPage);
        }
        event.preventDefault();
    });
}

Product.prototype.fillNumberPage = function (countPages, numberPage) {
    var $elementPagesCount = $('#' + this.idElementPagesProduct);
    $elementPagesCount.empty();
    $elementPagesCount.append('<a id="page_previous" href="#"><i class="fa fa-chevron-left"' +
        'aria-hidden="true"></i></a>');
    for (var ind = 1; ind <= countPages; ind++) {
        $elementPagesCount.append($('<a />', {
            href: '#',
            text: ind,
            class: 'ref_page'
        }));
    }
    $elementPagesCount.append('<a id="page_next" href="#"><i class="fa fa-chevron-right"' +
        'aria-hidden="true"></i></a>');

    $('#' + this.idElementPagesProduct + ' .ref_page').eq(numberPage - 1).addClass('href_active');
    this.hideNextPreviousPage(numberPage, $('.class_bottom_preview .ref_page').length);

    this.handlerDivPage();
}

Product.prototype.renderProduct = function (countForPrint, numberPage = 1, flagAll = false) {
    $.ajax({
        url: 'http://localhost:3000/product',
        context: this,
        dataType: 'json',

        success: function (data) {
            var dataAfterSearch = this.getItemForPrint(data);
            console.log(dataAfterSearch);

            var count;
            if (flagAll) {
                count = dataAfterSearch.length;
            } else {
                countForPrint < dataAfterSearch.length ? count = countForPrint : count = dataAfterSearch.length;
            }

            this.renderOnePage(dataAfterSearch, count, numberPage);

            var self = this;
            $('div .button_to_card').on('click', function (event) {
                self.addToCartDialog(event);
                event.preventDefault();
            });

            if ((this.idElementPagesProduct !== '') && (!flagAll)) {
                this.fillNumberPage(Math.ceil(dataAfterSearch.length / countForPrint), numberPage);
            }

            if (!flagAll) {
                $('#' + this.idChooseAll).removeClass('opacity_yes');
                if (this.idElementForHide !== '') {
                    $('#' + this.idElementForHide).removeClass('opacity_yes');
                }
            }
        }
    })
}

Product.prototype.createSelect = function (idDivWithSelect, arrayValue) {
    var $dialogSelect = $('#' + idDivWithSelect + ' select');
    for (var ind = 0; ind < arrayValue.length; ind++) {
        $dialogSelect.append($('<option />', {
            value: arrayValue[ind],
            text: arrayValue[ind]
        }));
    }
}

Product.prototype.addToCartDialog = function (event) {
    var idProduct = $(event.currentTarget).attr('data-id');
    var self = this;
    $.ajax({
        url: 'http://localhost:3000/product/' + idProduct,
        dataType: 'json',
        context: this,
        success: function (data) {
            $dialogCart = $('#dialog_cart');
            $dialogCart.empty();
            $dialogCart.append($('<img />', {
                src: this.pathHtml + data.path_img
            }));
            $dialogCart.append($('<h4 />', {
                text: data.name
            }));
            $dialogCart.append($('<div />', {
                id: 'dialog_size_item'
            }).append($('<span />', {
                text: 'Choose size: '
            })).append($('<select />')));
            this.createSelect('dialog_size_item', data.size);

            $dialogCart.append($('<div />', {
                id: 'dialog_color_item'
            }).append($('<span />', {
                text: 'Choose color: '
            })).append($('<select />')));
            this.createSelect('dialog_color_item', data.color);

            $dialogCart.dialog({
                modal: true,
                title: 'Choose for add to cart',
                buttons: {
                    "Add to cart": function () {
                        self.addToCart(idProduct, $('#dialog_size_item select').val(),
                            $('#dialog_color_item select').val());
                        $(this).dialog("close");
                    },
                    "Close": function () {
                        $(this).dialog("close");
                    },
                }
            });
        }
    });
}

Product.prototype.addToCart = function (idProduct, sizeItem, colorItem) {
    $.ajax({
        url: 'http://localhost:3000/product/' + idProduct,
        dataType: 'json',
        context: this,
        success: function (data) {
            var productToCard = {
                id: data.id,
                path_img: data.path_img,
                name: data.name,
                cost: data.cost,
                id_category: data.id_category,
                range: data.range,
                quantity: '1',
                color: colorItem,
                size: sizeItem
            };

            if ($('#product_cart .cart_product[data-id="' + productToCard.id + '"]').length) {
                $.ajax({
                    type: 'PATCH',
                    context: this,
                    url: 'http://localhost:3000/cart/' + productToCard.id,
                    data: {
                        quantity: +$('#product_cart .cart_product[data-id="' + productToCard.id + '"]')
                            .attr('data-quantity') + 1
                    },
                    success: function () {
                        this.cart.renderCart();
                    }
                })
            } else {
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:3000/cart',
                    context: this,
                    data: productToCard,
                    success: function () {
                        this.cart.renderCart();
                    }
                });
            }
        }
    });
}
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