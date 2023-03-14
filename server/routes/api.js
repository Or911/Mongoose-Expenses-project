const moment = require("moment");
const express = require("express");
const router = express.Router();
const Expense = require(".././model/Expense");

router.get("/expenses", function (req, res) {
  Expense.find({})
    .sort({ date: "descending" })
    .then((expenses) => res.status(200).send(expenses));
});

router.get("/expenses/:group", function (req, res) {
  let queryGroup = req.params.group;
  let total = req.query.total;
  let dateStrart = req.query.dateStrart || "1000/01/01";
  let dateEnd = req.query.dateEnd || moment().format("YYYY-MM-DD");

  if (total) {
    Expense.aggregate([
      {
        $match: {
          group: queryGroup,
          $and: [
            { date: { $gte: new Date(dateStrart) } },
            { date: { $lte: new Date(dateEnd) } },
          ],
        },
      },
      {
        $group: {
          _id: queryGroup,
          total: { $sum: "$amount" },
        },
      },
    ]).then((totalAmount) => {
      res.status(200).send(totalAmount);
      return;
    });
  } else {
    Expense.find({ group: queryGroup }, { _id: 0, amount: 1 }).then(
      (expenses) => {
        res.status(200).send(expenses);
      }
    );
  }
});

router.post("/expense", function (req, res) {
  let data = req.body;
  data.date = data.date ? data.date : moment().format("LLLL");
  let e = new Expense(data);
  e.save();
  console.log(`you spend ${data.amount} on ${data.date} for ${data.item}`);
});

router.put("/update", function (req, res) {
  let filter = { group: req.body.group1 };
  let update = { group: req.body.group2 };
  Expense.findOneAndUpdate(filter, update).then((a) => {
    res.status(200).send(a);
  });
});

module.exports = router;
