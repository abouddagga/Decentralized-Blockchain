class MemPool {
  constructor() {
    this.transactions = [];
  }

  updateOrAddTx(transaction) {
    const transactionHash = this.transactions.find(tx => tx.hash === transaction.hash);

    if (transactionHash) {
      this.transactions[this.transactions.indexOf(transactionHash)] = transaction;
    } else {
      this.transactions.push(transaction);
    }

  }

  minePool(minerAddress, difficulty) {
    const tempPool = this.popTx();

    this.generateReward(minerAddress);

    for (const trans of tempPool) {
      trans.timeStamp = Date.now();
    }

    const block = new Block(Date.now(), tempPool, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    this.chain.push(block);

    this.adjustDifficulty();
  }

  popTx() {
    const tempPool = this.transactions.slice(0, MAX_NUM_OF_TX_PER_BLOCK - 1);
    this.transactions = this.transactions.slice(MAX_NUM_OF_TX_PER_BLOCK - 1);
    return tempPool;
  }

  generateReward(minerAddress) {
    const reward = new Transaction(null, minerAddress, this.miningReward);
    this.transactions.unshift(reward);
  }
}

module.exports.MemPool = MemPool
