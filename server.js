const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DB_FILE = path.join(__dirname, "db.json");

app.use(express.json());
app.use(express.static(__dirname));

function readDB() {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Test
app.get("/api/data", (req, res) => {
    res.json(readDB());
});

// Login
app.post("/api/login", (req, res) => {

    const { username, password, role } = req.body;

    if (
        role === "student" &&
        username === "student" &&
        password === "student123"
    ) {
        return res.json({
            success: true,
            role: "student"
        });
    }

    if (
        role === "admin" &&
        username === "admin" &&
        password === "admin123"
    ) {
        return res.json({
            success: true,
            role: "admin"
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid username or password"
    });
});

// Get complaints
app.get("/api/complaints", (req, res) => {
    const db = readDB();
    res.json(db.complaints);
});

// Add complaint
app.post("/api/complaints", (req, res) => {

    const db = readDB();

    const complaint = {
        id: Date.now(),
        text: req.body.text,
        status: "Pending",
        date: new Date().toLocaleString()
    };

    db.complaints.push(complaint);

    writeDB(db);

    res.json({
        success: true,
        complaint
    });
});

// Resolve complaint
app.patch("/api/complaints/:id", (req, res) => {

    const db = readDB();

    const id = Number(req.params.id);

    const complaint = db.complaints.find(
        c => c.id === id
    );

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found"
        });
    }

    complaint.status = "Resolved";

    writeDB(db);

    res.json({
        success: true,
        complaint
    });
});

// Delete complaint
app.delete("/api/complaints/:id", (req, res) => {

    const db = readDB();

    const id = Number(req.params.id);

    db.complaints = db.complaints.filter(
        c => c.id !== id
    );

    writeDB(db);

    res.json({
        success: true
    });
});
// ==================== NOTICES ====================

// Get all notices
app.get("/api/notices", (req, res) => {
    const db = readDB();
    res.json(db.notices);
});

// Add notice
app.post("/api/notices", (req, res) => {

    const db = readDB();

    const notice = {
        id: Date.now(),
        title: req.body.title,
        message: req.body.message,
        date: new Date().toLocaleDateString()
    };

    db.notices.push(notice);

    writeDB(db);

    res.json({
        success: true,
        notice
    });
});

// Delete notice
app.delete("/api/notices/:id", (req, res) => {

    const db = readDB();

    const id = Number(req.params.id);

    db.notices = db.notices.filter(
        notice => notice.id !== id
    );

    writeDB(db);

    res.json({
        success: true
    });
});
// ==================== RULES MANAGEMENT ====================

// Get rules
app.get("/api/rules", (req, res) => {
    const db = readDB();
    res.json(db.rules);
});

// Add rule
app.post("/api/rules", (req, res) => {
    const db = readDB();

    const rule = {
        id: Date.now(),
        title: req.body.title,
        description: req.body.description,
        date: new Date().toLocaleDateString()
    };

    db.rules.push(rule);
    writeDB(db);

    res.json({
        success: true,
        rule
    });
});

// Delete rule
app.delete("/api/rules/:id", (req, res) => {
    const db = readDB();
    const id = Number(req.params.id);

    db.rules = db.rules.filter(rule => rule.id !== id);

    writeDB(db);

    res.json({
        success: true
    });
});
// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log("--------------------------------");
    console.log("Smart Hostel Server Started");
    console.log(`http://localhost:${PORT}`);
    console.log("--------------------------------");
});