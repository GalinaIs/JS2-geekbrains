/**
 * Конструктов класса User
 * @param {Сart} myCart Экземпляр класса Сart.
 * @param {boolean} IsAccountHtml Нужно ли отображать данные пользователя на странице личного кабинета.
 */
var User = function (myCart, IsAccountHtml = false) {
    this.cart = myCart;
    this.accountHtml = IsAccountHtml;
    this.initUser();
    this.getIdNextUser();
}

/**
 * Метод класса, который инициализирует пользователя с сервера.
 */
User.prototype.initUser = function () {
    $.ajax({
        url: 'http://localhost:3000/current_user',
        context: this,
        success: function (data) {
            this.userCurrent = data[0];

            if (this.accountHtml) {
                this.renderAccountHtml();
            }

            this.renderFormViewUser();
        }
    });
}

/**
 * Метод класса, который отрисовывает форму для данных пользователя.
 */
User.prototype.renderFormViewUser = function () {
    this.renderViewUser();
    this.handlerInfoUser();
}

/**
 * Метод класса, который запоминает идентивикатор для следующео пользователя, который будет регистрироваться на сайте.
 */
User.prototype.getIdNextUser = function () {
    $.ajax({
        url: 'http://localhost:3000/user',
        context: this,
        success: function (data) {
            this.idNextUser = +data[data.length - 1].id + 1;
        }
    })
}

/**
 * Метод класса, который отрисовывает внешний вид формы для данных пользователя.
 */
User.prototype.renderViewUser = function () {
    if (this.userCurrent === undefined || this.userCurrent.id === undefined) {
        $('#user_noreg').show();
        $('#user_reg').hide();
    } else {
        $('#user_noreg').hide();
        $('#user_reg').show();
        this.renderInfoUser();
    }
}

/**
 * Метод класса, который данные пользователя отрисосывает в форме для данных пользователя.
 */
User.prototype.renderInfoUser = function () {
    $('#user_reg .user_name').html(this.userCurrent.username);
}

/**
 * Метод класса, который определяет обработчики кнопок формы для данных пользователя.
 */
User.prototype.handlerInfoUser = function () {
    this.handlerLogInButton('#user_noreg', '#user_log_in', '#user_noreg form', '#user_email', '#user_password');
    this.handlerForgotPassword('#user_noreg', '.div_account_ref');
    this.handlerChangeInfoAccount('#user_reg', '#user_change');
    this.handlerExitButton('#user_reg', '#user_logout');
}

/**
 * Метод класса, который отрисовывает личный кабинет пользователя.
 */
User.prototype.accountViewForm = function () {
    if (this.userCurrent === undefined || this.userCurrent.id === undefined) {
        $('#no_log_in_user').show();
        $('#log_in_user').hide();
        $('#form_regisration').removeClass('opacity_yes');
    } else {
        $('#no_log_in_user').hide();
        $('#log_in_user').show();
        $('#form_regisration').addClass('opacity_yes');
        this.accountFillUserInformation();
    }
}

/**
 * Метод класса, который проверяет корректность заполнения полей формы для входа пользователя.
 * @param {Object} $formValidate Форма для входа пользователя.
 */
User.prototype.validateUserLogInForm = function ($formValidate) {
    $inputValide = $formValidate.children('input');
    var ind;

    var arrayValidation = [];
    for (ind = 0; ind < $inputValide.length; ind++) {
        arrayValidation.push($inputValide[ind].validationMessage);
    }

    var $formError = $formValidate.children('.error_forgot');
    for (ind = 0; ind < arrayValidation.length; ind++) {
        $formError.eq(ind).html(arrayValidation[ind]);
    }

    for (ind = 0; ind < arrayValidation.length; ind++) {
        if (arrayValidation[ind] !== '') {
            return false;
        }
    }
    return true;
}

/**
 * Метод класса, который отпределяет обработчик для входа пользователя на сайт.
 * @param {string} parentElement Идентификатор родителя элемента на странице.
 * @param {string} element Идентификатор элемента на странице.
 * @param {string} formForValidation Идентификатор формы, которую нужно проверить.
 * @param {string} inputWithEmail Идентификатор элемента, содержащий эл адрес пользователя.
 * @param {string} inputWithPassword Идентификатор элемента, содержащий пароль пользователя.
 */
