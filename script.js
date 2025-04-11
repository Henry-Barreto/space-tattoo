// ==================== SLIDER ====================
const initSlider = () => {
    const imageList = document.querySelector(".slider-wrapper .image-list");
    const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");
    const sliderScrollbar = document.querySelector(".container-wrapper .slider-scrollbar");
    const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");
    const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;

    scrollbarThumb.addEventListener("mousedown", (e) => {
        const startX = e.clientX;
        const thumbPosition = scrollbarThumb.offsetLeft;
        const maxThumbPosition = sliderScrollbar.getBoundingClientRect().width - scrollbarThumb.offsetWidth;

        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const newThumbPosition = thumbPosition + deltaX;
            const boundedPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition));
            const scrollPosition = (boundedPosition / maxThumbPosition) * maxScrollLeft;

            scrollbarThumb.style.left = `${boundedPosition}px`;
            imageList.scrollLeft = scrollPosition;
        }

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    });

    slideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id === "prev-slide" ? -1 : 1;
            const scrollAmount = imageList.clientWidth * direction;
            imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
    });

    const handleSlideButtons = () => {
        slideButtons[0].style.display = imageList.scrollLeft <= 0 ? "none" : "flex";
        slideButtons[1].style.display = imageList.scrollLeft >= maxScrollLeft ? "none" : "flex";
    }

    const updateScrollThumbPosition = () => {
        const scrollPosition = imageList.scrollLeft;
        const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
        scrollbarThumb.style.left = `${thumbPosition}px`;
    }

    imageList.addEventListener("scroll", () => {
        updateScrollThumbPosition();
        handleSlideButtons();
    });
}

window.addEventListener("resize", initSlider);
window.addEventListener("load", initSlider);
// ==================== SLIDER ====================

// ==================== LOGIN ====================
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("loginModal");
    const closeBtn = document.querySelector(".close-button");
    const loginForm = document.getElementById("loginForm");
    const loginError = document.getElementById("loginError");
    const userNameBtn = document.getElementById("userNameDisplay");
    const dropdown = document.getElementById("dropdownMenu");
    const logoutBtn = document.getElementById("logoutBtn");

    const loginRegistroDiv = document.querySelector(".login-registro");

    const USER_EMAIL = "teste@gmail.com";
    const USER_PASSWORD = "123456";

    function openModal() {
        modal.style.display = "flex";
    }

    function closeModal() {
        modal.style.display = "none";
        loginError.textContent = "";
    }

    function handleLogin(email, password, remember) {
        if (email === USER_EMAIL && password === USER_PASSWORD) {
            if (remember) {
                localStorage.setItem("isLoggedIn", "true");
            }
            updateLoginUI("Teste");
            closeModal();
        } else {
            loginError.textContent = "Email ou senha incorretos.";
        }
    }

    function updateLoginUI(name) {
        userNameBtn.textContent = `Olá, ${name}`;
        dropdown.style.display = "none";
        if (loginRegistroDiv) loginRegistroDiv.innerHTML = "Agendar <u>agora</u>";
    }

    function resetLoginUI() {
        userNameBtn.textContent = "login/regis";
        dropdown.style.display = "none";
        if (loginRegistroDiv) {
            loginRegistroDiv.innerHTML = `Entre/Registre<br>para <u>agendar</u>`;
        }
    }

    userNameBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const loggedUser = localStorage.getItem("userLogged");

        if (loggedUser) {
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        } else {
            openModal();
        }
    });

    if (loginRegistroDiv) {
        loginRegistroDiv.addEventListener("click", (e) => {
            e.preventDefault();
            const loggedUser = localStorage.getItem("userLogged");

            if (loggedUser) {
                console.log("Usuário logado! Ir para agendamento.");
            } else {
                openModal();
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("isLoggedIn");
            resetLoginUI();
            atualizarBotaoAgendar();
        });
    }

    closeBtn.addEventListener("click", closeModal);

    window.addEventListener("click", function (event) {
        if (!event.target.closest(".login") && dropdown) {
            dropdown.style.display = "none";
        }

        if (event.target === modal) {
            closeModal();
        }
    });

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const rememberMe = document.getElementById("rememberMe").checked;
        handleLogin(email, password, rememberMe);
    });

    const loggedUser = localStorage.getItem("userLogged");
    if (loggedUser) {
        updateLoginUI(loggedUser);
    } else {
        resetLoginUI();
    }
});
// ==================== LOGIN ====================

