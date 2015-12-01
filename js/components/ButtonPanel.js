import React, { Component } from 'react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

export default class ButtonPanel extends Component {

	constructor() {
		super();
		this.props = {
			currentSongIndex: 0,
			songCount: 0,
		};
	}

	render() {

		const { isPlaying, isPause, isLoading, songCount,
						onPlayBtnClick, onPauseBtnClick, currentSongIndex } = this.props;


		const isShowPlayBtn = !isPlaying || isPause;
		const buttonClickHandler = isShowPlayBtn ? this.props.onPlayBtnClick : this.props.onPauseBtnClick;
		let iconName;
		let iconClasses;

		if (isLoading) {
			iconName = 'refresh';
			iconClasses = 'audio-refresh-animate';
		} else {
			iconName = isShowPlayBtn ? 'play' : 'pause';
			iconClasses = '';
		}

		var buttonPanelClasses = 'audio-button-panel pull-left';

		if (songCount < 2) {
			return (
				<ButtonGroup className={buttonPanelClasses}>
					<Button bsSize="small" onClick={buttonClickHandler}>
						<Glyphicon className={iconClasses} glyph={iconName} />
					</Button>
				</ButtonGroup>
			);
		} else {

			const nextButtonClass = currentSongIndex === this.props.songCount - 1 ? 'disabled' : '';
			return (
				<ButtonGroup className={buttonPanelClasses}>
					<Button bsSize="small" onClick={this.props.onPrevBtnClick}>
						<Glyphicon glyph="step-backward" />
					</Button>
					<Button bsSize="small" onClick={buttonClickHandler}>
						<Glyphicon className={iconClasses} glyph={iconName} />
					</Button>
					<Button bsSize="small" onClick={this.props.onNextBtnClick} className={nextButtonClass}>
						<Glyphicon glyph="step-forward" />
					</Button>
				</ButtonGroup>
			);
		}
	}
}
