/**
 * Функция - конструктор класса Product. 
 * @param {Cart} cart Экземпляр класса Cart.
 * @param {string} idBrowseAll Идентификатор элемента на странице, который отвечает за то, что нужно показать все
 * элементы выборки.
 * @param {string} idElementHide Идентификатор элемента на странице, который нужны скрыть, если показаны все элементы
 * выборки.
 * @param {string} path Относительный путь для экземляра класса.
 * @param {string} idElementHtml Идентификатор элемента на странице, который содержит номера страниц для отображения
 * выборки.
 * @param {string} sortBy Параметр, по которому нужно сортировать выборку.
 */
var Product = function (myCart, idBrowseAll, idElementHide, path = '', idElementHtml = '', sortBy = '') {
    this.pathHtml = path;
    this.cart = myCart;
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

/**
 * Метод класса, который первоначально устанавливает параметры для выборки элементов.
 * @param {string} valueSortBy Параметр, по которому нужно сортировать выборку.
 */
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

/**
 * Метод класса, который определяет какую функцию для изменения значения параметра необходимо вызвать.
 * @param {string} value Значание параметра.
 * @param {string} paramName Имя параметра.
 */
Product.prototype.setParam = function (value, paramName) {
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

/**
 * Метод класса для изменения значения idCategory.
 * @param {string} idProduct Новое значение параметра.
 */
Product.prototype.setIdCategory = function (idProduct) {
    this.settingForSearch.idCategory = idProduct;
}

/**
 * Метод класса для добавления параметра в массив с перечнем категорий.
 * @param {string} newCategory Значение параметра для добавления в массив.
 */
Product.prototype.setCategory = function (newCategory) {
    this.settingForSearch.category.push(newCategory);
}

/**
 * Метод класса для добавления параметра в массив с перечнем брендов.
 * @param {string} newBrand Значение параметра для добавления в массив.
 */
Product.prototype.setBrand = function (newBrand) {
    this.settingForSearch.brand.push(newBrand);
}

/**
 * Метод класса для добавления параметра в массив с перечнем дизайнеров.
 * @param {string} newDesigner Значение параметра для добавления в массив.
 */
Product.prototype.setDesigner = function (newDesigner) {
    this.settingForSearch.designer.push(newDesigner);
}

/**
 * Метод класса для добавления параметра в массив с перечнем размеров.
 * @param {string} setSize Значение параметра для добавления в массив.
 */
Product.prototype.setSize = function (newSize) {
    this.settingForSearch.size.push(newSize);
}

/**
 * Метод класса для изменение параметра тренд.
 * @param {string} newTrend Название тренда.
 */
Product.prototype.setTrend = function (newTrend) {
    if (this.settingForSearch.trend === newTrend) {
        this.settingForSearch.trend = ''
    } else {
        this.settingForSearch.trend = newTrend;
    }
}

/**
 * Метод класса для изменения значения верхней и нижней границы цен.
 * @param [{number}] arrayPrice Массив значений цены.
 */
Product.prototype.setPrice = function (arrayPrice) {
    this.settingForSearch.price.upPrice = arrayPrice[0];
    this.settingForSearch.price.toPrice = arrayPrice[1];
}

/**
 * Метод класса для изменения параметра, по которому сортируется выборка.
 * @param {string} valueSortBy Новое значение, по которому идет сортировка.
 */
Product.prototype.setValueSortBy = function (valueSortBy) {
    this.settingForSearch.sortBy = valueSortBy;
}

/**
 * Метод класса, который определяет какую функцию для удаления значения параметра необходимо вызвать.
 * @param {string} value Значание параметра.
 * @param {string} paramName Имя параметра.
 */
Product.prototype.deleteParam = function (value, paramName) {
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

/**
 * Метод класса, который удаляет элемент массива из самого массива.
 * @param [{string}] array Массив.
 * @param {string} arrayElement Элемент массива.
 */
Product.prototype.deleteElementFromArray = function (array, arrayElement) {
    var position = array.indexOf(arrayElement);
    array.splice(position, 1);
}

/**
 * Метод класса, который удаляет элемент категории из массива категорий для выборки.
 * @param {string} delCategory Элемент, который необходимо удалить.
 */
Product.prototype.deleteCategory = function (delCategory) {
    this.deleteElementFromArray(this.settingForSearch.category, delCategory);
}

/**
 * Метод класса, который удаляет элемент бренда из массива брендов для выборки.
 * @param {string} delBrand Элемент, который необходимо удалить.
 */
Product.prototype.deleteBrand = function (delBrand) {
    this.deleteElementFromArray(this.settingForSearch.brand, delBrand);
}

/**
 * Метод класса, который удаляет элемент дизайнер из массива дизайнеров для выборки.
 * @param {string} delDesigner Элемент, который необходимо удалить.
 */
Product.prototype.deleteDesigner = function (delDesigner) {
    this.deleteElementFromArray(this.settingForSearch.designer, delDesigner);
}

/**
 * Метод класса, который удаляет элемент размер из массива размеров для выборки.
 * @param {string} deleteSize Элемент, который необходимо удалить.
 */
Product.prototype.deleteSize = function (delSize) {
    this.deleteElementFromArray(this.settingForSearch.size, delSize);
}

/**
 * Массив, который определяет содержится ли элемент в массиве. При этом считает, что элемент '' содержится в любом 
 * массиве.
 * @param {string} element Элемент.
 * @param [{string}] array Массив.
 */
Product.prototype.equalElement = function (element, array) {
    if (element === '') {
        return true;
    }

    return array.includes(element);
}

/**
 * Массив, который определяет содержится хотя бы одно значение первого массива во втором массиве. При этом считает, что
 * пустой массив содержится в любом массиве.
 * @param [{string}] array1 Первый массив.
 * @param [{string}] array2 Второй массив.
 */
Product.prototype.equalArray = function (array1, array2) {
    if (array1.length === 0) {
        return true;
    }

    return array2.some(element => array1.includes(element));
}

/**
 * Метод класса, который определяет входит ли значение цены в диапозон, определенный массивом priceArray. 
 * @param [{number}] priceArray Массив, который определяет диапозон цены.
 * @param {number} price Значение цены.
 */
Product.prototype.equalPrice = function (priceArray, price) {
    if ((priceArray.upPrice === '') || (priceArray.toPrice === '')) {
        return true;
    }

    return (priceArray.upPrice <= price) && (price <= priceArray.toPrice);
}

/**
 * Метод класса, который сортирует массив значений по определенному параметру.
 * @param [{Object}] data Массив, который необходимо отсортировать.
 */
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

/**
 * Метод класса, который из массива data выбирает только те, которые подходят по параметрам, определенным в классе.
 * @param [{Object}] data Массив объектов.
 */
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

    return this.sortByValue(dataForPrint);
}

/**
 * Метод класса, который отрисовывает 1 страницу товаров.
 * @param [{Object}] dataAfterSearch Данные для отрисовки.
 * @param {number} count Количество, которое необходимо отриосвать на одной странице товаров.
 * @param {number} numberPage Номер страницы товаров.
 */
Product.prototype.renderOnePage = function (dataAfterSearch, count, numberPage) {
    var $divProduct;
    var $productPreview = $('.preview_menu_flex');
    $productPreview.empty();

    if (dataAfterSearch.length === 0) {
        $productPreview.append($('<div />', {
            text: 'No item was found by the entered parameters',
            class: 'no_item_product'
        }))
    }

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

/**
 * Метод класса, который в зависимости от номера отображенной страницы определеляет должны ли отображаться кпонки - 
 * "Переход к предыдущей странице" и "Переход к следующей странице".
 * @param {number} valueRef Номер отображенной страницы.
 * @param {number} countPage Количество страниц.
 */
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

/**
 * Метод класса, который навешивает отработчики на кпонки "Переход к предыдущей странице", 
 * "Переход к следующей странице" и на каждую страницу.
 */
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

/**
 * Метод класса, который отрисоывает блок с номерами страниц товара.
 * @param {number} countPages Количетсво страниц.
 * @param {number} numberPage Номер страницы. 
 */
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

/**
 * Метод класса, который отрисосывает продукты.
 * @param {number} countForPrint Количество элементов на странице.
 * @param {number} numberPage Номер страницы.
 * @param {boolean} flagAll Нужно ли отобразить все элементы.
 */
Product.prototype.renderProduct = function (countForPrint, numberPage = 1, flagAll = false) {
    $.ajax({
        url: 'http://localhost:3000/product',
        context: this,
        dataType: 'json',

        success: function (data) {
            var dataAfterSearch = this.getItemForPrint(data);

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
                var countPage = Math.ceil(dataAfterSearch.length / countForPrint);
                this.fillNumberPage(countPage, numberPage);

                if (!flagAll) {
                    $('#' + this.idChooseAll).removeClass('opacity_yes');
                    if (this.idElementForHide !== '') {
                        $('#' + this.idElementForHide).removeClass('opacity_yes');
                    }
                }

                if (countPage === 1 || countPage === 0) {
                    $('#' + this.idChooseAll).addClass('opacity_yes');
                } else {
                    $('#' + this.idChooseAll).removeClass('opacity_yes');
                }

                if (countPage === 0 && this.idElementForHide !== '') {
                    $('#' + this.idElementForHide).addClass('opacity_yes');
                } else if (this.idElementForHide !== '') {
                    $('#' + this.idElementForHide).removeClass('opacity_yes');
                }
            }
        }
    })
}

/**
 * Метод класса, который отрисосывает элементы option для select на странице.
 * @param {string} idDivWithSelect Идентификатор блока с select.
//  * @param [{string}] arrayValue Массив со значениями.
 */
Product.prototype.createSelect = function (idDivWithSelect, arrayValue) {
    var $dialogSelect = $('#' + idDivWithSelect + ' select');
    for (var ind = 0; ind < arrayValue.length; ind++) {
        $dialogSelect.append($('<option />', {
            value: arrayValue[ind],
            text: arrayValue[ind]
        }));
    }
}

/**
 * Метод класса, который создает и отображает диалог для добавления товара в корзину с возможностью выбора цвета и
 *  размера.
 * @param {Object} event Событие, которое привело к вызову данной функции.
 */
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
                    'Add to cart': function () {
                        $(this).dialog('close');
                        self.addToCart(idProduct, $('#dialog_size_item select').val(),
                            $('#dialog_color_item select').val());
                    },
                    'Close': function () {
                        $(this).dialog('close');
                    },
                }
            });
        }
    });
}

