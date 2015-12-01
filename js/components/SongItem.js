import React, { Component } from 'react';
import classnames from 'classnames';
import { MenuItem, Glyphicon } from 'react-bootstrap';

export default class SongItem extends Component {

	render() {
		const { currentSongIndex, eventKey, isPlaying, name, onSongItemClick } = this.props;
		const isSelected = currentSongIndex === eventKey;
		const components = [];

		if ( isSelected && isPlaying ) {
			components[0] = <Glyphicon key="0" className="audio-song-item-icon active" glyph="play" />;
		} else {
			components[0] = <span key="0" className="audio-song-item-not-selected"></span>;
		}

		components[1] = <span key="1" className="audio-song-item-label" >{name}</span>;

		const classes = classnames('audio-song-item', {'active': isSelected });

		return (
			<MenuItem className={classes} eventKey={eventKey} onClick={onSongItemClick} >
				{ components }
			</MenuItem>
		);
	}
}
