document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
const expensesList = document.getElementById('expenses-list');
    
    const expensesGrid = document.getElementById('expenses-grid');
    
    const errorMessage= document.getElementById('error-message');
    const registerErrorMessage = document.getElementById('register-error-message');

    function displayError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => element.style.display = 'none', 5000);
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username === '' || password === '') {
            displayError(errorMessage, 'Username and Password cannot be empty.');
            return;
        }

        logiinUser(username, password);
    });

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();
        
        if (username === '' || email === '' || password === '' || confirmPassword === '') {
            displayError(registerErrorMessage, 'All fields are required.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            displayError(registerErrorMessage, 'Invalid email format.');
            return;
        }

        if (password !== confirmPassword) {
            displayError(registerErrorMessage, 'Passwords do not match.');
            return;
        }

        registerUser(username, email, password);
    });

    addExpenseForn.addEventListener('submit', (event) => {
        event.preventDefault();
        const description = document.getElementById('expense-description').value.trim();
        const amount = document.getElementById('expense-amount').value.trim();

        if (description === '' || amount === '') {
            alert('Description and amount cannot be empty.');
            return;
        }

        if (isNaN(amount) || parseFloat(amount) <= 0) {
            alert('Amount must be a positive value.');
            return;
        }

        addExpense(description, amount);
    });

    async function loginUser(username, password) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (!response.ok) {
                const result = await response.json();
                displayError(errorMessage, result.message || 'Login failed');
            } else {
                fetchExpenses();
            }
        } catch (error) {
            displayError(errorMessage, 'An error occurred during login. Please try again. ');
            console.error('Login error:', error);
        } 
    }

    async function registerUser(username, email, password) {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            if (!response.ok) {
                const result = await response.json();
                displayError(registerErrorMessage, result.message || 'Registration failed');
            } else {
                alert('Registration successful. Please log in');
            }
        } catch (error) {
            displayError(registerErrorMessage, 'An error occurred. Please try again ');
            console.error('Registration error:', error);
        }
    }

    async function addExpense(description, amount) {
        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, amount })
            });

            if (!response.ok) {
                alert('Failed to add expense. Please try again.');
            } else {
                alert('Expense added successfully.');
                fetchExpenses();
            }
        } catch (error) {
            alert('An error occurred while adding the expense. Please try again.');
            console.error('Add expense error:', error);
        }
        
    }
    
    async function fetchExpenses() {
        try {
        const response = await fetch('/api/expenses');
        if (response.ok) {
            const expenses = await response.json();
            displayExpenses(expenses);
        } else {
            alert('Failed to fetch Expenses');
        }
    } catch (error) {
            console.error('Error fetching expense:', error);
    }
}

    function displayExpenses(expenses) {
        expensesList.innerHTML = '';
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.textContent = '${expense.description}: $${expense.amount} on ${new Date(expense.date).toLocaleDateString()}';
            expensesList.appendChiild(li);
        });
   }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                showSection('dashboard');
                fetchExpenses();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
   });

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();
   })
    const sections = document.querySelectorAll('body > div');
    const navLinks = document.querySelectorAll('nav ul li a');

    function showSection(sectionId) {
        sections.forEach(section => {
            section.style.display = (section.id === sectionId) ? 'block' : 'none';
        });
    }

    showSection('login');

    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
        });
});

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        
        const password = document.getElementById('password').value.trim();
        const errorMessage = document.getElementById('error-message');

        if (!username || !password) {
            errorMessage.textContent = 'Please enter both password and username.';
            errorMessage.style.color = 'red';
        } else {
            errorMessage.textContent = '';
            alert('Login successful');
            showSection('dashboard');
            
        }
    });

    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();
        const registerErrorMessage = document.getElementBAyId('register-error-message');

        if (!username || !email || !password || !confirmPassword) {
            registerErrorMessage.textContent = 'All fields are required.';
            registerErrorMessage.style.color = 'red';
        } else if (password !== confirmPassword) {
            registerErrorMessage.textContent = 'Passwords do not match! ';
            registerErrorMessage.style.color = 'red';
        } else {
            registerErrorMessage.textContent = '';
            alert('Registration successful');
            showSection('dashboard');
        }
    });
})