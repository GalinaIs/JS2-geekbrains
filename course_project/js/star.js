/**
 * Функция - конструктор класса Star - отображение ранга товара в виде звездочек.
 * @param {string} range Ранга продукта сайта.
 */
var Star = function (range) {
    this.starString = '';
    var ind, countEmptyStar, countFullStar;

    if ((/\./).test(range)) {
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