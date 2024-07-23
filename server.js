/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Su Myat Pwint Soe Student ID: 160255238 Date: 7/7/2024
*
********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const path = require("path");
const collegeData = require("./modules/collegeData");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views/about.html"));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "views/htmlDemo.html"));
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course).then(data => {
            res.json(data);
        }).catch(err => {
            res.json({ message: "Not Found" });
        });
    } else {
        collegeData.getAllStudents().then(data => {
            res.json(data);
        }).catch(err => {
            res.json({ message: "Not Found" });
        });
    }
});

app.get("/tas", (req, res) => {
    collegeData.getTAs().then(data => {
        res.json(data);
    }).catch(err => {
        res.json({ message: "Not Found" });
    });
});

app.get("/courses", (req, res) => {
    collegeData.getCourses().then(data => {
        res.json(data);
    }).catch(err => {
        res.json({ message: "Not Found" });
    });
});

app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num).then(data => {
        res.json(data);
    }).catch(err => {
        res.json({ message: "Not Found" });
    });
});

// Route to render form
app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, "views/addStudent.html"));
});

// Route to handle form submission
app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body).then(() => {
        res.redirect("/students");
    }).catch(err => {
        res.status(500).send("Unable to add student");
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// Initialize the data and start the server
collegeData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on port: ${HTTP_PORT}`);
    });
}).catch(err => {
    console.log(`Unable to start server: ${err}`);
});

module.exports = app;
