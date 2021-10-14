const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE.replace(
  /<PASSWORD>/,
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  // eslint-disable-next-line no-console
  .then(() => console.log('Connected to Mongo successfully!'));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on ${port}`);
});
