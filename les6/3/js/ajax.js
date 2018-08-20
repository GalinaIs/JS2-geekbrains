//Получаем данные с сервера для загрузки в карусель.
(function($) {
    $(function(){
        $.ajax({
            url:'http://localhost:3000/product',
            success:function(data){
                var $ul = $('div .jcarousel ul');
                data.forEach(function(item){
                    $ul.append($('<li />').append($('<img />',{
                        src: item.path_img
                    })));
                });
            }
        })
    })
})(jQuery);