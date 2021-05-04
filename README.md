# Contribution tracker

This is a helper tool to manage contributions made by this organization.

## Quick start

```bash
git clone https://github.com/TPT-Loane/Contribution-Tracker # Clone the repo
cd Contribution-Tracker

npm i                   # install dependencies
cp .env.example .env    # create a '.env' file
vim .env                # edit '.env' file. Make sure to add your github personal access token

npm run start           # launch the server

# connect to 'localhost:3000' (port in '.env' file)
# query github API from: 'localhost:3000/data'. Data returned as pure JSON
```
