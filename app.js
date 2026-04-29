const API_URL = "http://localhost:3000/api";
let token = localStorage.getItem("token");

// ---------------- UI ----------------
function showPostSection() {
    document.getElementById("authentication").classList.add("hidden");
    document.getElementById("postSection").classList.remove("hidden");
}

// ---------------- REGISTER ----------------
function register() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Username and password required");
        return;
    }

    fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => {
        if (!res.ok) throw new Error("Registration failed");
        return res.json();
    })
    .then(() => alert("Registration successful. Please login."))
    .catch(err => alert(err.message));
}

// ---------------- LOGIN ----------------
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Username and password required");
        return;
    }

    fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
    })
    .then(data => {
        if (!data.token) throw new Error("Invalid response");

        token = `Bearer ${data.token}`;
        localStorage.setItem("token", token);

        showPostSection();
        getPosts();
    })
    .catch(err => alert(err.message));
}

// ---------------- CREATE POST ----------------
function createPost() {
    const title = document.getElementById("postHead").value.trim();
    const content = document.getElementById("postDetails").value.trim();

    if (!title || !content) {
        alert("Title and content required");
        return;
    }

    fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: token })
        },
        body: JSON.stringify({ title, content })
    })
    .then(res => {
        if (!res.ok) throw new Error("Create failed");
        return res.json();
    })
    .then(() => {
        alert("Post created");
        document.getElementById("postHead").value = "";
        document.getElementById("postDetails").value = "";
        getPosts();
    })
    .catch(err => alert(err.message));
}

// ---------------- GET POSTS ----------------
function getPosts() {
    fetch(`${API_URL}/posts`, {
        headers: token ? { Authorization: token } : {}
    })
    .then(res => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
    })
    .then(posts => {
        const container = document.getElementById("getPosts");
        container.innerHTML = "";

        posts.forEach(post => {
            const h1 = document.createElement("h1");
            const h3 = document.createElement("h3");
            const btnUpdate = document.createElement("button");
            const btnDelete = document.createElement("button");

            h1.innerText = post.title;      // safer
            h3.innerText = post.content;

            btnUpdate.innerText = "Update";
            btnDelete.innerText = "Delete";

            btnUpdate.onclick = () => updatePost(post._id);
            btnDelete.onclick = () => deletePost(post._id);

            container.append(h1, h3, btnUpdate, btnDelete);
        });
    })
    .catch(err => console.error(err));
}

// ---------------- UPDATE POST ----------------
function updatePost(id) {
    const newTitle = prompt("Enter new title:");
    const newContent = prompt("Enter new content:");

    if (!newTitle || !newContent) return;

    fetch(`${API_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: token })
        },
        body: JSON.stringify({ title: newTitle, content: newContent })
    })
    .then(res => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
    })
    .then(() => {
        alert("Post updated");
        getPosts();
    })
    .catch(err => alert(err.message));
}

// ---------------- DELETE POST ----------------
function deletePost(id) {
    if (!confirm("Delete this post?")) return;

    fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: token } : {}
    })
    .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        return res.json();
    })
    .then(() => {
        alert("Post deleted");
        getPosts();
    })
    .catch(err => alert(err.message));
}

// ---------------- LOGOUT ----------------
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

    alert("Logged out");
}

// ---------------- AUTO LOGIN ----------------
if (token) {
    showPostSection();
    getPosts();
}
