// Sistema de Cadastro de Estudantes - JavaScript Simplificado

// Variáveis globais
let students = [];
let studentIdCounter = 1;

// Inicialização da aplicação
document.addEventListener("DOMContentLoaded", function() {
    console.log("Sistema inicializado");
    
    // Remove a linha de exemplo
    const exampleRow = document.querySelector(".example-row");
    if (exampleRow) {
        exampleRow.remove();
    }
    
    // Configura o formulário
    const form = document.getElementById("studentForm");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        addStudentFromForm();
    });
    
    // Configura formatação de telefone
    const telefoneInput = document.getElementById("telefone");
    telefoneInput.addEventListener("input", formatTelefone);
    
    updateTableDisplay();
});

// Função para adicionar estudante a partir do formulário
function addStudentFromForm() {
    // Coleta dados do formulário
    const ra = document.getElementById("ra").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const dataNascimento = document.getElementById("dataNascimento").value;
    const telefone = document.getElementById("telefone").value.trim();
    
    // Validação básica
    if (!ra || !nome || !dataNascimento || !telefone) {
        showMessage("Todos os campos são obrigatórios!", "error");
        return;
    }
    
    // Verifica se RA já existe
    if (students.some(student => student.ra === ra)) {
        showMessage("RA já existe no sistema!", "error");
        return;
    }
    
    // Cria objeto do estudante
    const student = {
        id: studentIdCounter++,
        ra: ra,
        nome: nome,
        dataNascimento: dataNascimento,
        telefone: telefone
    };
    
    // Adiciona à lista
    students.push(student);
    
    // Atualiza a tabela
    updateTableDisplay();
    
    // Limpa o formulário
    document.getElementById("studentForm").reset();
    
    // Mostra mensagem de sucesso
    showMessage("Estudante adicionado com sucesso!", "success");
    
    // Foca no primeiro campo
    document.getElementById("ra").focus();
    
    console.log("Estudante adicionado:", student);
}

// Remove um estudante da lista
function removeStudent(button) {
    const row = button.closest("tr");
    const studentId = parseInt(row.dataset.studentId);
    
    if (confirm("Tem certeza que deseja remover este estudante?")) {
        // Adiciona animação de saída
        row.classList.add("slide-out");
        
        // Remove após a animação
        setTimeout(() => {
            // Remove do array
            students = students.filter(student => student.id !== studentId);
            
            // Atualiza a tabela
            updateTableDisplay();
            
            // Mostra mensagem de sucesso
            showMessage("Estudante removido com sucesso!", "success");
            
            console.log("Estudante removido, ID:", studentId);
        }, 300); // Tempo da animação CSS
    }
}

// Atualiza a exibição da tabela
function updateTableDisplay() {
    const tableBody = document.getElementById("studentsTableBody");
    const emptyState = document.getElementById("emptyState");
    const table = document.querySelector(".students-table");
    
    // Limpa o corpo da tabela
    tableBody.innerHTML = "";
    
    if (students.length === 0) {
        // Mostra estado vazio
        emptyState.style.display = "block";
        table.style.display = "none";
    } else {
        // Esconde estado vazio e mostra tabela
        emptyState.style.display = "none";
        table.style.display = "table";
        
        // Adiciona cada estudante à tabela
        students.forEach(student => {
            const row = createStudentRow(student);
            tableBody.appendChild(row);
        });
    }
}

// Cria uma linha da tabela para um estudante
function createStudentRow(student) {
    const row = document.createElement("tr");
    row.dataset.studentId = student.id;
    row.classList.add("fade-in");
    
    // Formata a data de nascimento
    const formattedDate = formatDate(student.dataNascimento);
    
    row.innerHTML = `
        <td><strong>${escapeHtml(student.ra)}</strong></td>
        <td>${escapeHtml(student.nome)}</td>
        <td>${formattedDate}</td>
        <td>${escapeHtml(student.telefone)}</td>
        <td>
            <button class="btn-remove" onclick="removeStudent(this)" title="Remover estudante">
                <span class="btn-icon">×</span>
                Remover
            </button>
        </td>
    `;
    
    return row;
}

// Formatação automática de telefone
function formatTelefone(event) {
    let value = event.target.value.replace(/\D/g, "");
    
    if (value.length <= 11) {
        if (value.length <= 10) {
            // Formato: (XX) XXXX-XXXX
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, function(match, p1, p2, p3) {
                if (p3) return `(${p1}) ${p2}-${p3}`;
                if (p2) return `(${p1}) ${p2}`;
                if (p1) return `(${p1}`;
                return value;
            });
        } else {
            // Formato: (XX) XXXXX-XXXX
            value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, function(match, p1, p2, p3) {
                if (p3) return `(${p1}) ${p2}-${p3}`;
                if (p2) return `(${p1}) ${p2}`;
                return value;
            });
        }
    }
    
    event.target.value = value;
}

// Formatação de data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
}

// Escape HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Mostra mensagem de feedback
function showMessage(message, type) {
    // Remove mensagens anteriores
    const existingMessages = document.querySelectorAll(".success-message, .error-message");
    existingMessages.forEach(msg => msg.remove());
    
    // Cria nova mensagem
    const messageDiv = document.createElement("div");
    messageDiv.className = type === "success" ? "success-message" : "error-message";
    messageDiv.innerHTML = message;
    
    // Insere após o formulário
    const formSection = document.querySelector(".form-section");
    formSection.appendChild(messageDiv);
    
    // Remove automaticamente após 4 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 4000);
}

// Função para adicionar dados de exemplo (comentada para iniciar com tabela vazia)
// function addExampleData() {
//     const exampleStudents = [
//         {
//             ra: '2024001',
//             nome: 'Ana Silva Santos',
//             dataNascimento: '1998-03-15',
//             telefone: '11987654321'
//         },
//         {
//             ra: '2024002',
//             nome: 'Carlos Eduardo Lima',
//             dataNascimento: '1999-07-22',
//             telefone: '11976543210'
//         },
//         {
//             ra: '2024003',
//             nome: 'Beatriz Costa Oliveira',
//             dataNascimento: '2000-01-10',
//             telefone: '11965432109'
//         }
//     ];
    
//     exampleStudents.forEach(studentData => {
//         const student = {
//             id: studentIdCounter++,
//             ra: studentData.ra,
//             nome: studentData.nome,
//             dataNascimento: studentData.dataNascimento,
//             telefone: studentData.telefone
//         };
//         students.push(student);
//     });
    
//     updateTableDisplay();
//     showMessage('Dados de exemplo adicionados!', 'success');
// }

// Função de debug
function debugInfo() {
    console.log("Estudantes cadastrados:", students);
    console.log("Total de estudantes:", students.length);
    console.log("Próximo ID:", studentIdCounter);
}

// Atalhos de teclado
document.addEventListener("keydown", function(event) {
    // Ctrl + Enter para submeter formulário
    if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        addStudentFromForm();
    }
    
    // Escape para limpar formulário
    if (event.key === "Escape") {
        document.getElementById("studentForm").reset();
        document.getElementById("ra").focus();
    }
});

// Expõe funções globais necessárias
window.removeStudent = removeStudent;
// window.addExampleData = addExampleData; // Comentado para não expor a função de exemplo
window.debugInfo = debugInfo;
