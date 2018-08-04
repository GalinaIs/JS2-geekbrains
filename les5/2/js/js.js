/**
 * Класс CommentClass отвечает за корректное отображение отзывов, обработку их и получение-отправку на сервер.
 * @constructor
 */
var CommentClass = function () {
    var self = this;

    this.getIdComment();
    this.renderCommentForVerify();
    this.renderCommentForView();

    $('#add_comment').on('click', 'button', function (event) {
        if (self.checkForm()) {
            self.postInfoToServer();
        } 
        event.preventDefault();
    });

    $('#add_comment_button').on('click', function (event) {
        self.submitComment();
        event.preventDefault();
    });

    $('#remove_comment_button').on('click', function (event) {
        self.deleteComment();
        event.preventDefault();
    })
}

/**
 * Метод класса получает id для слеующего комментария по количеству отзывов, хранящихся на сервере - считаем, 
 * что все отзывы идут по порядку и начинаются с 0.
 */
CommentClass.prototype.getIdComment = function () {
    var self = this;
    $.ajax({
        url: 'http://localhost:3000/full_list_comments',
        dataType: 'json',
        success: function (data) {
            self.idComment = data.length;
        }
    })
}

/**
 * Метод класса для проверки данных формы перед отправкой комментария пользователя.
 * @returns {boolean} возвращает true, если поля заполнены верно, в противном случае - false.
 */
CommentClass.prototype.checkForm = function () {
    var checkedName = this.checkName($('#user_name')[0].value);
    var checkedPhone = this.checkPhone($('#user_phone')[0].value);
    var checkedComment = this.checkComment($('#user_comment')[0].value);

    if (checkedName && checkedPhone && checkedComment) {
        return true;
    }

    return false;
}

/**
 * Метод класса для проверки поля - "Имя".
 * @param {string} name Функция получает проверяемое значение.
 * @returns {boolean} возвращает true, если поле заполнены верно, в противном случае - false.
 */
CommentClass.prototype.checkName = function (name) {
    var result;
    name.length >= 1 ? result = true : result = false;

    this.addInformationAboutError($("#user_name"), $("#user_name + .error"), "Поле имя не должно быть пустым", result);

    return result;
}

/**
 * Метод класса для проверки поля - "Номер телефона".
 * @param {string} phone Функция получает проверяемое значение.
 * @returns {boolean} возвращает true, если поле заполнены верно, в противном случае - false.
 */
CommentClass.prototype.checkPhone = function (phone) {
    var pattern = /^\+7\-9\d{2}\-\d{3}\-\d{2}\-\d{2}$/;
    var result = pattern.test(phone);

    this.addInformationAboutError($("#user_phone"), $("#user_phone + .error"),
        "Номер телефона необходимо ввести в формате: <br> +7-900-000-00-00", result);

    return result;
}

/**
 * Метод класса для проверки поля - "Оставить отзыв".
 * @param {string} comment Функция получает проверяемое значение.
 * @returns {boolean} возвращает true, если поле заполнены верно, в противном случае - false.
 */
CommentClass.prototype.checkComment = function (comment) {
    var result;
    comment.length >= 1 ? result = true : result = false;

    this.addInformationAboutError($("#user_comment"), $("#user_comment + .error"),
        "Поле комментарий не должно быть пустым", result);

    return result;
}

/**
 * Метод класса обрабатывает результат проверки поля. В случае, если поле заполнено неверно, то пользователю выводится
 * сообщение об ошибке и само поле подсвечивается красным, в противном случае - сообщения об ошибке нет и поле
 * подсвечено зеленым цветом.
 * @param {HTMLElement} inputElement Элемент html, значение которого проверялось.
 * @param {HTMLElement} divElement Элемент html для вывода информации об ошибке.
 * @param {string} textError Сообщение об ошибке.
 * @param {bollean} resultChecked Результат проверки.
 */
CommentClass.prototype.addInformationAboutError = function (inputElement, divElement, textError, resultChecked) {

    if (resultChecked) {
        inputElement.addClass('checked_input');
        inputElement.removeClass('error_input');

        divElement.html("");
    } else {
        inputElement.addClass('error_input');
        inputElement.removeClass('checked_input');

        divElement.html(textError);
    }
}

/**
 * Метод класса для отправки информации об отзыве на сервер.
 * 1. Поверяем, есть ли пользователь в нашем списке на сервере. Если нет, то добавляем его в этот список. Если есть, 
 * получаем его идентификатор.
 * 2. Добавляем отзыв в список отзывов для проверки на сервер.
 * 3. Добавляем отзыв в полный список всех комментариев на сервере.
 */
