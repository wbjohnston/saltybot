export enum STATUS {
    Open = 'open',
    Locked = 'locked'
}

export class SaltyBet {
    protected status: STATUS;

    public constructor(status: STATUS) {
        this.status = status
    }

    public setStatus(status: STATUS): this {
        this.status = status;

        return this;
    }

    public getStatus(): STATUS {
        return this.status;
    }
}