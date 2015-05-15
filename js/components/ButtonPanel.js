var React = require('react/addons');
var Button = require('react-bootstrap/Button');
var Glyphicon = require('react-bootstrap/Glyphicon');
var ButtonGroup = require('react-bootstrap/ButtonGroup');

module.exports = React.createClass({

	getDefaultProps: function() {
		return {
			currentSongIndex: 0,
			songCount: 0
		};
	},

	render: function() {

		var isPlaying = this.props.isPlaying;
		var isPause = this.props.isPause;
		var isLoading = this.props.isLoading;
		var isShowPlayBtn = !isPlaying || isPause;
		var buttonClickHandler = isShowPlayBtn ? this.props.onPlayBtnClick : this.props.onPauseBtnClick;
		var iconName;
		var iconClasses = "";

		if (isLoading) {
			iconName = "refresh";
			iconClasses = "audio-refresh-animate";
		} else {
			iconName = isShowPlayBtn ? "play" : "pause";
		}

		var songIndex = this.props.currentSongIndex;
		var buttonPanelClasses = "audio-button-panel pull-left";

		if (this.props.songCount < 2) {
			return (
				<ButtonGroup className={buttonPanelClasses}>
					<Button bsSize="small" onClick={buttonClickHandler}>
						<Glyphicon className={iconClasses} glyph={iconName} />
					</Button>
				</ButtonGroup>
			);
		} else {

			var nextButtonClass = songIndex == this.props.songCount - 1 ? "disabled" : "";
			
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
});