import { done, insert } from "../utils/init";
export type ActionType =
	| { type: "done"; payload: number }
	| { type: "insert"; payload: string };
export async function reducer(
	state: Promise<
		Array<{
			id: number;
			task: string;
			account: string;
			done: Boolean;
		}>
	>,
	action: ActionType
) {
	switch (action.type) {
		case "insert":
			return await insert(action.payload);
		case "done":
			return await done(action.payload);
		default:
			return state;
	}
}
