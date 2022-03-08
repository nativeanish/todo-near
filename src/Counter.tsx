import React, { useEffect, useState } from "react";
import * as near from "./utils/init";
import { AppCtx } from "./context";
const Counter = () => {
	const holder = React.useContext(AppCtx);
	const [account, setAccount] = useState<String | false>(false);
	const check = async () => {
		const token = await near.checkSign();
		if (token) {
			setAccount(token);
		}
	};
	const signin = async () => {
		await near.signin();
	};
	const signout = async () => {
		await near.sign_out();
		setAccount(false);
	};
	useEffect(() => {
		check().then().catch();
		make_state();
	}, [account]);
	const [task, setTask] = useState<Array<{
		id: number;
		task: string;
		account: string;
		done: Boolean;
	}> | null>(null);
	const make_state = () => {
		holder.states
			.then((e) => {
				console.log("fasd");
				console.log(`Hey ${e}`);
				setTask(e);
			})
			.catch((err) => console.log(err));
	};
	const add = (e: React.SyntheticEvent) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			text: { value: string };
		};
		holder.dispatch({
			type: "insert",
			payload: target.text.value as string,
		});
	};
	return (
		<>
			{account ? (
				<>
					<h1>Hello {account}</h1>
					<button onClick={signout}>
						logout
					</button>
					<h1>
						Add Task
						<form onSubmit={add}>
							<input
								type="text"
								name="text"
							/>
							<button type="submit">
								+Add
							</button>
						</form>
					</h1>
					<br />
					{task
						? task.map((e, k) => {
								return !e[3] ? (
									<h1
										key={
											k
										}
									>
										{
											e[1]
										}{" "}
										{e[2] ==
										account ? (
											<button
												onClick={() =>
													holder.dispatch(
														{
															type: "done",
															payload: e[0],
														}
													)
												}
											>
												Done
											</button>
										) : null}
									</h1>
								) : (
									<h1
										key={
											k
										}
									>
										<del>
											{
												e[1]
											}
										</del>
									</h1>
								);
						  })
						: null}
				</>
			) : (
				<button onClick={signin}>lOGIN</button>
			)}
		</>
	);
};
export default Counter;
