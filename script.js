
document.addEventListener("DOMContentLoaded", function () {

   
    const historyContainer = document.getElementById("historyContainer");

  
    if (historyContainer) {

    
        const presences = JSON.parse(localStorage.getItem("presences")) || [];

       
        presences.forEach(function (jour, index) {

         
            let absents = 0;
            let retards = 0;
            let presents = 0;

            jour.records.forEach(function (r) {
                if (r.statut === "Absent") absents++;
                if (r.statut === "Retard") retards++;
                if (r.statut === "Present") presents++;
            });

           
            historyContainer.innerHTML += `
                <div class="card-history">
                    <h5>${jour.date}</h5>
                    <p>
                        ${absents} Absents |
                        ${retards} Retards |
                        ${presents} Présents
                    </p>
                    <button class="btn-details" onclick="voirDetails(${index})">
                        Voir détails
                    </button>
                </div>
            `;
        });
    }

   
    const searchInput = document.querySelector(".search-box");

    if (searchInput) {
        searchInput.addEventListener("keyup", function () {
            const value = searchInput.value.toLowerCase();
            const cards = document.querySelectorAll(".card-history");

            cards.forEach(function (card) {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(value) ? "block" : "none";
            });
        });
    }

    
    const dateTitle = document.getElementById("dateTitle");

    if (dateTitle) {

        const presences = JSON.parse(localStorage.getItem("presences")) || [];
        const apprenants = JSON.parse(localStorage.getItem("apprenants")) || [];
        const index = localStorage.getItem("jourSelectionne");

        if (index !== null) {
            const jour = presences[index];
            dateTitle.innerText = "Détails de " + jour.date;

            const absentsContainer = document.getElementById("absentsContainer");
            const retardsContainer = document.getElementById("retardsContainer");

            jour.records.forEach(function (r) {
                const a = apprenants.find(ap => ap.id === r.idApprenant);

              
                if (r.statut === "Absent") {
                    absentsContainer.innerHTML += `
                        <div class="card-history">
                            <h5>${a.nom} ${a.prenom}</h5>
                            <span class="badge bg-danger">Absent</span>
                        </div>
                    `;
                }

             
                if (r.statut === "Retard") {
                    retardsContainer.innerHTML += `
                        <div class="card-history">
                            <h5>${a.nom} ${a.prenom}</h5>
                            <span class="badge bg-warning text-dark">
                                ${r.heureArrivee} - ${r.motif}
                            </span>
                        </div>
                    `;
                }
            });
        }
    }

});


function voirDetails(index) {
    localStorage.setItem("jourSelectionne", index);
    window.location.href = "details.html";
}
