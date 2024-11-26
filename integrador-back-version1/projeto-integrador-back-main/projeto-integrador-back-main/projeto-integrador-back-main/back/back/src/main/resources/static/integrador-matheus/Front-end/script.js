const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sModelo = document.querySelector("#m-modelo");
const sAno = document.querySelector("#m-ano");
const sPreco = document.querySelector("#m-preco");
const sCor = document.querySelector("#m-cor");
const sPlaca = document.querySelector("#m-placa");
const btnSalvar = document.querySelector("#btnSalvar");

let itens = [];
const API_URL = "http://localhost:8080/carro";

// Função para abrir o modal, tanto para criar quanto para editar
function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  // Se for edição, preenche os campos com os dados do carro selecionado
  if (edit) {
    const item = itens[index];
    sModelo.value = item.modelo;
    sAno.value = item.ano;
    sPreco.value = item.preco;
    sCor.value = item.cor;
    sPlaca.value = item.placa;
  } else {
    // Limpa os campos do modal se for criação
    sModelo.value = '';
    sAno.value = '';
    sPreco.value = '';
    sCor.value = '';
    sPlaca.value = '';
  }

  // Definir o comportamento do botão salvar
  btnSalvar.onclick = () => {
    if (edit) {
      // Se for edição, chama a função para atualizar o carro
      atualizarCarro(itens[index].id, {
        modelo: sModelo.value,
        ano: sAno.value,
        preco: sPreco.value,
        cor: sCor.value,
        placa: sPlaca.value
      });
    } else {
      // Se for criação, chama a função para criar um novo carro
      criarCarro({
        modelo: sModelo.value,
        ano: sAno.value,
        preco: sPreco.value,
        cor: sCor.value,
        placa: sPlaca.value
      });
    }
    modal.classList.remove("active");
  };
}

// Função para carregar os itens da API
async function loadItens() {
  try {
    const response = await fetch(`http://localhost:8080/carro/listarCarro`);
    if (response.ok) {
      itens = await response.json();
      tbody.innerHTML = "";
      itens.forEach((item, index) => insertItem(item, index));
    } else {
      console.error("Erro ao carregar carros:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao listar carros:", error);
  }
}

// Função para adicionar um novo carro (POST)
async function criarCarro(carro) {
  try {
    const response = await fetch(`http://localhost:8080/carro/criarCarro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carro),
    });

    if (response.ok) {
      loadItens(); // Atualiza a lista de carros após criação
    } else {
      console.error("Erro ao criar carro:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao criar carro:", error);
  }
}

// Função para atualizar um carro (PUT)
async function atualizarCarro(id, carro) {
  try {
    const response = await fetch(`http://localhost:8080/carro/atualizarCarro/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carro),
    });

    if (response.ok) {
      loadItens(); // Atualiza a lista de carros após atualização
    } else {
      console.error("Erro ao atualizar carro:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao atualizar carro:", error);
  }
}

// Função para deletar um carro (DELETE)
async function deletarCarro(id) {
  try {
    const response = await fetch(`http://localhost:8080/carro/deletarCarro/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      loadItens(); // Atualiza a lista de carros após exclusão
    } else {
      console.error("Erro ao deletar carro:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao deletar carro:", error);
  }
}

// Função para exibir um item na tabela
function insertItem(item, index) {
  const row = document.createElement("tr");
  
  row.innerHTML = `
    <td>${item.modelo}</td>
    <td>${item.ano}</td>
    <td>${item.preco}</td>
    <td>${item.cor}</td>
    <td>${item.placa}</td>
    <td>
      <button onclick="openModal(true, ${index})">Editar</button>
      <button onclick="deletarCarro(${item.id})">Excluir</button>
    </td>
  `;

  tbody.appendChild(row);
}

// Carrega os carros ao inicializar a página
loadItens();
