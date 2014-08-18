module.exports = function(io, doc, revs) {
  io.on('connection', function(socket) {
    console.log('connection!');
    doc.users.push({ username: 'Anonymous Hippo', cursorOffset: 0 });


    // currently client receives users array of user objects but cannot
    // determine which of the users to associate with itself
    // therefore, cannot determine which cursor to color black (own) versus
    // another color
    socket.on('write', function(keyCode, cursorOffset, updateTime) {
      // console.log('string: %s\ncursor: %d\nupdateTime: %d\n', keyCode, cursor, updateTime);

      doc.content = [doc.content.slice(0, cursorOffset), String.fromCharCode(keyCode), doc.content.slice(cursorOffset)].join('');

      // update cursorOffset for each user in doc.users succeeding inserted
      // character
      for (user in doc.users) {
        if (user.cursorOffset > cursorOffset) { // || user that triggered keypress
          user.cursorOffset++;
        }
      }

      io.sockets.emit('write', { content: doc.content, users: doc.users });

      // TODO: handle DELETE key
    });

    socket.on('cursor', function(keyCode, cursorOffset, updateTime) {
      // console.log('keyCode: %d\ncursor: %d\nupdateTime: %d\n', keyCode, cursor, updateTime);

      // TODO: handle RIGHT arrow
      // TODO: handle UP arrow
      // TODO: handle LEFT arrow
      // TODO: handle DOWN arrow
      // TODO: handle MOUSE click

    });

    socket.on('disconnect', function() {
      console.log('disconnection!');
    });
  });
}
