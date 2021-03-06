/*global define, TWEEN, _log, $ Modernizr*/

define(['graphicalweb/events/StateEvent',
        'graphicalweb/events/UserEvent',
        'graphicalweb/models/VarsModel',       
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/views/components/CharCanvas',
        'graphicalweb/views/components/Div'],

	function (StateEvent, UserEvent, VarsModel, Camera, Audio, Canvas, Div) {
		
		var Section5_CANVAS = function () {
			var instance = this,
                stateId = 5,
                character,
                $blockquotes,
                $cover,
                view;

            instance.phaselength = 0;
            instance.phase = 0;

//private
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);

                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                } else {
                    $(view + ':not(blockquote)').show();
                }
            }

//public
            instance.init = function () {
                view = '.section5';
                $blockquotes = $('blockquote' + view);
                  
                //instance.talkingpoint = 0;
                //instance.talkingpoints = TALKING_POINTS[stateId - 2].length;

                instance.phase = 0;
                instance.phaselength = $blockquotes.length + 1;

                if (Modernizr.canvas !== true) {
                    $('#warning').fadeIn();
                }

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -4290, y: 1090, z: -4650},
                    goalRotation = {x: 8, y: -104, z: 0},
                //var goalPosition = {x: 790, y: 792, z: -7050},
                //    goalRotation = {x: 1, y: -55, z: 0},
                    divPosition = {x: 4000, y: -1850, z: 4300},
                    divRotation = {x: 0, y: 80, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);  
                    Camera.setRotation(goalRotation);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);

                    handle_animIn_COMPLETE();
                } else {
                    Camera.animateRotation(goalRotation, 1000);
                    Camera.animatePosition(goalPosition, 1000, {easing: TWEEN.Easing.Quadratic.EaseOut});
                    Div.animatePosition(divPosition, 2000, {easing: TWEEN.Easing.Sinusoidal.EaseOut});
                    Div.animateRotation(divRotation, 2000, {callback: handle_animIn_COMPLETE});
                }
            };

            instance.run = function () {
                //var $currentQuote = $($blockquotes[instance.phase - 1]);

                $blockquotes.fadeOut();

                switch (instance.phase) {
                case 1:
                    //pixels
                    StateEvent.AUTOMATING.dispatch();    
                    Canvas.talk();
                    Div.setFace('happy');   

                    Audio.playDialogue($($blockquotes[0]).data('audio'), function () {
                        Canvas.face();
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 2:
                    //woah
                    Div.setFace('talk');                   
                    Canvas.face();

                    Audio.playDialogue($($blockquotes[1]).data('audio'), function () {
                        Div.setFace('happy');
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 3:
                    //canvas
                    Canvas.talk();
                    Div.setFace('happy');

                    Audio.playDialogue($($blockquotes[2]).data('audio'), function () {
                        Canvas.face();
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 4:
                    Div.setFace('happy');
                    Canvas.face();
                    StateEvent.WAIT_FOR_INTERACTION.dispatch();
                    break;
                case 5:
                    //spielberg
                    StateEvent.AUTOMATING.dispatch();         
                    Canvas.face();
                    Div.setFace('talk');

                    Audio.playDialogue($($blockquotes[3]).data('audio'), function () {
                        Div.setFace('happy');                   
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 6:
                    //further
                    Div.setFace('happy');                   
                    Canvas.talk();

                    Audio.playDialogue($($blockquotes[4]).data('audio'), function () {
                        Canvas.face();
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 7:
                    //weird
                    Div.setFace('talk');

                    Audio.playDialogue($($blockquotes[5]).data('audio'), function () {
                        Div.setFace('happy');                   
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                }
            };

            instance.prev = function () {
                instance.phase -= 1;
                instance.run();
            };

            instance.next = function () {
                instance.phase += 1;
                instance.run();
            };

            //instance.talkingPoint = function () {
            //    var array = TALKING_POINTS[stateId - 2];
            //    runTalkPoint(array, instance);
            //};

            instance.stop = function () {
                Audio.stopDialogue();
                $(view).hide();
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section5_CANVAS();
    });
