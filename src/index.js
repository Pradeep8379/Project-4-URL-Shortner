const express = require('express');
const route = require('./route/route.js');

const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose.connect("mongodb+srv://PradeepPatil:vp0T2toXsM1QqQAo@cluster0.h3sgz2m.mongodb.net/group27Database", {
    useNewUrlParser: true,
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route);


app.use((req, res, next) => {
    res.status(400).send({ status: false, error: "Enter proper Url" });
});


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});