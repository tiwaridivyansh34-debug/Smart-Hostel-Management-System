// =========================
// LOGIN FUNCTION
// =========================

function login() {

    let username =
        document.getElementById("username").value.trim();

    let password =
        document.getElementById("password").value;

    let message =
        document.getElementById("loginMessage");


    if (username === "" || password === "") {

        message.innerText =
            "Please enter username and password.";

        message.style.color = "red";

        return;
    }


    // =========================
    // STUDENT LOGIN
    // =========================

    if (username === "student" && password === "student123") {

        message.innerText = "";

        document.getElementById("loginPage")
            .style.display = "none";

        document.getElementById("adminDashboard")
            .style.display = "none";

        document.getElementById("dashboard")
            .style.display = "flex";

        displayComplaints();

        return;
    }


    // =========================
    // ADMIN LOGIN
    // =========================

    if (username === "admin" && password === "admin123") {

        message.innerText = "";

        document.getElementById("loginPage")
            .style.display = "none";

        document.getElementById("dashboard")
            .style.display = "none";

        document.getElementById("adminDashboard")
            .style.display = "flex";

        displayAdminComplaints();

        return;
    }


    // =========================
    // INVALID LOGIN
    // =========================

    message.innerText =
        "Invalid username or password.";

    message.style.color = "red";
}


// =========================
// STUDENT SECTION NAVIGATION
// =========================

function showSection(sectionName) {

    let sections =
        document.querySelectorAll(".section");

    sections.forEach(function(section) {

        section.classList.add("hidden");

    });

    document.getElementById(sectionName)
        .classList.remove("hidden");
}


// =========================
// STUDENT LOGOUT
// =========================

function logout() {

    let confirmLogout =
        confirm("Are you sure you want to logout?");

    if (!confirmLogout) {
        return;
    }

    document.getElementById("dashboard")
        .style.display = "none";

    document.getElementById("loginPage")
        .style.display = "flex";

    document.getElementById("username")
        .value = "";

    document.getElementById("password")
        .value = "";

    document.getElementById("loginMessage")
        .innerText = "";
}


// =========================
// LOAD SAVED COMPLAINTS
// =========================

let complaints =
    JSON.parse(
        localStorage.getItem("hostelComplaints")
    ) || [];


// =========================
// DISPLAY STUDENT COMPLAINTS
// =========================

function displayComplaints() {

    let complaintList =
        document.getElementById("complaintList");

    complaintList.innerHTML = "";


    complaints.forEach(function(complaint) {

        let newComplaint =
            document.createElement("div");

        newComplaint.className =
            "complaint";

        newComplaint.innerHTML = `

            <strong>
                Complaint #${complaint.id}
            </strong>

            <p>
                ${complaint.text}
            </p>

            <span>
                Status: ${complaint.status}
            </span>

        `;

        complaintList.appendChild(
            newComplaint
        );

    });


    document.getElementById(
        "complaintCount"
    ).innerText =
        complaints.length + " Active";
}


// =========================
// SUBMIT COMPLAINT
// =========================

function submitComplaint() {

    let input =
        document.getElementById("complaintInput");

    let complaintText =
        input.value.trim();


    if (complaintText === "") {

        alert("Please enter a complaint.");

        return;
    }


    let newComplaint = {

        id: complaints.length + 1,

        text: complaintText,

        status: "Pending"

    };


    complaints.push(newComplaint);


    localStorage.setItem(
        "hostelComplaints",
        JSON.stringify(complaints)
    );


    input.value = "";


    displayComplaints();


    alert(
        "Complaint submitted successfully!"
    );
}


// =========================
// FEE PAYMENT DEMO
// =========================

function payFee() {

    alert(
        "Payment gateway demo. " +
        "Pending fee payment initiated."
    );
}


// =========================
// ADMIN SECTION NAVIGATION
// =========================

function showAdminSection(sectionName) {

    let sections =
        document.querySelectorAll(".admin-section");

    sections.forEach(function(section) {

        section.classList.add("hidden");

    });

    document.getElementById(sectionName)
        .classList.remove("hidden");
}


// =========================
// DISPLAY ADMIN COMPLAINTS
// =========================

function displayAdminComplaints() {

    let adminList =
        document.getElementById("adminComplaintList");

    let adminCount =
        document.getElementById("adminComplaintCount");


    adminList.innerHTML = "";


    adminCount.innerText =
        complaints.length + " Complaints";


    if (complaints.length === 0) {

        adminList.innerHTML = `

            <div class="info-box">

                <p>
                    No complaints submitted yet.
                </p>

            </div>

        `;

        return;
    }


    complaints.forEach(function(complaint) {

        let complaintBox =
            document.createElement("div");

        complaintBox.className =
            "complaint";


        complaintBox.innerHTML = `

            <h3>
                Complaint #${complaint.id}
            </h3>

            <p>
                <strong>Complaint:</strong>
                ${complaint.text}
            </p>

            <p>
                <strong>Status:</strong>
                ${complaint.status}
            </p>


            ${
                complaint.status === "Pending"

                ?

                `
                <button
                    onclick="resolveComplaint(${complaint.id})">

                    ✅ Mark as Resolved

                </button>
                `

                :

                `
                <p>
                    ✅ Complaint Resolved
                </p>
                `
            }

        `;


        adminList.appendChild(
            complaintBox
        );

    });
}


// =========================
// RESOLVE COMPLAINT
// =========================

