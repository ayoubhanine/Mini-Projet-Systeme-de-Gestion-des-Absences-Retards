let students = JSON.parse(localStorage.getItem("students")) || [];

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
