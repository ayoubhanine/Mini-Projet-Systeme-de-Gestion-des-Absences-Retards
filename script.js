/***** INITIALISATION*/
let students = JSON.parse(localStorage.getItem("students")) || [];


 /* ======== GESTION DES ÉTUDIANTS ========*/

// Affichage tableau étudiants
function render() {
  const tbody = document.getElementById("studentTable");
  tbody.innerHTML = "";

  let active = 0;
  let inactive = 0;

  students.forEach((s, i) => {
    s.status === "Active" ? active++ : inactive++;

    tbody.innerHTML += `
      <tr>
        <td>${s.nom}</td>
        <td>${s.email}</td>
        <td>${s.groupe}</td>
        <td>
          <span class="badge ${s.status === "Active" ? "bg-success" : "bg-secondary"}"
                onclick="toggleStatus(${i})"
                style="cursor:pointer">
            ${s.status}
          </span>
        </td>
        <td>
          <i class="fa fa-edit mx-2" onclick="editStudent(${i})"></i>
          <i class="fa fa-trash text-danger" onclick="deleteStudent(${i})"></i>
        </td>
      </tr>
    `;
  });

  document.getElementById("total").innerText = students.length;
  document.getElementById("active").innerText = active;
  document.getElementById("inactive").innerText = inactive;

  localStorage.setItem("students", JSON.stringify(students));
}

// Ouvrir / fermer formulaire
function toggleForm() {
  document.getElementById("studentForm").classList.toggle("d-none");
}

// Ajouter / modifier étudiant
function saveStudent() {
  const nom = document.getElementById("nom").value.trim();
  const email = document.getElementById("email").value.trim();
  const groupe = document.getElementById("groupe").value.trim();
  const index = document.getElementById("index").value;

  if (!nom || !email || !groupe) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  const student = {
    id: index === "" ? Date.now() : students[index].id,
    nom,
    email,
    groupe,
    status: "Active",
    presences: index === "" ? [] : students[index].presences
  };

  if (index === "") {
    students.push(student);
  } else {
    students[index] = student;
  }
  localStorage.setItem("students", JSON.stringify(students));

  document.getElementById("nom").value = "";
  document.getElementById("email").value = "";
  document.getElementById("groupe").value = "";
  document.getElementById("index").value = "";

  toggleForm();
  render();
  afficherEtudiants(); 
}

// Éditer
function editStudent(i) {
  document.getElementById("nom").value = students[i].nom;
  document.getElementById("email").value = students[i].email;
  document.getElementById("groupe").value = students[i].groupe;
  document.getElementById("index").value = i;

  document.getElementById("studentForm").classList.remove("d-none");
}

// Supprimer
function deleteStudent(i) {
  if (confirm("Supprimer cet étudiant ?")) {
    students.splice(i, 1);
    render();
    afficherEtudiants();
  }
}

// Activer / désactiver
function toggleStatus(i) {
  students[i].status =
    students[i].status === "Active" ? "Inactive" : "Active";
  render();
  afficherEtudiants();
}

// Recherche
document.getElementById("search").addEventListener("keyup", function () {
  const val = this.value.toLowerCase();
  document.querySelectorAll("#studentTable tr").forEach(tr => {
    tr.style.display = tr.innerText.toLowerCase().includes(val) ? "" : "none";
  });
});


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

 /** ======== TABLEAU DE BORD (STATISTIQUES)*/

const absenceRate = document.getElementById("absence");
const retardRate = document.getElementById("retard");
const presenceRate = document.getElementById("presence");

const absenceTable = document.getElementById("absenceTable");
const retardTable = document.getElementById("retardTable");

function calculerStats() {
  let totalPresences = 0;
  let totalAbsences = 0;
  let totalRetards = 0;

  students.forEach(student => {
    student.presences.forEach(p => {
      if (p.statut === "Présent") totalPresences++;
      if (p.statut === "Absent") totalAbsences++;
      if (p.statut === "Retard") totalRetards++;
    });
  });

  const total = totalPresences + totalAbsences + totalRetards || 1;

  absenceRate.innerText = ((totalAbsences / total) * 100).toFixed(1) + "%";
  retardRate.innerText = ((totalRetards / total) * 100).toFixed(1) + "%";
  presenceRate.innerText = ((totalPresences / total) * 100).toFixed(1) + "%";
}