User.prototype.handlerLogInButton = function (parentElement, element, formForValidation, inputWithEmail,
    inputWithPassword) {
    var self = this;
    $(parentElement).on('click', element, function (event) {
        if (self.validateUserLogInForm($(formForValidation))) {
            self.logIn($(inputWithEmail).val(), $(inputWithPassword).val());
        }

        event.preventDefault();
    });
}

/**
 * Метод класса, который отпределяет обработчик для для создания нового аккаунта на сайте.
 */
User.prototype.accountHandlerNewAccountButton = function () {
    var self = this;
    $('.checkout__checkbox__form__flex').on('click', '#new_account_button', function (event) {
        if (self.validateDialogChangeAccount($('#form_regisration'))) {
            self.validationUserInServer($('#form_regisration'));
        }
        event.preventDefault();
    });
}

/**
 * Метод класса, который отпределяет обработчик для выхода пользователя из аккаунта на сайте.
 * @param {string} parentElement Идентификатор родителя элемента на странице.
 * @param {string} element Идентификатор элемента на странице.
 */
User.prototype.handlerExitButton = function (parentElement, element) {
    var self = this;
    $(parentElement).on('click', element, function (event) {
        self.dialogLogOut(self.userCurrent.id);
        event.preventDefault();
    });
}

/**
 * Метод класса, который определяет и отображает диалоговое окно для восстановления пароля пользователя.
 * @param {Object} $dialogForgotPassword Элемент страницы для диалога.
 */
User.prototype.showDialogForgotPassword = function ($dialogForgotPassword) {
    $dialogForgotPassword.dialog({
        modal: true,
        title: 'Reset password',

        hide: {
            effect: 'explode',
            duration: 1000
        },

        buttons: [{
            text: 'Send mail',
            click: function (event) {
                if ($('#dialog_forgot_password input')[0].validationMessage === '') {
                    $.ajax({
                        url: 'http://localhost:3000/user',
                        context: this,
                        success: function (data) {
                            for (var ind = 0; ind < data.length; ind++) {
                                if (data[ind].email === $('#dialog_forgot_password input').val()) {
                                    break;
                                }
                            }
                            if (ind === data.length) {
                                $('#dialog_forgot_password .error_forgot').html('User with this email is not register');
                            } else {
                                var $errorDial = $('#dialog_forgot_password .error_forgot');
                                $errorDial.html('Mail send in this email');
                                $errorDial.addClass('error_forgot_send');
                                $errorDial.removeClass('error_forgot');
                                $(event.currentTarget).hide();
                            }
                        }
                    })
                } else {
                    $('#dialog_forgot_password .error_forgot').
                    html($('#dialog_forgot_password input')[0].validationMessage);
                }
            }
        }, {
            text: 'Close',
            click: function () {
                $(this).dialog('close');
            }
        }]
    });
}

/**
 * Метод класса, который отпределяет обработчик для восстановления пароля пользователя.
 * @param {string} parentElement Идентификатор родителя элемента на странице.
 * @param {string} element Идентификатор элемента на странице. 
 */
User.prototype.handlerForgotPassword = function (parentElement, element) {
    var self = this;
    $(parentElement).on('click', element, function (event) {
        var $dialogForgotPassword = $('#dialog_forgot_password');
        $dialogForgotPassword.empty();
        $dialogForgotPassword.append($('<p />', {
            text: 'Input your email address to send mail for password reset'
        }));
        $dialogForgotPassword.append($('<input />', {
            type: 'email',
            required: 'required'
        }));
        $dialogForgotPassword.append($('<p />', {
            class: 'error_forgot'
        }));

        self.showDialogForgotPassword($dialogForgotPassword);

        event.preventDefault();
    });
}

/**
 * Метод класса, который добавляет к элементу страницы блок, необходимый для изменения информация в аккаунте
 * пользователя.
 * @param {Object} $dialogChangeInfo Элемент страницы для диалога.
 * @param {string} textDiv Текст для отображения блока.
 * @param {string} classDiv Класс, который присваивается блоку.
 * @param {string} type Тип элемента, который необходимо добавить.
 * @param {string} value Значение элемента, которое необходимо добавить.
 */
