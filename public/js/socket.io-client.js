function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  } else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

function setCaretToPos($input, pos) {
  setSelectionRange($input.get(0), pos, pos);
}

var socket = io();

socket.emit('newClient');

var CURSOR_KEYCODES = {
  33: 'page up',
  34: 'page down',
  35: 'end',
  36: 'home',
  37: 'left arrow',
  38: 'up arrow',
  39: 'right arrow',
  40: 'down arrow'
}

var $textarea = $('#textarea');
var d = new Date();
var updateTime = d.getTime(); // how recently has textarea been updated?

$textarea.bind('keypress', function(event) {
  event.preventDefault();
  socket.emit('write', event.keyCode, $textarea.prop('selectionStart'), updateTime);
});

$textarea.bind('keydown', function(event) {
  if (event.keyCode in CURSOR_KEYCODES) {
    event.preventDefault();
    socket.emit('cursor', event.keyCode, $textarea.prop('selectionStart'), updateTime);
  }
});

socket.on('write', function(data) {
  updateTime = d.getTime();
  $textarea.val(data.content);
  setCaretToPos($textarea, data.me.cursorOffset);
  // console.log('data.me.username: %s', data.me.username);
  // data.friends.forEach(function (friend) {
  //   console.log('friend.username: %s', friend.username);
  // });
});
