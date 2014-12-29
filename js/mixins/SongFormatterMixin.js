module.exports = {
	
	getSongName: function(song) {
		if (song.hasOwnProperty("name")) {
			return song.name;
		} else {
			var urlSplit = song.url.split("/");
			return urlSplit[urlSplit.length - 1];
		}
	}
}