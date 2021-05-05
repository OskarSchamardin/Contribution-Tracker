async function getUpdatedStatuses() {
    /* GETs '/data' to trigger the back end to get info from github API */

    let data = await fetch('/data');
    data = await data.json();           // Convert data to json to avoid getting 'readable stream' object
    return data;
}

async function updateStatusesInfo() {
    /* Gets new data from github API and displays it */
    let elStatus= document.getElementById('status');
    let data = await getUpdatedStatuses();

    elStatus.innerText = JSON.stringify(data);
}
