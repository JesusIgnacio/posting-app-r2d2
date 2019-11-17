const express = require('express')
const apiRoutes = require("./api-routes")
const cors = require("cors")

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors())

app.use('/api', apiRoutes)

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
});