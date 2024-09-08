const express = require('express');
const mysql = require('mysql2/promise');
const request = require('supertest');
const { test, expect, beforeAll, afterAll } = require('@jest/globals');

// Create a connection pool to the database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize Express app
const app = express();
app.use(express.json());

// Define routes
app.post('/expenses', async (req, res) => {
    const { description, amount } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO expenses (description, amount) VALUES (?, ?)', [description, amount]);
        res.status(201).json({ message: 'Expense added successfully', id: result.insertId });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Failed to add expense' });
    }
});

app.get('/expenses', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM expenses');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error retrieving expenses:', error);
        res.status(500).json({ error: 'Failed to retrieve expenses' });
    }
});

app.put('/expenses/:id', async (req, res) => {
    const { id } = req.params;
    const { description, amount } = req.body;
    try {
        const [result] = await pool.query('UPDATE expenses SET description = ?, amount = ? WHERE id = ?', [description, amount, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense updated successfully' });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ error: 'Failed to update expense' });
    }
});

app.delete('/expenses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM expenses WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

// Test cases
const server = app.listen(5500, () => {
        console.log('Server is listening on port 5500');
    });

    // Allow some time for the server to start
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await request(app).get('/expenses');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    server.close();


test('should create, update, and delete an expense', async () => {
    const server = app.listen(5500, () => {
        console.log('Server is listening on port 5500');
    });

    // Allow some time for the server to start
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create an expense
    const createResponse = await request(app)
        .post('/expenses')
        .send({ description: 'Test expense', amount: 100 });
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.message).toBe('Expense added successfully');
    const expenseId = createResponse.body.id;

    // Update the expense
    const updateResponse = await request(app)
        .put(`/expenses/${expenseId}`)
        .send({ description: 'Updated expense', amount: 150 });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.message).toBe('Expense updated successfully');

    // Delete the expense
    const deleteResponse = await request(app)
        .delete(`/expenses/${expenseId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Expense deleted successfully');


    afterAll(() => {
        server.close();
    });
})



