/* Person - BaseComponent*/
class Person {
    protected character: d3.Selection<any>;
    constructor(selector: string) {
        this.character = d3.select(selector);
        this.initMoney(0);
        this.registerHandlers();
    }

    registerHandlers() {
    }

    getMoney():number {
        return Number(this.character.text());
    }

    setMoney(deposit:number) {
        this.character.text(this.getMoney() + deposit);
    }

    initMoney(val:number) {
        this.character.text(val);
    }
}


/* Remitter & Rich - CharacterComponent*/
class Remitter extends Person {
    registerHandlers() {
        let w: any = window;
        w.saveMoney = this.saveMoney.bind(this);
        //w.beDecreasing = this.beDecreasing.bind(this);
    }

    saveMoney(deposit: number=1000) {
        this.setMoney(deposit)
        this.character.style({ 'color': '#fa0' });
    }

    beDecreasing() {
        const currentMoney: number = this.getMoney()
        this.character.transition().duration(2000)
            .tween("number", function() {
                let becomePoor = d3.interpolateRound(currentMoney, 0);
                let beingDark = d3.interpolateRgb('#fa0', '#ffffff');
                return function(t: number) {
                    // the `this` is a Node type.
                    this.textContent = becomePoor(t)
                    d3.select(this).style({ 'color': beingDark(t) });
                };
            });
    }
}


class Depositor extends Person {
    registerHandlers() {
        let w: any = window;
        //w.beIncreasing = this.beIncreasing.bind(this);
    }

    beIncreasing(newMoney:number) {
        const currentMoney: number = this.getMoney()
        const nextMoney: number = currentMoney + newMoney;
        const currentColor = this.character.style('color')
        this.character.transition().duration(2000)
            .tween("number", function() {
                let becomePoor = d3.interpolateRound(currentMoney, nextMoney);
                let beingDark = d3.interpolateRgb(currentColor, '#fa0');
                return function(t: number) {
                    // the `this` is a Node type.
                    this.textContent = becomePoor(t)
                    d3.select(this).style({ 'color': beingDark(t) });
                };
            });
    }
}


/* transfer */
class Transfer {
    public remitter: Remitter;
    public depositor: Depositor;
    constructor(remitterSelector: string, depositorSelector: string) {
        this.remitter = new Remitter(remitterSelector);
        this.depositor = new Depositor(depositorSelector);

        //////

        this.registerHandlers();
    }

    registerHandlers() {
        let w: any = window;
        w.doTransfer = this.doTransfer.bind(this);
    }

    doTransfer() {
        this.remitter.beDecreasing();
        this.depositor.beIncreasing(this.remitter.getMoney());
    }
}


/* activate */
const transfer = new Transfer(
    '.remitter > .money',
    '.depositor > .money'
)
transfer.remitter.saveMoney(2000);
