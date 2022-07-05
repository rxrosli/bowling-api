export interface BowlingDAO {
	id: string;
	name: string;
	rolls: number[];
}

export let bowlingCollection: BowlingDAO[] = [];
