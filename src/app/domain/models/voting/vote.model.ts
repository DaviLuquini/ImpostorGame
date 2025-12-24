export class Vote {
    id: string;
    voterId: string;
    targetId: string | null;
    timestamp: Date;

    constructor(voterId: string, targetId: string | null = null) {
        this.id = crypto.randomUUID();
        this.voterId = voterId;
        this.targetId = targetId;
        this.timestamp = new Date();
    }

    isSkip(): boolean {
        return this.targetId === null;
    }
}
