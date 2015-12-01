export default {

  secondsToTime(secs) {
    secs = Math.round(secs);
    const hours = Math.floor(secs / (60 * 60));

    const divisor_for_minutes = secs % (60 * 60);
    const minutes = Math.floor(divisor_for_minutes / 60);

    const divisor_for_seconds = divisor_for_minutes % 60;
    const seconds = Math.ceil(divisor_for_seconds);

    let time = '';

    if (hours > 0) time += `${hours}:`;
    time += `${this.timeUnitFormat(minutes)}:`;
    time += this.timeUnitFormat(seconds);

    return time;
  },

  timeUnitFormat(time) {
    if (time < 1) {
      return '00';
    } else if (time < 10) {
      return `0${time}`;
    } else {
      return time;
    }
  },
};