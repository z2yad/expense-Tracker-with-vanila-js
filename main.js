const form = document.querySelector('.form form');
const formContainer = document.querySelector('.form');
const titleInput = document.getElementById('title-input');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const btn = document.querySelector('.btn');

let transactions = [];

btn.addEventListener('click', function (e) {
    e.preventDefault();
    const title = titleInput.value;
    const amount = amountInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;
    const selectedType = document.querySelector('input[name="type"]:checked');
    const type = selectedType ? selectedType.value : "";

    let messages = [];
    if (title === "" || amount === "" || category === "" || type === "" || date === "") {
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
        let error = document.createElement("p");
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
        return;
    }
    const transaction = {
        title,
        amount: Number(amount),
        category,
        type,
        date
    };
    console.log(transaction);
    transactions.push(transaction);
    //استدعاء الدالة لعرض الترانزكشن    
    renderTransactions(transaction);
    form.reset();
});
//create row in  table
const transactionsBody = document.querySelector('#transactions-body');
function renderTransactions(transaction) {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${transaction.title}</td>
    <td>${transaction.amount}</td>
    <td>${transaction.category}</td>
    <td>${transaction.date}</td>
    <td><button>Edit</button> <button>Delete</button></td>
`;
    transactionsBody.appendChild(row);
}
