var data = doc.data();

let row = document.createElement("div");
row.className = "rowScroll";
section.appendChild(row);

// Check if the data.link contains a valid URL
let isUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(data.link);

if (isUrl) {
    let link = document.createElement('a');
    link.className = "scrollX";
    link.setAttribute("target", "_blank");
    link.setAttribute("href", `${data.link}`);
    link.innerText = data.link;
    row.appendChild(link);
} else {
    let paragraph = document.createElement('p');
    paragraph.className = "scrollX";
    paragraph.innerText = data.link;
    row.appendChild(paragraph);
}

let cont = document.createElement("div");
cont.className += " small-container";
row.appendChild(cont);

let timestamp = data.timestamp ? data.timestamp.toDate() : new Date(); // Use current time if timestamp is missing
let time = document.createElement('p');
time.className += " small";
time.innerText = moment(timestamp).fromNow();
cont.appendChild(time);

let del = document.createElement('p');
del.className = "bi bi-trash-fill";
del.className += " small";
del.addEventListener("click", () => deleteLink(doc.id));
cont.appendChild(del);