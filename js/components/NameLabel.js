var React = require('react/addons');
var Label = require('react-bootstrap/Label');

module.exports = React.createClass({
	render: function() {
		return (
			<span className="audio-name-label pull-left">{this.props.name}</span>
		);
	}
})