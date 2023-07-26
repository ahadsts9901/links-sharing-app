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

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: 'Added successfully'
            })
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
        .then(function(querySnapshot) {
            if (querySnapshot.size === 0) {
                section.innerHTML = "<div class='blue'>No Links found</div>";
            } else {
                querySnapshot.forEach(function(doc) {
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
                });
            }
        })
        .catch(function(error) {
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

    if (password === "delete123") {

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

                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                    icon: 'success',
                    title: 'Deleted successfully'
                })

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

document.addEventListener("DOMContentLoaded", function() {
    renderLink();
});

// delete all

async function deleteAllLinks() {
    const { value: password } = await Swal.fire({
        title: "Enter Password",
        input: "password",
        inputLabel: "Password",
        inputPlaceholder: "Enter Password",
        showCancelButton: true,
        confirmButtonColor: "#212121",
        cancelButtonColor: "#212121",
        confirmButtonText: "Submit",
    });

    if (password === "delete123") {
        const { isConfirmed } = await Swal.fire({
            title: "Delete All Links?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#212121",
            confirmButtonText: "Yes, delete all!",
            cancelButtonText: "Cancel",
            cancelButtonColor: "#212121"
        });

        if (isConfirmed) {
            db.collection("users")
                .get()
                .then((querySnapshot) => {
                    const batch = db.batch();
                    querySnapshot.forEach((doc) => {
                        batch.delete(doc.ref);
                    });

                    return batch.commit();
                })
                .then(() => {
                    // sweet alert
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })

                    Toast.fire({
                        icon: 'success',
                        title: 'All Links Deleted Successfully'
                    })
                    renderLink();
                })
                .catch((error) => {
                    console.error("Error deleting documents: ", error);
                });
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Incorrect password or canceled.",
            confirmButtonColor: "#212121",
        });
    }
}

document.querySelector("#deleteAllButton").addEventListener("click", deleteAllLinks);

// on form submit

document.querySelector('#form').addEventListener('submit', addLink);