module.exports = function(io, doc, revs) {
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

  var clients = {};

  io.on('connection', function(socket) {
    console.log('connection [socket.id: %s]', socket.id);

    clients[socket.id] = {
      'socket': socket,
      'about' : {
        'username': socket.id,
        'cursorOffset': 0
      }
    };

    socket.on('newClient', function() {
      // TODO: Refactor code into helper function (reused)
      // for-each loop through all sockets
      for (myClientKey in clients) {
        var friends = [];
        for (friendClientKey in clients) {
          if (myClientKey !== friendClientKey) {
            friends.push(clients[friendClientKey]['about']);
          }
        }
        // no need to include content for existing clients[myClientKey],
        // only include friends
        clients[myClientKey]['socket'].emit('edit', {
          content: doc.content,
          me: clients[myClientKey]['about'],
          friends: friends
        });
      };
    });
    // TODO: display existing content

    socket.on('backspace', function(keyCode, cursorOffset, updateTime) {
      doc.content = [doc.content.slice(0, cursorOffset - 1), doc.content.slice(cursorOffset)].join('');
      console.log(doc.content);
      // update cursorOffset for each user in doc.users with cursorOffsets gte
      // deleted character
      for (myClientKey in clients) {
        if (clients[myClientKey]['about']['cursorOffset'] >= cursorOffset) {
          clients[myClientKey]['about']['cursorOffset']--;
        }
      }
      clients[socket.id]['about']['cursorOffset'] = cursorOffset - 1;

      // TODO: Refactor code into helper function (reused)
      // for-each loop through all sockets
      for (myClientKey in clients) {
        var friends = [];
        for (friendClientKey in clients) {
          if (myClientKey !== friendClientKey) {
            friends.push(clients[friendClientKey]['about']);
          }
        }
        clients[myClientKey]['socket'].emit('edit', {
          content: doc.content,
          me: clients[myClientKey]['about'],
          friends: friends
        });
      };
    });

    socket.on('delete', function(keyCode, cursorOffset, updateTime) {
      doc.content = [doc.content.slice(0, cursorOffset), doc.content.slice(cursorOffset + 1)].join('');
      // update cursorOffset for each user in doc.users with cursorOffsets gte
      // deleted character
      for (myClientKey in clients) {
        if (clients[myClientKey]['about']['cursorOffset'] > cursorOffset) {
          clients[myClientKey]['about']['cursorOffset']--;
        }
      }
      clients[socket.id]['about']['cursorOffset'] = cursorOffset;

      // TODO: Refactor code into helper function (reused)
      // for-each loop through all sockets
      for (myClientKey in clients) {
        var friends = [];
        for (friendClientKey in clients) {
          if (myClientKey !== friendClientKey) {
            friends.push(clients[friendClientKey]['about']);
          }
        }
        clients[myClientKey]['socket'].emit('edit', {
          content: doc.content,
          me: clients[myClientKey]['about'],
          friends: friends
        });
      };

    });


    // currently client receives users array of user objects but cannot
    // determine which of the users to associate with itself
    // therefore, cannot determine which cursor to color black (own) versus
    // another color
    socket.on('insert', function(keyCode, cursorOffset, updateTime) {
      doc.content = [doc.content.slice(0, cursorOffset), String.fromCharCode(keyCode), doc.content.slice(cursorOffset)].join('');
      // update cursorOffset for each user in doc.users with cursorOffsets gt
      // inserted character
      for (myClientKey in clients) {
        if (clients[myClientKey]['about']['cursorOffset'] > cursorOffset) {
          clients[myClientKey]['about']['cursorOffset']++;
        }
      }
      clients[socket.id]['about']['cursorOffset'] = cursorOffset + 1;

      // TODO: Refactor code into helper function (reused)
      // for-each loop through all sockets
      for (myClientKey in clients) {
        var friends = [];
        for (friendClientKey in clients) {
          if (myClientKey !== friendClientKey) {
            friends.push(clients[friendClientKey]['about']);
          }
        }
        clients[myClientKey]['socket'].emit('edit', {
          content: doc.content,
          me: clients[myClientKey]['about'],
          friends: friends
        });
      };
    });

      // TODO: handle DELETE key

    socket.on('cursor', function(keyCode, cursorOffset, updateTime) {
      if (CURSOR_KEYCODES[keyCode] === 'page up') {
        // handle page up
      }
      if (CURSOR_KEYCODES[keyCode] === 'page down') {
        // handle page down
      }
      if (CURSOR_KEYCODES[keyCode] === 'end') {
        // handle page down
      }
      if (CURSOR_KEYCODES[keyCode] === 'home') {
        // handle page down
      }
      if (CURSOR_KEYCODES[keyCode] === 'left arrow') {
        // handle left arrow
        clients[socket.id]['about']['cursorOffset'] = clients[socket.id]['about']['cursorOffset'] > 0 ? cursorOffset - 1 : 0;
      }
      if (CURSOR_KEYCODES[keyCode] === 'up arrow') {
        // handle up arrow
      }
      if (CURSOR_KEYCODES[keyCode] === 'right arrow') {
        // handle right arrow
        clients[socket.id]['about']['cursorOffset'] = clients[socket.id]['about']['cursorOffset'] < doc.content.length ? cursorOffset + 1 : doc.content.length;
      }
      if (CURSOR_KEYCODES[keyCode] === 'down arrow') {
        // handle down arrow
      }

      // TODO: handle MOUSE click

      // TODO: Refactor code into helper function (reused)
      // for-each loop through all sockets
      for (myClientKey in clients) {
        var friends = [];
        for (friendClientKey in clients) {
          if (myClientKey !== friendClientKey) {
            friends.push(clients[friendClientKey]['about']);
          }
        }
        clients[myClientKey]['socket'].emit('edit', {
          content: doc.content,
          me: clients[myClientKey]['about'],
          friends: friends
        });
      };


    });

    socket.on('disconnect', function() {
      console.log('disconnection!');
      delete clients[socket.id];
    });
  });
}
