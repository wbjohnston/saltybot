export enum Status {
    Open = 'open',
    Locked = 'locked'
}

export class SaltyBet {
    private status: Status;
    private playerOneTotalBets: number;
    private playerTwoTotalBets: number;

    public constructor(status: Status, playerOneTotalBets: number, playerTwoTotalBets: number) {
        this.status = status;
        this.playerOneTotalBets = playerOneTotalBets;
        this.playerTwoTotalBets = playerTwoTotalBets;
    }

    public setStatus(status: Status): this {
        this.status = status;

        return this;
    }

    public getStatus(): Status {
        return this.status;
    }

    public getPlayerOneTotalBets(): number {
        return this.playerOneTotalBets;
    }

    public setPlayerOneTotalBets(total: number): this {
        this.playerOneTotalBets = total;

        return this;
    }

    public getPlayerTwoTotalBets(): number {
        return this.playerTwoTotalBets;
    }

    public setPlayerTwoTotalBets(total: number): this {
        this.playerTwoTotalBets = total;

        return this;
    }
}
