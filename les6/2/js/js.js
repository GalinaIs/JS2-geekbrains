/**
 * Объект с настройками ля проверуки формы.
 * {string} idForm Название id формы в html документе.
 * {string} idName Название id поля с именем в html документе.
 * {string} idPhone Название id поля с номером телефона в html документе.
 * {string} idEmail Название id поля с эл. почтой в html документе.
 * {string} idBirth Название id поля с датой рождения в html документе.
 */
var setting = {
    idForm: 'my_form',
    idName: 'name',
    idPhone: 'phone',
    idEmail: 'email',
    idBirth: 'data_birth'
}

/**
 * Класс для проверки валидации формы.
 * @constructor
 * @param {Object} userSetting Пользовательские настройки при необходимости.
 */
var FormValidation = function (userSetting = {}) {
    this.init(userSetting);

    this.form.on('click', event => this.validationForm(event));
}

/**
 * Метод класса для проверки формы по инициализации всех необходимых переменных.
 * @param {Object} userSetting Пользовательские настройки.
 */
FormValidation.prototype.init = function (userSetting) {
    this.setting = setting;
    Object.assign(this.setting, userSetting);

    this.form = $('#' + this.setting.idForm);
    this.name = $('#' + this.setting.idName);
    this.phone = $('#' + this.setting.idPhone);
    this.email = $('#' + this.setting.idEmail);

    this.dataBirth = $('#' + this.setting.idBirth);
    this.dataBirth.datepicker({
        firstDay: 1,
        maxDate: 0,
        dateFormat: "dd.mm.yy",
        hideIfNoPrevNext: true
    });
    $.datepicker.regional['ru'] = {
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    };
    $.datepicker.setDefaults($.datepicker.regional['ru']);
}

/**
 * Метод класса для проверки формы, который вызывается по клике на любой элемент формы.
 * @param {Object} event Событие, которое было при вызове функции-обработчика нажатия.
 */
FormValidation.prototype.validationForm = function (event) {
    if (!this.IsClickByButton(event)) {
        return;
    }

    var validDataBirth = this.validationDataBirth();
    var validEmail = this.validationEmail();
    var validPhone = this.validationPhone();
    var validName = this.validationName();

    if (!(validName && validPhone && validEmail && validDataBirth)) {
        event.preventDefault();
    } else {
        alert('Форма заполнена верно. Данные отправлены на сервер');
    }
}

/**
 * Метод класса для проверки формы, который проверяет было ли нажатие на кнопку формы.
 * @param {Object} event Событие, которое было при вызове функции-обработчика нажатия.
 * @returns {boolean} Возвращает true, если нажатие было на кнопку формы, иначе - false.
 */
FormValidation.prototype.IsClickByButton = function (event) {
    return event.target.tagName === "BUTTON";
}

/**
 * Метод класса для проверки формы, который проверяет корректность ввода имени. 
 */
FormValidation.prototype.validationName = function () {
    var pattern = /^[а-яёa-z]+$/i;
    var result = pattern.test(this.name.val());

    this.changeInformation(result, this.name, 'Поле "Имя" должно содержать только буквы', 'Поле "Имя"');

    return result;
}

/**
 * Метод класса для проверки формы, который проверяет корректность ввода номера телефона. 
 */
FormValidation.prototype.validationPhone = function () {
    var pattern = /^\+\d\(\d{3}\)\d{3}-\d{4}$/;
    var result = pattern.test(this.phone.val());

    this.changeInformation(result, this.phone, 'Поле "Телефон" должен быть введен в формате: +7(000)000-0000',
        'Поле "Телефон"');

    return result;
}

/**
 * Метод класса для проверки формы, который проверяет корректность ввода адреса эл. почты. 
 */
FormValidation.prototype.validationEmail = function () {
    var pattern = /^[a-z]+((\.?)|(-?))[a-z]*@[a-z]+\.((com)|(ru))$/;
    var result = pattern.test(this.email.val());

    this.changeInformation(result, this.email, `Поле "E-mail" должен выглядеть как mymail@mail.ru, или my.mail@mail.ru,
     или my-mail@mail.ru`, 'Поле "E-mail"');

    return result;
}

/**
 * Метод класса для проверки формы, который проверяет корректность ввода даты рождения. 
 */
FormValidation.prototype.validationDataBirth = function () {
    var result;
    this.dataBirth.val().length === 0 ? result = false : result = true;

    this.changeInformation(result, this.dataBirth, `Поле "Дата рождения" должно быть заполнено`,
        'Поле "Дата рождения"');

    return result;
}

/**
 * Метод класса для проверки формы, который в зависимости от результата проверки поля меняет проверяемому поля класс и
 * при необходимости выводит сообщение об ошибке.
 * @param {boolean} flag Результат проверки содержимого поля.
 * @param {HTMLElement} element Поля, которое было проверено
 * @param {string} errorInfo Сообщение об ошибке.
 */
FormValidation.prototype.changeInformation = function (flag, element, errorInfo, headerDialog) {
    $divError = element.parent().children().eq(1);

    if (flag) {
        $divError.html('');
        element.addClass('checked_input');
        element.removeClass('error_input');
    } else {
        $divError.html(errorInfo);
        $divError.dialog({
            height: 250,
            title: headerDialog,
            modal: true,

            hide: {
                effect: "explode",
                duration: 1000
            },

            buttons: [{
                text: 'OK',
                icon: 'ui-icon-info',
                click: function () {
                    $(this).dialog("close");
                }
            }]
        });
        element.addClass('error_input');
        element.removeClass('checked_input');
    }
}

window.onload = function () {
    new FormValidation();
}