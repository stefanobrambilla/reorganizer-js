/***************************************************
    @NAMESPACE  MAIN
    @REQUIRES   PAGE - FOUNDATION - JQUERY -
                RESPONSIVEIMG - BOWSER

    Main namespace. Init all method & events by looking
    for page type (PAGE namespace).
****************************************************/

jQuery.noConflict();

var MAIN = {
    // Init the application's core
    init: function() {

        // Defines modules to be initialized
        this.modules                = ['ACCORDION', 'DROPDOWN', 'FILTERS', 'MENU', 'MODAL', 'TABS', 'SEARCH'];
        this.animationDuration      = 300;
        this.animationDelay         = 150;
        this.configs                = {
            enableShowMore: true
        };

        PAGE.init();

        this.addBodyClasses();

        this._setEvents();
        this._triggerEvents();

        // Remove 300ms latency on click for touch devices
        if( PAGE.isTouchDevice() ) {
            FastClick.attach( document.body );
        }

        // Check current page type to run only needed code
        if( PAGE.isHome() )
            HOMEPAGE.init();

        if( PAGE.isListing() || PAGE.isSearch()) {

            LISTING.init();

            if( this.configs.enableShowMore && !PAGE.isLookSection() ) {
                SHOWMORE.init( this.configs );
            }
        }

        if( PAGE.isProductView() )
            PRODUCT_VIEW.init();

        if( PAGE.isCheckout() ){
            CHECKOUT.init();
        }
        
        if( PAGE.isMyAccount() ){
            jQuery(".my-account").find("input[type=text], input[type=password], input[type=email]").fakePlaceholder({'input_type': 'text'});
            jQuery(".my-account").find("select").fakePlaceholder({'input_type': 'select'});
        }

    },

    addBodyClasses: function() {

        jQuery('body')
            .addClass( PAGE.isTouchDevice() ? 'touch' : 'no-touch' )
            .addClass( bowser.chrome ? 'chrome' : '' )
            .addClass( bowser.firefox ? 'firefox' : '' )
            .addClass( bowser.msie ? 'msie' : '' )
            .addClass( bowser.msedge ? 'msedge' : '' );

    },

    _setEvents: function() {

        // Remove browser history scroll
       // history.scrollRestoration = 'manual';

        var _goTop = jQuery('#go-top');

        // Performs reflow on validationFailed event ( emitted in validation.js )
        jQuery(window).on('validationFailed', MAIN.reflow );

        // Performs reflow on admin area-request ajax loaded ( emitted in zendesk.js )
        jQuery(window).on('adminUpdate', MAIN.reflow );

        /*
         * Sticky Header
         * (Custom)
         */

        /* jQuery(window).on('scroll', function( event ) {

            var
                _scrolled   = jQuery(this).scrollTop(),
                _top        = jQuery('#top'),
                _body       = jQuery('body'),
                _menu       = jQuery('#menu');


            _scrolled > _top.height() ? _body.addClass('sticky') : _body.removeClass('sticky');
            _scrolled > _top.height() ? '' : _menu.removeClass('open');

        }); */
        
        /* Custom
        jQuery('.logo-main-wrapper').on('click', '.icon-menu', function( event ){

            jQuery("#menu").toggleClass("open");

        });
        */


        // Label input
        jQuery("#onestepcheckout-form").find("input[type=text], input[type=password], input[type=email]").fakePlaceholder({'input_type': 'text'});
        jQuery("#onestepcheckout-form").find("select").fakePlaceholder({'input_type': 'select'});

        jQuery(".customer-account-login form").find("input[type=text], input[type=password], input[type=email]").fakePlaceholder({'input_type': 'text'});

        jQuery(".customer-account-create form").find("input[type=text], input[type=password], input[type=email]").fakePlaceholder({'input_type': 'text'});
        jQuery(".customer-account-forgotpassword form").find("input[type=text], input[type=password], input[type=email]").fakePlaceholder({'input_type': 'text'});

        var winWidth = jQuery(window).width();
        var winHeight = jQuery(window).height();
        var t;
        jQuery(window).resize(function() {

            //Prevent from firing the event in IE when the window wasn't actually resized.
            var winNewWidth = jQuery(window).width();
            var winNewHeight = jQuery(window).height();
            if (winWidth != winNewWidth || winHeight != winNewHeight)
            {
                    
                clearTimeout(t);
                t = setTimeout(function() {

                    //console.log("xsmall:" + PAGE.isInBreakpoint('xsmall'));
                    //console.log("small:" + PAGE.isInBreakpoint('small'));
                    //console.log("medium:" + PAGE.isInBreakpoint('medium'));
                    //console.log("large:" + PAGE.isInBreakpoint('large'));


                    if( PAGE.isHome() ){
                        HOMEPAGE._setSliderHeight();
                    }

                    if( PAGE.isProductView() )
                        PRODUCT_VIEW._initProductCarousel();



                }, 100);

            } //end: if
            //Update window size variables
            winWidth = winNewWidth;
            winHeight = winNewHeight;

        }); //end: on resize

        // Go top button
        _goTop.on('click', function( event ) {

            event.preventDefault();

            jQuery('html, body').stop().animate( { scrollTop: 0 }, MAIN.animationDuration );

        });

        // Manage main navigation
        if( PAGE.isTouchDevice() ) {

            jQuery('#menu').on('click', 'li.parent > a', function( event ){

                event.preventDefault();
                var getFather = jQuery(this).parent();

                setTimeout(function(){

                    jQuery('#nav li.level1').matchHeight({ property: 'height' });

                }, 100);

                if ( getFather.hasClass('level1') ) {

                    if (getFather.hasClass('hover-class')) {

                        getFather.removeClass('hover-class');

                    } else {

                        jQuery('li.level1.parent').removeClass('hover-class');
                        getFather.addClass('hover-class');

                    }
                }else{

                    if ( getFather.hasClass('hover-class') ){

                        getFather.removeClass('hover-class');

                    }else{

                        jQuery('li.parent').removeClass('hover-class');
                        getFather.addClass('hover-class');

                    }

                }



            });


        }else{

            jQuery('#menu').on('click', 'li.parent.not-clickable > a', function( event ){

                event.preventDefault();

            });

            jQuery('#menu').on('mouseenter', 'li.level-top.parent', function( event ){

                event.preventDefault();

                setTimeout(function(){

                    jQuery('#nav li.level1').matchHeight({ property: 'height' });

                }, 100);

                if ( !jQuery(this).hasClass('hover-class') ){

                    jQuery('li.level-top.parent').removeClass('hover-class');
                    jQuery(this).addClass('hover-class');

                }

            });

            jQuery('#menu').on('mouseleave', 'li.level-top.parent', function( event ){

                event.preventDefault();

                jQuery('li.level-top.parent').removeClass('hover-class');

            });

        }


        // Managed by
        jQuery('#footer').on('click', 'a.managed-by', function( event ){

            event.preventDefault();

            if( PAGE.isTouchDevice() ) {

                event.stopImmediatePropagation();
                jQuery(this).find('span').stop().fadeToggle( MAIN.animationDuration );

            }

        });

        // Provide close fallback for touch devices
        jQuery('a.managed-by').on('click', 'span', function( event ) {

            event.preventDefault();

            if( PAGE.isTouchDevice() ) {

                event.stopImmediatePropagation();
                jQuery(this).stop().fadeOut( MAIN.animationDuration );
            }

        });

        // Print page
        jQuery('#print').on('click', function( event ) {

            event.preventDefault();
            PAGE.print();

        });

        // Init all modules event by checking for [MODULE_NAME].init function
        for( var i = 0; i < MAIN.modules.length; i++ ) {

            if( typeof MAIN[ MAIN.modules[i] ].init == 'function' ) {
                MAIN[ MAIN.modules[i] ].init();
            }

        }

    },

    // DOM Ready events to be triggered
    _triggerEvents: function() {

        // Select first tab for each tab instance
        jQuery('.tabs').each(function() {

            jQuery(this).find('a').first().trigger('click');

        });

        // Collapse all the accordions
        jQuery('.accordion-wrapper').each(function() {

            jQuery(this).find('.accordion-toggle').filter('.active').trigger('click');

        });

    },

    reflow: function() {

        Foundation.reInit('equalizer');
        jQuery(window).trigger('resize');

    },

    lockScroll: function( target ) {

        ( target || jQuery('body') ).css('overflow', 'hidden');

    },

    unlockScroll: function( target ) {

        ( target || jQuery('body') ).css('overflow', 'auto');

    },
    
    scrollToPoint: function(pointTag){

        var pointTag = jQuery(pointTag);
        var headerHeight = jQuery("#header").height();

        jQuery('html,body').stop().animate({scrollTop: (parseInt(pointTag.offset().top) - parseInt(headerHeight))},'slow');

    },

    SEARCH: {

        init: function(){

            this._setEvents();
            this._moveSearch();

        },

        _setEvents: function(){

            jQuery(window).resize(function() {

                MAIN.SEARCH._moveSearch();

            });

            jQuery(document).find('.icon-menu-search, #search-wrapper .icon-close').on('click', function () {

                var _th = jQuery(this),
                    _element = jQuery(document).find('#search-right');

                    console.log(_element.is(':visible'));

                _element.is(':visible') ? MAIN.SEARCH._closeSearch(_element, _th) : MAIN.SEARCH._openSearch(_element, _th);

            });

        },

        _moveSearch: function(){

            if( PAGE.isInBreakpoint('large') ){

                jQuery(document).find('#search-wrapper').appendTo('#search-center');

            }else{

                jQuery(document).find('#search-wrapper').appendTo('#search-right');

                console.log(PAGE.isInBreakpoint('xsmall'));

                if( PAGE.isInBreakpoint('xsmall') || PAGE.isInBreakpoint('small') ) {


                    var _win = jQuery(window).height(),
                        _head = jQuery('#header').height();

                    jQuery('#search-right').css('height', (_win - _head));

                }else{

                    jQuery('#search-right').css('height', 'auto');

                }
            }

        },

        _openSearch: function(_element, _th){

            _element.fadeIn();

            if( !PAGE.isInBreakpoint('xsmall') && !PAGE.isInBreakpoint('small') ) {

                _th.find('.icon-search').hide();
                _th.find('.icon-close').fadeIn();

            }

        },

        _closeSearch: function(_element, _th){

            _element.fadeOut();

            if( !PAGE.isInBreakpoint('xsmall') && !PAGE.isInBreakpoint('small') ) {

                _th.find('.icon-close').hide();
                _th.find('.icon-search').fadeIn();

            }

        }

    },

    MENU: {

        init: function() {

            this.menu = jQuery('#menu');
            this._initOffCanvasMenu();
            this._addOffCanvasMenuToggles();
            this._setEvents();

            if ( jQuery("#menu .opener").length <= 0){
                jQuery( "#menu li.parent" ).each(function( index ) {
                    jQuery(this).prepend('<i class="opener icon-plus"></i>');
                });
            }

        },

        _setEvents: function() {

            jQuery(document)
                .on('opened.zf.offcanvas', function() {
                    jQuery('.off-canvas-wrapper').addClass('open');
                    MAIN.MENU._lockScroll();
                    MAIN.MENU._heightOffCanvasMenu();
                })
                .on('closed.zf.offcanvas', function() {
                    jQuery('.off-canvas-wrapper').removeClass('open');
                    MAIN.MENU._unlockScroll();
                });

                jQuery(window).resize(function () {
                    MAIN.MENU._heightOffCanvasMenu();
                });

                jQuery('#off-canvas-menu .parent > a').on('click', function( event ) {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    var _parent     = jQuery(this).parent(),
                        /* It depends on having the wide menu or not
                        * e.g.
                        * Wide => Prenatal
                        * Non-wide => Fabiana Filippi
                        *  WIDE:
                        * _submenu    = _parent.find('[class*="dropdown"]').first(),
                        *
                        */
                        // Non-wide:
                        _submenu    = jQuery(this).next(),
                        _toggle     = _parent.find('.accordion-toggle').first();

                    if( !_submenu.is(':visible') ) {
                        _parent.addClass('opened');
                        _toggle.addClass('icon-minus');
                        _toggle.removeClass('icon-plus');
                        _submenu.stop().slideDown( MAIN.animationDuration );

                    } else {
                        _parent.removeClass('opened');
                        _toggle.removeClass('icon-minus');
                        _toggle.addClass('icon-plus');
                        _submenu.stop().slideUp( MAIN.animationDuration );
                    }

                })
                .on('click', 'a', function( event ) {
                    event.preventDefault();
                    window.location = jQuery(this).attr('href');
                });


                // Main menu (emulate hover behavior on touch devices)
                /*
                this.menu.on('click', 'a.level-top', function( event ) {

                    event.preventDefault();
                    event.stopImmediatePropagation();

                    var _this = jQuery(this);

                    // If is touch prevent click on level-top menu in order to show the submenu
                    if( PAGE.isTouchDevice() ) {

                        MAIN.MENU.menu.find('a.level-top').not(this).removeClass('active');

                        jQuery(this).toggleClass('active');

                    }
                    else {

                        window.location = _this.attr('href');

                    }

                });
                */

                // Off-Canvas menu (emulate accordion behavior)
                /*
                ****
                 jQuery('#off-canvas-menu')
                    .on('click', '.accordion-toggle', function( event ) {

                        event.preventDefault();
                        event.stopImmediatePropagation();

                        var _parent = jQuery(this).parent(), _submenu = _parent.find('[class*="dropdown"]').first();

                        jQuery('#off-canvas-menu')
                            .find('[class*="dropdown"]')
                                .not( _submenu )
                                    .stop()
                                        .slideUp( MAIN.animationDuration );

                         if( !_submenu.is(':visible') ) {

                            _parent.addClass('opened');
                            _submenu.stop().slideDown( MAIN.animationDuration );

                        }
                        else {

                            _parent.removeClass('opened');
                            _submenu.stop().slideUp( MAIN.animationDuration );

                        }

                    })
                    .on('click', 'a', function( event ) {

                        event.preventDefault();

                        window.location = jQuery(this).attr('href');

                    });
                ****
                */

        },

        _heightOffCanvasMenu: function(){

            var _win = jQuery(window).height(),
                _tab = jQuery('#off-canvas-tab .tabs').height();

            jQuery('#off-canvas-tab .tabs-slider-ctn').css('height', (_win - _tab));

        },

        // @TODO IMPROVE if possible.
        // Makes up the Off-Canvas menu by copy & paste pieces of DOM into the Off-Canvas wrapper.
        // It looks for selectors defined in _offCanvasSections, then paste the content to the placeholder
        // element. This implementation prevents code redundance.
        _initOffCanvasMenu: function() {

            var _this               = this;
            var _offCanvasSections  = {
                'search-bar':           _this._getSection('search-bar'),
                'account':              _this._getSection('account'),
                'footer-legal':         _this._getSection('footer-legal'),
                'footer-service':       _this._getSection('footer-service'),
                'menu':                 _this._getOffCanvasMenu( jQuery('#menu').clone(true) )
            };

            for( var _section in _offCanvasSections )  {

                var _currentSection = jQuery('#offCanvas').find('[data-append="'+ _section +'"]');

                if( _currentSection.children().size() == 0 ) {
                    _currentSection.empty().append( _offCanvasSections[_section] );
                }

            }

        },

        _getOffCanvasMenu: function( list ) {

            // Remove custom links and third level menu
            list.find('.nav-custom-link').remove();
            //list.find('ul.level1').remove();

            return jQuery( document.createElement('ul') )
                        .attr( { id: 'off-canvas-menu' } )
                            .append( list.html() );

        },

        _getSection: function( sectionId ) {

            var html = '';

            switch( sectionId.toLowerCase() ) {

                case 'search-bar':
                    html = jQuery('#search_mini_form').clone();
                    break;

                case 'account':
                    html = ( jQuery('#login-link') || jQuery('#logout-link') ).clone();
                    html.addClass('btn btn-filter').find('i').remove();
                    break;

                case 'footer-legal':
                    html = jQuery('[data-id="footer-legal"]').html();
                    break;

                case 'footer-service':
                    html = jQuery('[data-id="footer-service"]').html();
                    break;

                default:
                    html = '';
            }

            return html;

        },

        _lockScroll: function() {

            MAIN.lockScroll();
            MAIN.unlockScroll( jQuery('#offCanvas') );

        },

        _unlockScroll: function() {

            MAIN.unlockScroll();
            MAIN.unlockScroll( jQuery('#offCanvas') );

        },

        _addOffCanvasMenuToggles: function() {

            var _icon = jQuery( document.createElement('i') ).attr( { 'class': 'icon-plus accordion-toggle' } )
                _iconArrow = jQuery( document.createElement('i') ).attr( { 'class': 'icon-right accordion-toggle' } );

            jQuery('#off-canvas-menu').find('li:not(.level1).parent').each( function() {

                jQuery(this).find(' > a ').append( _icon.clone(true) );


            });

            jQuery('#off-canvas-menu').find('li.level1.parent').each( function() {

                jQuery(this).find(' > a ').append( _icon.clone(true) );


            });

            jQuery('[data-append="footer-service"], [data-append="account"] .logged').find('li').each( function() {

                jQuery(this).find(' > a ').append( _iconArrow.clone(true) );


            });

            jQuery('[data-append="account"] .logged').find('.accordion-wrapper').removeClass('accordion-wrapper');
            jQuery('[data-append="account"] .logged').find('.accordion-wrapper').removeClass('accordion-wrapper');
            jQuery('[data-append="account"] .logged').find('.accordion').removeClass('accordion');

        }

    },

    ACCORDION: {

        init: function() {

            this._setEvents();

        },

        _setEvents: function() {

            jQuery('#sidebar .icon-chevron-up').on('click', function( event ) {

                event.preventDefault();

                jQuery(this).next('div').toggleClass("open");
                jQuery(this).toggleClass("active");
            });

            jQuery('.accordion-toggle').on('click', function( event ) {

                event.preventDefault();

                if ( jQuery(this).next('ul').hasClass('open') ){

                    jQuery(this).next('ul').removeClass("open");
                    jQuery(this).removeClass("active");

                }else{

                    jQuery('.accordion').removeClass("open");
                    jQuery(".accordion-toggle").removeClass("active");

                    jQuery(this).next('ul').addClass("open");
                    jQuery(this).addClass("active");

                }

            });

            if(PAGE.isInBreakpoint('xsmall') || PAGE.isInBreakpoint('small')) {

                jQuery('.open-toggle > h6').on('click', function (event) {

                    event.preventDefault();
                        jQuery(this).next('ul').slideToggle();
                        jQuery(this).next('ul').toggleClass("active");
                        jQuery(this).parent().toggleClass("active");

                });
            }

        },


    },

    MODAL: {

        init: function() {

            this._setEvents();

        },

        _setEvents: function() {

            var _this = this;

            jQuery('body').on('click', '.modal-toggle', function( event ) {

                event.preventDefault();
                event.stopImmediatePropagation();

                var _modalId    = jQuery(this).attr('data-toggle') || jQuery('.modal').attr('id');
                var _modal      = MAIN.MODAL._getModal( _modalId );

                !_modal.closest('.modal-overlay').is(':visible') ? MAIN.MODAL.show( _modalId ) : MAIN.MODAL.hide( _modalId );


            });

            jQuery('.modal').on('click', '.modal-close', function( event ) {

                event.preventDefault();
                event.stopImmediatePropagation();

                var _modal = jQuery(this).closest('.modal').size() > 0 ? jQuery(this).closest('.modal') : jQuery(this).find('.modal');
                MAIN.MODAL.hide( _modal.attr('id') );

            });

            jQuery(document).on('keyup', function( event ) {

                if( event.keyCode == 27 ) {

                    jQuery('.modal').each(function() { jQuery(this).find('.modal-close').trigger('click'); });

                }

            });

        },

        _getModal: function( id ) {
            return jQuery('.modal').filter('#'+ id).first();
        },

        show: function( id ) {

            var _modal = MAIN.MODAL._getModal( id );

            _modal.closest('.modal-overlay').stop().fadeIn( MAIN.animationDuration );
            MAIN.lockScroll();

            if( _modal.hasClass('modal-video') )  MAIN.MODAL.showVideo( _modal );
            if( _modal.hasClass('modal-send-to-a-friend') )  MAIN.MODAL.sendFriend( _modal );
            if( _modal.hasClass('modal-privacy-empty') )  MAIN.MODAL.getAjaxContent( _modal );


        },

        hide: function( id ) {

            var _modal = MAIN.MODAL._getModal( id );

            _modal.closest('.modal-overlay').stop().fadeOut( MAIN.animationDuration );
            MAIN.unlockScroll();

            if( _modal.hasClass('modal-video') )  MAIN.MODAL.hideVideo( _modal );

        },

        getAjaxContent: function( modal ){

            jQuery.ajax({
                url: jQuery(".modal-privacy-empty-url").attr('data-href'),
                type: "POST",
                dataType: "text",
                success: function(data) {

                    var contentTxt = jQuery(data);
                    jQuery('.modal-privacy-empty .loading').hide();
                    jQuery('.modal-privacy-empty .content').html(contentTxt);

                }
            });

        },

        showVideo: function( modal ) {

            var _iframe = modal.find('iframe');

            _iframe.attr('src', _iframe.attr('data-src'));

        },

        sendFriend: function( modal ){

            jQuery.ajax({
                url: jQuery("#send-to-friend").attr('href'),
                type: "POST",
                dataType: "text",
                success: function(data) {

                    var contentTxt = jQuery(data);
                    jQuery('.modal-content').html(contentTxt);

                }
            });

        },

        hideVideo: function( modal ) {

            var _iframe = modal.find('iframe');

            _iframe.attr('src', '');

        }

    },

    DROPDOWN: {

        init: function() {

            this._setEvents();

        },

        _setEvents: function() {

            if ( PAGE.isTouchDevice() ) {

                jQuery(document.body).on('click', '.dropdown-toggle', function (event) {

                    event.preventDefault();
                    event.stopImmediatePropagation();

                    var _dropdown = jQuery(this).find('.dropdown');

                    _dropdown.is(':visible') ? _dropdown.stop().fadeOut(MAIN.animationDuration) : _dropdown.stop().fadeIn(MAIN.animationDuration);

                });
            }

        }

    },

    TABS:  {

        init: function() {

            this._setEvents();

        },

        _setEvents: function() {
            jQuery('.tabs').on('click', 'a', function( event ) {

                event.preventDefault();
                event.stopImmediatePropagation();

                var _index = jQuery(this).parent().index(),
                    _tabsContent = jQuery(this).closest('.tabs-wrapper').find('.tabs-content');

                jQuery(this)
                    .closest('.tabs')
                        .find('a')
                            .removeClass('active')
                                .filter(this)
                                    .addClass('active');

                _tabsContent.stop().hide();
                _tabsContent.filter(':eq('+ _index +')').stop().fadeIn( MAIN.animationDuration );

            });

        }

    },

    FILTERS: {

        init: function() {

            this._filters = jQuery('.filters-wrapper');

            this._setEvents();

        },

        _setEvents: function() {

            var _this = this;

            // Prevent auto-reload
            _this._filters
                .on('click', 'li > a', function( event ) {

                    event.preventDefault();
                    event.stopImmediatePropagation();

                    _this._toggleCheckbox( jQuery(this).find('input[type="checkbox"]') );

                })
                // Apply button flow
                .on('click', '.btn-apply-filters', function( event ) {

                    event.preventDefault();

                    _this.apply( _this._getUrl() );

                })
                .on('click', '.clear-filters', function( event ) {

                    event.preventDefault();

                    window.location = window.location.href.split('?')[0];

                });

            jQuery('.filters-toggle, .filters-close').on('click', function( event ) {

                event.preventDefault();
                event.stopImmediatePropagation();

                if( !_this._filters.is(':visible') ) {

                    MAIN.lockScroll();
                    _this.show();

                }
                else {

                    MAIN.unlockScroll();
                    _this.hide();

                }

            });

        },

        _toggleCheckbox: function( checkbox ) {

            checkbox.prop('checked', !checkbox.is(':checked') );

        },

        // Apply filters by calling a URL
        apply: function( url ) {

            if( url != '' ) {

                // Check if current URL has already some parameters
                if( window.location.href.indexOf('?') == -1 )
                    window.location = window.location.href + '?' + url;
                else
                    window.location = window.location.href.split('?')[0] + '?' + url;

            }

        },

        // Retrieve the parameters URL
        _getUrl: function() {

            var params = [];

            // Find checked filters and retrieve the parameter to be passed in GET call
            jQuery('.filters-wrapper').find(':checkbox').filter(':checked').each( function() {

                var
                    _index      = 0,
                    _checkbox   = jQuery(this),
                    _code       = _checkbox.attr('data-code'),
                    _val        = _checkbox.attr('value');

                // Manage multi-value selection on the same filter.
                // Multiple values are separated by '_' (underscore)
                if( _code != '' ) {

                    if( !_.findWhere( params, { code: _code } ) ) {

                        params.push({ code : _code, value: _val });

                    }
                    else {

                        _index = _.findIndex( params, function( item ) { return item.code == _code });
                        params[ _index ] = { code: params[_index].code, value : params[ _index ].value + '_' + _val };

                    }
                }

            });

            // Map the values and return them joined by '&'
            return ( _.map( params, function( item ) {  return item.code + '=' + item.value; }) ).join('&');

        },

        show: function() {

            this._filters.stop().slideDown( MAIN.animationDuration );

        },

        hide: function() {

            this._filters.stop().slideUp( MAIN.animationDuration );

        }

    },

    OVERLAY: {
        init: function() {
            this.lastDatePopupShowed;
            this.now = new Date();

            if (localStorage.getItem('popup-landed') !== null) {
                this.lastDatePopupShowed = new Date(parseInt(localStorage.getItem('popup-landed')));
              }

            this._setEvents();
        },

        _setEvents: function() {
            if (((this.now - this.lastDatePopupShowed) >= (30 * 86400000)) || !this.lastDatePopupShowed) {
                jQuery.magnificPopup.open({
                  items: { src: '#popup-landed' },
                  type: 'inline'
                }, 0);

                localStorage.setItem('popup-landed', this.now);
            }
        }
    }

};

var isCoreInitialized = false;

jQuery(document).ready(function() {

    Foundation.Equalizer.defaults.act_on_hidden_el = true;

    jQuery(document)
        .foundation()
        .on('ready', function() {

            if( !isCoreInitialized ) {

                MAIN.init();
                isCoreInitialized = true;

            }

        });

});
