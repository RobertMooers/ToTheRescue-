﻿(function () {
    var toggle_music = document.getElementById('minigameScript').getAttribute('toggleMusic');
    var imagePath = '../../MiniGames/Alphabet_Tracing/images/';
    var soundPath = '../../MiniGames/Alphabet_BubblePop/sounds/';
    var soundPath2 = '../../MiniGames/Alphabet_Tracing/sounds/';

    var difficulty_level = document.getElementById('minigameScript').getAttribute('difficulty');
    var audioClips;
    var tracingImages;
    var audioInstructions, audioInstructions2, letterAudio, backgroundMusic, endOfGame; //audio
    var playing = true;     //keep track of if game is playable

    //arrays containing paths to audio files and image files for alphabet outlines
    if (difficulty_level == 2) {
        audioClips = [soundPath + "d_recording.mp3", soundPath + "j_recording.mp3", soundPath + "k_recording.mp3",
            soundPath + "l_recording.mp3", soundPath + "n_recording.mp3", soundPath + "q_recording.mp3",
            soundPath + "u_recording.mp3", soundPath + "v_recording.mp3", soundPath + "w_recording.mp3",
            soundPath + "x_recording.mp3", soundPath + "y_recording.mp3", soundPath + "z_recording.mp3",
            soundPath + "e_recording.mp3"];

        tracingImages = [imagePath + "d_tracing.png", imagePath + "j_tracing.png", imagePath + "k_tracing.png",
            imagePath + "l_tracing.png", imagePath + "n_tracing.png", imagePath + "q_tracing.png",
            imagePath + "u_tracing.png", imagePath + "v_tracing.png", imagePath + "w_tracing.png",
            imagePath + "x_tracing.png", imagePath + "y_tracing.png", imagePath + "z_tracing.png",
            imagePath + "e_tracing.png"];
    }
    else {
        audioClips = [soundPath + "a_recording.mp3", soundPath + "c_recording.mp3", soundPath + "i_recording.mp3",
            soundPath + "m_recording.mp3", soundPath + "p_recording.mp3", soundPath + "r_recording.mp3",
            soundPath + "s_recording.mp3", soundPath + "t_recording.mp3", soundPath + "b_recording.mp3",
            soundPath + "f_recording.mp3", soundPath + "o_recording.mp3", soundPath + "g_recording.mp3",
            soundPath + "h_recording.mp3"];

        tracingImages = [imagePath + "a_tracing.png", imagePath + "c_tracing.png", imagePath + "i_tracing.png",
            imagePath + "m_tracing.png", imagePath + "p_tracing.png", imagePath + "r_tracing.png",
            imagePath + "s_tracing.png", imagePath + "t_tracing.png", imagePath + "b_tracing.png",
            imagePath + "f_tracing.png", imagePath + "o_tracing.png", imagePath + "g_tracing.png",
            imagePath + "h_tracing.png"];
    }

    //randomly choose index for tracing number
    var index = Math.floor((Math.random() * tracingImages.length)); //random number for array index

    //create audio
    var createAudio = function () {
        audioInstructions = new WebAudioAPISound(soundPath2 + "audio_instructions.mp3", { loop: false });
        audioInstructions.setVolume(70);
        audioInstructions.onEnded = instructionsEnded;
        audioInstructions2 = new WebAudioAPISound(soundPath2 + "audioinstructions_Part2.mp3", { loop: false });
        audioInstructions2.setVolume(70);
        endOfGame = new WebAudioAPISound(soundPath2 + "praise_recording.mp3", { loop: false });
        endOfGame.setVolume(70);
        backgroundMusic = new WebAudioAPISound(soundPath2 + "background_music.mp3", { loop: true });
        backgroundMusic.setVolume(5);
        if (toggle_music == "False")
            backgroundMusic.play(backgroundMusic);
    }

    window.onload = function () {
        createAudio();  //call function to create audio
        audioInstructions.play(audioInstructions);  //play instructions
    }
    
    //play audio of letter to trace
    instructionsEnded =  function () {
        letterAudio = new WebAudioAPISound(audioClips[index], { loop: false });
        letterAudio.setVolume(70);
        letterAudio.onEnded = letterEnded;
        letterAudio.play(letterAudio);
    };
    //play second part of audio instructions
    letterEnded = function () {
        audioInstructions2.play(audioInstructions2);
    };

    var curColor = '#000';          //color user is drawing with
    var clickX = new Array();       //array of X-coordinates
    var clickY = new Array();       //array of Y-coordinates
    var clickDrag = new Array();    //array of booleans indicating dragging motion
    var paint;                      //boolean to track if user is painting
    var base_image = new Image();   //coloring image

    //Get div that script is run in
    var canvasDiv = document.getElementById('BlocksGame');  //retrieve div to place elements into
    document.getElementById('BlocksGame').style.backgroundColor = '#ccbadc'
    document.getElementById('BlocksGame').style.width = '88%';
    document.getElementById('BlocksGame').style.marginLeft = '1%';

    //Create canvas element inside div 
    canvas = document.createElement('canvas');
    canvas.width = canvasDiv.clientWidth * 200 / 390;
    canvas.height = canvasDiv.clientHeight * 400 / 480;
    canvas.setAttribute('id', 'canvas');
    canvasDiv.appendChild(canvas);
    if (typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    context = canvas.getContext("2d");
    document.getElementById("canvas").style.backgroundColor = '#fff';
    canvas.style.border = '1px solid #000';
    canvas.style.marginLeft = '27%';
    canvas.style.marginTop = '4%';

    //handle resizing canvas when window is resized
    function canvasResize() {
        canvas.width = canvasDiv.clientWidth * 200 / 390;
        canvas.height = canvasDiv.clientHeight * 400 / 480;
        redraw();
    }
    window.addEventListener("resize", canvasResize);

    //create toolbar buttons
    function initButtons() {
        //create div for tool buttons
        var buttonsDiv = document.createElement('div');
        buttonsDiv.style.position = 'absolute';
        buttonsDiv.style.top = '0';
        buttonsDiv.style.marginLeft = '13%';
        buttonsDiv.style.marginTop = '3%';
        buttonsDiv.style.width = '13.5%';
        buttonsDiv.style.height = '100%';
        canvasDiv.appendChild(buttonsDiv);

        //create retry button
        var buttonRetry = document.createElement('button');
        buttonRetry.setAttribute('class', 'toolButton');
        buttonsDiv.appendChild(buttonRetry);
        buttonRetry.addEventListener('click', function () {
            clickX.length = 0;  //clear recorded clicks from arrays and redraw
            clickY.length = 0;
            clickDrag.length = 0;
            redraw();
        });
        buttonRetry.style.backgroundImage = 'url(' + imagePath + 'eraser-image.png)';
        buttonRetry.style.backgroundSize = 'cover';

        //create done button
        var buttonDone = document.createElement('button');
        buttonDone.setAttribute('class', 'toolButton');
        buttonsDiv.appendChild(buttonDone);
        buttonDone.addEventListener('click', function () {
            if (playing == true) {
                audioInstructions2.setVolume(.1);
                //Play end of game audio, save score to html element, and call end of game function
                endOfGame.play(endOfGame);
                document.getElementById('score').value = 2; //save score in html element
                EndofGame(); //function displays good job message and returns to map
                playing = false;
            }
        });
        buttonDone.style.backgroundImage = 'url(' + imagePath + 'done-image.jpg)';
        buttonDone.style.backgroundSize = 'cover';

        //style button elements
        var buttons = document.getElementsByClassName('toolButton');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.backgroundRepeat = 'no-repeat';
            buttons[i].style.backgroundPosition = 'center';
            buttons[i].style.backgroundColor = '#fff';
            buttons[i].style.width = '70%';
            buttons[i].style.height = '5%';
            buttons[i].style.marginTop = '15%';
            buttons[i].style.marginLeft = '17%';
        }
        buttonDone.style.height = '15%';
        buttonDone.style.width = '65%';
        buttonDone.style.borderRadius = '50%';
    }

    //add tracing image
    base_image.src = tracingImages[index];
    drawImage();

    //add down press movements to array and redraw
    press = function (e) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;
        paint = true;   //indicate that user is painting
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();
    };
    //add drag movements to array and redraw
    drag = function (e) {
        var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
        mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

        if (paint) {
            addClick(mouseX, mouseY, true);
            redraw();
        }
        // Prevent the whole page from dragging if on mobile
        e.preventDefault();
    };
    //set paint to false when user releases mouse or touch
    release = function (e) {
        paint = false;
        redraw();
    };
    //set paint to false when user leaves canvas
    cancel = function (e) {
        paint = false;
    };
    //add coordinates and dragging boolean to arrays
    function addClick(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
    }
    // Add mouse event listeners to canvas element
    canvas.addEventListener("mousedown", press, false);
    canvas.addEventListener("mousemove", drag, false);
    canvas.addEventListener("mouseup", release);
    canvas.addEventListener("mouseout", cancel, false);

    // Add touch event listeners to canvas element
    canvas.addEventListener("touchstart", press, false);
    canvas.addEventListener("touchmove", drag, false);
    canvas.addEventListener("touchend", release, false);
    canvas.addEventListener("touchcancel", cancel, false);

    //redraw canvas
    function redraw() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
        context.lineJoin = "round";
        context.lineWidth = 10;
        context.save();

        for (var i = 0; i < clickX.length; i++) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1], clickY[i - 1]);
            } else {
                context.moveTo(clickX[i] - 1, clickY[i]);
            }
            context.globalAlpha = 1;
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.strokeStyle = curColor;
            context.stroke();
        }

        context.restore();  //don't erase background image, only tracing
        context.globalAlpha = 1;
        //redraw tracing image
        context.drawImage(base_image, context.canvas.width * .1, context.canvas.height * .1, context.canvas.width * .8, context.canvas.height * .8);
    }
    //draw the tracing image
    function drawImage() {
        context.globalAlpha = 1;
        base_image.onload = function () {
            context.drawImage(base_image, context.canvas.width * .1, context.canvas.height * .1, context.canvas.width * .8, context.canvas.height * .8);
        }
    }
    initButtons(); //initalize buttons
}());