/**
 * Метод класса, который определяет нужно ли добавить товар в корзину, и если да, то добавляет товар с необходимыми 
 * характеристиками.
 * @param {string} idProduct Идентификатор товара.
 * @param {string} sizeItem Размер для добавления в корзину.
 * @param {string} colorItem Цвет для добавления в корзину.
 * @param {string} quantityItem Количетсво для добавления в корзину.
 * @param {boolean} isValidAdd Нужно ли добавить товар в корзину.
 * @param {string} errorMessage Сообщение с ошибкой в случае невозможности добавить товар.
 */
Product.prototype.addToCart = function (idProduct, sizeItem, colorItem, quantityItem = 1, isValidAdd = true,
    errorMessage = '') {
    $dialogResultAddToCart = $('#result_add_to_cart');
    if (isValidAdd) {
        var $productCart = $('#product_cart .cart_product[data-id-product="' + idProduct + '"][data-color="' +
            colorItem + '"][data-size="' + sizeItem + '"]');
        if ($productCart.length) {
            $.ajax({
                type: 'PATCH',
                context: this,
                url: 'http://localhost:3000/cart/' + $productCart.attr('data-id'),
                data: {
                    quantity: +$productCart.attr('data-quantity') + quantityItem
                },
                success: function () {
                    this.cart.renderCart();
                }
            })
        } else {
            $.ajax({
                url: 'http://localhost:3000/cart',
                context: this,
                success: function (dataCart) {
                    var idElementCart;
                    dataCart.length > 0 ? idElementCart = +dataCart[dataCart.length - 1].id + 1 : idElementCart = 1;

                    $.ajax({
                        url: 'http://localhost:3000/product/' + idProduct,
                        context: this,
                        success: function (dataProduct) {
                            var productToCard = {
                                id: idElementCart,
                                id_product: dataProduct.id,
                                path_img: dataProduct.path_img,
                                name: dataProduct.name,
                                cost: dataProduct.cost,
                                id_category: dataProduct.id_category,
                                range: dataProduct.range,
                                quantity: quantityItem,
                                color: colorItem,
                                size: sizeItem
                            };

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
                    });
                }
            });
        }
        $dialogResultAddToCart.html('Item successfully added to cart');
        $dialogResultAddToCart.dialog({
            modal: true,
            title: 'Result adding item to cart',
            buttons: {
                'OK': function () {
                    $(this).dialog('close');
                },
            }
        });
    } else {
        $dialogResultAddToCart.html(errorMessage);
        $dialogResultAddToCart.dialog({
            modal: true,
            title: 'Result adding item to cart',
            buttons: {
                'OK': function () {
                    $(this).dialog('close');
                },
            }
        });
    }
}