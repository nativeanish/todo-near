import * as nearapi from "near-api-js";
const get_near = async () => {
	const { keyStores } = nearapi;
	const keyStore = new keyStores.BrowserLocalStorageKeyStore();
	const config = {
		networkId: "testnet",
		keyStore, // optional if not signing transactions
		nodeUrl: "https://rpc.testnet.near.org",
		walletUrl: "https://wallet.testnet.near.org",
		helperUrl: "https://helper.testnet.near.org",
		explorerUrl: "https://explorer.testnet.near.org",
	};
	const near = await nearapi.connect(config);
	return near;
};

const get_wallet = async () => {
	const near = await get_near();
	const wallet = new nearapi.WalletConnection(near, null);
	return wallet;
};
const get_contract = async () => {
	const wallet = await get_wallet();
	const contract = new nearapi.Contract(
		wallet.account(),
		"dev-1646672493224-33813694626146",
		{
			viewMethods: ["get"],
			changeMethods: ["insert", "done"],
		}
	);
	return contract;
};
export const checkSign = async () => {
	const wallet = await get_wallet();
	if (wallet.isSignedIn()) {
		return wallet.getAccountId();
	} else {
		return false;
	}
};
export const signin = async () => {
	const wallet = await get_wallet();
	wallet.requestSignIn();
	return wallet.getAccountId();
};
export const sign_out = async () => {
	const wallet = await get_wallet();
	wallet.signOut();
};
export const get = async () => {
	const contract = await get_contract();
	const response = await contract.get();
	return response;
};

export const insert = async (tasks: string) => {
	const contract = await get_contract();
	await contract.insert({
		task: tasks,
	});
	return await get();
};

export const done = async (index: number) => {
	const contract = await get_contract();
	await contract.done({
		index: index,
	});
	return await get();
};
