export class FunctionTimer {

    constructor(timedFunction) {
        if (!timedFunction) {
            this.timedFunction = () => {};
        }

        this.timedFunction = timedFunction;
        this.#elapsed = 0;
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

    reset() {
        this._elapsed = 0;
    }

    async run() {
        let start = Date.now();
        await this._timedFunction();
        let end = Date.now();
        this._elapsed = this.#calculateActiveTime(start, end);
    }

    #calculateActiveTime(start, end) {
        // todo track inactive periods 
        return end - start;
    }

    formatElapsedTime() {
        let minutes = Math.floor(this._elapsed / 60000);
        let seconds = ((this._elapsed % 60000) / 1000).toFixed(0);
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }

        let milliseconds = this._elapsed % 1000;
        return `${FunctionTimer.#formatToTwoDigits(minutes)}:${FunctionTimer.#formatToTwoDigits(seconds)}.${milliseconds}`;
    }

    static #formatToTwoDigits(time) {
        return time < 10 ? "0" + time : time;
    }
}
