exports.minimizeTransactions = (members) => {
  console.log("🚀 ~ members:", members);
  // Step 1: Create a balance map for members
  const balances = members.reduce((acc, member) => {
    acc[member.user.name] = (acc[member.user.name] || 0) + member.balance;
    return acc;
  }, {});
  console.log("🚀 ~ balances ~ balances:", balances);

  // Step 2: Separate creditors and debtors
  const creditors = [];
  const debtors = [];

  for (const [name, balance] of Object.entries(balances)) {
    if (balance > 0) {
      creditors.push({ name, balance });
    } else if (balance < 0) {
      debtors.push({ name, balance: -balance }); // Store positive value for debtors
    }
  }

  // Step 3: Minimize transactions
  const transactions = [];

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const settledAmount = Math.min(creditor.balance, debtor.balance);

    transactions.push({
      from: debtor.name,
      to: creditor.name,
      amount: settledAmount,
    });

    // Update balances
    creditor.balance -= settledAmount;
    debtor.balance -= settledAmount;

    if (creditor.balance === 0) creditorIndex++;
    if (debtor.balance === 0) debtorIndex++;
  }

  return transactions;
};
