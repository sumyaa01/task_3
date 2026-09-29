// ===============================
// Student Expense Tracker
// ===============================

// Get HTML elements
const transactionForm = document.getElementById("transactionForm");
const typeInput = document.getElementById("type");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");

const transactionList = document.getElementById("transactionList");
const emptyMessage = document.getElementById("emptyMessage");

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const balance = document.getElementById("balance");

const searchInput = document.getElementById("search");
const filterType = document.getElementById("filterType");
const filterCategory = document.getElementById("filterCategory");

const themeBtn = document.getElementById("themeBtn");


// ===============================
// Load saved transactions
// ===============================

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let editId = null;


// ===============================
// Add Transaction
// ===============================

transactionForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const type = typeInput.value;
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;
    const description = descriptionInput.value;

    // Validation
    if (type === "" || amount <= 0 || category === "" || date === "") {
        alert("Please fill all required fields correctly.");
        return;
    }


    // Edit existing transaction
    if (editId !== null) {

        transactions = transactions.map(function (transaction) {

            if (transaction.id === editId) {

                return {
                    id: editId,
                    type: type,
                    amount: amount,
                    category: category,
                    date: date,
                    description: description
                };

            }

            return transaction;

        });

        editId = null;

        alert("Transaction updated successfully!");

    }

    // Add new transaction
    else {

        const transaction = {

            id: Date.now(),

            type: type,

            amount: amount,

            category: category,

            date: date,

            description: description

        };

        transactions.push(transaction);

        alert("Transaction added successfully!");

    }


    // Save and refresh
    saveTransactions();

    transactionForm.reset();

    displayTransactions();

    updateDashboard();

});


// ===============================
// Save Transactions
// ===============================

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// ===============================
// Display Transactions
// ===============================

function displayTransactions() {

    transactionList.innerHTML = "";

    const searchText =
        searchInput.value.toLowerCase();

    const selectedType =
        filterType.value;

    const selectedCategory =
        filterCategory.value;


    // Filter transactions
    const filteredTransactions =
        transactions.filter(function (transaction) {

            const matchesSearch =
                transaction.description
                    .toLowerCase()
                    .includes(searchText) ||

                transaction.category
                    .toLowerCase()
                    .includes(searchText);


            const matchesType =
                selectedType === "all" ||
                transaction.type === selectedType;


            const matchesCategory =
                selectedCategory === "all" ||
                transaction.category === selectedCategory;


            return (
                matchesSearch &&
                matchesType &&
                matchesCategory
            );

        });


    // No transaction found
    if (filteredTransactions.length === 0) {

        transactionList.innerHTML =
            "<p>No transactions found.</p>";

        return;

    }


    // Display transactions
    filteredTransactions.forEach(function (transaction) {

        const item =
            document.createElement("div");

        item.className =
            "transaction-item";


        const sign =
            transaction.type === "income"
                ? "+"
                : "-";


        const amountClass =
            transaction.type === "income"
                ? "income"
                : "expense";


        item.innerHTML = `

            <div class="transaction-info">

                <h4>
                    ${transaction.description || "No description"}
                </h4>

                <small>
                    ${transaction.category}
                    |
                    ${transaction.date}
                </small>

            </div>


            <div>

                <span class="${amountClass}">
                    ${sign} ₹${transaction.amount}
                </span>

                <br>

                <button
                    class="edit-btn"
                    onclick="editTransaction(${transaction.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                >
                    Delete
                </button>

            </div>

        `;


        transactionList.appendChild(item);

    });

}


// ===============================
// Update Dashboard
// ===============================

function updateDashboard() {

    let income = 0;

    let expense = 0;


    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {

            income += transaction.amount;

        }

        else {

            expense += transaction.amount;

        }

    });


    const currentBalance =
        income - expense;


    totalIncome.textContent =
        income.toFixed(2);

    totalExpense.textContent =
        expense.toFixed(2);

    balance.textContent =
        currentBalance.toFixed(2);

}


// ===============================
// Delete Transaction
// ===============================

function deleteTransaction(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this transaction?");


    if (!confirmDelete) {

        return;

    }


    transactions =
        transactions.filter(function (transaction) {

            return transaction.id !== id;

        });


    saveTransactions();

    displayTransactions();

    updateDashboard();

}


// ===============================
// Edit Transaction
// ===============================

function editTransaction(id) {

    const transaction =
        transactions.find(function (transaction) {

            return transaction.id === id;

        });


    if (!transaction) {

        return;

    }


    typeInput.value =
        transaction.type;

    amountInput.value =
        transaction.amount;

    categoryInput.value =
        transaction.category;

    dateInput.value =
        transaction.date;

    descriptionInput.value =
        transaction.description;


    editId = id;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ===============================
// Search
// ===============================

searchInput.addEventListener(
    "input",
    displayTransactions
);


// ===============================
// Filter Type
// ===============================

filterType.addEventListener(
    "change",
    displayTransactions
);


// ===============================
// Filter Category
// ===============================

filterCategory.addEventListener(
    "change",
    displayTransactions
);


// ===============================
// Dark / Light Mode
// ===============================

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");


    if (
        document.body.classList.contains("dark-mode")
    ) {

        themeBtn.textContent =
            "☀️ Light Mode";

    }

    else {

        themeBtn.textContent =
            "🌙 Dark Mode";

    }

});


// ===============================
// Initial Display
// ===============================

displayTransactions();

updateDashboard();