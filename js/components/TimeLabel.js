import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import TimeFormatterMixin from './../mixins/TimeFormatterMixin';

export default class TimeLabel extends Component {

	render() {
		const classes = 'audio-time pull-right';
		if (this.props.seek === undefined || !this.props.duration) {
			return (
				<span></span>
				// return (<span>&nbsp;</span>);
				// <span className={classes}>00:00 / 00:00</span>
			);
		}

		const seek = this.secondsToTime(this.props.seek);
		const duration = this.secondsToTime(this.props.duration);
		return (
			<span className={classes}>{seek} / {duration}</span>
		);
	}

}

reactMixin(TimeLabel.prototype, TimeFormatterMixin);