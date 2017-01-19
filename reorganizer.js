/**
 * Created by stefano.brambilla on 20/09/2016.
 * version: 0.1 Alpha
 *
 * Reorganizer plugin
 *
 */

var REORGANIZER = {

    init: function (options) {

        this.configs = {

            wrapper: 		        '#nav',
            containerMatch: 	    'li.level0',
            elementMatch: 	        'li.level1',
            destination:            '.nav-block > ul',

            classColumn: 	        'fake-col-wrapper',
            extraElementClass:      'elem-reorganized',

            foundation:             true,
            printExtraElementClass: true

        };

        this.configs 		= jQuery.extend( this.configs, ( options || {} ) );

        this._setEvents();
        this._checkReorganize();
    },

    _setEvents: function() {

    },

    _checkReorganize: function() {

        jQuery( REORGANIZER.configs.wrapper +' '+ REORGANIZER.configs.containerMatch ).each(function( index, element ) {

            if(jQuery(this).hasClass('reorganize')){

                REORGANIZER._appendColumns(element);

            }

        });

    },

    _appendColumns: function(element) {

        var _element         = jQuery(element),
            _elemClass       = _element.attr('class'),
            _destination    = _element.find(REORGANIZER.configs.destination);

        _elemClass = _elemClass.split(' ');

        jQuery(_elemClass).each(function (n, classes){

            if(classes.startsWith('columns-')){
                _nCol = classes;
            }

        });

        _nCol = _nCol.split('-');
        _nCol = _nCol[1];

        var _foundationClass = 12 / parseInt(_nCol);

        _destination.addClass('row');

        for(var i = 1; i <= _nCol; i++) {

            if(REORGANIZER.configs.foundation && _nCol != 5) {

                _destination.append('<li class="'+REORGANIZER.configs.classColumn+' '+ REORGANIZER.configs.classColumn+'-col-'+i +' columns small-'+_foundationClass+' medium-'+_foundationClass+'"><ul></ul></li>');

            }else{

                _destination.append('<li class="'+REORGANIZER.configs.classColumn+' '+ REORGANIZER.configs.classColumn+'-col-'+i+'"><ul></ul></li>');

            }
        }

        REORGANIZER._reorganizeElement(element);

    },

    _reorganizeElement: function(element) {

        var _element = jQuery(element);


        _element.find(REORGANIZER.configs.elementMatch).each( function(i, el){

            var _el         = jQuery(el);
                _elClass    = _el.attr('class');

            _elClass = _elClass.split(' ');

            jQuery(_elClass).each(function (n, classes){
                if(classes.startsWith('col-')){
                    _col = classes;
                }

            });
            _col = _col.split('-');
            _col = _col[1];

            if(REORGANIZER.configs.printExtraElementClass){

                _el = _el.addClass(REORGANIZER.configs.extraElementClass);

            }

            jQuery('.'+REORGANIZER.configs.classColumn+'-col-'+_col > ul).append(_el);

        });

        REORGANIZER._endElementReorganize(element);

    },

    _endElementReorganize: function(element) {

        jQuery(element).addClass('init-reorganized');

    }


};
