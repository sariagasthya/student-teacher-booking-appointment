// Registration
document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = {
        name: document.getElementById('name').value,
        role: document.getElementById('role').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration Successful!');
});
// Login System
document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
        alert(`Welcome ${user.role}!`);
        localStorage.setItem('loggedInUser', JSON.stringify(user));

        // Redirect based on role
        window.location.href = `${user.role}.html`;
    } else {
        alert('Invalid login credentials.');
    }
});

// Student Booking
document.getElementById('book-appointment')?.addEventListener('click', () => {
    const teacherName = document.getElementById('teacher-name').value;
    const time = document.getElementById('appointment-time').value;
    const message = document.getElementById('appointment-message').value;
    const student = JSON.parse(localStorage.getItem('loggedInUser'));

    if (teacherName && time && message) {
        const appointment = { student: student.email, teacher: teacherName, time, message, status: 'Pending' };
        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        alert('Appointment request sent!');
    } else {
        alert('Please fill all fields.');
    }
});

// Admin Panel Script

// Add Teacher
const teacherForm = document.getElementById('add-teacher-form');
teacherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('teacher-name').value;
    const department = document.getElementById('teacher-dept').value;
    const subject = document.getElementById('teacher-subject').value;

    let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    teachers.push({ name, department, subject });
    localStorage.setItem('teachers', JSON.stringify(teachers));

    alert('Teacher added successfully!');
    teacherForm.reset();
    displayTeachers();
});

// Display Teachers
function displayTeachers() {
    const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    const table = document.getElementById('teachers-table');
    table.innerHTML = '<tr><th>Name</th><th>Department</th><th>Subject</th><th>Action</th></tr>';
    teachers.forEach((teacher, index) => {
        table.innerHTML += `
            <tr>
                <td>${teacher.name}</td>
                <td>${teacher.department}</td>
                <td>${teacher.subject}</td>
                <td>
                    <button onclick="deleteTeacher(${index})">Delete</button>
                </td>
            </tr>`;
    });
}

// Delete Teacher
function deleteTeacher(index) {
    let teachers = JSON.parse(localStorage.getItem('teachers'));
    teachers.splice(index, 1);
    localStorage.setItem('teachers', JSON.stringify(teachers));
    displayTeachers();
}

// Display Students for Approval
function displayStudents() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const studentsTable = document.getElementById('students-table');
    studentsTable.innerHTML = '<tr><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr>';
    users.forEach((user, index) => {
        if (user.role === 'student' && !user.approved) {
            studentsTable.innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>Pending</td>
                    <td>
                        <button onclick="approveStudent(${index})">Approve</button>
                    </td>
                </tr>`;
        }
    });
}

// Approve Student
function approveStudent(index) {
    let users = JSON.parse(localStorage.getItem('users'));
    users[index].approved = true;
    localStorage.setItem('users', JSON.stringify(users));
    displayStudents();
}

// Load data on page load
window.onload = () => {
    displayTeachers();
    displayStudents();
};

// Teacher Dashboard Script

// Load teacher-specific appointments
function loadTeacherAppointments() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const table = document.getElementById('teacher-appointments');

    table.innerHTML = '<tr><th>Student</th><th>Time</th><th>Message</th><th>Status</th><th>Action</th></tr>';
    appointments.filter(app => app.teacher === user.email).forEach((app, index) => {
        table.innerHTML += `
            <tr>
                <td>${app.student}</td>
                <td>${app.time}</td>
                <td>${app.message}</td>
                <td>${app.status}</td>
                <td>
                    <button onclick="updateAppointmentStatus(${index}, 'Approved')">Approve</button>
                    <button onclick="updateAppointmentStatus(${index}, 'Rejected')">Cancel</button>
                </td>
            </tr>`;
    });
}

// Update appointment status
function updateAppointmentStatus(index, status) {
    let appointments = JSON.parse(localStorage.getItem('appointments'));
    appointments[index].status = status;
    localStorage.setItem('appointments', JSON.stringify(appointments));
    alert(`Appointment ${status}!`);
    loadTeacherAppointments();
}

// Display messages
function loadMessages() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const messageContainer = document.getElementById('messages-container');

    messageContainer.innerHTML = ''; // Clear previous messages
    appointments.filter(app => app.teacher === user.email).forEach(app => {
        messageContainer.innerHTML += `<p><strong>${app.student}:</strong> ${app.message}</p>`;
    });
}

// Load all appointments for the teacher
function loadAllAppointments() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const table = document.getElementById('all-appointments');

    table.innerHTML = '<tr><th>Student</th><th>Time</th><th>Message</th><th>Status</th></tr>';
    appointments.filter(app => app.teacher === user.email).forEach(app => {
        table.innerHTML += `
            <tr>
                <td>${app.student}</td>
                <td>${app.time}</td>
                <td>${app.message}</td>
                <td>${app.status}</td>
            </tr>`;
    });
}

// Logout function
document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
});

// Load data on page load
window.onload = () => {
    loadTeacherAppointments();
    loadMessages();
    loadAllAppointments();
};


// Auto-load relevant pages
if (window.location.pathname.includes('admin.html')) loadAdminAppointments();
if (window.location.pathname.includes('teacher.html')) loadTeacherAppointments();