User.prototype.appendElementDialogChange = function ($dialogChangeInfo, textDiv, classDiv, type, value) {
    $dialogChangeInfo.append($('<div />', {
        text: textDiv,
        class: classDiv
    }));

    var $dialogSelect;
    if (type !== 'select') {
        if (textDiv !== 'credit cart') {
            $dialogChangeInfo.append($('<input />', {
                type: type,
                required: 'required',
                value: value
            }));
        } else {
            $dialogChangeInfo.append($('<input />', {
                type: type,
                required: 'required',
                value: value,
                pattern: '^\\d{7}-\\d{4}-\\d{6}-\\d{3}$'
            }));
        }
        $dialogChangeInfo.append($('<p />', {
            class: 'error_forgot'
        }))
    } else {
        $dialogChangeInfo.append($('<select />'));
        $dialogSelect = $dialogChangeInfo.children('select');
        if (value === 'Male') {
            $dialogSelect.append($('<option />', {
                text: 'Male'
            }));
            $dialogSelect.append($('<option />', {
                text: 'Female'
            }));
        } else if (value === 'Female') {
            $dialogSelect.append($('<option />', {
                text: 'Female'
            }));
            $dialogSelect.append($('<option />', {
                text: 'Male'
            }));
        }
    }
}

/**
 * Метод класса, который добавляет к элементы страницы блоки, необходимые для изменения информация в аккаунте
 * пользователя.
 * @param {Object} $dialogChangeInfo Элемент страницы для диалога.
 */
User.prototype.fillDialogChangeInfo = function ($dialogChangeInfo) {
    $dialogChangeInfo.append($('<p />', {
        text: 'Input new data for change your account'
    }));

    this.appendElementDialogChange($dialogChangeInfo, 'name', 'checkout__checkbox__form__flex__text', 'text',
        this.userCurrent.username);
    this.appendElementDialogChange($dialogChangeInfo, 'PASSWORD', 'checkout__checkbox__form__flex__text', 'password',
        this.userCurrent.password);
    this.appendElementDialogChange($dialogChangeInfo, 'repeat PASSWORD', 'checkout__checkbox__form__flex__text',
        'password', this.userCurrent.password);
    this.appendElementDialogChange($dialogChangeInfo, 'EMAIL ADDRESS', 'checkout__checkbox__form__flex__text',
        'email', this.userCurrent.email);
    this.appendElementDialogChange($dialogChangeInfo, 'gender', 'checkout__checkbox__form__flex__text', 'select',
        this.userCurrent.gender);
    this.appendElementDialogChange($dialogChangeInfo, 'credit cart', 'checkout__checkbox__form__flex__text', 'text',
        this.userCurrent.credit_cart);

    $dialogChangeInfo.append($('<p />', {
        class: 'error_forgot'
    }))
}

/**
 * Метод класса, который определяет совпадают ли введенные пароли.
 * @param {string} password Значение пароля.
 * @param {string} passwordRepeat Значение повторенного пароля.
 */
User.prototype.validRepeatPassword = function (password, passwordRepeat) {
    return password === passwordRepeat;
}

/**
 * Метод класса, который проверяет правильность введения данных для изменения информации в аккаунте пользователя.
 * @param {Object} $dialogChangeInfo Элемент страницы.
 */
User.prototype.validateDialogChangeAccount = function ($dialogChangeInfo) {
    $inputForm = $dialogChangeInfo.children('input');

    var ind;
    var arrayValidation = [];
    for (ind = 0; ind < $inputForm.length; ind++) {
        arrayValidation.push($inputForm[ind].validationMessage);
    }

    var $inputPassword = $dialogChangeInfo.children('input:password');
    if (!(this.validRepeatPassword($inputPassword.eq(0).val(), $inputPassword.eq(1).val()))) {
        arrayValidation[2] = 'Repeat password must be equal password';
    }

    if (arrayValidation[4] !== '') {
        arrayValidation[4] += ' Формат: 0000000-0000-000000-000';
    }

    var $formError = $dialogChangeInfo.children('.error_forgot');
    for (ind = 0; ind < arrayValidation.length; ind++) {
        $formError.eq(ind).html(arrayValidation[ind]);
    }

    for (ind = 0; ind < arrayValidation.length; ind++) {
        if (arrayValidation[ind] !== '') {
            return false;
        }
    }
    return true;
}

/**
 * Метод класса, который изменяет данные пользователя на сервере.
 * @param {Object} $element Элемент на странице.
 */
