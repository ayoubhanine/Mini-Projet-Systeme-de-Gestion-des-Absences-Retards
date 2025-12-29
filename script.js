// Tableau des étudiants (localStorage)
let students = JSON.parse(localStorage.getItem("students")) || [];

// Afficher les étudiants
function renderStudents() {
  let tbody = document.getElementById("studentTable");
  tbody.innerHTML = "";

  students.forEach((s, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${s.nom}</td>
        <td>${s.email}</td>
        <td>${s.groupe}</td>
        <td>${s.status}</td>
        <td>
          <button onclick="editStudent(${i})">Edit</button>
          <button onclick="deleteStudent(${i})">Delete</button>
        </td>
      </tr>
    `;
  });

  localStorage.setItem("students", JSON.stringify(students));
}

// Ajouter étudiant
function addStudent() {
  let nom = document.getElementById("nom").value;
  let email = document.getElementById("email").value;
  let groupe = document.getElementById("groupe").value;

  if (nom === "" || email === "" || groupe === "") {
    alert("Remplir tous les champs");
    return;
  }

  students.push({
    nom: nom,
    email: email,
    groupe: groupe,
    status: "Active"
  });

  clearForm();
  renderStudents();
}

// Supprimer
function deleteStudent(index) {
  students.splice(index, 1);
  renderStudents();
}

// Modifier (remplir formulaire)
function editStudent(index) {
  document.getElementById("nom").value = students[index].nom;
  document.getElementById("email").value = students[index].email;
  document.getElementById("groupe").value = students[index].groupe;

  document.getElementById("saveBtn").onclick = function () {
    updateStudent(index);
  };
}

// Update étudiant
function updateStudent(index) {
  students[index].nom = document.getElementById("nom").value;
  students[index].email = document.getElementById("email").value;
  students[index].groupe = document.getElementById("groupe").value;

  clearForm();
  renderStudents();

  document.getElementById("saveBtn").onclick = addStudent;
}

// Vider formulaire
function clearForm() {
  document.getElementById("nom").value = "";
  document.getElementById("email").value = "";
  document.getElementById("groupe").value = "";
}

// Initialisation
renderStudents();
