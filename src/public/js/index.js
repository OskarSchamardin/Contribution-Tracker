updateStatusesInfo(); // Display info on page load

async function getUpdatedStatuses() {
    /* GETs '/data' to trigger the back end to get info from github API */

    let data = await fetch('/data');
    data = await data.json();           // Convert data to json to avoid getting 'readable stream' object
    return data;
}

async function updateStatusesInfo() {
    /* Gets new data from github API and displays it */
    let data = await getUpdatedStatuses();
    data = await data['data']['organization']['repository'];

    const list= document.getElementById('list');
    let nullNames = [];                 // Commits with no registered user as author
    let showNullNameWarning = false;    // Bool for showing a warning for incomplete data

    /* Clear list */
    while(list.firstChild) {
        list.removeChild(list.lastChild)
    }

    /* Filter and display data for each collaborator */
    for(let i in data['collaborators']['nodes']) {
        const username = `${data['collaborators']['nodes'][i]['login']}`;
        const avatarURL = `${data['collaborators']['nodes'][i]['avatarUrl']}`;
        let issuesNo = 0;           // Number of authored issues
        let commitsNo = 0;          // Number of all authored commits
        let mainCommitsNo = 0;      // Number of authored commits in 'main'
        let pullsNo = 0;            // Number of authored pull requests
        let pullsAssignedNo = 0;    // Number of pull requests assigned to user
        let reviewsNo = 0;          // Number of authored code reviews (comments in review threads in PR)
        let scannedCommits = [];    // Helps with preventing duplicate data

        /* List item container */
        let newListItem = document.createElement('div');
        newListItem.id = `listItem${i}`;
        newListItem.className = `listItem`;
        list.appendChild(newListItem);

        /* Avatar */
        newListItem = document.createElement('img');
        newListItem.src = avatarURL;
        newListItem.style.height = '64px';
        newListItem.style.width = '64px';
        document.getElementById(`listItem${i}`).appendChild(newListItem);

        /* Login name */
        newListItem = document.createElement('a');
        newListItem.href= `https://github.com/${username}`;
        newListItem.innerText = username;
        document.getElementById(`listItem${i}`).appendChild(newListItem);

        /* Number of authored issues */
        for(let i in data['issues']['nodes']) {
            if(data['issues']['nodes'][i]['author']['login'] === username) {
                issuesNo++;
            }
        }
        newListItem = document.createElement('p');
        newListItem.innerText = `Authored issues: ${issuesNo}`;
        document.getElementById(`listItem${i}`).appendChild(newListItem);

        /* Number of authored commits */
        for(let i in data['refs']['edges']) {
            const branch = data['refs']['edges'][i]['node'];
            const commit = branch['target']['history']['edges'];

            /* Loop commits in branch history */
            for(let j in commit) {
                const commitSHA = commit[j]['node']['abbreviatedOid'];

                if(nullNames.includes(commitSHA)) { continue; }                                     // Skip commits with no registered author
                if(scannedCommits.includes(commitSHA) && branch['name'] !== 'main') { continue; }   // Skip scanned commits if not on 'main' branch

                if(commit[j]['node']['author']['user'] === null) {
                    showNullNameWarning = true;
                    console.warn(`Commit: \'${commitSHA}\' author is NULL!`);   // Warn user about incomplete data
                    nullNames.push(commitSHA);                                  // Mark commit as a commit with no registered author
                }
                else if (commit[j]['node']['author']['user']['login'] === username) {
                    scannedCommits.includes(commitSHA) || commitsNo++;          // increment if not scanned yet
                    (branch['name'] === 'main') && mainCommitsNo++;             // increment if branch is main
                }

                scannedCommits.push(commitSHA);  // Mark commit as checked if branch is not main
            }
        }
        newListItem = document.createElement('p');
        newListItem.innerText = `Authored commits: ${commitsNo} (main: ${mainCommitsNo})`;
        document.getElementById(`listItem${i}`).appendChild(newListItem);

        /* Pull requests number */
        for(let i in data['pullRequests']['nodes']) {
            const pullRequest = data['pullRequests']['nodes'][i];

            if(pullRequest['author']['login'] === username) { pullsNo++; }      // Increment if user is PR author
            if(pullRequest['assignees'] !== null) {
                for(let j in pullRequest['assignees']['nodes']) {
                    if (pullRequest['assignees']['nodes'][j]['login'] === username) { pullsAssignedNo++; } // Increment if PR is assigned to user
                }
            }
        }
        newListItem = document.createElement('p');
        newListItem.innerText = `Authored pull requests: ${pullsNo} (assigned: ${pullsAssignedNo})`;
        document.getElementById(`listItem${i}`).appendChild(newListItem);

        /* Code reviews number */
        for(let i in data['pullRequests']['nodes']) {
            const pullRequest = data['pullRequests']['nodes'][i];

            if(pullRequest['reviews'] !== null) {
                for(let j in pullRequest['reviews']['nodes']) {
                    if(pullRequest['reviews']['nodes'][j]['author']['login'] === username) { reviewsNo++; } // Increment if review is from username
                }
            }
        }
        newListItem = document.createElement('p');
        newListItem.innerText = `Authored code reviews: ${reviewsNo}`;
        document.getElementById(`listItem${i}`).appendChild(newListItem);

        /* TODO: Comments number */
    }

    if(showNullNameWarning) {
        /* Show visual warning if some commits have 'null' as the authoring user */
        document.getElementById('nullNameWarning').style.display = 'block';
    }
}