User.prototype.refreshUserData = function ($element) {
    $dataInput = $element.children('input');
    var refreshDataUser = {
        username: $dataInput.eq(0).val(),
        password: $dataInput.eq(2).val(),
        email: $dataInput.eq(3).val(),
        gender: $element.children('select').val(),
        credit_cart: $dataInput.eq(4).val()
    }

    $.ajax({
        url: 'http://localhost:3000/current_user/' + this.userCurrent.id,
        type: 'PATCH',
        context: this,
        data: refreshDataUser,
        success: function () {
            this.userCurrent.username = $dataInput.eq(0).val();
            this.userCurrent.password = $dataInput.eq(2).val();
            this.userCurrent.email = $dataInput.eq(3).val();
            this.userCurrent.gender = $element.children('select').val();
            this.userCurrent.credit_cart = $dataInput.eq(4).val();
            if (this.accountHtml) {
                this.accountFillUserInformation();
            }
            this.renderInfoUser();
        }
    });

    $.ajax({
        url: 'http://localhost:3000/user/' + this.userCurrent.id,
        type: 'PATCH',
        context: this,
        data: refreshDataUser
    })
}

/**
 * Метод класса, который определяет обработчик при изменении данных пользователя в аккаунте.
 * @param {string} parentElement Идентификатор родителя элемента на странице.
 * @param {string} element Идентификатор элемента на странице.  
 */
User.prototype.handlerChangeInfoAccount = function (parentElement, element) {
    var self = this;
    $(parentElement).on('click', element, function (event) {
        var $dialogChangeInfo = $('#dialog_change_info');
        $dialogChangeInfo.empty();
        self.fillDialogChangeInfo($dialogChangeInfo);

        $dialogChangeInfo.dialog({
            modal: true,
            title: 'Change information',

            hide: {
                effect: 'explode',
                duration: 1000
            },

            buttons: [{
                text: 'Change information',
                click: function (event) {
                    if (self.validateDialogChangeAccount($dialogChangeInfo)) {
                        self.refreshUserData($dialogChangeInfo);
                        var $resultChange = $('.error_forgot:last');
                        $resultChange.html('Data user save');
                        $resultChange.addClass('error_forgot_send');
                        $resultChange.removeClass('error_forgot');
                        $(event.currentTarget).hide();
                    }
                }
            }, {
                text: 'Close',
                click: function () {
                    $(this).dialog('close');
                }
            }]
        });

        event.preventDefault();
    });
}

/**
 * Метод класса, который определяет обработчики кнопок в личном кабинете пользователя.
 */
User.prototype.accountHandlerButton = function () {
    this.handlerLogInButton('.checkout__checkbox__form__flex__flex', '#log_in_button', '#no_log_in_user',
        '#input_email_log_in', '#input_password_log_in');
    this.accountHandlerNewAccountButton();
    this.handlerExitButton('.checkout__checkbox__form__flex__flex', '#exit_account_button');
    this.handlerForgotPassword('.checkout__checkbox__form__flex__flex', '#forgot_password');
    this.handlerChangeInfoAccount('.checkout__checkbox__form__flex__flex', '#change_info_account_button');
}

/**
 * Метод класса, который отрисовывает личный кабинет пользователя.
 */
User.prototype.renderAccountHtml = function () {
    this.accountViewForm();
    this.accountHandlerButton();
}

/**
 * Метод класса, который заменяет пароль на строку из * такой же длины.
 * @param {number} length Длина пароля.
 */
User.prototype.changePasswordForPrint = function (length) {
    var passwordForPrint = '';
    for (var ind = 0; ind < length; ind++) {
        passwordForPrint += '*';
    }
    return passwordForPrint;
}

/**
 * Метод класса, который заменяет номер кредитной карты на строку из * и последние 3 цифры карты.
 * @param {string} numberCreditCard Номер кредитной карты.
 */
User.prototype.changeCreditCartForPrint = function (numberCreditCard) {
    var firstPartCreditCard = numberCreditCard.substring(0, numberCreditCard.length - 4);
    var secondPartCreditCard = numberCreditCard.substring(numberCreditCard.length - 4, numberCreditCard.length);

    var firstPartCreditCardForPrint = '';
    for (var ind = 0; ind < firstPartCreditCard.length; ind++) {
        firstPartCreditCard[ind] === '-' ? firstPartCreditCardForPrint += '-' : firstPartCreditCardForPrint += '*';
    }

    return firstPartCreditCardForPrint + secondPartCreditCard;
}

