const assert = require('assert');
const request = require('supertest');
const express = require('express');
const app = require('../api/app');

describe('Expense Tracker API', () => {
    test('should create a new expense', (done) => {
        const expense = { description: 'Lunch', amount: 258 };

        request(app)
            .post('/expenses')
            .send(expense)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                assert.deepStrictEqual(res.body.message, 'Expense Added Successfully!');
                done();
            });
    });

    it('should retrieve all expenses', (done) => {
        request(app)
            .get('/expenses')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(Array.isArray(res.body), 'Response should be an array');
                done();
            });
    });

    it('should update an existing expense', (done) => {
        const updatedExpense = { description: 'Breakfast', amount: 28.00 };

        request(app)
            .put('/expenses/1')
            .send(updatedExpense)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.deepStrictEqual(res.body.message, 'Expense Updated Successfully!');
                done();
            });
    });

    it('should delete an expense', (done) => {
        request(app)
            .delete('/expenses/1')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.deepStrictEqual(res.body.message, 'Expense Deleted!');
                done();
            });
    });

    it('should handle login', (done) => {
        const user = { username: 'user123', password: 'passw0rd123' };

        request(app)
            .post('/api/login')
            .send(user)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(res.body.message, 'Login should be successful');
                done();
            });
    });
});