// ==================== FLATPICKR ====================
flatpickr("#inputAgendamento", {
    enableTime: true,
    dateFormat: "d/m/Y H:i",
    time_24hr: true,
    minDate: "today"
});
// ==================== FLATPICKR ====================

// ==================== AGENDAMENTO - POPUP ====================
document.getElementById("btnAgendamento").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("popupAgendamento").style.display = "block";
});

document.getElementById("fecharAgendamento").addEventListener("click", function () {
    document.getElementById("popupAgendamento").style.display = "none";
});

window.addEventListener("click", function (event) {
    const popup = document.getElementById("popupAgendamento");
    if (event.target === popup) {
        popup.style.display = "none";
    }
});
// ==================== AGENDAMENTO - POPUP ====================

// ==================== AGENDAMENTO - CONFIRMAR ====================
document.getElementById("btnConfirmarAgendamento").addEventListener("click", function () {
    const dataSelecionada = document.getElementById("inputAgendamento").value;
    const msg = document.getElementById("msgSucessoAgendamento");

    if (dataSelecionada.trim() !== "") {
        msg.style.display = "block";

        let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
        agendamentos.push(dataSelecionada);
        localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

        setTimeout(() => {
            msg.style.display = "none";
            document.getElementById("popupAgendamento").style.display = "none";
            document.getElementById("inputAgendamento").value = "";
        }, 2000);
    } else {
        alert("Por favor, selecione uma data e hora antes de confirmar.");
    }
});
// ==================== AGENDAMENTO - CONFIRMAR ====================

// ==================== AGENDAMENTO - LISTAGEM ====================
const btnMeusAgendamentos = document.getElementById("meusAgendamentos");
const modalAgendamentos = document.getElementById("modalAgendamentos");
const listaAgendamentos = document.getElementById("listaAgendamentos");
const closeAgendamentos = document.querySelector(".close-agendamentos");

btnMeusAgendamentos.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarAgendamentos();
    modalAgendamentos.style.display = "block";
});

closeAgendamentos.addEventListener("click", () => {
    modalAgendamentos.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modalAgendamentos) {
        modalAgendamentos.style.display = "none";
    }
});

function mostrarAgendamentos() {
    listaAgendamentos.innerHTML = "";
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

    if (agendamentos.length === 0) {
        listaAgendamentos.innerHTML = "<li>Nenhum agendamento encontrado.</li>";
    } else {
        agendamentos.forEach(data => {
            const item = document.createElement("li");
            item.textContent = formatarData(data);
            listaAgendamentos.appendChild(item);
        });
    }
}

function formatarData(dataStr) {
    const data = new Date(dataStr);
    return data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}
// ==================== AGENDAMENTO - LISTAGEM ====================

// ==================== LOGIN/AGENDAR - BOTÃO ====================
const loginRegistroDiv = document.querySelector(".login-registro");

function estaLogado() {
    return localStorage.getItem("isLoggedIn") === "true";
}

function atualizarBotaoAgendar() {
    if (estaLogado()) {
        loginRegistroDiv.innerHTML = `Agendar <u>agora</u>`;
        loginRegistroDiv.classList.add("botao-agendar");

        loginRegistroDiv.onclick = function () {
            document.getElementById("btnAgendamento").style.display = "block";
        };
    } else {
        loginRegistroDiv.innerHTML = `Entre/Registre para <u>agendar</u>`;
        loginRegistroDiv.classList.remove("botao-agendar");

        loginRegistroDiv.onclick = function () {
            document.getElementById("loginModal").style.display = "block";
        };
    }
}

atualizarBotaoAgendar();

if (!window.atualizarBotaoAgendarGlobal) {
    window.atualizarBotaoAgendarGlobal = atualizarBotaoAgendar;
}
// ==================== LOGIN/AGENDAR - BOTÃO ====================