/**
 * Метод класса, который отрисовывает информацию о пользователе в личном кабинете пользователя.
 */
User.prototype.accountFillUserInformation = function () {
    $('#your_name_p').html(this.userCurrent.username);
    $('#your_email_p').html(this.userCurrent.email);
    $('#your_gender_p').html(this.userCurrent.gender);
    $('#your_credit_p').html(this.userCurrent.credit_cart);

    $('#your_password_p').html(this.changePasswordForPrint(this.userCurrent.password.length));
    $('#your_credit_p').html(this.changeCreditCartForPrint(this.userCurrent.credit_cart));;
}

/**
 * Метод класса, который отображает диалог при входе в аккаунт пользователя - хочет ли пользователь загрузить корзину, 
 * которая была сохранена в аккаунте ранее.
 */
User.prototype.dialogLogIn = function () {
    $dialogLogIn = $('#dialog_registration');
    $dialogLogIn.html('Do you want shopping with cart from your account?');
    var self = this;

    $dialogLogIn.dialog({
        modal: true,
        title: 'Your shopping cart',

        hide: {
            effect: 'explode',
            duration: 1000
        },

        closeOnEscape: false,
        open: function (event, ui) {
            $('.ui-dialog-titlebar-close', ui.dialog | ui).hide();
        },

        buttons: [{
            text: 'Yes',
            click: function () {
                self.cart.readCartInUserProfile(self.userCurrent.id);
                $(this).dialog('close');
                self.renderViewUser();
                if (self.accountHtml) {
                    self.accountViewForm();
                }
            }
        }, {
            text: 'No',
            click: function () {
                $(this).dialog('close');
                self.renderViewUser();
                if (self.accountHtml) {
                    self.accountViewForm();
                }
            }
        }]
    });
}
/**
 * Метод класса, который определяет существует ли зарегистрированный пользователь с такими данными. Если нет, то 
 * сообщает об этом пользователю. Если да, то входим в аккаунт пользователя.
 * @param {string} email Эл почта.
 * @param {string} password Пароль.
 */
User.prototype.logIn = function (email, password) {
    $.ajax({
        url: 'http://localhost:3000/user',
        context: this,
        success: function (data) {
            for (var ind = 0; ind < data.length; ind++) {
                if (data[ind].email === email && data[ind].password === password) {
                    break;
                }
            }

            if (ind !== data.length) {
                this.userCurrent = data[ind];

                $.ajax({
                    url: 'http://localhost:3000/current_user',
                    type: 'POST',
                    contentType: 'application/json',
                    context: this,
                    dataType: 'JSON',
                    data: JSON.stringify(data[ind]),
                    success: function () {
                        this.dialogLogIn();
                    }
                });
            } else {
                $('#login_error').html('You input incorrent data! Such user is not exists');
                $('#login_error').dialog({
                    modal: true,
                    title: 'Error!',

                    hide: {
                        effect: 'explode',
                        duration: 1000
                    },

                    buttons: [{
                        text: 'OK',
                        icon: 'ui-icon-alert',
                        click: function () {
                            $(this).dialog('close');
                        }
                    }]
                });
            }
        }
    });
}

/**
 * Метод класса, который опрашивает пользователя для выходе из аккаунта - необходимо ли сохранить текущую корзину в это 
 * аккаунте. Если пользователь ответил да, то сохранеяет. Если нет, то нет.
 * @param {string} idUser Идентификатор пользователя.
 */
User.prototype.dialogLogOut = function (idUser) {
    $dialogLogOut = $('#dialog_registration');
    $dialogLogOut.html('Do you want to save this cart in your account?');
    var self = this;

    $dialogLogOut.dialog({
        modal: true,
        title: 'Your shopping cart',

        hide: {
            effect: 'explode',
            duration: 1000
        },

        closeOnEscape: false,
        open: function (event, ui) {
            $('.ui-dialog-titlebar-close', ui.dialog | ui).hide();
        },

        buttons: [{
            text: 'Yes',
            click: function () {
                self.cart.writeCartInUserProfile(idUser);
                self.cart.clearCart();
                self.logOut();
                $(this).dialog('close');
            }
        }, {
            text: 'No',
            click: function () {
                self.cart.clearCart();
                self.logOut();
                $(this).dialog('close');
            }
        }]
    });
}

