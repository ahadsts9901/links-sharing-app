let section = document.querySelector(".section")

function addLink(event){
    event.preventDefault()

    let input = document.querySelector('.input').value

    let row = document.createElement("div")
    row.className += " rowScroll"
    section.appendChild(row)

    let link = document.createElement('a')
    link.className += " scrollX"
    link.setAttribute("target","_blank")
    link.setAttribute("href",`${input}`)
    link.innerText = input
    row.appendChild(link)

    let del = document.createElement('p')
    del.className += " bi bi-trash-fill"
    // del.addEventListener("click", delete)
    row.appendChild(del)


    document.querySelector('.input').value = ""
}
