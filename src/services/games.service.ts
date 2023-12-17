import Scoreboard from "../models/scoreboard";

export default class GamesService {

    public straightDetected(dices: Array<number>): boolean {
        dices.sort();
        return !dices.some(
            (dice: any, i: number) => {
                if(i==0)return;
                if(dices[i - 1] + 1 != dice)
                    return true;
            }
        )
    }

    public fullHouseDetected(dices: Array<number>): boolean {
        dices.sort();

        let firstRepeatedDices = new Set(dices.slice(0,2));
        let secondRepeatedDices = new Set(dices.slice(2,5));
        if(firstRepeatedDices.size == 1 && secondRepeatedDices.size == 1) return true;

        firstRepeatedDices = new Set(dices.slice(0,3));
        secondRepeatedDices = new Set(dices.slice(3,5));
        return firstRepeatedDices.size == 1 && secondRepeatedDices.size == 1;
    }

    public pokerDetected(dices: Array<number>): boolean {
        let repeatedDices = new Set(dices);
        return repeatedDices.size == 2;
    }

    public largeDetected(dices: Array<number>): boolean {
        let repeatedDices = new Set(dices);
        return repeatedDices.size == 1;
    }


    getResults(dicesValue: Array<number>, launchesMade: number, scoreboard: Scoreboard) {
        const results: any[] = [];

        let resultName = '';
        let resultValue = 0;
        let resultPosition = 0;
        if(this.straightDetected(dicesValue) && scoreboard.straight == null){
            resultName = 'Escalera';
            resultValue = 20;
            resultPosition = 7;
            if(launchesMade == 1){
                resultName += ' de mano';
                resultValue += 5;
            }
            results.push({resultName, resultValue, resultPosition});
        }else if(this.fullHouseDetected(dicesValue) && scoreboard.fullHouse == null){
            resultName = 'Full House';
            resultValue = 30;
            resultPosition = 8;
            if(launchesMade == 1){
                resultName += ' de mano';
                resultValue += 5;
            }
            results.push({resultName, resultValue, resultPosition});
        }else if(this.pokerDetected(dicesValue) && scoreboard.poker == null){
            resultName = 'Poker';
            resultValue = 40;
            resultPosition = 9;
            if(launchesMade == 1){
                resultName += ' de mano';
                resultValue += 5;
            }
            results.push({resultName, resultValue, resultPosition});
        }else if(this.largeDetected(dicesValue) && scoreboard.large == null){
            resultName = 'La Grande';
            resultValue = 50;
            resultPosition = 10;
            if(launchesMade == 1){
                resultName += ' de mano';
                resultValue += 5;
            }
            results.push({resultName, resultValue, resultPosition});
        }else{
            if(scoreboard.straight == null)
                results.push({
                    resultName: 'Escalera',
                    resultValue: 0,
                    resultPosition: 7
                });
            if(scoreboard.fullHouse == null)
                results.push({
                    resultName: 'Full House ',
                    resultValue: 0,
                    resultPosition: 8
                });
            if(scoreboard.poker == null)
                results.push({
                    resultName: 'Poker',
                    resultValue: 0,
                    resultPosition: 9
                });
            if(scoreboard.large == null)
                results.push({
                    resultName: 'La Grande',
                    resultValue: 0,
                    resultPosition: 10
                });
        }

        let value = dicesValue.filter((dice: number) => dice == 1).length;
        if(scoreboard.one == null)
            results.push({
                resultName: 'Balas',
                resultValue: value,
                resultPosition: 1
            })
        value = dicesValue.filter((dice: number) => dice == 2).length * 2;
        if(scoreboard.two == null)
            results.push({
                resultName: 'Tontos',
                resultValue: value,
                resultPosition: 2
            })
        value = dicesValue.filter((dice: number) => dice == 3).length * 3;
        if(scoreboard.three == null)
            results.push({
                resultName: 'Trenes',
                resultValue: value,
                resultPosition: 3
            })
        value = dicesValue.filter((dice: number) => dice == 4).length * 4;
        if(scoreboard.four == null)
            results.push({
                resultName: 'Cuadras',
                resultValue: value,
                resultPosition: 4
            })
        value = dicesValue.filter((dice: number) => dice == 5).length * 5;
        if(scoreboard.five == null)
            results.push({
                resultName: 'Quinas',
                resultValue: value,
                resultPosition: 5
            })
        value = dicesValue.filter((dice: number) => dice == 6).length * 6;
        if(scoreboard.six == null)
            results.push({
                resultName: 'Senas',
                resultValue: value,
                resultPosition: 6
            })

        return results;
    }
}