/**
 * Функция, которая отрисовывает блок товаров на странице, и определяет, что элементы i блока товары являются 
 * перетаскиваемыми, и описывает их свойства при перетаскивании.
 */
function renderGoodsList() {
  $('#goods').empty();
  $('#goods').append($('<p />', {
    text: 'Товары:'
  }));

  $.get('http://localhost:3000/goods', {}, function (goods) {
    var $ul = $('<ul />');
    var $li;

    goods.forEach(function (item) {
      $li = $('<li />', {
        text: item.name + ' Цена: ' + item.price + ' руб. '
      }).append(
        $('<button />', {
          text: 'Купить',
          'data-id': item.id,
          'data-price': item.price,
          'data-name': item.name
        }));

      $li.draggable({
        cancel: "button",
        axis: "y",
        distance: 15,
        refreshPositions: true,
        revert: true,

        start: function (event, ui) {
          ui.helper.css("color", "blue");
        },

        stop: function (event, ui) {
          ui.helper.css("color", "black");
        },

      });

      $ul.append($li);
    })

    $('#goods').append($ul);
  }, 'json');
}

/**
 * Функция, которая отрисовывает блок корзины на странице, и определяет, что на блок корзины можно перетащить элементы,
 * а также описывает поведение блока, когда на него перетащен элемент товара.
 */
function renderCart() {
  $('#cart').empty();
  $('#cart').append($('<p />', {
    text: 'Корзина:'
  }));

  $.get('http://localhost:3000/cart', {}, function (goods) {
    var $ul = $('<ul />');
    var total = 0;

    goods.forEach(function (item) {
      $ul.append($('<li />', {
        text: item.name + ' Цена: ' + item.price + ' руб. Количество: ' + item.quantity + ' Общая стоимость: ' +
          (+item.quantity) * (+item.price) + ' '
      }).append(
        $('<button />', {
          text: 'Удалить',
          'data-id': item.id,
          'data-price': item.price,
          'data-name': item.name,
          'data-quantity': item.quantity
        })
      ));
      total += (+item.quantity) * (+item.price);
    });

    $('#cart').append($ul);
    $('#cart').append($('<div />', {
      text: 'Общая стоимость: ' + total + ' руб.'
    }));
  }, 'json');

  $('#cart').droppable({
    over: function () {
      $('#cart').css('background-color', 'green');
    },

    out: function () {
      $('#cart').css('background-color', 'white');
    },

    deactivate: function () {
      $('#cart').css('background-color', 'white');
    },

    drop: (event, ui) => buyProduct(event, ui)
  });

}

/**
 * Фукнция-обработчик, которая срабатывает при добавлении товара в корзину.
 * @param {Object} event Событие, которое произошло.
 * @param {Object} ui Елемент, который нужен для корректной обработки при перетаскивании блоков.
 */
function buyProduct(event, ui = '') {
  var self;
  ui === '' ? self = this : self = $(ui.helper).children(1);

  var good = {
    id: $(self).attr('data-id'),
    price: $(self).attr('data-price'),
    name: $(self).attr('data-name'),
    quantity: 1
  }

  if ($('#cart li button[data-id="' + good.id + '"]').length) {
    var $good = $('#cart li button[data-id="' + good.id + '"]');

    $.ajax({
      type: 'PATCH',
      url: 'http://localhost:3000/cart/' + good.id,
      data: {
        quantity: +$good.attr('data-quantity') + 1
      },
      success: function () {
        renderCart();
      }
    });
  } else {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/cart',
      data: good,
      success: function () {
        renderCart();
      }
    });
  }

  event.preventDefault();
}

(function ($) {
  $(document).ready(function () {
    renderGoodsList();
    renderCart();

    /**
     * Навешиваем функцию обработчик на кнопки "Удалить" блока корзины
     */
    $('#cart').on('click', 'li button', function (event) {

      if ($('#cart li button[data-id="' + $(this).attr('data-id') + '"]').attr('data-quantity') > 1) {
        $.ajax({
          type: 'PATCH',
          url: 'http://localhost:3000/cart/' + $(this).attr('data-id'),
          data: {
            quantity: +$(this).attr('data-quantity') - 1
          },
          success: function () {
            renderCart();
          }
        })
      } else {
        $.ajax({
          type: 'DELETE',
          url: 'http://localhost:3000/cart/' + $(this).attr('data-id'),
          success: function () {
            renderCart();
          }
        })
        event.preventDefault();
      }
    });

    /**
     * Навешиваем функцию обработчик на кнопки "Купить" блока корзины
     */
    $('#goods').on('click', 'li button', buyProduct);

  })
})(jQuery);