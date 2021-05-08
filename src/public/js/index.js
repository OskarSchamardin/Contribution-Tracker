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

    /* Collaborator logins */
    for(let i in data['collaborators']['nodes']) {
        let username = `${data['collaborators']['nodes'][i]['login']}`;

        let newListItem = document.createElement('p');
        newListItem.className = `user-${i}`;
        newListItem.innerText = username;

        document.getElementById('list').appendChild(newListItem);
    }

}
