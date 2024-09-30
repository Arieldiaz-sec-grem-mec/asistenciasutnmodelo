// URL de la Web App desplegada en Google Apps Script
const webAppUrl = 'https://script.google.com/macros/s/AKfycbxU2236K_T4KIbO68baTaTM6cReQGGWksFW2HHnE3z2o6S1Zd7tqw85qQuQpWBkTpZg/exec';

// Cargar la lista de estudiantes desde la Web App
function loadStudents() {
    fetch(`${webAppUrl}?action=getStudents`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const studentList = document.getElementById('studentList');
                studentList.innerHTML = '';
                data.students.forEach((student, index) => {
                    const div = document.createElement('div');
                    div.className = 'student';
                    div.innerHTML = `<span onclick="toggleAttendance(this, ${index})">${student}</span>`;
                    studentList.appendChild(div);
                });
            } else {
                console.error('Error al cargar los estudiantes:', data.error);
            }
        })
        .catch(error => console.error('Error al cargar los estudiantes:', error));
}

// Cambiar el estado de asistencia
function toggleAttendance(element, index) {
    element.parentElement.classList.toggle('selected');
}

// Enviar el formulario de asistencia
function submitForm() {
    const attendanceData = [];
    const students = document.querySelectorAll('.student');
    students.forEach((student, index) => {
        const status = student.classList.contains('selected') ? 'Presente' : 'Ausente';
        attendanceData.push({ name: student.innerText, status: status }); // Modificar aquí
    });

    fetch(webAppUrl, {
        method: 'POST',
        body: JSON.stringify(attendanceData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Asistencia enviada con éxito');
                location.reload();
            } else {
                console.error('Error al enviar la asistencia:', data.error);
            }
        })
        .catch(error => console.error('Error al enviar la asistencia:', error));
}


// Cargar estudiantes al iniciar
window.onload = loadStudents;
