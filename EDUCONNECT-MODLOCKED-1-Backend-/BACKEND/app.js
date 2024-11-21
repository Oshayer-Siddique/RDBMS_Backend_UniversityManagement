// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./Admin/Config/db');
const departmentRoutes = require('./Admin/Routes/departmentRoutes');
const courseRoutes = require('./Admin/Routes/courseRoutes');
const studentRoutes = require('./Admin/Routes/studentRoutes');
const studentEnrollRoutes = require('./Admin/Routes/studentEnrollRoutes');
const teacherAssignRoutes = require('./Admin/Routes/teacherAssignRoutes');
const teacherRoutes = require('./Admin/Routes/teacherRoutes');
const assignmentRoutes = require('./Admin/Routes/assignmentRoutes');
const cors = require('cors');

// const a = require('./Admin/Routes/studentRoutes');
const port = 8000;



const app = express();
app.use(express.json());
app.use(cors({
  origin : "http://localhost:3000",
}));

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello, Admin!");
  });


app.use('/departments',departmentRoutes);
app.use('/courses',courseRoutes);
app.use('/students',studentRoutes);
app.use('/teacher',teacherRoutes);
app.use('/studentenroll',studentEnrollRoutes);
app.use('/teacherassign',teacherAssignRoutes);
app.use('/assignment',assignmentRoutes);







  


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });