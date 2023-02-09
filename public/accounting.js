const transactionsSection = document.querySelector('[--transactions]');
const accNameSection = document.querySelector('[--account-name]');


transactionsSection.innerHTML = '';

const transactions = [];
const entityAccount = {
	id: 2,
	name: 'Joseph Guzman'
};

if (accNameSection)
	accNameSection.innerText = entityAccount.name;

class TransactionManager
{
	constructor()
	{
		this.transactions 		 = [];
		this.valueTransactions 	 = [];
		this.transactionGroups   = [];

		this.byItemsOnly = false; // include all transactions from personal entities without exchange of goods
	}

	getTransactionGroup(trans)
	{
		for (const tGr of this.transactions)
		{
			if (tGr.item_id === trans.item_id)
				return tGr;
		}

		return null;
	}

	getTGroupCollection(group_id)
	{
		return this.transactionGroups.find(tg => tg.group_id == group_id);
	}

	explodeTGroup(tGroup)
	{
		// returns all subgroups of a specific tgroup.
		const tGroups = [];

		const findByGroupId = (tGroups, gId) => {
			return tGroups.find(tg => tg.group_id === gId);
		};

		for (const t of tGroup.transactions)
		{
			if (tGroups.length < 1)
			{
				tGroups.push(new TransactionGroup(t));
				continue;
			}

			const tgr = findByGroupId(tGroups, t.group_id);
			if (!tgr)
				tGroups.push(new TransactionGroup(t));
			else
				tgr.addTransaction(t);
		}

		return tGroups;
	}

	addTransaction(transaction)
	{
		let arr = this.transactions;

		if (transaction.item_id < 0)
			arr = this.valueTransactions;

		const tGroup = this.getTransactionGroup(transaction);
		if (tGroup)
			tGroup.addTransaction(transaction);
		else
			arr.push(new TransactionGroup(transaction));

		if (!tGroup)
		{
			const ltGroup = arr[arr.length - 1];
			if (ltGroup.group_id && ltGroup.group_name)
			{
				
				const c = this.getTGroupCollection(ltGroup.group_id);

				if (!c)
				{
					this.transactionGroups.push(new TransactionCollection(
						ltGroup.group_id,
						ltGroup.group_name,
						ltGroup.group_hidden,
						ltGroup
					));
				} else {
					c.addGroup(ltGroup);
				}
			}
		} else {
			const subTGroups = this.explodeTGroup(tGroup);
			for (const subGroup of subTGroups)
			{
				if (subGroup.group_id && subGroup.group_name)
				{
					
					const c = this.getTGroupCollection(subGroup.group_id);

					if (!c)
					{
						this.transactionGroups.push(new TransactionCollection(
							subGroup.group_id,
							subGroup.group_name,
							subGroup.group_hidden,
							subGroup
						));
					} else {
						if (!c.hasItemId(subGroup.item_id))
							c.addGroup(subGroup);
					}
				}
			}
		}
	}

	totalBalance()
	{
		let balance = 0;
		for (const tGroup of this.transactions)
			balance += tGroup.totalBalance();

		if (!this.byItemsOnly)
		{
			for (const tGroup of this.valueTransactions)
				balance += tGroup.totalBalance();
		}

		return balance;
	}
}

class TransactionCollection
{
	constructor(group_id, group_name, group_hidden, ref_tgroup)
	{
		this.group_id 		= group_id;
		this.group_name 	= group_name;
		this.label 			= this.group_name;
		this.group_hidden 	= group_hidden;
		this.groups 		= [ref_tgroup];
	}

	addGroup(group)
	{
		this.groups.push(group);
	}

	totalBalance()
	{
		let balance = 0;
		for (const g of this.groups)
			balance += g.totalBalance();

		return balance;
	}

	itemsCount()
	{
		return this.groups.length;
	}

	hasItemId(item_id)
	{
		for (const group of this.groups)
		{
			if (group.item_id === item_id)
				return true;
		}

		return false;
	}
}

class TransactionGroup
{
	constructor(transaction)
	{
		this.item_id 	  = transaction.item_id;
		this.group_id 	  = transaction.group_id;
		this.group_name	  = transaction.group_name;
		this.group_hidden = transaction.group_hidden && transaction.group_hidden == "1";
		this.label 		= transaction.item_name;

		this.totBalance = null;

		this.transactions = [transaction];
	}

	addTransaction(t)
	{
		this.transactions.push(t);
	}

