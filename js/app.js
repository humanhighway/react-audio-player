import React from 'react';
import ReactDOM from 'react-dom';
import AudioPlayer from './components/AudioPlayer';

require('./../sass/app.scss');

const songs = [
	{ url: 'assets/stop.mp3' },
];

ReactDOM.render(
  <AudioPlayer songs={songs} />,
  document.getElementById('audio-player1')
);

ReactDOM.render(
  <AudioPlayer dataUrl="./assets/songs.json" />,
	document.getElementById('audio-player2')
);

