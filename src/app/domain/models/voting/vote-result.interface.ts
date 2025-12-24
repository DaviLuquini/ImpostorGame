export interface IVoteResult {
    eliminatedPlayerId: string | null;
    voteCounts: Map<string, number>;
    wasTie: boolean;
    totalVotes: number;
}
