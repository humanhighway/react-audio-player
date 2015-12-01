import React, { Component } from 'react';
import { Label } from 'react-bootstrap';

export default class NameLabel extends Component {
	render() {
		return (
			<span className="audio-name-label pull-left">{this.props.name}</span>
		);
	}
}