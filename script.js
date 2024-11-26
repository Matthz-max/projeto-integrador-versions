const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sModelo = document.querySelector("#m-modelo");
const sAno = document.querySelector("#m-ano");
const sPreco = document.querySelector("#m-preco");
const sCor = document.querySelector("#m-cor");
const sPlaca = document.querySelector("#m-placa");
const btnSalvar = document.querySelector("#btnSalvar");
const modalConfirm = document.querySelector("#modalConfirm");
const btnConfirmDelete = document.querySelector("#btnConfirmDelete");
const btnCancelDelete = document.querySelector("#btnCancelDelete");

// URL da API
const API_URL = "http://localhost:8080/carro";

// Variáveis para o gerenciamento do estado
let itens = [];
let modelo;
let id = undefined;

// Abrir o modal
function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  modal.onclick = (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      modal.classList.remove("active");
    }
  };

  if (edit) {
    sModelo.value = itens[index].modelo;
    sAno.value = itens[index].ano;
    sPreco.value = itens[index].preco;
    sCor.value = itens[index].cor;
    sPlaca.value = itens[index].placa;
    modelo = index;
  } else {
    sModelo.value = "";
    sAno.value = "";
    sPreco.value = "";
    sCor.value = "";
    sPlaca.value = "";
  }
}

// Função para carregar os carros
async function loadItens() {
  try {
    const response = await fetch(`${API_URL}/listarcarro`);  
    if (response.ok) {
      const carros = await response.json();  
      itens = carros;  
      tbody.innerHTML = ''; 
      carros.forEach((item, index) => {
        insertItem(item, index);  
      });
    } else {
      console.error("Erro ao carregar carros:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao carregar carros:", error);
  }
}

// Função para inserir um item na tabela
function insertItem(item, index) {
  let tr = document.createElement("tr");
  tr.innerHTML = `
    <td><img src="${item.imagemUrl}" alt="Imagem do Carro" style="max-width: 100px; max-height: 100px;" /></td>
    <td>${item.modelo}</td>
    <td>${item.ano}</td>
    <td>${item.preco}</td>
    <td>${item.cor}</td>
    <td>${item.placa}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
    </td>
    <td class="acao">
      <button onclick="showConfirmDeleteModal(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

// Função para abrir modal de confirmação de exclusão
function showConfirmDeleteModal(index) {
  modalConfirm.classList.add("active");  

  btnConfirmDelete.onclick = () => {
    deleteItem(index);  
    modalConfirm.classList.remove("active");  
  };

  btnCancelDelete.onclick = () => {
    modalConfirm.classList.remove("active");  
  };
}

// Função para deletar um carro
async function deleteItem(index) {
  const id = itens[index].id;  
  try {
    const response = await fetch(`${API_URL}/deletecarro${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      loadItens(); 
    } else {
      console.error("Erro ao deletar carro:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao deletar carro:", error);
  }
}

// Função para criar ou atualizar um carro
async function salvarCarro(event) {
  event.preventDefault();

  const carro = {
    modelo: sModelo.value,
    ano: sAno.value,
    preco: sPreco.value,
    cor: sCor.value,
    placa: sPlaca.value,
    imagemUrl: "default-image-url", // Ajustar com a URL da imagem
  };

  if (modelo !== undefined) {
   
    const id = itens[modelo].id;
    await atualizarcarro(id, carro);
  } else {
    
    await criarcarro(carro);
  }
}

// Função para criar um novo carro
async function criarcarro(carro) {
  try {
    const response = await fetch(`${API_URL}/criarcarro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carro),
    });

    if (response.ok) {
      loadItens(); 
      modal.classList.remove("active");  
    } else {
      console.error("Erro ao criar carro:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao criar carro:", error);
  }
}
// Função para atualizar um carro
async function atualizarcarro(id, carro) {
  try {
    const response = await fetch(`${API_URL}/atualizarcarro${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carro),
    });

    if (response.ok) {
      loadItens();  
      modal.classList.remove("active");  
    } else {
      console.error("Erro ao atualizar carro:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao atualizar carro:", error);
  }
}
 
loadItens();
btnSalvar.addEventListener("click", salvarCarro);
