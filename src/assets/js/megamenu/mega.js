(function ( $ ) {
 
    $.fn.superMegaMenu = function( options ) {
 
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            hoverEffect: 'defaultEffect',
            color: "Red",
            backgroundColor: "white"
        }, options );
 		
        

        // Greenify the collection based on the settings variable.
        if(this.hasClass('navbar sm-navbar') !=true)
            return false;
        

        // set this
        var superMegaMenuThisObject = $(this);
        $(window).on('load resize', function(){
             var windowWidth = $(window).width();
             if(windowWidth < 992){
                // remove hover effect class
                superMegaMenuThisObject.removeClass(settings.hoverEffect);
                 // sub menu
                 $('li.has-menu-item-submenu > a').wrap('<a href="#" class="slicknav"></a>');
                 $('li.has-menu-item-submenu > a').append('<span class="icon"></span>');
                 $('li.has-menu-item-submenu > a.slicknav').on('click', function(event){
                     event.preventDefault();
                     $(this).parent().toggleClass('sub-open');
                     $(this).parent().children('ul.sub-menu').slideToggle();
                 });
                 // mega menu
                 $('li.has-menu-item-megamenu > a').wrap('<a href="#" class="slicknav"></a>');
                 $('li.has-menu-item-megamenu > a').append('<span class="icon"></span>');
                 $('li.has-menu-item-megamenu > a.slicknav').on('click', function(event){
                     event.preventDefault();
                     $(this).parent().toggleClass('sub-open');
                     $(this).parent().children('.mega-menu').slideToggle();
                 });
             }else {
                $('a.slicknav a').unwrap();
                superMegaMenuThisObject.addClass('smmNavbar-'+settings.hoverEffect);
             }
         });
 
    };
 
}( jQuery ));
