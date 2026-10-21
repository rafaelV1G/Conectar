const nav = document.getElementById("nav");
const menuToggle = document.querySelector(".menu-toggle");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

document.querySelectorAll("[data-scroll]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.scroll)?.scrollIntoView({behavior:"smooth"});
  });
});

function openModal(title, text) {
  modalTitle.textContent = title;
  modalText.textContent = text;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

document.querySelectorAll(".details").forEach(button => {
  button.addEventListener("click", () => openModal(
    button.dataset.title,
    "Este anúncio é um exemplo do projeto acadêmico. Na versão final, podemos colocar fotos reais, localização, características, valor e um botão de contato."
  ));
});

document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("click", () => openModal(
    card.dataset.service,
    "Você pode transformar esta categoria em uma busca completa, mostrando profissionais, descrição do serviço, cidade, faixa de preço e formas de contato."
  ));
});

const searchInput = document.getElementById("mainSearch");
const typeFilter = document.getElementById("typeFilter");
const searchBtn = document.getElementById("searchBtn");

function runSearch() {
  const term = searchInput.value.trim().toLowerCase();
  const type = typeFilter.value;
  const cards = document.querySelectorAll(".listing-card");
  let visible = 0;

  cards.forEach(card => {
    const matchesText = !term || card.dataset.search.includes(term);
    const matchesType = type === "todos" || card.dataset.kind === type;
    const show = matchesText && matchesType;
    card.style.display = show ? "" : "none";
    if (show) visible++;
  });

  document.getElementById("imoveis").scrollIntoView({behavior:"smooth"});
  if (term && visible === 0) {
    openModal("Nenhum resultado", "Não encontramos um anúncio com esse termo nesta demonstração. Na versão final, podemos ampliar o cadastro e a busca.");
  }
}
searchBtn.addEventListener("click", runSearch);
searchInput.addEventListener("keydown", e => { if (e.key === "Enter") runSearch(); });

document.getElementById("whatsappBtn").addEventListener("click", () => {
  openModal("Contato", "Aqui podemos colocar o número real do WhatsApp da empresa e abrir uma conversa com uma mensagem pronta.");
});
document.getElementById("registerBtn").addEventListener("click", () => {
  openModal("Cadastro", "Na próxima versão podemos criar um formulário para cadastrar imóvel ou serviço, com validação dos campos.");
});
