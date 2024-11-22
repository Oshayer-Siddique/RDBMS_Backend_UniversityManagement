import React, { useState } from "react";
import "../styles/AdminStudentRegister.css";

const AdminStudentRegister = () => {
  const [formData, setFormData] = useState({
    studentfirstName: "",
    studentmiddleName: "",
    studentlastName: "",
    studentdateOfBirth: "",
    studentID: "",  // Use studentID for consistency with form input
    studentDepartment: "",
    studentstreetAddress: "",
    studentcity: "",
    studentstate: "",
    studentcountry: "",
    studentzipCode: "",
    studentemail: "",
    studentphone: "",
    studentguardianPhone: "",
    studentbloodGroup: "",
    studentPass: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send data to backend
    try {
      const response = await fetch('http://localhost:8000/students/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: formData.studentID,
          name: `${formData.studentfirstName} ${formData.studentmiddleName} ${formData.studentlastName}`,
          email: formData.studentemail,
          password: formData.studentPass || 'defaultPassword',
          address: `${formData.studentstreetAddress}, ${formData.studentcity}, ${formData.studentstate}, ${formData.studentcountry} - ${formData.studentzipCode}`,
          date_of_birth: formData.studentdateOfBirth,
          department: formData.studentDepartment,
          phone_number: formData.studentphone,
          blood_group: formData.studentbloodGroup,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Student Registered Successfully:", data);
      } else {
        const error = await response.json();
        console.error("Failed to Register Student:", error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form className="adminstudentform" onSubmit={handleSubmit}>

      <h2>Student Registration Form</h2>

      <section className="adminstudentformsection">
        <fieldset>
          <legend>Personal Information</legend>
          <input
            type="text"
            name="studentfirstName"
            placeholder="First Name"
            value={formData.studentfirstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="studentmiddleName"
            placeholder="Middle Name"
            value={formData.studentmiddleName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="studentlastName"
            placeholder="Last Name"
            value={formData.studentlastName}
            onChange={handleChange}
          />
          <input
            type="date"
            name="studentdateOfBirth"
            placeholder="Date of Birth"
            value={formData.studentdateOfBirth}
            onChange={handleChange}
          />
          <input
            type="text"
            name="studentguardianPhone"
            placeholder="Guardian Phone Number"
            value={formData.studentguardianPhone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="studentbloodGroup"
            placeholder="Blood Group"
            value={formData.studentbloodGroup}
            onChange={handleChange}
          />
        </fieldset>
      </section>

      <section className="adminstudentformsection">
        <fieldset>
          <legend>Department</legend>
          <input
            type="text"
            name="studentDepartment"
            placeholder="Department Name"
            value={formData.studentDepartment}
            onChange={handleChange}
          />
        </fieldset>
      </section>

      <section className="adminstudentformsection">
        <fieldset>
          <legend>Address</legend>
          <input
            type="text"
            name="studentstreetAddress"
            placeholder="Street Address"
            value={formData.studentstreetAddress}
            onChange={handleChange}
          />
          <input
            type="text"
            name="studentcity"
            placeholder="City"
            value={formData.studentcity}
            onChange={handleChange}
          />
          <input
            type="text"
            name="studentstate"
            placeholder="State / Province"
            value={formData.studentstate}
            onChange={handleChange}
          />
          <input
            type="text"
            name="studentcountry"
            placeholder="Country"
            value={formData.studentcountry}
            onChange={handleChange}
          />
          <input
            type="text"
            name="studentzipCode"
            placeholder="ZIP Code"
            value={formData.studentzipCode}
            onChange={handleChange}
          />
        </fieldset>
      </section>

      <section className="adminstudentformsection">
        <fieldset>
          <legend>Contact Information</legend>
          <input
            type="email"
            name="studentemail"
            placeholder="E-mail Address"
            value={formData.studentemail}
            onChange={handleChange}
          />
          <input
            type="text"
            name="studentphone"
            placeholder="Phone Number"
            value={formData.studentphone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="studentPass"
            placeholder="Default password"
            value={formData.studentPass}
            onChange={handleChange}
          />
          <input
            type="text"
            name="studentID"
            placeholder="Student ID"
            value={formData.studentID}
            onChange={handleChange}
          />
        </fieldset>
      </section>

      <button className="studentregisterbutton" type="submit">
        Register this student
      </button>
    </form>
  );
};

export default AdminStudentRegister;
