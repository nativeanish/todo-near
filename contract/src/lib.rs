use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, near_bindgen, AccountId};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Todo {
    state: UnorderedMap<u64, (String, AccountId, bool)>,
}

#[near_bindgen]
impl Todo {
    pub fn insert(&mut self, task: String) -> Vec<(u64, String, AccountId, bool)> {
        let _temp = (task, env::signer_account_id(), false);
        let len = self.state.len() + 1;
        self.state.insert(&len, &_temp);
        return self.get();
    }

    pub fn get(&self) -> Vec<(u64, String, AccountId, bool)> {
        let mut _temp_vec: Vec<(u64, String, AccountId, bool)> = vec![];
        for (a, b) in self.state.iter() {
            _temp_vec.push((a, b.0, b.1, b.2));
        }
        return _temp_vec;
    }

    pub fn done(&mut self, index: u64) -> Vec<(u64, String, AccountId, bool)> {
        let _dec = self.state.get(&index).unwrap();
        if _dec.1 == env::signer_account_id() {
            self.state.remove(&index);
            let take = (_dec.0, _dec.1, true);
            self.state.insert(&index, &take);
        }
        return self.get();
    }
}
impl Default for Todo {
    fn default() -> Self {
        Self {
            state: UnorderedMap::new(b"0"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};
    fn get_context(predecessor_account_id: String, storage_usage: u64) -> VMContext {
        VMContext {
            current_account_id: "todo".to_string(),
            signer_account_id: "anish.testnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id,
            input: vec![],
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view: false,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }
    #[test]
    fn todo() {
        let context = get_context("anish.testnet".to_string(), 0);
        testing_env!(context);
        let mut contract = Todo::default();
        contract.insert("Doing Homework".to_string());
        assert_eq!(
            contract.get()[0],
            (
                1,
                "Doing Homework".to_string(),
                "anish.testnet".to_string(),
                false
            ),
        );
        contract.done(1);
        assert_eq!(
            contract.get()[0],
            (
                1,
                "Doing Homework".to_string(),
                "anish.testnet".to_string(),
                true
            ),
        );
    }
}
