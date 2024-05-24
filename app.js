const express = require('express');
const methodOverride = require('method-override');
const Routers = require('./Routers/index');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use('/', Routers);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
