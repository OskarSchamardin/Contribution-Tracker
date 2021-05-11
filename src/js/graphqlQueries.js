/* This file contains the graphql queries to be sent to github's
 * graphql API.
 */

module.exports = {
    /* GraphQL query to get issues from github */
    queryIssues: `
    {
      organization(login: "TPT-Loane") {
        repositories(first: 5) {
          nodes {
            name
            issues(first: 100) {
              nodes {
                number
                author {
                  login
                }
                assignees(first: 100) {
                  nodes {
                    login
                  }
                }
                comments(first: 100) {
                  nodes {
                    author {
                      login
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`,

    /* GraphQL query to get commits from github */
    queryCommits: `
    {
      organization(login: "TPT-Loane") {
        repositories(first: 5) {
          nodes {
            name
            refs(refPrefix: "refs/heads/", orderBy: {direction: DESC, field: TAG_COMMIT_DATE}, first: 100) {
              edges {
                node {
                  name
                  ... on Ref {
                    target {
                      ... on Commit {
                        history(first: 100) {
                          edges {
                            node {
                              ... on Commit {
                                abbreviatedOid
                                messageHeadline
                                committedDate
                                author {
                                  user {
                                    login
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    `,

    /* GraphQL query to get pull requests from github */
    queryPullRequests: `
    {
      organization(login: "TPT-Loane") {
        repositories(first: 5) {
          nodes {
            name
            pullRequests(first: 100) {
              nodes {
                title
                author {
                  login
                }
                assignees(first: 100) {
                  nodes {
                    login
                  }
                }
                comments(first: 100) {
                  nodes {
                    author {
                      login
                    }
                  }
                }
                reviews(first: 100) {
                  nodes {
                    author {
                      login
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`,

    /* GraphQL query to get contributors from github */
    queryContributors: `
    {
      organization(login: "TPT-Loane") {
        repositories(first: 5) {
          nodes {
            name
            collaborators(first: 100) {
              nodes {
                avatarUrl
                login
              }
            }
          }
        }
      }
    }`
}
