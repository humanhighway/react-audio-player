export default {
	getSongName(song) {
		if (song.hasOwnProperty('name')) {
			return song.name;
		} else {
			const urlSplit = song.url.split('/');
			return urlSplit[urlSplit.length - 1];
		}
	}
};
