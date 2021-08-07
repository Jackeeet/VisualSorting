export class FunctionTimer {

    constructor(timedFunction) {
        if (!timedFunction) {
            this.timedFunction = () => {};
        }

        this.timedFunction = timedFunction;
        this.#elapsed = 0;
        this.inactiveTime = 0;
        this.#inactivePeriodStart = null;
    }

    get elapsed() {
        return this._elapsed;
    }

    set #elapsed(value) {
        this._elapsed = value; 
    }

    get timedFunction() {
        return this._timedFunction;
    }

    set timedFunction(timedFunction) {
        this._timedFunction = timedFunction;
    }

    get inactivePeriodStart() {
        return this._inactivePeriodStart;
    }

    set #inactivePeriodStart(value) {
        this._inactivePeriodStart = value;
    }

    get inactiveTime() {
        return this._inactiveTime;
    }

    set inactiveTime(value) {
        this._inactiveTime = value;
    }

    reset() {
        this.#elapsed = 0;
        this.inactiveTime = 0;
    }

    async run() {
        document.addEventListener(
            "visibilitychange", 
            () => { FunctionTimer.visibilityListener(this) });

        let start = Date.now();
        await this._timedFunction();
        let end = Date.now();
        this._elapsed = this.#calculateActiveTime(start, end);
    }

    #calculateActiveTime(start, end) {
        return end - start - this.inactiveTime;
    }

    formatElapsedTime() {
        let minutes = Math.floor(this._elapsed / 60000);
        let seconds = ((this._elapsed % 60000) / 1000).toFixed(0);
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }

        let formattedMinutes = FunctionTimer.#formatToTwoDigits(minutes);
        let formattedSeconds = FunctionTimer.#formatToTwoDigits(seconds);
        let milliseconds = this._elapsed % 1000;
        return `${formattedMinutes}:${formattedSeconds}.${milliseconds}`;
    }

    static #formatToTwoDigits(time) {
        return time < 10 ? "0" + time : time;
    }

    static visibilityListener(functionTimer) {
        switch(document.visibilityState) {
            case "hidden":
                functionTimer._inactivePeriodStart = Date.now();
                break;
            case "visible":
                functionTimer._inactiveTime += Date.now() - functionTimer._inactivePeriodStart; 
                functionTimer._inactivePeriodStart = 0;
                break;
        }
    }
}