	totalBalance()
	{
		// to avoid computing more than one transaction's prices
		// when the same transaction can be found in multiple groups.
		let ids_processed = [];
		if (!this.totBalance)
		{

			let totBalance = 0;
			for (const t of this.transactions)
			{
				if (ids_processed.includes(t.id))
					continue;

				if(t.eid_to !== entityAccount.id)
					totBalance -= t.price;
				else
					totBalance += t.price;

				ids_processed.push(t.id);
			}

			this.totBalance = totBalance;
		}

		return this.totBalance;
	}
}

const transManager = new TransactionManager();

class Item
{
	constructor(id, name)
	{
		this.id = id;
		this.name = name;
	}
}

class Transaction
{
	constructor(id, item_name, item_id, price, eid_from, eid_to, group_id, group_name, group_hidden, timestamp)
	{
		this.id = id;
		this.item_id = item_id;
		this.item_name = item_name;
		this.price = price;
		this.eid_from = eid_from;
		this.eid_to = eid_to;
		this.group_id = group_id;
		this.group_name = group_name;
		this.group_hidden = group_hidden;
		this.timestamp = timestamp;
	}
}

class Entity
{
	constructor(id, name)
	{
		this.id = id;
		this.name = name;
	}
}

const FetchTransactions = () => {
	return new Promise((_res, _rej) => {
		fetch('/transactions').then(res => {
			res.json().then(data => {
				for (const t of data)
					transactions.push(new Transaction(
						t.id, 
						t.item_name, 
						t.item_id, 
						t.price, 
						t.eid_from, 
						t.eid_to,
						t.group_id,
						t.group_name,
						t.group_hidden,
						t.time_stamp
					));
				_res(transactions);
			});
		});
	});
};

function dec(n)
{
	if ( n < 10 )
		return "0" + n;
	return n;
}

function __transaction_widget_coll(tCollection)
{
	const el = document.createElement('tr');

	let element = `<span class="loss">-</span>`;

	let cumBalance = tCollection.totalBalance();

	if (cumBalance > 0)
		element = `<span class="gain">+</span>`;
	else
		if (cumBalance === 0)
			element = '';

	cumBalance = Math.abs(cumBalance);

	el.innerHTML += `<td><span>${tCollection.label} (${tCollection.itemsCount()})</span></td>`;
	el.innerHTML += `<td>${element}<span>${parseInt(cumBalance) + "." + dec(Math.ceil((cumBalance - parseInt(cumBalance))*100)) } EUR</span></td>`;

	return el;
}


function __transaction_widget(tGroup)
{
	const el = document.createElement('tr');

	let element = `<span class="loss">-</span>`;

	let cumBalance = tGroup.totalBalance();

	if (cumBalance > 0)
		element = `<span class="gain">+</span>`;
	else
		if (cumBalance === 0)
			element = '';

	cumBalance = Math.abs(cumBalance);

	el.innerHTML += `<td><span>${tGroup.label}</span></td>`;
	el.innerHTML += `<td>${element}<span>${parseInt(cumBalance) + "." + dec(Math.ceil((cumBalance - parseInt(cumBalance))*100)) } EUR</span></td>`;

	return el;
}

function __total_widget()
{
	const el = document.createElement('tr');

	let balance = transManager.totalBalance();
	let element = '<span class="loss">-</span>';

	if (balance === 0)
		element = '';
	else
		if (balance > 0)
			element = '<span class="gain">+</span>';

	balance = Math.abs(balance);

	el.innerHTML += `<th><span>Total ${transManager.byItemsOnly ? '<span style="color: #b1b1b1;font-weight: lighter;font-size: 11px;">(items only)</span>' : ''}</span></th>`;
	el.innerHTML += `<td class="total">${element}<span>${parseInt(balance) + "." + dec(Math.ceil((balance - parseInt(balance))*100))} EUR</span></td>`;

	return el;
}

FetchTransactions().then(ts => {
	transactionsSection.innerHTML = '';
	transManager.byItemsOnly = true;

	ts.forEach(e => {
		transManager.addTransaction(e);
	});


	transManager.valueTransactions.forEach(tGroup => {
		if (!tGroup.group_id)
			transactionsSection.appendChild(__transaction_widget(tGroup));
	});

	transManager.transactionGroups.forEach(tCollection => {
		if (!tCollection.group_hidden)
			transactionsSection.appendChild(__transaction_widget_coll(tCollection));
	});

	transManager.transactions.forEach(tGroup => {
		if (!tGroup.group_id)
			transactionsSection.appendChild(__transaction_widget(tGroup));
	});

	transactionsSection.appendChild(__total_widget());


	console.log(transManager);
});