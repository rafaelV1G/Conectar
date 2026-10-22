// ======================================================
// CONECTAR IMÓVEIS E SERVIÇOS
// JAVASCRIPT
// ======================================================


// ======================================================
// CONFIGURAÇÃO DO WHATSAPP
// ======================================================

// COLOQUE SEU NÚMERO AQUI
//
// Exemplo para:
// (34) 99999-9999
//
// Use:
// 5534999999999
//
// SEM +, espaços, parênteses ou hífen.

const WHATSAPP_NUMBER = "553491483936";


const WHATSAPP_MESSAGE =
    "Olá! Vim pelo site da Conectar Imóveis e Serviços e gostaria de saber mais.";


// ======================================================
// FUNÇÃO DO WHATSAPP
// ======================================================

function abrirWhatsApp(mensagem = WHATSAPP_MESSAGE) {

    const numero = WHATSAPP_NUMBER.replace(/\D/g, "");

    if (!numero || numero.length < 12) {

        alert(
            "Configure seu número de WhatsApp no arquivo script.js."
        );

        return;
    }

    const texto = encodeURIComponent(mensagem);

    const link =
        "https://wa.me/" +
        numero +
        "?text=" +
        texto;

    window.open(link, "_blank");

}


// ======================================================
// MENU MOBILE
// ======================================================

const mobileMenu =
    document.getElementById("mobileMenu");

const nav =
    document.getElementById("nav");


if (mobileMenu && nav) {

    mobileMenu.addEventListener("click", function () {

        nav.classList.toggle("open");

        if (nav.classList.contains("open")) {

            mobileMenu.textContent = "✕";

        } else {

            mobileMenu.textContent = "☰";

        }

    });

}


document.querySelectorAll("nav a").forEach(function (link) {

    link.addEventListener("click", function () {

        if (nav) {

            nav.classList.remove("open");

        }

        if (mobileMenu) {

            mobileMenu.textContent = "☰";

        }

    });

});


// ======================================================
// BOTÃO FALAR PELO WHATSAPP
// ======================================================

const whatsappButton =
    document.getElementById("whatsapp");


if (whatsappButton) {

    whatsappButton.addEventListener("click", function (event) {

        event.preventDefault();

        abrirWhatsApp();

    });

}


// ======================================================
// BOTÃO QUERO CADASTRAR
// ======================================================

// Por enquanto ele não faz nada,
// conforme você pediu.

const registerButton =
    document.getElementById("register");


if (registerButton) {

    registerButton.addEventListener("click", function () {

        // Futuramente podemos colocar
        // formulário de cadastro aqui.

    });

}


// ======================================================
// BOTÃO SOU PROFISSIONAL
// ======================================================

const professionalButton =
    document.getElementById("professionalBtn");


if (professionalButton) {

    professionalButton.addEventListener("click", function (event) {

        event.preventDefault();

        // Por enquanto não faz nada.

    });

}


// ======================================================
// FAVORITOS
// ======================================================

document.querySelectorAll(".heart").forEach(function (button) {

    button.addEventListener("click", function (event) {

        event.preventDefault();

        event.stopPropagation();

        button.classList.toggle("saved");

        if (button.classList.contains("saved")) {

            button.textContent = "♥";

        } else {

            button.textContent = "♡";

        }

    });

});


// ======================================================
// MODAL
// ======================================================

const modal =
    document.getElementById("modal");

const closeModalButton =
    document.getElementById("closeModal");

const modalTitle =
    document.getElementById("modalTitle");

const modalText =
    document.getElementById("modalText");

const modalAction =
    document.getElementById("modalAction");


function abrirModal(titulo, texto) {

    if (!modal) return;

    modalTitle.textContent = titulo;

    modalText.textContent = texto;

    modalAction.textContent = "Fechar";

    modal.classList.add("open");

}


function fecharModal() {

    if (!modal) return;

    modal.classList.remove("open");

}


if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        fecharModal
    );

}


if (modalAction) {

    modalAction.addEventListener(
        "click",
        fecharModal
    );

}


if (modal) {

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {

            fecharModal();

        }

    });

}


document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        fecharModal();

    }

});


// ======================================================
// BOTÕES VER IMÓVEL
// ======================================================

document.querySelectorAll(".details").forEach(function (button) {

    button.addEventListener("click", function () {

        const titulo =
            button.getAttribute("data-title") ||
            "Imóvel";

        abrirModal(

            titulo,

            "Este anúncio é uma demonstração do projeto. Na versão final podemos colocar localização, fotos adicionais, características, valor e contato do anunciante."

        );

    });

});


// ======================================================
// SERVIÇOS
// ======================================================

document.querySelectorAll("[data-service]").forEach(function (button) {

    button.addEventListener("click", function () {

        const servico =
            button.getAttribute("data-service");

        abrirModal(

            servico,

            "Aqui podemos colocar os profissionais disponíveis para esse serviço, informações, avaliações, cidade de atendimento e formas de contato."

        );

    });

});


// ======================================================
// PESQUISA
// ======================================================

const searchButton =
    document.getElementById("searchBtn");

const searchInput =
    document.getElementById("searchInput");

const category =
    document.getElementById("category");


function pesquisar() {

    if (!searchInput || !category) return;


    const termo =
        searchInput.value
            .trim()
            .toLowerCase();


    const categoria =
        category.value;


    const cards =
        document.querySelectorAll(".property-card");


    let encontrados = 0;


    cards.forEach(function (card) {

        const tags =
            (card.getAttribute("data-tags") || "")
                .toLowerCase();


        const tipo =
            card.getAttribute("data-kind") || "";


        const categoriaCorreta =
            categoria === "todos" ||
            tipo === categoria;


        const textoCorreto =
            termo === "" ||
            tags.includes(termo);


        if (
            categoriaCorreta &&
            textoCorreto
        ) {

            card.style.display = "";

            encontrados++;

        } else {

            card.style.display = "none";

        }

    });


    const emptyState =
        document.getElementById("emptyState");


    if (emptyState) {

        if (encontrados === 0) {

            emptyState.style.display = "block";

        } else {

            emptyState.style.display = "none";

        }

    }


    const imoveis =
        document.getElementById("imoveis");


    if (imoveis) {

        imoveis.scrollIntoView({
            behavior: "smooth"
        });

    }

}


if (searchButton) {

    searchButton.addEventListener(
        "click",
        pesquisar
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                pesquisar();

            }

        }
    );

}
