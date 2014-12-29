module.exports =  {

	secondsToTime: function(secs) {
		secs = Math.round(secs);
        var hours = Math.floor(secs / (60 * 60));

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        var time = "";

        if(hours > 0) {
          time += hours + ":";
        }

        time += this.timeUnitFormat(minutes) + ":";
        time += this.timeUnitFormat(seconds);
        return time; 
	},

    timeUnitFormat:function(time) {
        if (time < 1) {
            return "00";
        } else if (time < 10) {
            return "0" + time;
        } else {
            return time;
        }
    }
};