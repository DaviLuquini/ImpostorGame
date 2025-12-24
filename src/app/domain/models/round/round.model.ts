export class Round {
    number: number;
    startedAt: Date;
    eliminatedPlayerId: string | null = null;

    constructor(number: number) {
        this.number = number;
        this.startedAt = new Date();
    }

    setElimination(playerId: string): void {
        this.eliminatedPlayerId = playerId;
    }
}
