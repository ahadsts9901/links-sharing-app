const firebaseConfig = {
    apiKey: "AIzaSyDDkH9pqIcdWmRlXHdyC2G0z0Lhlej5dCw",
    authDomain: "links-sharing-b9c2a.firebaseapp.com",
    projectId: "links-sharing-b9c2a",
    storageBucket: "links-sharing-b9c2a.appspot.com",
    messagingSenderId: "606062782904",
    appId: "1:606062782904:web:c4a1a96a5f42be8236c74d",
    // measurementId: "G-NRHCLX7W6D"
}

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

let section = document.querySelector(".section")

function addLink(event) {
    event.preventDefault()
    let input = document.querySelector('.input').value

    db.collection("users").add({
        link: 'https://youtube.com'
    })
    .then((docRef) => {
        renderLink()
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

    let row = document.createElement("div")
    row.className += " rowScroll"
    section.appendChild(row)

    let link = document.createElement('a')
    link.className += " scrollX"
    link.setAttribute("target", "_blank")
    link.setAttribute("href", `${input}`)
    link.innerText = input
    row.appendChild(link)

    let del = document.createElement('p')
    del.className += " bi bi-trash-fill"
    // del.addEventListener("click", delete)
    row.appendChild(del)


    document.querySelector('.input').value = ""
    
}
