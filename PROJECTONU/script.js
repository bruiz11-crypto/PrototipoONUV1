document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reportForm");
  const responseDiv = document.getElementById("response");
  const lista = document.getElementById('listaReportes');

  // Crear contenedor dinámico para los reportes
  const reportsContainer = document.createElement("div");
  reportsContainer.style.marginTop = "25px";
  document.querySelector(".container").appendChild(reportsContainer);

  // Mostrar historial de reportes si estamos en la página de historial
  if (lista) {
    let reportes = JSON.parse(localStorage.getItem('reportes')) || [];
    if (reportes.length === 0) {
      lista.innerHTML = '<p>No hay reportes registrados.</p>';
    } else {
      lista.innerHTML = reportes.map(reporte => {
        let urgencyColor;
        switch (reporte.urgency) {
          case "normal": urgencyColor = "#4CAF50"; break;
          case "alta": urgencyColor = "#FF9800"; break;
          case "critica": urgencyColor = "#F44336"; break;
          default: urgencyColor = "#1e3c72";
        }
        
        return `
          <div class="reporte-card" style="border-left-color: ${urgencyColor}">
            <h3 style="color: ${urgencyColor}">${reporte.subject}</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
              <span style="background: ${urgencyColor}; color: white; padding: 5px 10px; border-radius: 5px;">
                Urgencia: ${reporte.urgency}
              </span>
              <span style="color: #666;">
                ${reporte.fecha}
              </span>
            </div>
            <p><strong>ODS relacionado:</strong> ${reporte.ods}</p>
            <p><strong>Descripción:</strong> ${reporte.description}</p>
            ${reporte.name ? `<p><strong>Nombre:</strong> ${reporte.name}</p>` : ''}
            ${reporte.email ? `<p><strong>Email:</strong> ${reporte.email}</p>` : ''}
          </div>
        `;
      }).join('');
    }
  }

  // --------------------------
  // Animación de fade-in al hacer scroll
  const fadeSections = document.querySelectorAll(".container section, header");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
        entry.target.style.transition = "all 0.8s ease-out";
      }
    });
  }, { threshold: 0.2 });

  fadeSections.forEach(sec => {
    sec.style.opacity = 0;
    sec.style.transform = "translateY(30px)";
    observer.observe(sec);
  });

  // --------------------------
  // Cards ODS interactivos
  const odsCards = document.querySelectorAll(".ods-card");
  odsCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.07) rotate(-1deg)";
      card.style.boxShadow = "0 20px 60px rgba(0,0,0,0.35)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1) rotate(0)";
      card.style.boxShadow = "0 10px 35px rgba(0,0,0,0.25)";
    });
  });

  // --------------------------
  // Tooltips animados en inputs y selects
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach(input => {
    const tooltip = document.createElement("span");
    tooltip.style.position = "absolute";
    tooltip.style.background = "#1e3c72";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "6px 12px";
    tooltip.style.borderRadius = "6px";
    tooltip.style.fontSize = "0.9rem";
    tooltip.style.opacity = 0;
    tooltip.style.transition = "opacity 0.3s, transform 0.3s";
    tooltip.style.pointerEvents = "none";
    tooltip.textContent = input.placeholder;
    input.parentElement.style.position = "relative";
    input.parentElement.appendChild(tooltip);

    input.addEventListener("focus", () => {
      tooltip.style.opacity = 1;
      tooltip.style.transform = "translateY(-30px)";
    });
    input.addEventListener("blur", () => {
      tooltip.style.opacity = 0;
      tooltip.style.transform = "translateY(0)";
    });
  });

  // --------------------------
  // Manejo avanzado del formulario
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.name.value || "Anon";
    const email = form.email.value || "No proporcionado";
    const ods = form.ods.value;
    const subject = form.subject.value.trim();
    const description = form.description.value.trim();
    const urgency = form.urgency.value;

    if (!ods || !subject || !description) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Crear tarjeta dinámica de reporte
    const reportCard = document.createElement("div");
    reportCard.style.border = "3px solid";
    reportCard.style.borderRadius = "16px";
    reportCard.style.padding = "18px";
    reportCard.style.marginBottom = "15px";
    reportCard.style.transition = "all 0.5s ease, transform 0.4s ease";
    reportCard.style.opacity = 0;

    // Color según urgencia
    let color;
    switch (urgency) {
      case "normal": color = "#4CAF50"; break;
      case "alta": color = "#FF9800"; break;
      case "critica": color = "#F44336"; break;
    }

    reportCard.style.borderColor = color;
    reportCard.style.background = `rgba(${urgency === 'critica' ? '244,67,54' : urgency==='alta' ? '255,152,0' : '76,175,80'},0.1)`;

    reportCard.innerHTML = `
      <h3 style="margin-bottom:10px; color:${color};">${subject}</h3>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>ODS:</strong> ${ods}</p>
      <p><strong>Descripción:</strong> ${description}</p>
      <p><strong>Urgencia:</strong> ${urgency}</p>
    `;

    // Hover efecto para tarjetas de reporte
    reportCard.addEventListener("mouseenter", () => {
      reportCard.style.transform = "translateY(-5px) scale(1.02)";
      reportCard.style.boxShadow = "0 15px 50px rgba(0,0,0,0.3)";
    });
    reportCard.addEventListener("mouseleave", () => {
      reportCard.style.transform = "translateY(0) scale(1)";
      reportCard.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
    });

    reportsContainer.appendChild(reportCard);
    setTimeout(() => { reportCard.style.opacity = 1; }, 50);

    // Guardar en localStorage
    const datos = {
      name,
      email,
      ods,
      subject,
      description,
      urgency,
      fecha: new Date().toLocaleString()
    };
    let reportes = JSON.parse(localStorage.getItem('reportes')) || [];
    reportes.push(datos);
    localStorage.setItem('reportes', JSON.stringify(reportes));

    // Mensaje temporal animado
    responseDiv.textContent = "✅ Reporte enviado con éxito";
    responseDiv.style.background = "rgba(0,0,0,0.05)";
    responseDiv.style.padding = "12px";
    responseDiv.style.borderRadius = "10px";
    responseDiv.style.transform = "translateY(-5px)";
    responseDiv.style.transition = "all 0.4s ease";

    setTimeout(() => {
      responseDiv.style.transform = "translateY(0)";
      responseDiv.textContent = "";
      responseDiv.style.background = "transparent";
      responseDiv.style.padding = "0";
    }, 3000);

    form.reset();
  });

  // --- Ocultar navbar al hacer scroll hacia abajo y mostrar al subir ---
  (function() {
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScroll && currentScroll > 80) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      lastScroll = currentScroll;
    });
  })();

  // --- Mostrar footer solo al llegar al fondo ---
  (function() {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    footer.style.transform = 'translateY(100%)';
    window.addEventListener('scroll', function() {
      const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
      if (scrollBottom) {
        footer.style.transform = 'translateY(0)';
      } else {
        footer.style.transform = 'translateY(100%)';
      }
    });
  })();
});
