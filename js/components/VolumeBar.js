import React, { Component } from 'react';
import classnames from 'classnames';
import { Button, Glyphicon } from 'react-bootstrap';

let uniquleId = 0;

export default class VolumeBar extends Component {

	constructor() {
		super();
		this.state = { hide: true };
		this.toggle = this.toggle.bind(this);
		this.adjustVolumeTo = this.adjustVolumeTo.bind(this);
		this.volumeToMax = this.volumeToMax.bind(this);
		this.volumeToMin = this.volumeToMin.bind(this);
	}

	render() {
		const percent = this.props.volume * 100;
		const style = { top: `${ 100 - percent }%` };
		const toggleIcon = this.props.volume === 0 ? 'volume-off' : 'volume-up';

		const audioVolumeBarClasses = classnames(
			'audio-volume-bar',
  		{ 'audio-volume-bar-hide': this.state.hide })
		;

		const audioVolumeBarContainerId = 'audioVolumeBarContainerId' + ++uniquleId;
		const toggleBtnId = 'toggleBtn' + ++uniquleId;

		return (
			<div id={audioVolumeBarContainerId} ref="audioVolumeBarContainer" className="audio-volume-bar-container">
				<Button id={toggleBtnId} ref="toggleButton" bsSize="small" onClick={this.toggle}>
					<Glyphicon glyph={toggleIcon}/>
				</Button>
				<div className={audioVolumeBarClasses}>
					<div className="audio-volume-min-max" onClick={this.volumeToMax}>
						<Glyphicon glyph="volume-up" />
					</div>
					<div ref="audioVolumePercentContainer" className="audio-volume-percent-container" onClick={this.adjustVolumeTo}>
						<div className="audio-volume-percent" style={style}></div>
					</div>
					<div className="audio-volume-min-max" onClick={this.volumeToMin}>
						<Glyphicon glyph="volume-off" />
					</div>
				</div>
			</div>
		);
	}

	toggle() {

		// when bar open, do nothing if toggle btn press again
		if (this.isToggleBtnPress) {
			this.isToggleBtnPress = false;
			return;
		}

		const hide = !this.state.hide;
		if (hide) return;

		this.setState({ hide: false });
		this.globalClickHandler = $(document).mousedown(e => {
			const reactId = this.refs.audioVolumeBarContainer.props.id;
			const toggleBtnReactId = this.refs.toggleButton.props.id;
			let node = e.target;
			while(node != null) {
				const nodeReactId =  $(node).context.id;
				if (reactId === nodeReactId) {
					return;
				} else if (toggleBtnReactId === nodeReactId) {
					this.isToggleBtnPress = true;
					break;
				}
				node = node.parentNode;
			}
			this.globalClickHandler.unbind();
			this.globalClickHandler = null;
			this.setState({ hide: true });
		}.bind(this));
	}

	adjustVolumeTo(e) {
		const container = $(this.refs.audioVolumePercentContainer);
		const containerStartY = container.offset().top;
		let percent = (e.clientY - containerStartY) / container.height();
		percent = 1 - percent;
		this.props.adjustVolumeTo(percent);
	}

	volumeToMax() {
		this.props.adjustVolumeTo(1);
	}

	volumeToMin() {
		this.props.adjustVolumeTo(0);
	}
}
