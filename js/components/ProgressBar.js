import React, { Component } from 'react';
import classnames from 'classnames';

export default class ProgressBar extends Component {

	constructor() {
		super();
		this.props = { progressStyle : { marginLeft: '5px' }};
		this._seekTo = this._seekTo.bind(this);
	}

	_seekTo(e) {
		if (!this.props.percent) return;
		const container = $(this.refs.progressBar);
		const containerStartX = container.offset().left;
		let percent = (e.clientX - containerStartX) / container.width();
		percent = percent >= 1 ? 1 : percent;
		this.props.seekTo(percent);
	}

	render() {
		const { percent } = this.props;

		const _percent = percent * 100;
		const style = { width: `${_percent}%` };
		const classes = classnames(
  		'audio-progress-container',
  		'pull-left',
  		{ 'audio-progress-container-short-width': this.props.shorter});

		return (
			<div ref="progressBar" className={classes} style={this.props.progressStyle} onClick={this._seekTo}>
				<div className="audio-progress" style={style}></div>
			</div>
		);
	}

}
