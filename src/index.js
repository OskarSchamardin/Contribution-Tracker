const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
require('dotenv').config();

const app = express();

const port = 3000;

/* GraphQL query that gets sent to github API */
const graphqlQuery = `
{
  organization(login: "TPT-Loane") {
    repository(name: "TPT-Loane") {
      issues(last: 100) {
        nodes {
          number
          author {
            login
          }
        }
      }
    }
  }
}
`;

/* Serve static pages from the 'public' directory */
app.use(express.static(path.join(__dirname, 'public')));

app.get("/data", (req, res) => {
  /* Get data from github and return JSON */
  fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`
    },
    body: JSON.stringify({
      query: graphqlQuery
    })
  })
    .then(result => {
      return result.json();
    })
    .then(data => {
      res.send(data);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
