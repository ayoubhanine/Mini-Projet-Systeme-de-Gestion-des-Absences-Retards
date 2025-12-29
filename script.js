 /* ======= PAGE PRÉSENCE ======*/
const listContainer = document.getElementById("listesetudiants");
const butt=document.getElementById("savePresence")
function afficherEtudiants() {
  listContainer.innerHTML = "";

  students
    .filter(s => s.status === "Active")
    .forEach(student => {
      const div = document.createElement("div");
      div.className = "student-detail d-flex align-items-center mb-2 p-3 rounded";
      div.dataset.id = student.id;

      div.innerHTML = `
        <div class="flex-grow-1">
          <strong>${student.nom}</strong><br>
          <small class="text-muted">${student.groupe}</small>
        </div>

        <button class="btn btn-success btn-present mx-1">Présent</button>
        <button class="btn btn-danger btn-absent mx-1">Absent</button>
        <button class="btn btn-warning btn-retard mx-1">Retard</button>
      `;

      listContainer.appendChild(div);
    });
}

listContainer.addEventListener("click", function (e) {
  const studentDiv = e.target.closest(".student-detail");
  if (!studentDiv) return;

  const studentId = Number(studentDiv.dataset.id);
  const student = students.find(s => s.id === studentId);
  const date = document.getElementById("date").value;

  if (!date) {
    alert("Veuillez sélectionner une date");
    return;
  }

  if (e.target.classList.contains("btn-present")) {
    student.presences.push({ date, statut: "Présent" });
  }

  if (e.target.classList.contains("btn-absent")) {
    student.presences.push({ date, statut: "Absent" });
  }

  if (e.target.classList.contains("btn-retard")) {
    afficherFormulaireRetard(studentDiv, student, date);
    return;
  }

  localStorage.setItem("students", JSON.stringify(students));
});


 /* FORMULAIRE RETARD*/
function afficherFormulaireRetard(studentDiv, student, date) {
  if (studentDiv.nextElementSibling?.classList.contains("retard-info")) return;

  const retardDiv = document.createElement("div");
  retardDiv.className = "retard-info";

  retardDiv.innerHTML = `
    <div class="mt-3 p-3 rounded border border-warning">
      <h6 class="text-warning fw-bold">Informations du retard</h6>

      <input type="time" class="form-control mb-2" id="heure">
      <select class="form-select mb-2" id="motif">
        <option value="">-- Motif --</option>
        <option>Transport</option>
        <option>Rendez-vous médical</option>
        <option>Problème familial</option>
        <option>Autre</option>
      </select>

      <textarea class="form-control mb-2" id="details" placeholder="Détails"></textarea>
      <button class="btn btn-warning btn-sm">Confirmer</button>
    </div>
  `;

  retardDiv.querySelector("button").addEventListener("click", () => {
    student.presences.push({
      date,
      statut: "Retard",
      heure: retardDiv.querySelector("#heure").value,
      motif: retardDiv.querySelector("#motif").value,
      details: retardDiv.querySelector("#details").value
    });

    localStorage.setItem("students", JSON.stringify(students));
    retardDiv.remove();//Supprime le formulaire de la page
    alert("Retard enregistré");
  });

  studentDiv.after(retardDiv);
}


 /* ======== AUTHENTIFICATION (LOGIN / LOGOUT)*/

// Soumission du formulaire de login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Identifiants (simple pour projet scolaire)
  if (username === "a" && password === "a") {
    localStorage.setItem("token", "true");

    document.getElementById("loginPage").classList.add("d-none");
    document.getElementById("dashboard").classList.remove("d-none");
  } else {
    alert("Nom d'utilisateur ou mot de passe incorrect");
  }
});

// Vérifier l'état de connexion au chargement
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  const dashboard = document.getElementById("dashboard");
  const loginPage = document.getElementById("loginPage");

  if (token === "true") {
    dashboard.classList.remove("d-none");
    loginPage.classList.add("d-none");
  } else {
    dashboard.classList.add("d-none");
    loginPage.classList.remove("d-none");
  }
});

// Déconnexion
document.getElementById("logoutBtn").addEventListener("click", function (e) {
  e.preventDefault();

  localStorage.removeItem("token");

  document.getElementById("dashboard").classList.add("d-none");
  document.getElementById("loginPage").classList.remove("d-none");
  document.getElementById("loginForm").reset();
});



/* NAVIGATION SIDEBAR*/
const navLinks = document.querySelectorAll(".nav-link[data-page]");
const pages = document.querySelectorAll(".page-content");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    pages.forEach(p => (p.style.display = "none"));

    const pageId =
      "page" +
      link.dataset.page.charAt(0).toUpperCase() +
      link.dataset.page.slice(1);

    document.getElementById(pageId).style.display = "block";
  });
});


/* * INITIAL LOAD*/
render();
afficherEtudiants();

