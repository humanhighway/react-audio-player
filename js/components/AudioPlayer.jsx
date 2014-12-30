var React = require('react/addons');
var ButtonPanel = require("./ButtonPanel.jsx");
var ProgressBar = require("./ProgressBar.jsx");
var VolumeBar = require("./VolumeBar.jsx");
var TimeLabel = require("./TimeLabel.jsx");
var NameLabel = require("./NameLabel.jsx");
var SongList = require("./SongList.jsx");

var SongFormatterMixin = require("./../mixins/SongFormatterMixin");

var Howl = require('howler').Howl;

module.exports = React.createClass({

	mixins: [ SongFormatterMixin ],

	getDefaultProps: function() {
		return { songs:[] };
	},

	getInitialState:function() {
		return {
			isPlaying: false,
			isPause: false,
			isLoading: false,
			currentSongIndex: -1,
			volume: 0.5
		};
	},

	componentWillMount: function() {

		if (this.props.dataUrl) {
			$.ajax({
			  dataType: "json",
			  url: this.props.dataUrl,
			  success: function(response) {
			  	this.setState({ 
			  									songs: response.songs,
			  									currentSongIndex: 0
			  							 });
			  }.bind(this)
			});
		} else if (this.props.songs) {
			this.setState({ 
											songs: this.props.songs,
											currentSongIndex: 0 
										});
		} else {
			throw "no data";
		}
	},

	componentDidUpdate: function(prevProps, prevState, prevContext) {
		if (this.state.isPlaying && this.state.currentSongIndex != prevState.currentSongIndex) {
			this.initSoundObject();
		}
	},

	render: function() {
		var songCount = this.songCount();
		var percent = 0;
		if (this.state.seek && this.state.duration) {
			percent = this.state.seek / this.state.duration;
		}

		var topComponents = [
			<ButtonPanel isPlaying={this.state.isPlaying} isPause={this.state.isPause}
					isLoading={this.state.isLoading}
					currentSongIndex={this.state.currentSongIndex} songCount={songCount}
					onPlayBtnClick={this.onPlayBtnClick} onPauseBtnClick={this.onPauseBtnClick}
					onPrevBtnClick={this.onPrevBtnClick} onNextBtnClick={this.onNextBtnClick} />,
			<ProgressBar shorter={songCount > 1} percent={percent} seekTo={this.seekTo} />,
			<VolumeBar volume={this.state.volume} adjustVolumeTo={this.adjustVolumeTo} />
		];

		var songName;
		if (this.songCount() > 1) {
			topComponents.push(
				<SongList ref="songList" className="pull-left" 
						songs={this.state.songs}
						currentSongIndex={this.state.currentSongIndex} 
						isPlaying={this.state.isPlaying} isPause={this.state.isPause} 
						onSongItemClick={this.onSongItemClick}/>
			);
			songName = (this.state.currentSongIndex + 1) + ". " + this.getCurrentSongName();
		} else {
			songName = this.getCurrentSongName();
		}

		return (
			<div className="audio-player">		
				<div className="clearfix">
					{ topComponents }
				</div>
				
				<div className="audio-desc-container clearfix">
					<NameLabel name={songName} />
					<TimeLabel seek={this.state.seek} duration={this.state.duration}/>
				</div>

			</div>
		);
	},

	onPlayBtnClick: function() {
		if (this.state.isPlaying && !this.state.isPause) {
			return;
		};
		this.play();
	},

	onPauseBtnClick: function() {
		var isPause = !this.state.isPause;
		this.setState({ isPause: isPause });
		isPause ? this.pause() : this._play();
	},

	onPrevBtnClick: function() {
		this.prev();
	},

	onNextBtnClick: function() {
		this.next();
	},

 	onSongItemClick: function(songIndex) {
 		// handle pause/playing state.
 		if (this.state.currentSongIndex == songIndex) {
 			if (this.state.isPause) {
 				this.onPauseBtnClick();
 				this.refs.songList.hideDropdownMenu();
 			} else if (!this.state.isPlaying) {
 				this.onPlayBtnClick();
 				this.refs.songList.hideDropdownMenu();
 			}
 			return;
 		}

 		// handle index change state, it must change to play.
		this.stop();
		this.clearSoundObject();
		this.setState({ 
										currentSongIndex: songIndex,
										duration: 0,
										isPlaying: true,
										isPause: false
									});
 		this.refs.songList.hideDropdownMenu();

 	},

	play: function() {
		
		this.setState({ isPlaying: true, isPause: false });

		if (!this.howler) {
			this.initSoundObject();
		} else {
			var songUrl = this.state.songs[this.state.currentSongIndex].url;
			if (songUrl != this.howler._src) {
				this.initSoundObject();
			} else {
				this._play();
			}
		}
	},

	initSoundObject: function() {
		this.clearSoundObject();
		this.setState({ isLoading: true });

		var song = this.state.songs[this.state.currentSongIndex];
		this.howler = new Howl({
			src: song.url,
			volume: this.state.volume,
			onload: this.initSoundObjectCompleted,
			onend: this.playEnd
		});
	},

	clearSoundObject: function() {
 		if (this.howler) {
			this.howler.stop();
			this.howler = null;
		}
 	},

	initSoundObjectCompleted: function() {
		this._play();
		this.setState({ 
			duration: this.howler.duration(),
			isLoading: false
		});
	},

	_play: function() {
		this.howler.play();
		this.stopUpdateCurrentDuration();
		this.updateCurrentDuration();
		this.interval = setInterval(this.updateCurrentDuration, 1000);
	},

	playEnd: function() {
		if(this.state.currentSongIndex == this.state.songs.length - 1) {
			this.stop();
		} else {
			this.next();
		}
	},

	stop: function() {
		this.stopUpdateCurrentDuration();
		this.setState({ seek: 0, isPlaying: false });
	},

	pause: function() {
		this.howler.pause();
		this.stopUpdateCurrentDuration();
	},

	prev: function() {
		if (this.state.seek > 1 || this.state.currentSongIndex == 0) {
			this.seekTo(0);
		} else {
			this.updateSongIndex(this.state.currentSongIndex - 1);
		}
	},

	next: function() {
		this.updateSongIndex(this.state.currentSongIndex + 1);
	},

	updateSongIndex: function(index) {
		this.setState({ 
										currentSongIndex: index,
										duration: 0
									});
		if (this.state.isPause) {
			this.stop();
			this.clearSoundObject();
		} else {
			this.stopUpdateCurrentDuration();
		}
	},

	updateCurrentDuration: function() {
		this.setState({ seek: this.howler.seek() });
	},

	stopUpdateCurrentDuration: function() {
		clearInterval(this.interval);
	},

	seekTo: function(percent) {
		var seek = this.state.duration * percent;
		this.howler.seek(seek);
		this.setState({ seek: seek });
	},

	adjustVolumeTo: function(percent) {
		this.setState({ volume: percent });
		if (this.howler) {
			this.howler.volume(percent);
		}
	},

	songCount: function() {
		return this.state.songs ? this.state.songs.length : 0;
	},

	getCurrentSongName: function() {
		if (this.state.currentSongIndex < 0) {
			return "";
		}
		var song = this.state.songs[this.state.currentSongIndex];
		return this.getSongName(song);
 	}

});
