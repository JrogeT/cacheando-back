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


    getResults(dicesValue: Array<number>, launchesMade: number) {
        const results: any[] = [];

        let resultName = '';
        let resultValue = 0;
        let resultPosition = 0;
        if(this.straightDetected(dicesValue)){
            resultName = 'Escalera';
            resultValue = 20;
            resultPosition = 7;
            if(launchesMade == 1){
                resultName += ' de mano';
                resultValue += 5;
            }
            results.push({resultName, resultValue, resultPosition});
        }else if(this.fullHouseDetected(dicesValue)){
            resultName = 'Full House';
            resultValue = 30;
            resultPosition = 8;
            if(launchesMade == 1){
                resultName += ' de mano';
                resultValue += 5;
            }
            results.push({resultName, resultValue, resultPosition});
        }else if(this.pokerDetected(dicesValue)){
            resultName = 'Poker';
            resultValue = 40;
            resultPosition = 9;
            if(launchesMade == 1){
                resultName += ' de mano';
                resultValue += 5;
            }
            results.push({resultName, resultValue, resultPosition});
        }else if(this.largeDetected(dicesValue)){
            resultName = 'La Grande';
            resultValue = 50;
            resultPosition = 10;
            if(launchesMade == 1){
                resultName += ' de mano';
                resultValue += 5;
            }
            results.push({resultName, resultValue, resultPosition});
        }else{
            results.push({
                resultName: 'Escalera',
                resultValue: 0,
                resultPosition: 7
            });
            results.push({
                resultName: 'Full House ',
                resultValue: 0,
                resultPosition: 8
            });
            results.push({
                resultName: 'Poker',
                resultValue: 0,
                resultPosition: 9
            });
            results.push({
                resultName: 'La Grande',
                resultValue: 0,
                resultPosition: 10
            });
        }

        let value = dicesValue.filter((dice: number) => dice == 1).length;
        results.push({
            resultName: 'Balas',
            resultValue: value,
            resultPosition: 1
        })
        value = dicesValue.filter((dice: number) => dice == 2).length * 2;
        results.push({
            resultName: 'Tontos',
            resultValue: value,
            resultPosition: 2
        })
        value = dicesValue.filter((dice: number) => dice == 3).length * 3;
        results.push({
            resultName: 'Trenes',
            resultValue: value,
            resultPosition: 3
        })
        value = dicesValue.filter((dice: number) => dice == 4).length * 4;
        results.push({
            resultName: 'Cuadras',
            resultValue: value,
            resultPosition: 4
        })
        value = dicesValue.filter((dice: number) => dice == 5).length * 5;
        results.push({
            resultName: 'Quinas',
            resultValue: value,
            resultPosition: 5
        })
        value = dicesValue.filter((dice: number) => dice == 6).length * 6;
        results.push({
            resultName: 'Senas',
            resultValue: value,
            resultPosition: 6
        })

        return results;
    }
}