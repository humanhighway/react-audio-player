import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import ButtonPanel from './ButtonPanel';
import ProgressBar from './ProgressBar';
import VolumeBar from './VolumeBar';
import TimeLabel from './TimeLabel';
import NameLabel from './NameLabel';
import SongList from './SongList';
import SongFormatterMixin from './../mixins/SongFormatterMixin';
import { Howl } from 'howler';

export default class AudioPlayer extends Component {

	constructor() {
		super();
		this.props = { songs:[] };
		this.state = {
			isPlaying: false,
			isPause: false,
			isLoading: false,
			currentSongIndex: -1,
			volume: 0.5,
		};

		this._onPlayBtnClick = this._onPlayBtnClick.bind(this);
		this._onPauseBtnClick = this._onPauseBtnClick.bind(this);
		this._onPrevBtnClick = this._onPrevBtnClick.bind(this);
		this._onNextBtnClick = this._onNextBtnClick.bind(this);
		this._seekTo = this._seekTo.bind(this);
		this._updateCurrentDuration = this._updateCurrentDuration.bind(this);
		this._adjustVolumeTo = this._adjustVolumeTo.bind(this);
		this._initSoundObjectCompleted = this._initSoundObjectCompleted.bind(this);
		this._playEnd = this._playEnd.bind(this);
		this._onSongItemClick = this._onSongItemClick.bind(this);
	}

	componentWillMount() {

		const { dataUrl, songs } = this.props;

		if (dataUrl) {
			$.ajax({
			  dataType: 'json',
			  url: this.props.dataUrl,
			  success: response => {
			  	this.setState({
						songs: response.songs,
						currentSongIndex: 0,
					});
				},
			});
		} else if (this.props.songs) {
			this.setState({
				songs: this.props.songs,
				currentSongIndex: 0,
			});
		} else {
			throw Error('no data');
		}
	}

	componentDidUpdate(prevProps, prevState, prevContext) {
		const { isPlaying, currentSongIndex } = this.state;
		if (isPlaying && currentSongIndex != prevState.currentSongIndex) {
			this._initSoundObject();
		}
	}

	_onPlayBtnClick() {
		if (this.state.isPlaying && !this.state.isPause) {
			return;
		};
		this.play();
	}

	_onPauseBtnClick() {
		const isPause = !this.state.isPause;
		this.setState({ isPause: isPause });
		isPause ? this._pause() : this._play();
	}

	_onPrevBtnClick() {
		this._prev();
	}

	_onNextBtnClick() {
		this._next();
	}

 	_onSongItemClick(songIndex) {
 		const { currentSongIndex, isPause, isPlaying } = this.state;
 		// handle pause/playing state.
 		if (currentSongIndex == songIndex) {
 			if (isPause) {
 				this._onPauseBtnClick();
 			} else if (!isPlaying) {
 				this._onPlayBtnClick();
 			}
 			return;
 		}

 		// handle index change state, it must change to play.
		this._stop();
		this._clearSoundObject();
		this.setState({
										currentSongIndex: songIndex,
										duration: 0,
										isPlaying: true,
										isPause: false
									});
 	}

	play() {
		this.setState({ isPlaying: true, isPause: false });

		if (!this.howler) {
			this._initSoundObject();
		} else {
			const songUrl = this.state.songs[this.state.currentSongIndex].url;
			if (songUrl != this.howler._src) {
				this._initSoundObject();
			} else {
				this._play();
			}
		}
	}

	_initSoundObject() {
		this._clearSoundObject();
		this.setState({ isLoading: true });

		const song = this.state.songs[this.state.currentSongIndex];
		this.howler = new Howl({
			src: song.url,
			volume: this.state.volume,
			onload: this._initSoundObjectCompleted,
			onend: this._playEnd,
		});
	}

	_clearSoundObject() {
 		if (this.howler) {
			this.howler.stop();
			this.howler = null;
		}
 	}

	_initSoundObjectCompleted() {
		this._play();
		this.setState({
			duration: this.howler.duration(),
			isLoading: false,
		});
	}

	_play() {
		this.howler.play();
		this._stopUpdateCurrentDuration();
		this._updateCurrentDuration();
		this.interval = setInterval(this._updateCurrentDuration, 1000);
	}

	_playEnd() {
		if(this.state.currentSongIndex == this.state.songs.length - 1) {
			this._stop();
		} else {
			this._next();
		}
	}

	_stop() {
		this._stopUpdateCurrentDuration();
		this.setState({ seek: 0, isPlaying: false });
	}

	_pause() {
		this.howler.pause();
		this._stopUpdateCurrentDuration();
	}

	_prev() {
		if (this.state.seek > 1 || this.state.currentSongIndex == 0) {
			this._seekTo(0);
		} else {
			this._updateSongIndex(this.state.currentSongIndex - 1);
		}
	}

	_next() {
		this._updateSongIndex(this.state.currentSongIndex + 1);
	}

	_updateSongIndex(index) {
		this.setState({
			currentSongIndex: index,
			duration: 0,
		});
		if (this.state.isPause) {
			this._stop();
			this._clearSoundObject();
		} else {
			this._stopUpdateCurrentDuration();
		}
	}

	_updateCurrentDuration() {
		this.setState({ seek: this.howler.seek() });
	}

	_stopUpdateCurrentDuration() {
		clearInterval(this.interval);
	}

	_seekTo(percent) {
		const seek = this.state.duration * percent;
		this.howler.seek(seek);
		this.setState({ seek: seek });
	}

	_adjustVolumeTo(percent) {
		this.setState({ volume: percent });
		if (this.howler) {
			this.howler.volume(percent);
		}
	}

	songCount() {
		return this.state.songs ? this.state.songs.length : 0;
	}

	getCurrentSongName() {
		if (this.state.currentSongIndex < 0) return '';
		const song = this.state.songs[this.state.currentSongIndex];
		return this.getSongName(song);
 	}

	render() {
		const songCount = this.songCount();
		const { seek, duration, volume,
						isPlaying, isPause, isLoading, currentSongIndex } = this.state;

		let percent = 0;

		if (seek && duration) {
			percent = seek / duration;
		}

		const topComponents = [
			<ButtonPanel key="0"
					isPlaying={isPlaying} isPause={isPause}
					isLoading={isLoading}
					currentSongIndex={currentSongIndex} songCount={songCount}
					onPlayBtnClick={this._onPlayBtnClick} onPauseBtnClick={this._onPauseBtnClick}
					onPrevBtnClick={this._onPrevBtnClick} onNextBtnClick={this._onNextBtnClick} />,
			<ProgressBar key="1" shorter={songCount > 1} percent={percent} seekTo={this._seekTo} />,
			<VolumeBar key="2" volume={volume} adjustVolumeTo={this._adjustVolumeTo} />,
		];

		let songName;
		if (this.songCount() > 1) {
			topComponents.push(
				<SongList key="3" ref="songList" className="pull-left"
						songs={this.state.songs}
						currentSongIndex={currentSongIndex}
						isPlaying={isPlaying} isPause={isPause}
						onSongItemClick={this._onSongItemClick}/>
			);
			songName = `${this.state.currentSongIndex + 1} . ${this.getCurrentSongName()}`;
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
	}

}

reactMixin(AudioPlayer.prototype, SongFormatterMixin);