# Cooper Quiz

A live multiplayer quiz game: host on a big screen, players join from their phones with a game PIN or QR code.

## Use it
- **Host:** open the site → *Create or host a quiz* → build a quiz → **Host**. Put the lobby on a TV or projector.
- **Players:** open the same site on a phone, enter the PIN (or scan the QR code), pick a nickname.
- Keyboard: Space / Enter / → moves to the next screen while hosting.

## Features
- Multiple choice (2–4 answers), True/False, and multi-select (mark more than one correct answer)
- Image per question (auto-resized), timers from 5 seconds to 4 minutes
- Speed-based scoring (500–1,000 points) with answer streak bonus (up to +500)
- Live answer chart, scoreboard, podium, and CSV results download
- Original fantasy-style music and sound effects (folk flute, harp, war drums, horns) on the host screen, generated live in the browser (toggle with the Music button or M)
- Players can refresh or reconnect mid-game and keep their score
- Quizzes save in the host's browser (IndexedDB); Export/Import as `.json` to back up or move them

## How it works
Single static page (`index.html`). Players connect directly to the host browser over WebRTC via [PeerJS](https://peerjs.com); the free PeerJS cloud server only brokers the initial connection. No backend, no accounts. The host tab must stay open during a game.