function resolveComplaint(complaintId) {

    let complaint =
        complaints.find(function(item) {

            return item.id === complaintId;

        });


    if (!complaint) {

        alert("Complaint not found.");

        return;
    }


    complaint.status = "Resolved";


    localStorage.setItem(
        "hostelComplaints",
        JSON.stringify(complaints)
    );


    displayAdminComplaints();


    alert(
        "Complaint marked as resolved successfully!"
    );
}


// =========================
// ADMIN LOGOUT
// =========================

function adminLogout() {

    let confirmLogout =
        confirm("Are you sure you want to logout?");


    if (!confirmLogout) {
        return;
    }


    document.getElementById("adminDashboard")
        .style.display = "none";


    document.getElementById("loginPage")
        .style.display = "flex";


    document.getElementById("username")
        .value = "";


    document.getElementById("password")
        .value = "";


    document.getElementById("loginMessage")
        .innerText = "";
}


// =========================
// INITIAL LOAD
// =========================

displayComplaints();
// ==================== NOTICE MANAGEMENT ====================

async function loadNotices() {
    try {
        const response = await fetch("/api/notices");
        const notices = await response.json();

        const container = document.getElementById("studentNotices");

        if (!container) return;

        if (notices.length === 0) {
            container.innerHTML = "<p>No notices available.</p>";
            return;
        }

        container.innerHTML = notices.map(notice => `
            <div class="notice">
                <h3>${notice.title}</h3>
                <p>${notice.message}</p>
                <small>📅 ${notice.date}</small>
            </div>
        `).join("");

    } catch (error) {
        console.error("Error loading notices:", error);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    loadNotices();
    loadAdminNotices();
    loadRules();
    loadStudentRules();
});
// ==================== ADMIN NOTICE MANAGEMENT ====================

async function loadAdminNotices() {

    const container = document.getElementById("adminNoticeList");

    if (!container) return;

    try {

        const response = await fetch("/api/notices");
        const notices = await response.json();

        if (notices.length === 0) {
            container.innerHTML = "<p>No notices available.</p>";
            return;
        }

        container.innerHTML = notices.map(notice => `
            <div class="notice">
                <h3>${notice.title}</h3>
                <p>${notice.message}</p>
                <small>📅 ${notice.date}</small>

                <br><br>

                <button onclick="deleteNotice(${notice.id})">
                    🗑️ Delete
                </button>
            </div>
        `).join("");

    } catch (error) {
        console.error("Error loading admin notices:", error);
    }
}


async function addNotice() {

    const title = document.getElementById("noticeTitle").value.trim();
    const message = document.getElementById("noticeMessage").value.trim();

    if (!title || !message) {
        alert("Please enter title and message.");
        return;
    }

    await fetch("/api/notices", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title,
            message: message
        })

    });

    document.getElementById("noticeTitle").value = "";
    document.getElementById("noticeMessage").value = "";

    loadAdminNotices();

    alert("Notice added successfully!");
}


async function deleteNotice(id) {

    if (!confirm("Delete this notice?")) {
        return;
    }

    await fetch(`/api/notices/${id}`, {
        method: "DELETE"
    });

    loadAdminNotices();
}
// ==================== RULES MANAGEMENT ====================

async function loadRules() {
    const container = document.getElementById("adminRuleList");

    if (!container) {
        console.log("adminRuleList not found");
        return;
    }

    try {
        const response = await fetch("/api/rules");
        const rules = await response.json();

        console.log("Rules:", rules);

        if (rules.length === 0) {
            container.innerHTML = "<p>No rules available.</p>";
            return;
        }

        container.innerHTML = rules.map(rule => `
            <div class="notice">
                <h3>📜 ${rule.title}</h3>
                <p>${rule.description}</p>
                <small>📅 ${rule.date}</small>

                <br><br>

                <button onclick="deleteRule(${rule.id})">
                    🗑️ Delete
                </button>
            </div>
        `).join("");

    } catch (error) {
        console.error("Error loading rules:", error);
        container.innerHTML = "<p>Error loading rules.</p>";
    }
}


async function addRule() {

    const titleInput = document.getElementById("ruleTitle");
    const descriptionInput = document.getElementById("ruleDescription");

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title || !description) {
        alert("Please enter rule title and description.");
        return;
    }

    try {

        const response = await fetch("/api/rules", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                description: description
            })
        });

        const result = await response.json();

        console.log("Added rule:", result);

        if (!response.ok) {
            alert("Failed to add rule.");
            return;
        }

        titleInput.value = "";
        descriptionInput.value = "";

        await loadRules();

        alert("Rule added successfully!");

    } catch (error) {
        console.error("Error adding rule:", error);
        alert("Server error while adding rule.");
    }
}


async function deleteRule(id) {

    if (!confirm("Delete this rule?")) {
        return;
    }

    try {

        await fetch(`/api/rules/${id}`, {
            method: "DELETE"
        });

        await loadRules();

    } catch (error) {
        console.error("Error deleting rule:", error);
    }
}
async function loadStudentRules() {

    const container = document.getElementById("studentRules");

    if (!container) return;

    try {
        const response = await fetch("/api/rules");
        const rules = await response.json();

        if (rules.length === 0) {
            container.innerHTML = "<p>No rules available.</p>";
            return;
        }

        container.innerHTML = rules.map(rule => `
            <div class="notice">
                <h3>📜 ${rule.title}</h3>
                <p>${rule.description}</p>
                <small>📅 ${rule.date}</small>
            </div>
        `).join("");

    } catch (error) {
        console.error("Error loading student rules:", error);
    }
}