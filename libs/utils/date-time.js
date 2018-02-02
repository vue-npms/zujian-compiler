class DateTime {

    static now() {
        return new DateTime();
    }

    constructor (time) {
        this.time = time || new Date()
    }
    get time () {
        return this._time
    }
    set time (value) {
        this._timeMap = {
            year: value.getFullYear(),
            month: value.getMonth() + 1,
            day: value.getDate(),
            hour: value.getHours(),
            minutes: value.getMinutes(),
            seconds: value.getSeconds()
        }
        for (let key in this._timeMap) {
            let value = this._timeMap[key]
            value = value < 10 ? `0${value}` : value
            this._timeMap[key] = `${value}`
        }
        this._time = value
    }
    toString (formatString = 'yyyy-MM-dd HH:mm:ss') {
        const { year, month, day, hour, minutes, seconds } = this._timeMap
        return formatString
            .replace(/y+/, ($0) => (year.substring(year.length, -$0.length)))
            .replace(/M+/, () => month)
            .replace(/d+/, () => day)
            .replace(/H+/, () => hour)
            .replace(/h+/, () => hour % 12 === 0 ? 12 : hour % 12)
            .replace(/m+/, () => minutes)
            .replace(/s+/, () => seconds)
    }
}

module.exports = DateTime