// sweet alert

let timerInterval;
Swal.fire({
    title: "Loading...",
    html: "I will close in <b></b> milliseconds.",
    timer: 3000,
    timerProgressBar: true,
    didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft();
        }, 100);
    },
    willClose: () => {
        clearInterval(timerInterval);
    },
}).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
        // console.log('I was closed by the timer')
    }
});

// code start

const firebaseConfig = {
    apiKey: "AIzaSyDDkH9pqIcdWmRlXHdyC2G0z0Lhlej5dCw",
    authDomain: "links-sharing-b9c2a.firebaseapp.com",
    projectId: "links-sharing-b9c2a",
    storageBucket: "links-sharing-b9c2a.appspot.com",
    messagingSenderId: "606062782904",
    appId: "1:606062782904:web:c4a1a96a5f42be8236c74d",
    // measurementId: "G-NRHCLX7W6D"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

let section = document.querySelector(".section");

// add link function

function addLink(event) {
    event.preventDefault();
    let input = document.querySelector('.input').value;

    db.collection("users").add({
        link: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp() // Add a timestamp field with server timestamp
    })
        .then((docRef) => {

            // sweet alert

            Swal.fire({
                icon: "success",
                title: "Added",
                confirmButtonText: "OK",
                confirmButtonColor: "#212121",
            });
            renderLink();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

    document.querySelector('.input').value = "";
}

// renderLink function

function renderLink() {
    section.innerHTML = ""; // Clear the section container before rendering links
    db.collection("users")
        .orderBy("timestamp", "desc")
        .get()
        .then(function (querySnapshot) {
            if (querySnapshot.size === 0) {
                section.innerHTML = "<div class='blue'>No Links found</div>";
            } else {
                querySnapshot.forEach(function (doc) {
                    var data = doc.data();

                    let row = document.createElement("div");
                    row.className = "rowScroll";
                    section.appendChild(row);

                    let link = document.createElement('a');
                    link.className = "scrollX";
                    link.setAttribute("target", "_blank");
                    link.setAttribute("href", `${data.link}`);
                    link.innerText = data.link;
                    row.appendChild(link);

                    let cont = document.createElement("div")
                    cont.className += " small-container"
                    row.appendChild(cont)

                    let timestamp = data.timestamp ? data.timestamp.toDate() : new Date(); // Use current time if timestamp is missing
                    let time = document.createElement('p');
                    time.className += " small"
                    time.innerText = moment(timestamp).fromNow();
                    cont.appendChild(time);

                    let del = document.createElement('p');
                    del.className = "bi bi-trash-fill";
                    del.className += " small"
                    del.addEventListener("click", () => deleteLink(doc.id));
                    cont.appendChild(del);
                });
            }
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

async function deleteLink(docId) {
    const { value: password } = await Swal.fire({
        title: "Enter Your Password",
        input: "password",
        inputLabel: "Password",
        inputPlaceholder: "Enter Your Password",
        confirmButtonColor: "#212121",
        confirmButtonText: "Delete URL",
        inputAttributes: {
            maxlength: 10,
            autocapitalize: "off",
            autocorrect: "off",
        }
    });

    if (password === "12345678") {

        // sweet alert

        Swal.fire({
            title: "Do You Want To Delete It ?",
            showDenyButton: true,
            confirmButtonText: "Delete",
            denyButtonText: `Don't Delete`,
            confirmButtonColor: "#212121",
            denyButtonColor: "#212121",
        }).then((result) => {
            if (result.isConfirmed) {

                // sweet alert

                Swal.fire({
                    icon: "success",
                    title: "Deleted",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#212121",
                });

                db.collection("users").doc(docId).delete()
                    .then(() => {
                        renderLink(); // Re-render links after successful deletion
                    })
                    .catch((error) => {
                        console.error("Error deleting document: ", error);
                    });
            } else {
                renderLink(); // Re-render links if the deletion is canceled
            }
        });
    } else {

        // sweet alert

        Swal.fire({
            icon: "error",
            title: "Access Denied",
            confirmButtonText: "OK",
            confirmButtonColor: "#212121",
        });
    }
}

// on load function

document.addEventListener("DOMContentLoaded", function () {
    renderLink(); // Render links when the DOM is fully loaded
});

// on form submit

document.querySelector('#form').addEventListener('submit', addLink);
