# Contribution tracker

This is a helper tool to manage contributions made by this organization.

## Quick start

```bash
git clone https://github.com/TPT-Loane/Contribution-Tracker # Clone the repo
cd Contribution-Tracker

npm i                       # install dependencies
cp .env.example .env        # create a '.env' file
vim .env                    # edit '.env' file. Make sure to add your github personal access token

# Launch server with...
npm run start               # launch the server locally
# or...
docker-compose up --build   # launch the server in docker

# connect to 'localhost:3000' (port in '.env' file) if running locally.
# connect to 'localhost:3002' if running via docker.
# query github API from: 'localhost:<port>/api'. Data returned as pure JSON
```