/**
 * Метод класса, который вызывается пр ивыходе пользователя из аккаунта.
 */
User.prototype.logOut = function () {
    $.ajax({
        url: 'http://localhost:3000/current_user/' + this.userCurrent.id,
        context: this,
        type: 'DELETE',
        success: function () {
            this.userCurrent = {};
            this.renderViewUser();
            if (this.accountHtml) {
                this.accountViewForm();
            }
        }
    });
}

/**
 * Метод класса, который опрашивает пользователя при успешной регистрации - хочет ли пользователь продолжить работу с
 * корзиной. Если да, то текущая корзина записывается пользователю на сервер, если нет, то корзина обнуляется.
 * @param {Object} $element Элемент страницы.
 */
//!
User.prototype.createDialogSuccesRegisration = function ($element) {
    var $dialogReg = $('#dialog_registration');
    $dialogReg.empty();
    $dialogReg.append($('<div />', {
        text: 'You have registered successfully'
    }));
    $dialogReg.append($('<div />', {
        text: 'Do you want to continue working with this cart?'
    }));
    $dialogReg.children('div').eq(0).addClass('error_forgot_send');
    $dialogReg.children('div').eq(0).removeClass('error_forgot');

    var self = this;
    $dialogReg.dialog({
        modal: true,
        title: 'Result registration',

        hide: {
            effect: 'explode',
            duration: 1000
        },

        closeOnEscape: false,
        open: function (event, ui) {
            $('.ui-dialog-titlebar-close', ui.dialog | ui).hide();
        },

        buttons: [{
            text: 'Yes',
            click: function () {
                self.cart.writeCartInUserProfile(this.idNextUser);
                self.createNewUser($element);
                $(this).dialog('close');
            }
        }, {
            text: 'No',
            click: function () {
                self.cart.clearCart();
                self.createNewUser($element);
                $(this).dialog('close');
            }
        }]
    });
}

/**
 * Метод класса, который определяет и отобращает диалог при ошибке регистрации пользователя.
 */
User.prototype.createDialogErrorRegisration = function () {
    var $dialogReg = $('#dialog_registration');
    $dialogReg.empty();
    $dialogReg.html('Error: User with this email exists');
    $dialogReg.removeClass('error_forgot_send');
    $dialogReg.addClass('error_forgot');
    $dialogReg.dialog({
        modal: true,
        title: 'Result registration',
        buttons: {
            'OK': function () {
                $(this).dialog('close');
            },
        }
    });
}

/**
 * Метод клаcса, который при регистрации нового пользователя проверяет есть зарегистрированный ли пользователь с такой 
 * эл почтой. Если есть, то выдаем ошибку регистрации. Если нет, то регистрируем пользователя.
 * @param {Object} $element Элемент страницы.
 */
User.prototype.validationUserInServer = function ($element) {
    $.ajax({
        url: 'http://localhost:3000/user',
        context: this,
        success: function (data) {
            var email = $element.children('input').eq(3).val();
            for (var ind = 0; ind < data.length; ind++) {
                if (email === data[ind].email) {
                    break;
                }
            }

            if (ind === data.length) {
                this.createDialogSuccesRegisration($element);
            } else {
                this.createDialogErrorRegisration();
            }
        }
    });
}

/**
 * Метод класса, который создает нового пользователя при успешной регистрации пользователя на сайте.
 * @param {Object} $element Элемент страницы.
 */
User.prototype.createNewUser = function ($element) {
    $dataInput = $element.children('input');
    var newUser = {
        id: this.idNextUser,
        username: $dataInput.eq(0).val(),
        password: $dataInput.eq(2).val(),
        email: $dataInput.eq(3).val(),
        gender: $element.children('select').val(),
        credit_cart: $dataInput.eq(4).val(),
        userCart: ''
    }
    this.idNextUser++;

    $.ajax({
        url: 'http://localhost:3000/current_user',
        type: 'POST',
        context: this,
        data: newUser,
        success: function () {
            $.ajax({
                url: 'http://localhost:3000/user',
                type: 'POST',
                context: this,
                data: newUser,
                success: function () {
                    this.userCurrent = Object.create(newUser);
                    this.renderViewUser();
                    if (this.accountHtml) {
                        this.accountViewForm();
                    }
                }
            });
        }
    });
}