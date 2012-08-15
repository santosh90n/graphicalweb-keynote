/*global define Modernizr*/
define([],

	function () {
		
		var VarsModel = function () {
			var instance = this;

            instance.PRESENTATION = true;  //presentation mode
            instance.ADOBE_BUILD = true;    //adobe's build
            instance.AUDIO = true;         //audio is supported
            instance.DETAILS = true;        //support detail ainimations

		};

		return new VarsModel();
    });
