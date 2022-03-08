import * as React from "react";
import { reducer } from "./reducer/fs";
import { get } from "./utils/init";
interface DispatchType1 {
	type: string;
	payload: number;
}
interface DispatchType2 {
	type: string;
	payload: string;
}
type DispatchType = DispatchType1 | DispatchType2;
interface AppContextInterface {
	states: Promise<
		Array<{
			id: number;
			task: string;
			account: string;
			done: Boolean;
		}>
	>;
	dispatch: (arg0: DispatchType) => void;
}
export const AppCtx = React.createContext<AppContextInterface | null>(null);
const Context = ({ children }: { children: React.ReactNode }) => {
	const [states, dispatch] = React.useReducer(reducer, get());
	return (
		<>
			<AppCtx.Provider value={{ states, dispatch }}>
				{children}
			</AppCtx.Provider>
		</>
	);
};
export default Context;
