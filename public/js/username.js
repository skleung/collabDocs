(function(window, document, undefined) {
  var socket = io();

  $(document).ready(function() {
    $('#myModal').modal('show');
  });

  $('#username-form').bind('submit', function(event) {
    event.preventDefault();
    console.log('Emitted "newUser" message for ' + $('#username-form [name=username-input]').val());
    socket.emit('newUser', { username: $('#username-form [name=username-input]').val() });
    $('#myModal').modal('hide');
  });
})(this, this.document);
