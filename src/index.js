const express = require("express");     // Serve the page at a 'localhost' near you.
const fetch = require("node-fetch");    // Make GraphQL queries and such.
const oauth = require("oauth").OAuth2;  // OAuth helper
const path = require("path");           // Use files in directory.
require('dotenv').config();             // Use 'process.env.ENV_VARIABLE' to use '.env' file vars.

const app = express();

const port = process.env.PORT || 3000;                          // Use port found in '.env' or default back to port '3000'
const queries = require('./js/graphqlQueries.js');              // import queries stored in './js/graphqlQueries.js'
let githubOAuthAppSecretToken = null;

/* OAuth params for github API */
const githubOAuth = new oauth(process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET,
    "https://github.com/",
    "login/oauth/authorize",
    "login/oauth/access_token"
);

/* Serve static pages from the 'public' directory */
app.use(express.static(path.join(__dirname, 'public')));

/* Tell github that we want to authorize a user */
/* More info at stackoverflow: https://stackoverflow.com/a/24253645 */
app.get("/githubOAuth", (req, res) => {
    res.writeHead(303, {
        Location: githubOAuth.getAuthorizeUrl({
            scope: "user,repo,gist"
        })
    });
    res.end();
});

/* Github calls this URL and we request a secret token */
app.get("/githubOAuthResponse", (req, res) => {
    const code = req.query.code;

    githubOAuth.getOAuthAccessToken(code, {}, (err, access_token, refresh_token) => {
        if(err) { console.log(err); }
        githubOAuthAppSecretToken = access_token;
    });
    res.redirect('/');
});

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
    if(githubOAuthAppSecretToken === null) {
        res.status(401).send('Authorization required, please authorize with github first.');
        return;
    }

    /* Get data from github and return JSON */
    fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${githubOAuthAppSecretToken}`
        },
        body: JSON.stringify({
            query: graphqlQuery
        })
    }).then(result => {
        return result.json();
    }).then(data => {
        res.status(200);
        res.json(data);
    });
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
