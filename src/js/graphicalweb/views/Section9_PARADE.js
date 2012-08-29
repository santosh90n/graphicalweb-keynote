/*global define $ TWEEN*/

define(['graphicalweb/events/StateEvent',
        'graphicalweb/events/UserEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/models/VarsModel',
        'graphicalweb/views/components/CharShader',
        'graphicalweb/views/components/CharCss',
        'graphicalweb/views/components/CharSvg',
        'graphicalweb/views/components/char3d',
        'graphicalweb/views/components/CharBlend',
        'graphicalweb/views/components/TinyCanvas',
        'graphicalweb/views/components/TinyWebgl',
        'graphicalweb/views/components/Div',
        'graphicalweb/views/components/Scenery'],

	function (StateEvent, UserEvent, Camera, Audio, VarsModel, Shader, CSS, SVG, Moon, Blend, TinyCanvas, TinyWebgl, Div, Scenery) {
		
		var Section9_PARADE = function () {
			var instance = this,
                stateId = 9,
                shader,
                moon,
                css,
                blend,
                svg,
                webgl,
                canvas,
                $cover,
                $blockquotes,
                $parade,
                $carouselHolder,
                $carouselContent,
                view;

            instance.phaselength = 0;
            instance.phase = 0;

//private
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                
                shader.start();
                svg.start();
                css.start();
                moon.start();
                blend.start();
                canvas.start();
                canvas.show();

                svg.moveTo({x: 0, y: -300}, 1000);
                css.moveTo({x: 150, y: 200}, 1000);
                moon.moveTo({x: -400, y: -150}, 1000);
                blend.fadeIn({'left': '0px', 'opacity': '1'});

                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                } else {
                    $(view + ':not(blockquote)').show();
                }
            }

            /* transition from one to another */
            function setCarousel(num) {
                
                $carouselHolder.show();
                
                if (VarsModel.ADOBE_BUILD !== false) {
                    //fade out
                    $carouselContent.removeClass('in');

                    setTimeout(function () {
                        
                        //swap
                        $carouselContent.hide();
                        $($carouselContent[num]).show();

                        setTimeout(function () {
                            //fade in
                            $($carouselContent[num]).addClass('in');
                        }, 10);

                    }, 400);

                } else {
                    $carouselContent.hide();
                    $($carouselContent[num]).show();
                }
            }
            
//public
            instance.init = function (direct) {
                view = '.section9';
                $blockquotes = $('blockquote' + view);

                $carouselContent = $('.carousel-content');
                $carouselHolder = $('#carouselHolder');
                $parade = $('#charParade');
                $parade.show();

                if (VarsModel.ADOBE_BUILD !== true) {
                    $('#warning').fadeIn();
                }

                //webgl = new TinyWebgl();
                canvas = new TinyCanvas();
                css = new CSS('#paradeCSS');
                svg = new SVG('#paradeSVG');
                moon = new Moon('#paradeTransform');
                blend = new Blend('#paradeBlend');
                shader = new Shader();

                instance.phase = 0;
                instance.phaselength = $blockquotes.length + $carouselContent.length; //pad for other sections

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.update = function () {
                if (VarsModel.DETAILS === true) {
                    svg.update();
                    moon.update();
                }
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -2550, y: -768, z: 0},
                    goalRotation = {x: 0, y: 0, z: 0},
                    divPosition = {x: 2500, y: 0, z: 0},
                    divRotation = {x: 0, y: 0, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Scenery.setParallax(300);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.animatePosition(goalPosition, 1000);
                    Scenery.animateParallax(300, 1000);
                    Div.animateRotation(divRotation, 2000);                    
                    Div.animatePosition(divPosition, 2000, {easing: TWEEN.Easing.Sinusoidal.EaseIn, callback: handle_animIn_COMPLETE});
                }
            };

            instance.next = function () {
                var $currentQuote = $($blockquotes[instance.phase]),
                    carousel;
                
                $blockquotes.fadeOut();
                
                switch (instance.phase) {
                case 0:
                    //explore graphical web
                    StateEvent.AUTOMATING.dispatch();         
                    Div.setFace('happy');
                    shader.talk(true);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        shader.talk(false);
                    });
                    break;
                case 1:
                    //this is what i'm talking about
                    Div.setFace('talk');
                    shader.talk(false);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 2:
                    //let's get creative
                    Div.setFace('talk');
                    shader.talk(false);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        shader.talk(false);
                    });
                    break;
                default:
                    carousel = instance.phase - 3;
                    setCarousel(carousel);
                    break;
                }
                instance.phase += 1;
            };

            instance.stop = function () {
                $(view).hide();
                                
                $carouselHolder.hide();
                $carouselContent.hide();
                $carouselContent.removeClass('in');

                Div.setFace('happy');
                shader.talk(false);

                shader.stop();
                css.stop();
                svg.stop();
                moon.stop();
                canvas.stop();
                canvas.hide();
     
                svg.moveTo({x: 900, y: -300}, 300);
                css.moveTo({x: 1000, y: 200}, 300);
                moon.moveTo({x: -400, y: -800}, 300);
                blend.fadeOut(function () {
                    blend.stop();
                    instance.destroy();
                });
            };

            instance.destroy = function () {
                $parade.hide();
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section9_PARADE();
    });