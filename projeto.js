import { createClient } from '@supabase/supabase-js';

// Galeria de Professores - Web Semântica
// Schema.org Person + Organization estruturado

const galeriaDB = [
    {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Prof. Dr. João Silva",
        "jobTitle": "Professor de Engenharia",
        "department": "Engenharia de Software",
        "email": "joao.silva@universidade.edu",
        "telephone": "+55 11 3000-0000",
        "url": "https://universidade.edu/professores/joao-silva",
        "image": "https://universidade.edu/images/joao-silva.jpg",
        "expertise": ["JavaScript", "Python", "Arquitetura de Sistemas"],
        "workLocation": "Campus Central - Sala 301",
        "availableLanguage": ["pt", "en"],
        "award": "Melhor Professor 2023"
    }
];

function renderGaleria(professores) {
    const container = document.getElementById('galeria');
    
    professores.forEach(prof => {
        const card = document.createElement('article');
        card.setAttribute('itemscope', '');
        card.setAttribute('itemtype', 'https://schema.org/Person');
        card.innerHTML = `
            <h2 itemprop="name">${prof.name}</h2>
            <p itemprop="jobTitle">${prof.jobTitle}</p>
            <p itemprop="department">${prof.department}</p>
            <img itemprop="image" src="${prof.image}" alt="${prof.name}">
            <p><strong>Email:</strong> <span itemprop="email">${prof.email}</span></p>
            <p><strong>Tel:</strong> <span itemprop="telephone">${prof.telephone}</span></p>
            <p><strong>Especialidades:</strong> ${prof.expertise.join(', ')}</p>
            <p><strong>Localização:</strong> <span itemprop="workLocation">${prof.workLocation}</span></p>
        `;
        container.appendChild(card);
    });
}

// Inicializar ao carregar
document.addEventListener('DOMContentLoaded', () => {
    renderGaleria(galeriaDB);
    adicionarMetadadosSemanticos();
});

function adicionarMetadadosSemanticos() {
    const head = document.head;
    const metadados = {
        "application/ld+json": JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Galeria de Professores",
            "description": "Diretório de professores com metadados de web semântica",
            "url": "https://universidade.edu/professores"
        })
    };
    
    const script = document.createElement('script');
    script.type = "application/ld+json";
    script.textContent = metadados["application/ld+json"];
    head.appendChild(script);
}
const data = []; // Initialize data with an empty array or fetch data from a source

const container = document.getElementById('galeria'); // Define container again

data.forEach(d => {
  const card = document.createElement("div");
  card.className = "depoimento-card";

  const dataFormatada = new Date(d.created_at).toLocaleDateString("pt-BR");

  card.innerHTML = `
    <div class="depoimento-nome">${d.nome}</div>
    <div class="depoimento-data">${dataFormatada}</div>
    <div class="depoimento-texto">${d.comentario}</div>
  `;

  container.appendChild(card);
});
// Importar cliente Supabase

const supabaseUrl = 'https://seu-projeto.supabase.co';
const supabaseKey = 'sua-chave-publica';
const supabase = createClient(supabaseUrl, supabaseKey);

// Buscar depoimentos do Supabase
async function carregarDepoimentos() {
    try {
        const { data, error } = await supabase
            .from('depoimentos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        renderizarDepoimentos(data);
    } catch (err) {
        console.error('Erro ao carregar depoimentos:', err);
    }
}

// Salvar novo depoimento
async function salvarDepoimento(nome, comentario) {
    try {
        const { error } = await supabase
            .from('depoimentos')
            .insert([{ nome, comentario, created_at: new Date() }]);
        
        if (error) throw error;
        
        carregarDepoimentos();
    } catch (err) {
        console.error('Erro ao salvar depoimento:', err);
    }
}

function renderizarDepoimentos(depoimentos) {
    const container = document.getElementById('galeria');
    container.innerHTML = '';
    
    depoimentos.forEach(d => {
        const card = document.createElement('div');
        card.className = 'depoimento-card';
        const dataFormatada = new Date(d.created_at).toLocaleDateString('pt-BR');
        card.innerHTML = `
            <div class="depoimento-nome">${d.nome}</div>
            <div class="depoimento-data">${dataFormatada}</div>
            <div class="depoimento-texto">${d.comentario}</div>
        `;
        container.appendChild(card);
    });
}

// Carregar ao iniciar
carregarDepoimentos();