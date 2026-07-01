const form = document.querySelector('.form form');
const formContainer = document.querySelector('.form');
const titleInput = document.getElementById('title-input');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const btn = document.querySelector('.btn');
const transactionsBody = document.querySelector('#transactions-body');

let transactions = [];
let editingId = null;

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function getSelectedType() {
    const selectedType = document.querySelector('input[name="type"]:checked');
    return selectedType ? selectedType.value : "";
}

function renderTransactions(transaction) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', transaction.id);
    row.innerHTML = `
    <td>${transaction.title}</td>
    <td>${transaction.amount}</td>
    <td>${transaction.category}</td>
    <td>${transaction.date}</td>
    <td><button class="edit-btn">Edit</button> <button class="del-btn" data-id="${transaction.id}">Delete</button></td>
`;
    transactionsBody.appendChild(row);
}

function renderAllTransactions() {
    transactionsBody.innerHTML = "";
    transactions.forEach((transaction) => {
        renderTransactions(transaction);
    });
}

function showError(messages) {
    const error = document.createElement("p");
    error.textContent = messages.join(", ");
    error.style.color = "red";
    error.style.fontSize = "14px";
    error.style.fontWeight = "bold";
    error.style.textAlign = "center";
    error.style.marginTop = "10px";
    error.style.marginBottom = "10px";
    formContainer.appendChild(error);
    setTimeout(() => {
        error.remove();
    }, 3000);
}

function resetFormState() {
    form.reset();
    titleInput.focus();
    editingId = null;
    btn.textContent = "Add transaction";
}

function loadTransactions() {
    const savedTransactions = localStorage.getItem('transactions');

    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
        renderAllTransactions();
    }
}

btn.addEventListener('click', function (e) {
    e.preventDefault();

    const title = titleInput.value;
    const amount = amountInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;
    const type = getSelectedType();

    const messages = [];
    if (title === "") {
        messages.push("Title is required");
    }
    if (amount === "") {
        messages.push("Amount is required");
    }
    if (category === "") {
        messages.push("Category is required");
    }
    if (type === "") {
        messages.push("Type is required");
    }
    if (date === "") {
        messages.push("Date is required");
    }

    if (messages.length > 0) {
        showError(messages);
        return;
    }

    const transaction = {
        id: editingId || Date.now(),
        title,
        amount: Number(amount),
        category,
        type,
        date
    };

    if (editingId) {
        const transactionIndex = transactions.findIndex((item) => item.id === editingId);
        transactions[transactionIndex] = transaction;
    } else {
        transactions.push(transaction);
    }

    saveTransactions();
    renderAllTransactions();
    resetFormState();
});

transactionsBody.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-btn')) {
        const id = Number(e.target.parentElement.parentElement.dataset.id);
        const transaction = transactions.find((item) => item.id === id);

        if (!transaction) return;

        editingId = id;
        titleInput.value = transaction.title;
        amountInput.value = transaction.amount;
        categoryInput.value = transaction.category;
        dateInput.value = transaction.date;
        document.querySelector(`input[name="type"][value="${transaction.type}"]`).checked = true;
        btn.textContent = "Update";
    }

    if (e.target.classList.contains('del-btn')) {
        const id = Number(e.target.dataset.id);

        transactions = transactions.filter((transaction) => transaction.id !== id);

        saveTransactions();
        renderAllTransactions();
        resetFormState();
    }
});

loadTransactions();
//Search
const searchInput = document.getElementById('search-input');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();

        if (searchTerm === "") {
            renderAllTransactions();
            return;
        }

        const searchResult = transactions.filter((transaction) => {
            return transaction.title.toLowerCase().includes(searchTerm) ||
                transaction.category.toLowerCase().includes(searchTerm);
        });

        transactionsBody.innerHTML = "";
        searchResult.forEach((transaction) => {
            renderTransactions(transaction);
        });
    });
}
// Dashbord statics
const balance = document.getElementById('balance');
const income = document.getElementById('income-total');
const expense = document.getElementById('expense-total');

function updateDashbord() {
    const totalIncome = transactions.filter((transaction) => transaction.type === "income").reduce((total, transaction) => total + transaction.amount, 0);

    const totalExpense = transactions.filter((transaction) => transaction.type === "expense").reduce((total, transaction) => total + transaction.amount, 0);

    const totalBalance = totalIncome - totalExpense;

    balance.textContent = `$${totalBalance}`;
    income.textContent = `$${totalIncome}`;
    expense.textContent = `$${totalExpense}`;
}
updateDashbord();

//statics
const totalTransactions = document.getElementById('total-transactions');
const highestExpense = document.getElementById('highest-expense');
const highestIncome = document.getElementById('highest-income');
const topCategory = document.getElementById('top-category');

function updateStatistics() {
    totalTransactions.textContent = ` Total Transactions : ${transactions.length}`
    highestExpense.textContent = `Highest Expense : ${transactions.filter((transaction) => transaction.type === "expense").reduce((total, transaction) => total + transaction.amount, 0)}`;
    highestIncome.textContent = `Highest Income : ${transactions.filter((transaction) => transaction.type === "income").reduce((total, transaction) => total + transaction.amount, 0)}`;

    topCategory.textContent = `Top Category : ${transactions.reduce((total, transaction) => {
        if (transaction.type === "expense") {
            return transaction.category;
        } else {
            return total;
        }
    }, {})}`;
}
updateStatistics();
