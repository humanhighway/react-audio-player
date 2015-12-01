import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import DropDownButton from 'react-bootstrap/lib/DropDownButton';
import SongItem from './SongItem';
import SongFormatterMixin from './../mixins/SongFormatterMixin';

export default class SongList extends Component {

	render() {

		const { currentSongIndex, isPlaying, isPause, onSongItemClick, songs } = this.props;
		const songCount = songs.length;

		let songItems = songs.map((song, index) => {

			let songName = this.getSongName(song);
			songName = songCount > 1 ? `${(index + 1)} . ${songName}` : songName;

			return <SongItem currentSongIndex={currentSongIndex}
							key={index}
							eventKey={index}
							name={songName}
							isPlaying={isPlaying}
							isPause={isPause}
							onSongItemClick={onSongItemClick.bind(null, index)} /> ;
		});

		return (
			<div className="audio-songs-list">
				<DropDownButton title="" id="nested-dropdown" ref="dropdownButton">
					{ songItems }
				</DropDownButton>
			</div>
		);
	}

}

reactMixin(SongList.prototype, SongFormatterMixin);
