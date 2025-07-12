const API_URL = "http://localhost:3000/api";
let token = localStorage.getItem("token");

function showPostSection(){
    document.getElementById("authentication").classList.add("hidden");
    document.getElementById("postSection").classList.remove("hidden");
}

function register(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert("Registration completed! Try logIn");
        } else {
            alert("Registration failed");
        }
    });
}


function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            token = `Bearer ${data.token}`;
            localStorage.setItem("token", token);
        } else {
            alert("Login failed");
        }
    });
    // showPostSection();
    // getPosts();
}

function createPost(){
    const title = document.getElementById("postHead").value;
    const content  = document.getElementById("postDetails").value;

    fetch(`${API_URL}/posts/`, {
        method: "POST",
        headers: { "Content-Type" : "application/json" ,
            'Authorization': `${token}`
        },
        body: JSON.stringify({ title, content })
    })
    .then(response => response.json())
    .then(data => {
        if (data._id) {
            alert("Post created successfully");
            document.getElementById("postHead").value = "";
            document.getElementById("postDetails").value = "";
            getPosts();
        } else {
            alert("Error creating post");
        }
    });
    getPosts();
}

function getPosts(){
    fetch(`${API_URL}/posts`, {
        headers: { "Authorization": `${token}` }
    })
    .then(response => response.json())
    .then(posts =>{
        const showPost = document.getElementById("getPosts");
        showPost.innerHTML = ""
        posts.forEach(post => {
            let title = post.title;
            let content = post.content;

            let h1Element = document.createElement("h1");
            let h3Element = document.createElement("h3");
            let btnUpdate = document.createElement("button");
            let btnDelete = document.createElement("button");

            btnUpdate.innerText = "Update";
            btnDelete.innerText = "Delete";

            btnUpdate.addEventListener("click", () => updatePost(post._id));
            btnDelete.addEventListener("click", () => deletePost(post._id));

            h1Element.innerHTML = title;
            h3Element.innerHTML = content;

            showPost.appendChild(h1Element);
            showPost.appendChild(h3Element);
            showPost.appendChild(btnUpdate);
            showPost.appendChild(btnDelete);
        });
    });
}
function updatePost(_id) {
    const newTitle = prompt("Enter new title:");
    const newContent = prompt("Enter new content:");
    console.log(_id)

    fetch(`${API_URL}/posts/${_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        },
        body : JSON.stringify({ title: newTitle, content: newContent })
    })
    .then(response => response.json())
    .then(data => {
        if (data._id) {
            alert("Post updated successfully");
            getPosts();
        } else {
            alert("Error updating post");
        }
    });
}

function deletePost(_id) {
    console.log(_id)
    if (confirm("Are you sure you want to delete this post?")) {
        fetch(`${API_URL}/posts/${_id}`, {
            method: "DELETE",
            headers: { 'Authorization': `${token}` }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert("Post deleted successfully");
                getPosts();
            } else {
                alert("Error deleting post");
            }
        });
    }
}


function logout() {
    localStorage.removeItem("token");
    token = null;

    document.getElementById("postSection").classList.add("hidden");
    document.getElementById("authentication").classList.remove("hidden");

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("postHead").value = "";
    document.getElementById("postDetails").value = "";

    document.getElementById("getPosts").innerHTML = "";
    alert("You have been logged out successfully");
}

if (token) {
    showPostSection();
}