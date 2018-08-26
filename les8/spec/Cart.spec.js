describe('Тестируем корзину товаров', function () {
    var cart = new Cart();

    var goods = [{
            id: 1,
            name: 'Трусы',
            price: 100,
            quantity: '1'
        },
        {
            id: 2,
            name: 'Носки',
            price: 300,
            quantity: '1'
        },
        {
            id: 3,
            name: 'Перчатки',
            price: 500,
            quantity: '1'
        }
    ];

    it('Проверяем общую стоимость корзины', function () {
        expect(cart.renderCartProduct(goods)).toBe(900);
    });

    var goods1 = [{
            id: 1,
            name: 'Трусы',
            price: 100,
            quantity: '5'
        },
        {
            id: 2,
            name: 'Носки',
            price: 300,
            quantity: '2'
        },
        {
            id: 3,
            name: 'Перчатки',
            price: 500,
            quantity: '0'
        }
    ];

    it('Проверяем общую стоимость корзины', function () {
        expect(cart.renderCartProduct(goods1)).toBe(1100);
    });

});