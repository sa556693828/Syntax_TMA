import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  toNano,
} from "@ton/core";

export class Lottery implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromConfig(admin_addr: Address, code: Cell, workchain = 0) {
    const data = beginCell()
      .storeCoins(toNano("500"))
      .storeCoins(toNano("500"))
      .storeAddress(admin_addr)
      .storeInt(0, 64)
      .storeInt(0, 256)
      .endCell();
    const init = { code, data };
    const address = contractAddress(workchain, init);

    return new Lottery(address, init);
  }

  // deploy contract
  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendInternalMessage(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
  ) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendWithdrawal(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
  ) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(1002, 32).endCell(),
    });
  }

  async sendAddBalance(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
  ) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(1003, 32).endCell(),
    });
  }

  async getData(provider: ContractProvider) {
    const { stack } = await provider.get("get_info", []);
    let available_balance = stack.readNumber();
    let service_balance = stack.readNumber();
    let admin_addr_workchain = stack.readNumber();
    let admin_addr = stack.readNumber();
    let last_number = stack.readNumber();
    //hash: stack.readNumber()
    // contract: return (db::available_balance, db::service_balance, parse_std_addr(db::admin_addr), db::last_number, db::hash);
    return last_number;
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("get_info", []);
    let available_balance = stack.readNumber();
    return available_balance;
  }
}
