var bell = new Audio('http://www.hurricanecharlie.co.uk/files/bell.mp3'),
    seconds = 60,
    count = 0,
    minBreak = 5,
    minSesh = 25,
    state = 'start',
    pauseFlag = false,
    interval,
    circleData = {};
    
/* Timer function counts down seconds and minutes
using a a setInterval function. Filter for seconds,
minutes and completion. Also checks for pause flag. */
function timer(min, sec, counter) {

  interval = setInterval(function() {

    // minute countdown filter
    if (counter % 60 === 0 && !pauseFlag) {
      min--;
      $('.minutes').text(min);
      sec = 60;
    }

    // seconds timer if not paused
    if (!pauseFlag) {
      sec--;
      var value = zeroPrefixer(sec);
      $('.seconds').text(value);
      counter--;
      timerCircle(counter);
    }

    // timer complete filter switches state
    if (min === 0 && sec === 0) {
      clearInterval(interval);
      bell.play();
      chooser();
    }

  }, 1000);

}

/* Function that switches between break and session
this calls the function to update the state. */
function chooser() {
  if (state === 'session') {
    stateUpdater('break', minBreak, count, 'on break');
  } else {
    stateUpdater('session', minSesh, count, 'in session');
  }
}

/* Function that updates the timer values from chooser
function and starts the timer */
function stateUpdater(stateVal, sesh, count, msg) {
  state = stateVal;
  count = sesh * seconds;
  resetCircle(stateVal);
  circleSetup(count, stateVal);
  timer(sesh, seconds, count);
  $('.message').text(msg);
}

/* Zero prefixer function for seconds display */
function zeroPrefixer(val) {
  return (val < 10 ? '0' : '') + val;
}

/* Function to setup values for animated timer circle */
function circleSetup(count, sesh) {
  circleData.deg = 360 / count;
  circleData.mid = count / 2;
  circleData.sesh = sesh;
  circleData.angle = 0;
  circleData.totalTime = count;
}

/* Function to control the timer circle animation
according to the current seconds count */
function timerCircle(countVal) {

  rotateCircle(countVal);

  if(countVal === circleData.mid) {
    circleData.angle = circleData.deg;
    $('.right.mask').css('z-index', '2');
  } else {
    circleData.angle += circleData.deg;
  }

}

/* Function rotate the mask parts of the timer circle
animation */
function rotateCircle(countVal) {
  if(countVal >= circleData.mid) {
    $('.left.mask').css('transform', 'rotate(' + circleData.angle + 'deg)');
  } else {
    $('.right.mask').css('transform', 'rotate(' + circleData.angle + 'deg)');
  }
}

/* Function to reset the timer circle parts ready
for the next session. */
function resetCircle(stateVal) {
  colourSwap(stateVal);
  $('.left.mask').css('transform', 'rotate(0deg)');
  $('.right.mask').css('transform', 'rotate(0deg)');
  $('.right.mask').css('z-index', '0');
}

/* Function change the timer circle colours according
to the current session. This works by adding an overlay
class with the alternative colors. */
function colourSwap(stateVal) {
  if (stateVal === 'break') {
    $('.mask').addClass('overlay-mask');
    $('.circle').addClass('overlay-circle');
  } else {
    $('.mask').removeClass('overlay-mask');
    $('.circle').removeClass('overlay-circle');
  }
}


/* click event for the start / pause button. This either
starts or pauses depending on the current status and updates
the status on screen */
$('.btn-start').click(function() {
  var $this = $(this).text();

  if ($this === 'Pause') {
    pauseFlag = true;
    $(this).text('Back to work');
  } else if ($this === 'Back to work') {
    pauseFlag = false;
    $(this).text('Pause');
  } else {
    count = minSesh * seconds;
    $('.btn-elements').prop('disabled', true)
    $(this).text('Pause');
    chooser();
  }

});

/* session adjustment buttons */
$('.session-plus').click(function() {
  minSesh++;
  $('.minutes').text(minSesh);
  $('.session-num').text(minSesh);
});

$('.session-minus').click(function() {
  if (minSesh > 1) {
    minSesh--;
    $('.minutes').text(minSesh);
    $('.session-num').text(minSesh);
  }
});

/* break adjustment buttons */
$('.break-plus').click(function() {
  minBreak++;
  $('.break-num').text(minBreak);
});

$('.break-minus').click(function() {
  if (minBreak > 1) {
    minBreak--;
    $('.break-num').text(minBreak);
  }
});

/* reset button returns values to original starting state */
$('.reset-btn').click(function() {
  $('.btn-elements').prop('disabled', false);
  pauseFlag = false;
  state = 'start';
  clearInterval(interval);
  $('.minutes').text(minSesh);
  $('.seconds').text('00');
  $('.btn-start').text('Start');
  $('.message').text('press start to begin');
  resetCircle('reset');
});
