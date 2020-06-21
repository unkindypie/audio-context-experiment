import Microphone from './Microphone';
import $ from 'jquery';

$(document.getElementById('app')).append('<button id="b1">Start</button>');
$(document.getElementById('b1')).click(e => {
  const mic = new Microphone();
  $(e.currentTarget).fadeOut();
});
