var Star=function(t){var e,r,a;if(this.starString="",/\./.test(t)){for(this.starString="",a=parseInt(t),e=0;e<a;e++)this.starString+='<i class="fa fa-star" aria-hidden="true"></i>';for(this.starString+='<i class="fa fa-star-half-o" aria-hidden="true"></i>',r=4-a,e=0;e<r;e++)this.starString+='<i class="fa fa-star-o" aria-hidden="true"></i>'}else{for(this.starString="",a=parseInt(t),e=0;e<a;e++)this.starString+='<i class="fa fa-star" aria-hidden="true"></i>';for(r=5-a,e=0;e<r;e++)this.starString+='<i class="fa fa-star-o" aria-hidden="true"></i>'}},Cart=function(t=""){this.pathHtml=t,this.renderCart()};Cart.prototype.renderCart=function(){$.ajax({url:"http://localhost:3000/cart",context:this,dataType:"json",success:function(t){var e,r=$("#product_cart");r.empty();var a=0,i=0,o=this;t.forEach(function(t){$(".template_cart .cart_product img").attr("src",o.pathHtml+t.path_img),$(".template_cart .cart_member_label p").html(t.name),$(".template_cart .cart_member_label span").html(t.quantity+"  x   $"+t.cost),$(".template_cart .cart_product").attr("data-id",t.id),$(".template_cart .cart_product").attr("data-quantity",t.quantity),a+=+t.quantity*+t.cost,i+=+t.quantity;var s=new Star(t.range);$(".template_cart .div_star").html(s.starString),(e=$(".template_cart").clone()).removeClass("template_cart"),r.append(e)}),$(".button_delete").on("click",function(t){o.deleteElement(t),t.preventDefault()}),$("div .elipse_card").html(i),$("div .total_price p").eq(1).html("$"+a)}})},Cart.prototype.deleteElement=function(t){var e=$(t.currentTarget).parent().children().attr("data-id");$(t.currentTarget).parent().children().attr("data-quantity")>1?$.ajax({type:"PATCH",url:"http://localhost:3000/cart/"+e,context:this,data:{quantity:$(t.currentTarget).parent().children().attr("data-quantity")-1},success:function(){this.renderCart()}}):$.ajax({type:"DELETE",url:"http://localhost:3000/cart/"+e,context:this,success:function(){this.renderCart()}})};var Feedback=function(){$("#feedback1").addClass("display_flex_fb"),$("#fb_div_flex a:first").addClass("active_fb_div_member"),$("#fb_div_flex").on("click","a",function(t){$(".active_fb_div_member").removeClass("active_fb_div_member"),$(this).addClass("active_fb_div_member"),$(".display_flex_fb").removeClass("display_flex_fb"),$($(this).attr("href")).addClass("display_flex_fb"),t.preventDefault()})};$(document).ready(function(){new Feedback});var Product=function(t,e,r,a="",i="",o=""){this.pathHtml=a,this.cart=t,this.initSettingForSearch(o),this.idElementPagesProduct=i,this.idChooseAll=e,this.idElementForHide=r;var s=this;$("#"+this.idChooseAll).on("click",function(t){s.renderProduct(0,1,!0),$("#"+s.idChooseAll).addClass("opacity_yes"),""!==s.idElementForHide&&$("#"+s.idElementForHide).addClass("opacity_yes"),t.preventDefault()})};Product.prototype.initSettingForSearch=function(t){this.settingForSearch={idCategory:"",category:[],brand:[],designer:[],size:[],trend:"",price:{upPrice:"",toPrice:""},sortBy:t}},Product.prototype.set=function(t,e){switch(e){case"idCategory":this.setIdCategory(t);break;case"category":this.setCategory(t);break;case"brand":this.setBrand(t);break;case"designer":this.setDesigner(t);break;case"size":this.setSize(t);break;case"trend":this.setTrend(t);break;case"price":this.setPrice(t);break;case"valueSortBy":this.setValueSortBy(t)}},Product.prototype.setIdCategory=function(t){this.settingForSearch.idCategory=t},Product.prototype.setCategory=function(t){this.settingForSearch.category.push(t)},Product.prototype.setBrand=function(t){this.settingForSearch.brand.push(t)},Product.prototype.setDesigner=function(t){this.settingForSearch.designer.push(t)},Product.prototype.setSize=function(t){this.settingForSearch.size.push(t)},Product.prototype.setTrend=function(t){this.settingForSearch.trend=t},Product.prototype.setPrice=function(t){this.settingForSearch.price.upPrice=t[0],this.settingForSearch.price.toPrice=t[1]},Product.prototype.setValueSortBy=function(t){this.settingForSearch.sortBy=t},Product.prototype.delete=function(t,e){switch(e){case"category":this.deleteCategory(t);break;case"brand":this.deleteBrand(t);break;case"designer":this.deleteDesigner(t);break;case"size":this.deleteSize(t)}},Product.prototype.deleteElementFromArray=function(t,e){var r=t.indexOf(e);t.splice(r,1)},Product.prototype.deleteCategory=function(t){this.deleteElementFromArray(this.settingForSearch.category,t)},Product.prototype.deleteBrand=function(t){this.deleteElementFromArray(this.settingForSearch.brand,t)},Product.prototype.deleteDesigner=function(t){this.deleteElementFromArray(this.settingForSearch.designer,t)},Product.prototype.deleteSize=function(t){this.deleteElementFromArray(this.settingForSearch.size,t)},Product.prototype.equalElement=function(t,e){return""===t||e.includes(t)},Product.prototype.equalArray=function(t,e){return 0===t.length||e.some(e=>t.includes(e))},Product.prototype.equalPrice=function(t,e){return""===t.upPrice||""===t.toPrice||t.upPrice<=e&&e<=t.toPrice},Product.prototype.sortByValue=function(t){switch(this.settingForSearch.sortBy){case"Name":return t.sort(function(t,e){return t.name>e.name});case"Cost":return t.sort(function(t,e){return+t.cost>+e.cost});case"Range":return t.sort(function(t,e){return+t.range>+e.range});default:return t}},Product.prototype.getItemForPrint=function(t){for(var e=[],r=0;r<t.length;r++)this.equalElement(this.settingForSearch.idCategory,t[r].id_category)&&this.equalArray(this.settingForSearch.category,t[r].category_name)&&this.equalArray(this.settingForSearch.brand,t[r].brand)&&this.equalArray(this.settingForSearch.designer,t[r].designer)&&this.equalArray(this.settingForSearch.size,t[r].size)&&this.equalElement(this.settingForSearch.trend,t[r].trend)&&this.equalPrice(this.settingForSearch.price,+t[r].cost)&&e.push(t[r]);return console.log(this.sortByValue(e)),this.sortByValue(e)},Product.prototype.renderOnePage=function(t,e,r){var a,i=$(".preview_menu_flex");i.empty();for(var o=(r-1)*e;o<r*e&&!(o>=t.length);o++){$(".template .img_prod").attr("src",this.pathHtml+t[o].path_img),$(".template .unit_name").html(t[o].name),$(".template .unit_cost").html("$"+t[o].cost),$(".template .button_to_card").attr("data-id",t[o].id);var s=new Star(t[o].range);$(".template .div_star").html(s.starString),(a=$(".template").clone()).removeClass("template"),i.append(a)}},Product.prototype.hideNextPreviousPage=function(t,e){$("#page_previous").removeClass("opacity_yes"),$("#page_next").removeClass("opacity_yes"),1===t&&$("#page_previous").addClass("opacity_yes"),t===e&&$("#page_next").addClass("opacity_yes")},Product.prototype.handlerDivPage=function(){var t=this;$(".ref_page").on("click",function(e){$(".href_active").removeClass("href_active"),$(this).addClass("href_active"),t.renderProduct(+$("#count_item_man select").val(),+$(this).html()),t.hideNextPreviousPage(+$(this).html(),$(".class_bottom_preview .ref_page").length),e.preventDefault()}),$("#page_previous").on("click","i",function(e){var r=+$(".href_active").html();r>1&&($(".href_active").removeClass("href_active"),$(".class_bottom_preview .ref_page").eq(r-2).addClass("href_active"),t.renderProduct(+$("#count_item_man select").val(),r-1),t.hideNextPreviousPage(r-1,$(".class_bottom_preview .ref_page").length)),e.preventDefault()}),$("#page_next").on("click","i",function(){var e=+$(".href_active").html(),r=$(".class_bottom_preview .ref_page").length;e<r&&($(".href_active").removeClass("href_active"),$(".class_bottom_preview .ref_page").eq(e).addClass("href_active"),t.renderProduct(+$("#count_item_man select").val(),e+1),t.hideNextPreviousPage(e+1,r)),event.preventDefault()})},Product.prototype.fillNumberPage=function(t,e){var r=$("#"+this.idElementPagesProduct);r.empty(),r.append('<a id="page_previous" href="#"><i class="fa fa-chevron-left"aria-hidden="true"></i></a>');for(var a=1;a<=t;a++)r.append($("<a />",{href:"#",text:a,class:"ref_page"}));r.append('<a id="page_next" href="#"><i class="fa fa-chevron-right"aria-hidden="true"></i></a>'),$("#"+this.idElementPagesProduct+" .ref_page").eq(e-1).addClass("href_active"),this.hideNextPreviousPage(e,$(".class_bottom_preview .ref_page").length),this.handlerDivPage()},Product.prototype.renderProduct=function(t,e=1,r=!1){$.ajax({url:"http://localhost:3000/product",context:this,dataType:"json",success:function(a){var i,o=this.getItemForPrint(a);console.log(o),i=r?o.length:t<o.length?t:o.length,this.renderOnePage(o,i,e);var s=this;$("div .button_to_card").on("click",function(t){s.addToCartDialog(t),t.preventDefault()}),""===this.idElementPagesProduct||r||this.fillNumberPage(Math.ceil(o.length/t),e),r||($("#"+this.idChooseAll).removeClass("opacity_yes"),""!==this.idElementForHide&&$("#"+this.idElementForHide).removeClass("opacity_yes"))}})},Product.prototype.createSelect=function(t,e){for(var r=$("#"+t+" select"),a=0;a<e.length;a++)r.append($("<option />",{value:e[a],text:e[a]}))},Product.prototype.addToCartDialog=function(t){var e=$(t.currentTarget).attr("data-id"),r=this;$.ajax({url:"http://localhost:3000/product/"+e,dataType:"json",context:this,success:function(t){$dialogCart=$("#dialog_cart"),$dialogCart.empty(),$dialogCart.append($("<img />",{src:this.pathHtml+t.path_img})),$dialogCart.append($("<h4 />",{text:t.name})),$dialogCart.append($("<div />",{id:"dialog_size_item"}).append($("<span />",{text:"Choose size: "})).append($("<select />"))),this.createSelect("dialog_size_item",t.size),$dialogCart.append($("<div />",{id:"dialog_color_item"}).append($("<span />",{text:"Choose color: "})).append($("<select />"))),this.createSelect("dialog_color_item",t.color),$dialogCart.dialog({modal:!0,title:"Choose for add to cart",buttons:{"Add to cart":function(){r.addToCart(e,$("#dialog_size_item select").val(),$("#dialog_color_item select").val()),$(this).dialog("close")},Close:function(){$(this).dialog("close")}}})}})},Product.prototype.addToCart=function(t,e,r){$.ajax({url:"http://localhost:3000/product/"+t,dataType:"json",context:this,success:function(t){var a={id:t.id,path_img:t.path_img,name:t.name,cost:t.cost,id_category:t.id_category,range:t.range,quantity:"1",color:r,size:e};$('#product_cart .cart_product[data-id="'+a.id+'"]').length?$.ajax({type:"PATCH",context:this,url:"http://localhost:3000/cart/"+a.id,data:{quantity:+$('#product_cart .cart_product[data-id="'+a.id+'"]').attr("data-quantity")+1},success:function(){this.cart.renderCart()}}):$.ajax({type:"POST",url:"http://localhost:3000/cart",context:this,data:a,success:function(){this.cart.renderCart()}})}})},$(document).ready(function(){var t=new Cart;new Product(t,"browse_all","","").renderProduct(8)});