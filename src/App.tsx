import React from "react";
import Counter from "./Counter";
import Context from "./context";
const App = () => (
	<Context>
		<Counter />
	</Context>
);
export default App;
