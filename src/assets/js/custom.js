(function($) {
    "use strict";
    
    $(document).ready(function() {

        //preloading for page
        $(window).on('load', function() { // makes sure the whole site is loaded 
            var status = $('#status');
            var preloader = $('#preloader');
            var body = $('body');
            status.fadeOut(); // will first fade out the loading animation 
            preloader.delay(0).fadeOut('fast'); // will fade out the white DIV that covers the website. 
            body.delay(0).css({'overflow':'visible'});
            var vidDefer = document.getElementsByTagName('iframe');
            for (var i=0; i<vidDefer.length; i++) {
                if(vidDefer[i].getAttribute('data-src')) {
                    vidDefer[i].setAttribute('src',vidDefer[i].getAttribute('data-src'));
                } 
            }
        })
        
        /* -----------------------------------------------------
            Variables
        ----------------------------------------------------- */
        var leftArrow = '<img src="images/arrow-left.png">';
        var rightArrow = '<img src="images/arrow-right.png">';

        /* -------------------------------------------------------------
            menu 
        ------------------------------------------------------------- */
        $( "#superMenu" ).superMegaMenu();

        /* -------------------------------------------------------------
            Inner linking
        ------------------------------------------------------------- */
        if ($('.intro-select a[href^="#"]').length){
            $('.intro-select a[href^="#"]').not("#scrollUp").on('click', function (e) {
                e.preventDefault();
                var target = this.hash;
                var $target = $(target);
                $('html, body').stop().animate({
                     'scrollTop': $target.offset().top
                }, 900, 'swing');
            });
        }

        /* -----------------------------------------------------
            main slider
        ----------------------------------------------------- */
        if ($('.main-slider').length){
            $('.main-slider').owlCarousel({
                items: 1,
                animateOut: 'fadeOut',
			    animateIn: 'fadeIn',
			    smartSpeed:450,
                loop: true,
                autoplay: true,
                autoplayTimeout: 11000,
                nav: true,
                dots: false,
                navText: [ leftArrow, rightArrow],
            });
        }

        //-Main slider two
        $('.main-slider-two').owlCarousel({
            items: 1,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            smartSpeed:450,
            loop: true,
            autoplay: true,
            autoplayTimeout: 10000,
            nav: true,
            dots: false,
            navText: [ leftArrow, rightArrow],
        }); 

        /* -----------------------------------------------------
            client slider
        ----------------------------------------------------- */
        if ($('.client-slider').length){
            $('.client-slider').owlCarousel({
                items: 5,
                loop: false,
                autoplay: false,
                autoplayTimeout: 5000,
                nav: false,
                margin: 20,
                dots: false,
                responsive:{
                    0:{
                        items:4
                    },
                    768:{
                        items: 5
                    }
                }
            });
        }

        /* -----------------------------------------------------
            movie-post-slider
        ----------------------------------------------------- */
        if ($('.movie-post-slider').length){
            $('.movie-post-slider').owlCarousel({
                items: 5,
                loop: true,
                autoplay: false,
                autoplayTimeout: 5000,
                nav: true,
                margin: 30,
                dots: false,
                navText: ['<img src="images/arrow-left.png">', '<img src="images/arrow-right.png">'],
                responsive:{
                    0:{
                        items:1
                    },
                    768:{
                        items: 3
                    },
                    1024:{
                        items: 4
                    },
                    1600:{
                        items: 5
                    }
                }
            });
        }

        /* -----------------------------------------------------
            series-details
        ----------------------------------------------------- */
        if ($('.movie-series-slider').length){
            $('.movie-series-slider').owlCarousel({
                loop: true,
                autoplay: false,
                autoplayTimeout: 5000,
                nav: true,
                dots: false,
                margin: 20,
                items: 4,
                navText: ['<img src="images/arrow-left.png">', '<img src="images/arrow-right.png">'],
                responsive:{
                    0:{
                        items:1
                    },
                    768:{
                        items: 3
                    },
                    1024:{
                        items: 4
                    },
                    1600:{
                        items: 5
                    }
                }
            })
        }

        /* -----------------------------------------------------
            swiper container
        ----------------------------------------------------- */
        var swiper = new Swiper('.swiper-container', {
          loop: true,
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          initialSlide: 2,
          coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
            slideShadows : true,
          },
          pagination: {
            el: '.swiper-pagination',
          },
        });

        /* -----------------------------------------------------
            viddeo play js
        ----------------------------------------------------- */
        $('.vid-item').each(function(index){
		    $(this).on('click', function(){
		      var current_index = index+1;
		      $('.vid-item .thumb').removeClass('active');
		      $('.vid-item:nth-child('+current_index+') .thumb').addClass('active');
		    });
	  	});


        /* -------------------------------------------------------------
            trailer-scroll js
        ------------------------------------------------------------- */
        if ( $('.trailer-scroll').length){
            $(".trailer-scroll").mCustomScrollbar({
                setWidth: false,
                setHeight: 765,
            });
        }

        /* -----------------------------------------------------
            testimonial-slider
        ----------------------------------------------------- */
        if ($('.testimonial-slider').length){
            $('.testimonial-slider').owlCarousel({
                loop: false,
                autoplay: false,
                autoplayTimeout: 5000,
                nav: false,
                dots: true,
                items: 2,
                responsive:{
                    0:{
                        items:1
                    },
                    992:{
                        items:2
                    }
                }
            })
        }

        /* -----------------------------------------------------
            testimonial two slider
        ----------------------------------------------------- */
        if ($('.testimonial-two').length){
            $('.testimonial-two').owlCarousel({
                items: 1,
                loop: true,
                autoplay: true,
                autoplayTimeout: 5000,
                nav: false,
                dots: false,
            })
        }

        /* -------------------------------------------------------------
            testimonial-three-slider js
        ------------------------------------------------------------- */
        if ($('.testimonial-three-slider').length){
            $('.testimonial-three-slider').owlCarousel({
                items: 1,
                loop: true,
                margin: 20,
                autoplay: false,
                autoplayTimeout: 5000,
                nav: false,
                dots: true,
            });
        }

        /* -------------------------------------------------------------
            Fact Counter
        ------------------------------------------------------------- */
        if ( $('.fact-count').length){
            $('.fact-count').counterUp({
                delay: 10,
                time: 5000
            });
        }
        

        /* -------------------------------------------------------------
            MAGNIFIC JS
        ------------------------------------------------------------- */
        $('.play-video').magnificPopup({
          type: 'iframe'
        });
        $.extend(true, $.magnificPopup.defaults, {
          iframe: {
            patterns: {
              youtube: {
                index: 'youtube.com/', 
                id: 'v=', 
                src: 'http://www.youtube.com/embed/%id%?autoplay=1' 
              }
            }
          }
        });

        /* -------------------------------------------------------------
            bootstrapTabControl
        ------------------------------------------------------------- */
        function bootstrapTabControl(){
            var i, items = $('.nav-item'), pane = $('.tab-pane');
            var preloaderHTML = '<div class="tab-preloader"><div class="preload"></div></div>';
            // next
            $('.nexttab').on('click', function(){
                for(i = 0; i < items.length; i++){
                    if($(items[i]).hasClass('active') == true){
                        break;
                    }
                }
                if(i < items.length - 1){
                    // for tab
                    $(items[i]).removeClass('active show');
                    $(items[i+1]).addClass('active show');
                    // for pane
                    $(pane[i]).removeClass('show active');
                    $(pane[i+1]).addClass('show active');
                }
                // preloader
                $('.tab-content>.active .movie-series').css({'opacity': 0});
                $('.tab-content>.active').append(preloaderHTML);
                setTimeout(function() {
                    $('.tab-preloader').remove();
                    $('.tab-content>.active .movie-series').css({'opacity': 1});
                }, 1000);
                // end preloader
            });
            // Prev
            $('.prevtab').on('click', function(){
                for(i = 0; i < items.length; i++){
                    if($(items[i]).hasClass('active') == true){
                        break;
                    }
                }
                if(i != 0){
                    // for tab
                    $(items[i]).removeClass('active show');
                    $(items[i-1]).addClass('active show');
                    // for pane
                    $(pane[i]).removeClass('show active');
                    $(pane[i-1]).addClass('show active');
                }

                 // preloader
                $('.tab-content>.active .movie-series').css({'opacity': 0});
                $('.tab-content>.active').append(preloaderHTML);
                setTimeout(function() {
                    $('.tab-preloader').remove();
                    $('.tab-content>.active .movie-series').css({'opacity': 1});
                }, 1000);
                // end preloader
            });
            // tab preloader
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                $('.tab-content>.active .movie-series').css({'opacity': 0});
                $('.tab-content>.active').append(preloaderHTML);
                setTimeout(function() {
                    $('.tab-preloader').remove();
                    $('.tab-content>.active .movie-series').css({'opacity': 1});
                }, 1000);
            });
        }
        bootstrapTabControl(); 

        /* -------------------------------------------------------------
           portfolio isotope
        ------------------------------------------------------------- */
        function bioscope_isotpop_filter(selector, buttonSelector){
            if ($(selector).length){
                var $teamFilter = $(selector).isotope();
                var activeClass = 'active';

                $(buttonSelector).on( 'click', 'button', function() {
                    var filterValue = $(this).attr('data-filter');
                    $teamFilter.isotope({ filter: filterValue });

                    $(buttonSelector).find('.'+activeClass).removeClass(activeClass);
                    $(this).addClass(activeClass);
                });
            }
        }
        /* -------------------------------------------------------------
            Gallery Isotop Filter
        ------------------------------------------------------------- */
        bioscope_isotpop_filter('.portfolio-isotope', '.portfolio-isotope-btn');

        /* -------------------------------------------------------------
            award slider js
        ------------------------------------------------------------- */
        if ($('.award-slider').length){
            $('.award-slider').owlCarousel({
                items: 5,
                loop: false,
                autoplay: false,
                autoplayTimeout: 5000,
                nav: false,
                dots: false,
                responsive:{
                    0:{
                        items:2
                    },
                    768:{
                        items: 3
                    },
                    1024:{
                        items: 5
                    },
                }
            });
        }

        /* -------------------------------------------------------------
            Partner-slider js
        ------------------------------------------------------------- */
        if ($('.partner-slider').length){
            $('.partner-slider').owlCarousel({
                items: 5,
                loop: false,
                autoplay: false,
                autoplayTimeout: 5000,
                nav: false,
                dots: false,
                responsive:{
                    0:{
                        items:2
                    },
                    768:{
                        items: 3
                    },
                    1024:{
                        items: 5
                    },
                }
            });
        }

        /* -----------------------------------------------------
            movie-post-sliderx
        ----------------------------------------------------- */
        if ($('.movie-post-slider2').length){
            $('.movie-post-slider2').owlCarousel({
                items: 5,
                loop: false,
                autoplay: false,
                autoplayTimeout: 5000,
                nav: false,
                dots: false,
                responsive:{
                    0:{
                        items:1
                    },
                    768:{
                        items: 4
                    },
                    1024:{
                        items: 5
                    },
                    1600:{
                        items: 6
                    }
                }
            });
        }

        /* -------------------------------------------------------------
            upcomming-trailer-slider js
        ------------------------------------------------------------- */
        if ($('.upcomming-trailer-slider').length){
            $('.upcomming-trailer-slider').owlCarousel({
                items: 1,
                loop: false,
                autoplay: false,
                autoplayTimeout: 11000,
                nav: true,
                dots: false,
                navText: [ leftArrow, rightArrow],
            });
        }

        /* -----------------------------------------------------
            movie-post-sliderx
        ----------------------------------------------------- */
        if ($('.movie-photo-slider').length){
            $('.movie-photo-slider').owlCarousel({
                items: 2,
                loop: false,
                autoplay: false,
                margin: 20,
                autoplayTimeout: 5000,
                nav: false,
                dots: false,
                responsive:{
                    0:{
                        items:1
                    },
                    768:{
                        items: 3
                    },
                    1024:{
                        items: 4
                    },
                    1600:{
                        items: 4
                    }
                }
            });
        }

        /* -----------------------------------------------------
            movie-post-sliderx
        ----------------------------------------------------- */
        if ($('.movie-cast-slider').length){
            $('.movie-cast-slider').owlCarousel({
                items: 5,
                loop: false,
                autoplay: false,
                margin: 20,
                autoplayTimeout: 5000,
                nav: false,
                dots: false,
                responsive:{
                    0:{
                        items:2
                    },
                    768:{
                        items: 4
                    },
                    1024:{
                        items: 5
                    },
                    1600:{
                        items: 5
                    }
                }
            }); 
        }

        /* -------------------------------------------------------------
            Count Down js
        ------------------------------------------------------------- */
        var clock;
        clock = $('.clock').FlipClock({
            clockFace: 'DailyCounter',
            autoStart: false,
            callbacks: {
                stop: function() {
                    $('.message').html('The clock has stopped!')
                }
            }
        });    
        clock.setTime(220880);
        clock.setCountdown(true);
        clock.start();

        //clock 2
        var clock;
        clock = $('.clock2').FlipClock({
            clockFace: 'DailyCounter',
            autoStart: false,
            callbacks: {
                stop: function() {
                    $('.message').html('The clock has stopped!')
                }
            }
        });    
        clock.setTime(220880);
        clock.setCountdown(true);
        clock.start();
        //clock 3
        var clock;
        clock = $('.clock3').FlipClock({
            clockFace: 'DailyCounter',
            autoStart: false,
            callbacks: {
                stop: function() {
                    $('.message').html('The clock has stopped!')
                }
            }
        });    
        clock.setTime(220880);
        clock.setCountdown(true);
        clock.start();
        

        /* -------------------------------------------------------------
            map js
        ------------------------------------------------------------- */
        if($('#map').length){
            function initMap() {
            var usRoadMapType = new google.maps.StyledMapType([
                  {
                    featureType: 'all',
                    elementType: 'all',
                    stylers: [
                      {invert_lightness: 'true'},        
                      {hue: '#335158'},
                      {saturation: 40},
                      {lightness: 30},         
                      {gamma: 0.5}
                    ]
                  }
                ], {name: 'Dark Style'});  
              var uluru = {lat: 42.316725, lng: -75.392093};
              var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 10,
                center: uluru,
                mapTypeControlOptions: {
                  position: google.maps.ControlPosition.TOP_LEFT,
                  mapTypeIds: [google.maps.MapTypeId.ROADMAP,
                    google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID,
                    google.maps.MapTypeId.TERRAIN, 'usroadatlas']
                },  
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_TOP
                },
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.LEFT_TOP
                }
              });
            map.mapTypes.set('usroadatlas', usRoadMapType);
            map.setMapTypeId('usroadatlas');
              var contentString = '<div class="map-info-box">'+ 
                 '<div class="map-head">'+ 
                 '<h3>Launch</h3></div>'+ 
                 '<p class="map-address"><i class="fa fa-map-marker"></i> Lorem ipsum dolor sit amet <br><i class="fa fa-phone"></i> 800-8765-4321<br><span class="map-email"><i class="fa fa-envelope"></i> info@yoursite.com</span></p>'+ 
                 '<p><a href="https://www.google.com/maps/place/8+Bridge+St,+Sidney,+NY+13838,+Birle%C5%9Fik+Devletler/@42.31647,-75.392079,19z/data=!3m1!4b1!4m5!1m2!2m1!1s60+MAIN+ST.+SIDNEY,+NY+13838+ABD!3m1!1s0x89dba3d449a51193:0x4e86a4772df5fa8f" target="_blank">Open on Google Maps</a></p></div>';
              
              var infowindow = new google.maps.InfoWindow({
                content: contentString
              });
              var image = 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/48/map-marker-icon.png';
              var marker = new google.maps.Marker({
                position: uluru,
                map: map,
                icon: image,
                title: 'Uluru (Ayers Rock)'
              });
              marker.addListener('onclick', function() {
                infowindow.open(map, marker);
              });
               marker.addListener('onclick', function() {
                map.setZoom(14);
                map.setCenter(marker.getPosition());
              });
            }
            google.maps.event.addDomListener(window, "load", initMap);
            window.onorientationchange = function(){window.location.reload();}
        }

        /*
        |---------------------------------------------
        | owl-carouse
        |---------------------------------------------
        */
        $('.client-carousel').owlCarousel({
            loop:true,
            autoplay: true,
            margin:10,
            nav:false,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:3
                },
                1024:{
                    items:5
                }
            }
        }) 
        
        
        /*
        |---------------------------------------------
        | wow-js
        |---------------------------------------------
        */
        new WOW().init();

        /*
        |----------------------------------------------------------------------------
        | Ajax Mailchimp
        |----------------------------------------------------------------------------
        */
        var $form = $('#mc-embedded-subscribe-form')
        if ($form.length > 0) {
            $('form input[type="submit"]').on('click', function (event) {
                if (event) event.preventDefault()
                register($form)
            })
        }

        function register($form) {
            $('#mc-embedded-subscribe').val('Send');
            $.ajax({
                type: $form.attr('method'),
                url: $form.attr('action'),
                data: $form.serialize(),
                cache: false,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                error: function (err) { alert('Could not connect to the registration server. Please try again later.') },
                success: function (data) {
                    $('#mc-embedded-subscribe').val('Send')
                    if (data.result === 'success') {
                        // Yeahhhh Success
                        console.log(data.msg)
                        $('#mce-EMAIL').css('borderColor', '#ffffff')
                        $('#subscribe-result').css('color', 'rgb(53, 114, 210)')
                        $('#subscribe-result').html('<p>Thank you for subscribing. We have sent you a confirmation email.</p>')
                        $('#mce-EMAIL').val('')
                    } else {
                        // Something went wrong, do something to notify the user.
                        console.log(data.msg)
                        $('#mce-EMAIL').css('borderColor', '#ff8282')
                        $('#subscribe-result').css('color', '#ff8282')
                        $('#subscribe-result').html('<p>' + data.msg.substring(4) + '</p>')
                    }
                }
            })
        };

        /* -------------------------------------------------------------
          Scroll To Top
        ------------------------------------------------------------- */
        $.scrollUp({
          scrollText: '<i class="fa fa-angle-up"></i>',
        });

        $('#vid-list li a').on('click', function(e){
            e.preventDefault();
            var videoShortcode = $(this).data('videourl');
            var url = 'https://youtube.com/embed/'+videoShortcode+'?autoplay=1&rel=0&showinfo=0&autohide=1';
            $('#vid_frame').attr('src', url);
        });


    });
})(jQuery);

//videoplay-list
var playListID = ["PLSSPBo7OVSZs96Cr6nEnzQpRDGwih38ie"]; 
var apiKey = "AIzaSyBMRyIdlgyAKIoKe9ptUZgejHZQB3RWumY"; 
var autoPlayNext = 0; 
var showPlayerControls = 1; 
var showVideoInfo = 1; 
var showRelatedVideos = 0; 
var showTitlesInList = 1; 