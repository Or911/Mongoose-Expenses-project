const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExpenseSchema = new Schema({
    item: String,
    amount: Number,
    date: Date,
    group:String
})

const Expense = mongoose.model("expense", ExpenseSchema)
module.exports = Expense