CommentClass.prototype.postInfoToServer = function () {

    var userName = $('#user_name')[0].value;
    var userPhone = $('#user_phone')[0].value;
    var userComment = $('#user_comment')[0].value;
    var result = false;
    var ind;
    var self = this;

    $.ajax({
        url: 'http://localhost:3000/user',
        dataType: 'json',
        success: function (data) {
            for (ind = 0; ind < data.length; ind++) {
                if ((data[ind].name == userName) && (data[ind].number_phone == userPhone)) {
                    result = true;
                    break;
                }
            }
            var idUser;
            if (ind === data.length) {
                idUser = data.length + 1;
                var newUser = {
                    id: idUser,
                    name: userName,
                    number_phone: userPhone
                }
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:3000/user',
                    data: newUser
                })
            } else {
                idUser = data[ind].id;
            }
            var newComment = {
                id: self.idComment,
                id_user: idUser,
                text: userComment
            };
            $.ajax({
                type: 'POST',
                url: 'http://localhost:3000/add',
                data: newComment,
                success: function () {
                    var answerServer = {
                        result: 1
                    };
                    alert('Ваш отзыв передан на модерацию');
                },
                error: function (errorInfo) {
                    var answerServer = {
                        result: 0,
                        info: errorInfo
                    };
                    alert("error" + answerServer.info);
                }
            });
            var fullNewComment = {
                id: self.idComment,
                id_user: idUser,
                text: userComment,
                statys: 'verify'
            };
            $.ajax({
                type: 'POST',
                url: 'http://localhost:3000/full_list_comments',
                data: fullNewComment,
            });
            self.idComment++;
            self.renderCommentForVerify();
        }
    });
}

/**
 * Метод класса, который отвечает за отображение отзыва, который подлежит модерации.
 */
CommentClass.prototype.renderCommentForVerify = function () {
    $.ajax({
        url: 'http://localhost:3000/add',
        dataType: 'json',
        success: function (data) {
            var $divInfo = $('#info_about_comment');
            if (data.length >= 1) {
                $divInfo.empty();
                $divInfo.append($('<div />', {
                    'data-id': data[0].id,
                    'data-text': data[0].text
                }));
                $divInfo.append($('<p />', {
                    text: 'Номер отзыва: ' + data[0].id
                }));
                $divInfo.append($('<p />', {
                    text: 'Пользователь: ' + data[0].id_user
                }));
                $divInfo.append($('<p />', {
                    text: 'Текст отзыва: ' + data[0].text
                }));
                $('#verify_comment button').show();
            } else {
                $divInfo.html("Нет отзывов для рассмотрения.");
                $('#verify_comment button').hide();
            }
        }
    })
}

/**
 * Метод класса, который вызывается при одобрении отзыва. При этом происходит следующее:
 * 1. Отзыв добавляется в перечень отзывов для вывода на сайте.
 * 2. Статус отзыва в полном списке всех комментариев на сервере меняется на "submit".
 * 3. Отзыв удаляется из списка отзывов для проверки на сервере.
 */
CommentClass.prototype.submitComment = function () {
    var newComment = {
        id: $('#info_about_comment div').attr('data-id'),
        text: $('#info_about_comment div').attr('data-text')
    };

    var self = this;

    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/list',
        data: newComment,

        success: function () {
            var answerServer = {
                result: 1
            };
            self.renderCommentForView();
        },

        error: function (errorInfo) {
            var answerServer = {
                result: 0,
                info: errorInfo
            };
            alert(answerServer.info);
        }
    });

    $.ajax({
        type: 'PATCH',
        url: 'http://localhost:3000/full_list_comments/' + $('#info_about_comment div').attr('data-id'),
        data: {
            statys: 'submit'
        }
    });

    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:3000/add/' + $('#info_about_comment div').attr('data-id'),

        success: function () {
            self.renderCommentForVerify();
        },
    });
}

/**
 * Метод класса, который вызывается при отклонении отзыва. При этом происходит следующее:
 * 1. Статус отзыва в полном списке всех комментариев на сервере меняется на "delete".
 * 2. Отзыв удаляется из списка отзывов для проверки на сервере.
 */
CommentClass.prototype.deleteComment = function () {
    var self = this;

    $.ajax({
        type: 'PATCH',
        url: 'http://localhost:3000/full_list_comments/' + $('#info_about_comment div').attr('data-id'),
        data: {
            statys: 'delete'
        }
    });

    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:3000/add/' + $('#info_about_comment div').attr('data-id'),

        success: function () {
            self.renderCommentForVerify();
        },
    });
}

/**
 * Метод класса, который отвечает за отображение всех отзывов на сайте, которые прошли модерацию.
 */
CommentClass.prototype.renderCommentForView = function () {
    $.ajax({
        url: 'http://localhost:3000/list',
        dataType: 'json',
        success: function (data) {
            var $divAllComments = $('#all_comments');

            if (data.length >= 1) {
                $divAllComments.empty();

                data.forEach(function (item) {
                    $divAllComments.append($('<div/>').append($('<p />', {
                        text: 'Номер отзыва: ' + item.id
                    }).append($('<p />', {
                        text: 'Текст отзыва: ' + item.text
                    }))));
                });
            } else {
                $divAllComments.append($('<div /', {
                    text: "Нет ни одного отзыва."
                }));
            }
        },

        error: function (errorInfo) {
            var answerServer = {
                result: 0,
                info: errorInfo
            };
            alert(answerServer.info);
        }
    })
}


$(document).ready(function () {
    var my_comment = new CommentClass();
});