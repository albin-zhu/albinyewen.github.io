function on_ng_ready(){
/*==============================================
    Transparent Navbar
    =============================================== */
    if($('.main-nav').is('.navbar-transparent')){
        if($(window).scrollTop() > 10){
                $('.main-nav').removeClass('navbar-transparent');
            }else{
                $('.main-nav').addClass('navbar-transparent');
            }
        $(window).scroll( function() {
            if($(window).scrollTop() > 10){
                $('.main-nav').removeClass('navbar-transparent');
            }else{
                $('.main-nav').addClass('navbar-transparent');
            }
        });
    }
}