function afficherTopAbsents() {
  absenceTable.innerHTML = "";

  const sorted = [...students]
    .map(s => ({
      nom: s.nom,
      groupe: s.groupe,
      count: s.presences.filter(p => p.statut === "Absent").length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  sorted.forEach((s, i) => {
    absenceTable.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${s.nom} - ${s.groupe}</td>
        <td>${s.count}</td>
      </tr>
    `;
  });
}

function afficherTopRetards() {
  retardTable.innerHTML = "";

  const sorted = [...students]
    .map(s => ({
      nom: s.nom,
      groupe: s.groupe,
      count: s.presences.filter(p => p.statut === "Retard").length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  sorted.forEach((s, i) => {
    retardTable.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${s.nom} - ${s.groupe}</td>
        <td>${s.count}</td>
      </tr>
    `;
  });
}

function renderDashboard() {
  calculerStats();
  afficherTopAbsents();
  afficherTopRetards();
}

renderDashboard();


 /**  HISTORIQUE – ENAA (VERSION FINALE)*/

// Récupération des étudiants + présences
students = JSON.parse(localStorage.getItem("students")) || []; // 🔥 sans 'let'

// Conteneurs
const historyList = document.getElementById("historyList");
const detailsContainer = document.getElementById("detailsContainer");
const pageTitle = document.querySelector(".page-title");
const searchInput = document.getElementById("searchHistory");


/* *  Regrouper les présences par date*/
function getPresencesByDate() {
  const map = {};

  students.forEach(student => {
    if (!student.presences) return;

    student.presences.forEach(p => {
      if (!map[p.date]) {
        map[p.date] = { absents: 0, retards: 0, presents: 0, details: [] };
      }

      if (p.statut === "Absent") map[p.date].absents++;
      else if (p.statut === "Retard") map[p.date].retards++;
      else map[p.date].presents++;

      map[p.date].details.push({
        ...p,
        nom: student.nom,
        groupe: student.groupe,
        id: student.id || ""
      });
    });
  });

  return map;
}


 /**  Afficher la liste de l’historique*/
function renderHistory() {
  if (!historyList) return;

  const data = getPresencesByDate();
  historyList.innerHTML = "";

  Object.keys(data).sort().reverse().forEach(date => {
    const d = data[date];

    historyList.innerHTML += `
      <div class="card-history">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5>${date}</h5>
            <p>${d.absents} Absents | ${d.retards} Retards | ${d.presents} Présents</p>
          </div>
          <button class="btn-details" onclick="showDetails('${date}')">
            Voir détails
          </button>
        </div>
      </div>
    `;
  });
}

/*  Afficher les détails d’une date */
function showDetails(date) {
  const data = getPresencesByDate()[date];
  if (!data || !detailsContainer) return;

  pageTitle.innerText = "Détails de " + date;
  historyList.style.display = "none";
  detailsContainer.style.display = "block";
  detailsContainer.innerHTML = "";

  // Absents
  if (data.absents > 0) {
    detailsContainer.innerHTML += `<h4 class="text-danger">Absents (${data.absents})</h4>`;
    data.details.filter(d => d.statut === "Absent").forEach(d => {
      detailsContainer.innerHTML += createDetailCard(d, "danger", "Absent");
    });
  }

  // Retards
  if (data.retards > 0) {
    detailsContainer.innerHTML += `<h4 class="text-warning mt-4">Retards (${data.retards})</h4>`;
    data.details.filter(d => d.statut === "Retard").forEach(d => {
      const label = `${d.heure || ""} retard`;
      detailsContainer.innerHTML += createDetailCard(d, "warning", label);
    });
  }

  // Bouton retour
  detailsContainer.innerHTML += `
    <button class="btn btn-light mt-4" onclick="backToHistory()">
      ← Retour à l'historique
    </button>
  `;
}

/*  Carte détail étudiant */
function createDetailCard(d, color, label) {
  const initials = d.nom.split(" ").map(n => n[0]).join("").toUpperCase();

  return `
    <div class="card-history">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <div class="rounded-circle bg-${color} text-white d-flex
                      justify-content-center align-items-center"
               style="width:50px;height:50px;font-weight:bold;">
            ${initials}
          </div>
          <div class="ms-3">
            <h5 class="mb-1">${d.nom}</h5>
            <p class="mb-0">Groupe ${d.groupe}</p>
          </div>
        </div>
        <span class="badge bg-${color} px-3 py-2">${label}</span>
      </div>
    </div>
  `;
}

/*  Retour à la liste  */
function backToHistory() {
  pageTitle.innerText = "Historique des Absences & Retards";
  detailsContainer.style.display = "none";
  historyList.style.display = "block";
}

/* Recherche */
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    document.querySelectorAll("#historyList .card-history").forEach(card => {
      card.style.display = card.innerText.toLowerCase().includes(value)
        ? "block"
        : "none";
    });
  });
}

// Initialisation
renderHistory();
