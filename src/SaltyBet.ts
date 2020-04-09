export enum Status {
    Open = 'open',
    Locked = 'locked'
}

export class SaltyBet {
    private previousStatus: Status;
    private playerOneTotalBets: number;
    private playerTwoTotalBets: number;

    public constructor(previousStatus: Status, playerOneTotalBets: number, playerTwoTotalBets: number) {
        this.previousStatus = previousStatus;
        this.playerOneTotalBets = playerOneTotalBets;
        this.playerTwoTotalBets = playerTwoTotalBets;
    }

    public setPreviousStatus(status: Status): this {
        this.previousStatus = status;

        return this;
    }

    public getPreviousStatus(): Status {
        return this.previousStatus;
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
