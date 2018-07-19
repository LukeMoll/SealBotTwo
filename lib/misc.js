module.exports = {

    /**
     * Converts a duration of seconds into a more meaningful object
     * @param {number} second: duration of seconds
     * @returns {object}: seconds broken down into weeks, days, hours, minutes, and remaining seconds.
     */
    secondsToPeriod: function (seconds) {
        var num = ~~seconds;
        var s = num % 60;
        num = ~~(num / 60);
        var m = num % 60;
        num = ~~(num / 60);
        var h = num % 60;
        num = ~~(num / 60);
        var d = num % 24;
        num = ~~(num / 24);
        var w = num % 7;
        num = ~~(num / 7);
    
        return {
          seconds: s,
          minutes: m,
          hours: h,
          days: d,
          weeks: w
        };
    }

}