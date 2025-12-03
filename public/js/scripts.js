//Event listeners
let authorLinks = document.querySelectorAll("a");
for(authorLink of authorLinks){
    authorLink.addEventListener("click", getAuthorInfo);
}

async function getAuthorInfo(){
    var myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();

    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    //console.log(data);
    let authorInfo = document.querySelector("#authorInfo");
    authorInfo.innerHTML = `<h1> ${data[0].firstName} 
                                 ${data[0].lastName}</h1>`;
    authorInfo.innerHTML += `<img src="${data[0].portrait}"
    width="200px"><br>`;
    authorInfo.innerHTML += `<strong>Date of Birth:</strong> ${data[0].dob} <br>`;
    authorInfo.innerHTML += `<strong>Date of Death:</strong> ${data[0].dod} <br>`;
    authorInfo.innerHTML += `<strong>Sex:</strong> ${data[0].sex} <br>`;
    authorInfo.innerHTML += `<strong>Profession:</strong> ${data[0].profession} <br>`;
    authorInfo.innerHTML += `<strong>Country:</strong> ${data[0].country} <br>`;
    authorInfo.innerHTML += `<strong>Biography:</strong> <p>${data[0].biography}</p>`;
}

document.addEventListener("DOMContentLoaded", loadCategories);

async function loadCategories() {
    let response = await fetch("/api/categories");
    let data = await response.json();

    let menu = document.querySelector("#categoryMenu");

    data.forEach(cat => {
        menu.innerHTML += `<option value="${cat.category}">${cat.category}</option>`;
    });
}
