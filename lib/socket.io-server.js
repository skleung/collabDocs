// one clients hash per room
var clients = {};

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

function updateClients(doc, clients) {
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
}

module.exports = function(io, doc, revs) {
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
      updateClients(doc, clients);
    });

    socket.on('backspace', function(keyCode, cursorOffset, updateTime) {
      doc.content = [doc.content.slice(0, cursorOffset - 1), doc.content.slice(cursorOffset)].join('');
      for (myClientKey in clients) {
        if (clients[myClientKey]['about']['cursorOffset'] >= cursorOffset) {
          clients[myClientKey]['about']['cursorOffset']--;
        }
      }
      clients[socket.id]['about']['cursorOffset'] = cursorOffset - 1;

      updateClients(doc, clients);
    });

    socket.on('delete', function(keyCode, cursorOffset, updateTime) {
      doc.content = [doc.content.slice(0, cursorOffset), doc.content.slice(cursorOffset + 1)].join('');
      for (myClientKey in clients) {
        if (clients[myClientKey]['about']['cursorOffset'] > cursorOffset) {
          clients[myClientKey]['about']['cursorOffset']--;
        }
      }
      clients[socket.id]['about']['cursorOffset'] = cursorOffset;

      updateClients(doc, clients);
    });

    socket.on('insert', function(keyCode, cursorOffset, updateTime) {
      doc.content = [doc.content.slice(0, cursorOffset), String.fromCharCode(keyCode), doc.content.slice(cursorOffset)].join('');
      for (myClientKey in clients) {
        if (clients[myClientKey]['about']['cursorOffset'] > cursorOffset) {
          clients[myClientKey]['about']['cursorOffset']++;
        }
      }
      clients[socket.id]['about']['cursorOffset'] = cursorOffset + 1;

      updateClients(doc, clients);
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

      updateClients(doc, clients);
    });

    socket.on('disconnect', function() {
      console.log('disconnection!');
      delete clients[socket.id];
    });
  });
}
