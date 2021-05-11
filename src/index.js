const express = require("express");     // Serve the page at a 'localhost' near you.
const fetch = require("node-fetch");    // Make GraphQL queries and such.
const path = require("path");           // Use files in directory.
require('dotenv').config();             // Use 'process.env.ENV_VARIABLE' to use '.env' file vars.

const app = express();

const port = process.env.PORT || 3000;              // Use port found in '.env' or default back to port '3000'
const queries = require('./js/graphqlQueries.js');  // import queries stored in './js/graphqlQueries.js'

/* Serve static pages from the 'public' directory */
app.use(express.static(path.join(__dirname, 'public')));

app.get("/api", (req, res) => {
  /* Query to send to github */
  let graphqlQuery = false;

  switch (req.query.queryType) {
    case 'issues':
      graphqlQuery = queries.queryIssues;
      break;
    case 'commits':
      graphqlQuery = queries.queryCommits;
      break;
    case 'pulls':
      graphqlQuery = queries.queryPullRequests;
      break;
    case 'collaborators':
      graphqlQuery = queries.queryContributors;
      break;
    default:
      graphqlQuery = false;
      break;
  }

  if(!graphqlQuery) { res.status(400).send('Bad request.'); return; }

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
      res.status(200);
      res.json(data);
    });
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
