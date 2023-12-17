export default class Scoreboard{
    constructor(
        public one: number | undefined = undefined,
        public two: number | undefined = undefined,
        public three: number | undefined = undefined,
        public four: number | undefined = undefined,
        public five: number | undefined = undefined,
        public six: number | undefined = undefined,
        public straight: number | undefined = undefined,
        public fullHouse: number | undefined = undefined,
        public poker: number | undefined = undefined,
        public large: number | undefined = undefined,
        public total = 0
    ) { }

    public apply(result: any) {
        this.total += result.resultValue;

        switch (result.resultPosition) {
            case 1:
                this.one = result.resultValue;
                break;
            case 2:
                this.two = result.resultValue;
                break;
            case 3:
                this.three = result.resultValue;
                break;
            case 4:
                this.four = result.resultValue;
                break;
            case 5:
                this.five = result.resultValue;
                break;
            case 6:
                this.six = result.resultValue;
                break;
            case 7:
                this.straight = result.resultValue;
                break;
            case 8:
                this.fullHouse = result.resultValue;
                break;
            case 9:
                this.poker = result.resultValue;
                break;
            case 10:
                this.large = result.resultValue;
                break;
        }
    }

    public isFull(): boolean {
        for (var key in this) {
            if (this[key] === undefined)
                return false;
        }
        return true;
    }
}