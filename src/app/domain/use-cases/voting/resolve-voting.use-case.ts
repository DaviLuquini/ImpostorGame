import { Vote } from '@domain/models/voting/vote.model';
import { IVoteResult } from '@domain/models/voting/vote-result.interface';

export class ResolveVotingUseCase {
    static execute(votes: Vote[]): IVoteResult {
        const voteCounts = this.countVotes(votes);
        const { eliminatedId, wasTie } = this.determineElimination(voteCounts);

        return {
            eliminatedPlayerId: eliminatedId,
            voteCounts,
            wasTie,
            totalVotes: votes.length
        };
    }

    private static countVotes(votes: Vote[]): Map<string, number> {
        const counts = new Map<string, number>();

        votes.forEach(vote => {
            if (vote.targetId) {
                const current = counts.get(vote.targetId) ?? 0;
                counts.set(vote.targetId, current + 1);
            }
        });

        return counts;
    }

    private static determineElimination(voteCounts: Map<string, number>): { eliminatedId: string | null; wasTie: boolean } {
        if (voteCounts.size === 0) {
            return { eliminatedId: null, wasTie: false };
        }

        let maxVotes = 0;
        let topCandidates: string[] = [];

        voteCounts.forEach((count, playerId) => {
            if (count > maxVotes) {
                maxVotes = count;
                topCandidates = [playerId];
            } else if (count === maxVotes) {
                topCandidates.push(playerId);
            }
        });

        if (topCandidates.length > 1) {
            return { eliminatedId: null, wasTie: true };
        }

        return { eliminatedId: topCandidates[0], wasTie: false };
    }
}
