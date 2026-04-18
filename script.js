/* ==========================================================================
   CONFIGURAÇÕES GERAIS E ESTADO
   ========================================================================== */
let producoesDoDia = [];

/* ==========================================================================
   AUTENTICAÇÃO E NAVEGAÇÃO
   ========================================================================== */
function fazerLogin() {
    const user = document.getElementById('login-email').value;
    if(user) {
        document.getElementById('user-display').innerText = user.toUpperCase();
        document.getElementById('tela-login').style.display = 'none';
        document.getElementById('app-principal').style.display = 'block';
    } else {
        alert("Digite um ID");
    }
}

function voltarHome() {
    document.getElementById('conteudo-modulo').style.display = 'none';
    document.getElementById('grid-home').style.display = 'grid';
    producoesDoDia = [];
}
function abrirModulo(nome) {
    document.getElementById('grid-home').style.display = 'none';
    document.getElementById('conteudo-modulo').style.display = 'block';
    
    const titulos = { 
        injecao: "INJEÇÃO", 
        bobines: "BOBINES", 
        serra: "SERRA", 
        embalagem: "EMBALAGEM", 
        gestao: "GESTÃO", 
        config: "AJUSTES" 
    };
    
    document.getElementById('titulo-modulo').innerText = titulos[nome];
    const render = document.getElementById('render-modulo');

    if (nome === 'injecao') {
        render.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; padding:15px;">
                <div class="card" onclick="exibirFormulario('injecao')"><i class="fas fa-plus"></i><span>Novo Relatório</span></div>
                <div class="card" onclick="exibirHistoricoModulo('injecao')"><i class="fas fa-history"></i><span>Histórico</span></div>
            </div>`;
    } 
    else if (nome === 'bobines') {
        renderizarMenuBobines();
    } 
    else if (nome === 'serra') {
        renderizarMenuSerra(); 
    }
    else if (nome === 'embalagem') {
        renderizarMenuEmbalagem(); // Nova função para Embalagem
    }
    else {
        render.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:200px; color:#94a3b8; text-align:center; padding:20px;">
                <i class="fas fa-laptop-code" style="font-size:40px; margin-bottom:15px; color:#3b82f6;"></i>
                <h3 style="color:white;">MÓDULO EM DESENVOLVIMENTO</h3>
                <p>Esta funcionalidade estará disponível em breve.</p>
            </div>`;
    }
}

/* ==========================================================================
   SEÇÃO: INJEÇÃO (ORIGINAL)
   ========================================================================== */
function exibirFormulario(modulo) {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('render-modulo').innerHTML = `
        <div style="padding: 15px;">
            <label style="font-size:12px; color:#94a3b8;">DATA DA PRODUÇÃO</label>
            <input type="date" id="data-producao" value="${hoje}" style="width:100%; padding:12px; background:#020617; color:white; border:1px solid #334155; border-radius:8px; margin-bottom:15px;">
            
            <label style="font-size:12px; color:#94a3b8;">TIPO DE PAINEL</label>
            <select id="inj-painel" style="width:100%; padding:12px; background:#020617; color:white; border:1px solid #334155; border-radius:8px; margin-bottom:15px;">
                <option value="5 Ondas">5 Ondas</option>
                <option value="Telha Canudo">Telha Canudo</option>
                <option value="Fachada oculta">Fachada Oculta</option>
                <option value="Fachada visivel">Fachada visivel</option>
                <option value="Fachada ondulada">Fachada ondulada</option>
                <option value="Polipainel">Polipainel</option>
            </select>
            
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                <div style="flex:1;">
                    <label style="font-size:12px; color:#94a3b8;">ESPESSURA</label>
                    <select id="inj-esp">
                        <option value="30">30 mm</option>
                        <option value="40">40 mm</option>
                        <option value="50">50 mm</option>
                        <option value="60">60 mm</option>
                        <option value="80">80 mm</option>
                        <option value="100">100 mm</option>
                         <option value="120">120 mm</option>
                    </select>
                </div>
                <div style="flex:1;">
                    <label style="font-size:12px; color:#94a3b8;">METROS</label>
                    <input type="number" id="prod-metros" placeholder="Qtd" style="width:100%; padding:12px; background:#020617; color:white; border:1px solid #334155; border-radius:8px;">
                </div>
            </div>

            <label style="font-size:11px; color:#3b82f6; font-weight:bold;">PARÂMETROS DA MÁQUINA</label>
            <div class="grid-quimicos">
                <input type="number" id="q-pol" placeholder="POL kg">
                <input type="number" id="q-mdi" placeholder="MDI kg">
                <input type="number" id="q-pen" placeholder="PEN kg">
                <input type="number" id="q-cat1" placeholder="Cat 1 kg">
                <input type="number" id="q-cat2" placeholder="Cat 2 kg">
                <input type="number" id="q-cat3" placeholder="Cat 3 kg">
                <input type="number" id="q-cat4" placeholder="Cat 4 kg">
                <select id="q-vel">
                    <option value="" disabled selected>Vel (m/min)</option>
                    <option value="5 m/min">5 m/min</option>
                    <option value="6 m/min">6 m/min</option>
                    <option value="8 m/min">8 m/min</option>
                    <option value="9 m/min">9 m/min</option>
                    <option value="10 m/min">10 m/min</option>
                    <option value="11 m/min">11 m/min</option>
                    <option value="12 m/min">12 m/min</option>
                </select>
            </div>

            <button onclick="salvarNaLista()" class="btn-primary btn-add-lista">ADICIONAR À LISTA</button>
            <div id="lista-temp" style="margin-top:15px;"></div>
            <button id="btn-finalizar" onclick="finalizarTurno('${modulo}')" class="btn-primary btn-finish-dia" style="display:none;">SALVAR RELATÓRIO DO DIA</button>
        </div>`;
}

function salvarNaLista() {
    const painel = document.getElementById('inj-painel').value;
    const esp = document.getElementById('inj-esp').value;
    const metros = document.getElementById('prod-metros').value;

    if(!metros) return alert("Por favor, insira a quantidade de metros!");

    const item = {
        id: Date.now(),
        nome: painel,
        esp: esp,
        metros: metros,
        pol: document.getElementById('q-pol').value || 0,
        mdi: document.getElementById('q-mdi').value || 0,
        pen: document.getElementById('q-pen').value || 0,
        cat1: document.getElementById('q-cat1').value || 0,
        cat2: document.getElementById('q-cat2').value || 0,
        cat3: document.getElementById('q-cat3').value || 0,
        cat4: document.getElementById('q-cat4').value || 0,
        vel: document.getElementById('q-vel').value || 0,
        paragens: []
    };

    producoesDoDia.push(item);
    document.getElementById('btn-finalizar').style.display = "block";
    atualizarListaVisual();
    document.getElementById('prod-metros').value = "";
}

function atualizarListaVisual() {
    const listaTemp = document.getElementById('lista-temp');
    listaTemp.innerHTML = ""; 
    producoesDoDia.forEach(item => {
        listaTemp.innerHTML += `
        
            <div style="padding:10px; border-bottom:1px solid #334155; background:#1e293b; margin-bottom:5px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:12px; color:white;">
                    <b>${item.nome} (${item.esp}mm)</b><br>
                    <span>Mts: ${item.metros} | Vel: ${item.vel}</span>
                </div>
                <div style="display:flex; gap:5px;">
                    <button onclick="editarTudo(${item.id})" style="background:#eab308; color:black; border:none; padding:5px; border-radius:4px; cursor:pointer; font-weight:bold; font-size:10px;">EDITAR</button>
                    <button onclick="removerItem(${item.id})" style="background:#ef4444; color:white; border:none; padding:5px; border-radius:4px; cursor:pointer; font-weight:bold; font-size:10px;">X</button>
                </div>
            </div>`;
    });
}

/* ==========================================================================
   SISTEMA DE EDIÇÃO (MODAL)
   ========================================================================== */
function editarTudo(id) {
    const item = producoesDoDia.find(p => p.id === id);
    if(!item) return;

    const container = document.getElementById('conteudo-modal');
    container.innerHTML = `
        <input type="hidden" id="edit-id" value="${item.id}">
        <div style="display:flex; flex-direction:column; gap:10px;">
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                <div>
                    <label style="color:white; font-size:11px;">DATA</label>
                    <input type="date" id="edit-data" value="${item.data || ''}" style="width:100%; padding:8px; border-radius:5px; background:#020617; color:white; border:1px solid #334155;">
                </div>
                <div>
                    <label style="font-size:12px; color:#94a3b8;">ESPESSURA</label>
                    <select id="inj-esp">
                        <option value="30">30 mm</option>
                        <option value="40">40 mm</option>
                        <option value="50">50 mm</option>
                        <option value="60">60 mm</option>
                        <option value="80">80 mm</option>
                        <option value="100">100 mm</option>
                         <option value="120">120 mm</option>
                    </select>
                </div>
            </div>

            <label style="font-size:12px; color:#94a3b8;">TIPO DE PAINEL</label>
            <select id="inj-painel" style="width:100%; padding:12px; background:#020617; color:white; border:1px solid #334155; border-radius:8px; margin-bottom:15px;">
                <option value="5 Ondas">5 Ondas</option>
                <option value="Telha Canudo">Telha Canudo</option>
                <option value="Fachada oculta">Fachada Oculta</option>
                <option value="Fachada visivel">Fachada visivel</option>
                <option value="Fachada ondulada">Fachada ondulada</option>
                <option value="Polipainel">Polipainel</option>
            </select>

             <label style="font-size:12px; color:#94a3b8; font-weight:bold;">Velocidade Da Linha</label>
            <select id="q-vel">
                    <option value="" disabled selected>Vel (m/min)</option>
                    <option value="5 m/min">5 m/min</option>
                    <option value="6 m/min">6 m/min</option>
                    <option value="8 m/min">8 m/min</option>
                    <option value="9 m/min">9 m/min</option>
                    <option value="10 m/min">10 m/min</option>
                    <option value="11 m/min">11 m/min</option>
                    <option value="12 m/min">12 m/min</option>
                </select>


            <label style="color:white; font-size:11px;">METROS</label>
            <input type="number" id="edit-metros" value="${item.metros}" style="padding:8px; border-radius:5px; background:#020617; color:white; border:1px solid #334155;">

            <label style="color:#3b82f6; font-size:12px; font-weight:bold; margin-top:10px;">QUÍMICOS / CATALISADORES</label>
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:8px;">
                <div>
                    <label style="color:white; font-size:10px;">POL</label>
                    <input type="number" id="edit-pol" value="${item.pol || 0}" style="width:100%; padding:5px; background:#1e293b; color:white; border:1px solid #334155;">
                </div>
                <div>
                    <label style="color:white; font-size:10px;">MDI</label>
                    <input type="number" id="edit-mdi" value="${item.mdi || 0}" style="width:100%; padding:5px; background:#1e293b; color:white; border:1px solid #334155;">
                </div>
                <div>
                    <label style="color:white; font-size:10px;">PEN</label>
                    <input type="number" id="edit-pen" value="${item.pen || 0}" style="width:100%; padding:5px; background:#1e293b; color:white; border:1px solid #334155;">
                </div>
                <div>
                    <label style="color:white; font-size:10px;">CAT 1</label>
                    <input type="number" id="edit-cat1" value="${item.cat1 || 0}" style="width:100%; padding:5px; background:#1e293b; color:white; border:1px solid #334155;">
                </div>
                <div>
                    <label style="color:white; font-size:10px;">CAT 2</label>
                    <input type="number" id="edit-cat2" value="${item.cat2 || 0}" style="width:100%; padding:5px; background:#1e293b; color:white; border:1px solid #334155;">
                </div>
                <div>
                    <label style="color:white; font-size:10px;">CAT 3</label>
                    <input type="number" id="edit-cat3" value="${item.cat3 || 0}" style="width:100%; padding:5px; background:#1e293b; color:white; border:1px solid #334155;">
                </div>
            </div>
            <label style="color:white; font-size:10px;">CAT 4</label>
                    <input type="number" id="edit-cat4" value="${item.cat4 || 0}" style="width:100%; padding:5px; background:#1e293b; color:white; border:1px solid #334155;">
                </div>
            </div>
            <div id="container-paragens" style="margin-top:10px;"></div>
            <button type="button" onclick="adicionarLinhaParagem()" style="background:#3b82f6; color:white; border:none; padding:5px; border-radius:4px; font-size:10px;">+ PARAGEM</button>
        </div>`;

    if (item.paragens && item.paragens.length > 0) {
        item.paragens.forEach(p => adicionarLinhaParagem(p.motivo, p.tempo));
    }
    document.getElementById('modal-edicao').style.display = 'flex';
}

function salvarEdicaoModal() {
    const id = parseInt(document.getElementById('edit-id').value);
    const item = producoesDoDia.find(p => p.id === id);
    
    if (item) {
        item.metros = document.getElementById('edit-metros').value;
        const motivos = document.querySelectorAll('.paragem-motivo');
        const tempos = document.querySelectorAll('.paragem-tempo');
        item.paragens = [];
        motivos.forEach((el, index) => {
            if (el.value.trim() !== "") {
                item.paragens.push({ motivo: el.value, tempo: tempos[index].value });
            }
        });
        fecharModal();
        atualizarListaVisual();
    }
}

function adicionarLinhaParagem(motivo = '', tempo = '') {
    const container = document.getElementById('container-paragens');
    const div = document.createElement('div');
    // Aumentei um pouco a largura da coluna do tempo (de 60px para 80px) para caber o relógio digital
    div.style = "display:grid; grid-template-columns: 1fr 80px 30px; gap:5px; margin-bottom:5px;"; 
    div.innerHTML = `
        <input type="text" placeholder="Motivo" value="${motivo}" class="paragem-motivo" style="padding:5px; border-radius:4px; background:#0f172a; color:white; border:1px solid #334155; font-size:11px;">
        
        <input type="time" value="${tempo}" class="paragem-tempo" style="padding:5px; border-radius:4px; background:#0f172a; color:white; border:1px solid #334155; font-size:11px;">
        
        <button type="button" onclick="this.parentElement.remove()" style="background:#ef4444; color:white; border:none; border-radius:4px;">X</button>`;
    container.appendChild(div);
}

function fecharModal() {
    document.getElementById('modal-edicao').style.display = 'none';
}

function removerItem(id) {
    producoesDoDia = producoesDoDia.filter(p => p.id !== id);
    atualizarListaVisual();
    if(producoesDoDia.length === 0) document.getElementById('btn-finalizar').style.display = "none";
}

/* ==========================================================================
   GERAÇÃO DE PDF E HISTÓRICO
   ========================================================================== */
function finalizarTurno(modulo) {
    const dataInput = document.getElementById('data-producao').value;
    const d = new Date(dataInput + "T12:00:00");
    const ano = d.getFullYear();
    const mes = d.toLocaleString('pt-br', { month: 'long' }).toUpperCase();
    
    let db = JSON.parse(localStorage.getItem('atlas_db')) || {};
    if(!db[ano]) db[ano] = {};
    if(!db[ano][mes]) db[ano][mes] = [];

    db[ano][mes].push({
        modulo,
        data: d.toLocaleDateString('pt-br'),
        operador: document.getElementById('user-display').innerText,
        itens: [...producoesDoDia]
    });

    localStorage.setItem('atlas_db', JSON.stringify(db));
    alert("Relatório salvo!");
    voltarHome();
}

function exibirHistoricoModulo(modulo) {
    const db = JSON.parse(localStorage.getItem('atlas_db')) || {};
    const render = document.getElementById('render-modulo');
    let html = `
        <div style="padding:15px; color:white;">
            <h2 style="border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">📂 Histórico da injeççao</h2>
    `;

    for(let ano in db) {
        html += `
            <div class="folder-year" onclick="toggleElement('folder-ano-${ano}')" style="background:#334155; padding:12px; margin-top:8px; border-radius:8px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; font-weight:bold; color:white;">
                <span>📂 ANO ${ano}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div id="folder-ano-${ano}" style="display:none; padding:5px 10px;">`;
        
        for(let mes in db[ano]) {
            const filtrados = db[ano][mes].filter(r => r.modulo === modulo);
            if(filtrados.length > 0) {
                const mesId = `folder-mes-${ano}-${mes}`;
                html += `
                    <div class="folder-month" onclick="toggleElement('${mesId}')" style="color:#3b82f6; padding:10px; cursor:pointer; border-bottom:1px solid #1e293b; display:flex; justify-content:space-between; align-items:center; font-weight:600;">
                        <span>📅 ${mes}</span>
                        <i class="fas fa-caret-down"></i>
                    </div>
                    <div id="${mesId}" style="display:none; padding-left:10px; border-left:2px solid #3b82f6; margin-bottom:10px;">`;
                
                filtrados.forEach((rel, idx) => {
                    const relId = `detalhe-${ano}-${mes}-${idx}`;
                    html += `
                        <div style="background:#1e293b; padding:12px; margin-bottom:8px; border-radius:8px; border:1px solid #334155;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div style="color:white; font-size:13px;"><b>${rel.data}</b> <br><small style="color:#94a3b8;">${rel.operador}</small></div>
                                <div style="display:flex; gap:8px;">
                                    <button onclick="toggleElement('${relId}')" style="background:#475569; color:white; border:none; padding:6px 10px; border-radius:5px; font-size:11px; cursor:pointer;">VER</button>
                                    <button onclick="gerarPDF_Injecao_Final('${encodeURIComponent(JSON.stringify(rel))}')" style="background:#10b981; color:white; border:none; padding:6px 10px; border-radius:5px; font-size:11px; cursor:pointer;"><i class="fas fa-file-pdf"></i> PDF</button>
                                </div>
                            </div>
                            <div id="${relId}" style="display:none; margin-top:10px; padding-top:10px; border-top:1px solid #334155; font-size:12px; color:#cbd5e1;">
                                ${rel.itens.map(item => `
                                    <div style="margin-bottom:8px;">
                                        <b style="color:#10b981;">${item.nome} (${item.esp}mm)</b>: ${item.metros}m | Vel: ${item.vel}m/min
                                        <div style="font-size:10px; color:#94a3b8;">P:${item.pol} M:${item.mdi} Pen:${item.pen} | C1:${item.cat1} C2:${item.cat2}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>`;
                });
                html += `</div>`;
            }
        }
        html += `</div>`;
    }
    render.innerHTML = html || "<p style='text-align:center; padding:20px; color:gray;'>Nenhum histórico encontrado.</p>";
}

// Função auxiliar para abrir e fechar (Toggle)
function toggleElement(id) {
    const el = document.getElementById(id);
    if (el.style.display === "none") {
        el.style.display = "block";
    } else {
        el.style.display = "none";
    }
}
function gerarPDF_Injecao_Final(dadosEncoded) {
    const rel = JSON.parse(decodeURIComponent(dadosEncoded));
    const janela = window.open('', '_blank');

    let tabelaItens = "";
    let totalMetrosDia = 0;

    rel.itens.forEach(item => {
        const metrosNum = parseFloat(item.metros) || 0;
        totalMetrosDia += metrosNum;

        tabelaItens += `
            <tr>
                <td style="border: 1px solid #000; padding: 8px; font-size: 14px;">${item.nome}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center; font-size: 14px;">${item.esp}mm</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center; font-size: 14px; font-weight:bold;">${metrosNum.toFixed(2)}m</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center; font-size: 14px;">${item.vel}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center; font-size: 14px;">${item.pol}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center; font-size: 14px;">${item.mdi}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center; font-size: 14px;">${item.pen}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center; font-size: 14px;">${item.cat1}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center; font-size: 14px;">${item.cat2}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center; font-size: 14px;">${item.cat3}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center; font-size: 14px;">${item.cat4}</td>
            </tr>`;
        
        if(item.paragens && item.paragens.length > 0) {
            let pTexto = item.paragens.map(p => `• ${p.motivo} (${p.tempo}min)`).join("  |  ");
            tabelaItens += `
                <tr>
                    <td colspan="11" style="border: 1px solid #000; padding: 8px; font-size: 12px; background: #f2f2f2;">
                        <b>PARAGENS:</b> ${pTexto}
                    </td>
                </tr>`;
        }
    });

    janela.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { box-sizing: border-box; }
                body { 
                    padding: 0; 
                    margin: 0; 
                    font-family: Arial, sans-serif; 
                    width: 100vw; 
                }

                /* CABEÇALHO OCUPANDO 100% DA LARGURA */
                .header-container { 
                    background: #000; 
                    color: #fff; 
                    width: 100%; 
                    padding: 15px; 
                    border-bottom: 5px solid #E31C24;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .logo-wrapper { display: flex; align-items: center; }
                .logo-bar { width: 30px; height: 8px; background: #E31C24; margin-bottom: 4px; }
                .text-atlas { font-family: 'Arial Black', sans-serif; font-size: 24px; line-height: 1; color: #fff; }
                .text-painel { font-size: 9px; letter-spacing: 4px; color: #fff; text-transform: uppercase; }

                /* TABELA QUE OCUPA A TELA TODA E PERMITE SCROLL SE PRECISAR */
                .main-content { padding: 10px; width: 100%; }
                .table-container { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
                table { width: 100%; border-collapse: collapse; min-width: 800px; } 
                
                th { background: #e2e8f0; border: 1px solid #000; padding: 10px; font-size: 14px; color: #000; }
                td { border: 1px solid #000; padding: 8px; color: #000; }

                .resumo-final { 
                    margin-top: 20px; 
                    padding: 20px; 
                    background: #f8f9fa; 
                    border: 2px solid #000; 
                    text-align: center;
                    width: 100%;
                }

                .assinatura { margin-top: 40px; text-align: center; padding-bottom: 40px; }
                .linha-assinatura { border-top: 1px solid #000; width: 80%; margin: 0 auto; padding-top: 5px; }

                @media print { 
                    .no-print { display: none !important; } 
                    @page { size: landscape; margin: 0; }
                    body { width: 100%; }
                    .header-container { background: #000 !important; -webkit-print-color-adjust: exact; }
                }
            </style>
        </head>
        <body>
            <div class="header-container">
                <div class="logo-wrapper">
                    <div style="margin-right:10px;">
                        <div class="logo-bar"></div><div class="logo-bar"></div>
                    </div>
                    <div>
                        <span class="text-atlas">ATLAS</span><br>
                        <span class="text-painel">P A I N E L</span>
                    </div>
                </div>
                <div style="text-align: center;">
                    <h2 style="margin:0; font-size: 16px;">RELATÓRIO DE INJEÇÃO</h2>
                </div>
            </div>

            <div class="main-content">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>PRODUTO</th><th>ESP.</th><th>METROS</th><th>VEL.</th><th>POL</th><th>MDI</th><th>PEN</th><th>C1</th><th>C2</th><th>C3</th><th>C4</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tabelaItens}
                        </tbody>
                    </table>
                </div>

                <div class="resumo-final">
                    <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">
                        TOTAL: <span style="color: #E31C24;">${totalMetrosDia.toFixed(2)} metros</span>
                    </div>
                    <div style="font-size: 14px;">
                        Finalizado por: <b>${rel.operador}</b> em <b>${rel.data}</b>
                    </div>
                </div>

                <div class="assinatura">
                    <div class="linha-assinatura">Assinatura: ${rel.operador}</div>
                </div>

                <div class="no-print" style="text-align: center;">
                    <button onclick="window.print()" style="padding: 20px; background: #000; color: #fff; border: 3px solid #E31C24; width: 100%; font-size: 18px; font-weight: bold; border-radius: 10px;">
                        🖨️ CONFIRMAR E GERAR PDF
                    </button>
                </div>
            </div>
        </body>
        </html>
    `);
    janela.document.close();
}
//final da injeççao

/* ==========================================================================
   MÓDULO: BOBINES
   ========================================================================== */
function renderizarMenuBobines() {
    const render = document.getElementById('render-modulo');
    
    render.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; padding:15px;">
            <div class="card" onclick="moduloBobine('novo')">
                <i class="fas fa-file-circle-plus"></i>
                <span style="font-size:11px;">CRIAR RELATÓRIO</span>
            </div>
            <div class="card" onclick="moduloBobine('historico')">
                <i class="fas fa-clock-rotate-left"></i>
                <span style="font-size:11px;">HISTÓRICO</span>
            </div>
            <div class="card" onclick="moduloBobine('calculadora')">
                <i class="fas fa-calculator"></i>
                <span style="font-size:11px;">CALC. BOBINA</span>
            </div>
            <div class="card" onclick="moduloBobine('calculadora_agro')">
                <i class="fas fa-wheat-awn"></i>
                <span style="font-size:11px;">CALC. AGROPAINEL</span>
            </div>
        </div>
    `;
}

// Direcionamento das funções de Bobines
/* ==========================================================================
   MÓDULO: BOBINES (VERSÃO SEM EDITAR - APENAS STATUS E EXCLUIR)
   ========================================================================== */

let lancamentosTemporarios = [];
let historicoBobines = JSON.parse(localStorage.getItem('historicoBobines')) || []; // Salva no navegador
let producaoAtiva = 1; 
let lancamentoAtual = { tipo: '', lado: '', subtipo: '', qtd: 1, numBobine: '', ral: '', status: '', producao: 1 };

function moduloBobine(tipo) {
    const render = document.getElementById('render-modulo');
    
    switch(tipo) {
        case 'novo':
            renderizarNovoRelatorio();
            break;
        case 'historico':
            renderizarHistoricoBobines();
            break;
        case 'calculadora':
            renderizarCalculadoraBobina();
            break;
        case 'calculadora_agro':
            renderizarCalculadoraAgro();
            break;
    }
}
function renderizarNovoRelatorio() {
    const render = document.getElementById('render-modulo');
    // Mantém a data de hoje como padrão se for o primeiro acesso
    const dataHojeIso = new Date().toISOString().split('T')[0]; 

    render.innerHTML = `
        <div style="padding: 15px; color: white; max-width: 600px; margin: auto;">
            <div style="background: #1e293b; padding: 20px; border-radius: 15px; border: 1px solid #334155;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; background:#0f172a; padding:10px; border-radius:10px; border:1px solid #3b82f6;">
                    <div style="font-size:11px; color:#3b82f6; font-weight:bold;">DATA DE TRABALHO:</div>
                    <input type="date" id="data-retroativa" value="${dataHojeIso}" 
                        style="background:transparent; color:white; border:none; font-family:Arial; font-weight:bold; cursor:pointer; outline:none;">
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h3 style="color:#E31C24; margin:0;">NOVO LANÇAMENTO</h3>
                </div>

                <label style="color:#94a3b8; font-size:12px;">O QUE DESEJA LANÇAR?</label>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin:10px 0 20px 0;">
                    <button onclick="setTipoLancamento('filme')" id="btn-filme" class="btn-opt">FILME</button>
                    <button onclick="setTipoLancamento('chapa')" id="btn-chapa" class="btn-opt">BOBINA CHAPA</button>
                </div>

                <div id="area-configuracao"></div>

                <button onclick="adicionarAoLancamento()" id="btn-add" style="display:none; width:100%; padding:15px; background:#10b981; color:white; border:none; border-radius:8px; font-weight:bold; margin-top:15px; cursor:pointer;">
                    ADICIONAR AO LANÇAMENTO
                </button>
            </div>

            <div id="lista-lancamentos" style="margin-top:20px;"></div>

            <div id="acoes-finais" style="display:none; grid-template-columns: 1fr 1fr; gap:10px; margin-top:20px;">
                <button onclick="encerrarProducao()" style="padding:15px; background:#3b82f6; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">FIM PRODUÇÃO</button>
                <button onclick="fecharDia()" style="padding:15px; background:#E31C24; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">FECHAR DIA</button>
            </div>
        </div>

        <style>
            .btn-opt { padding:12px; background:#0f172a; color:white; border:1px solid #334155; border-radius:8px; cursor:pointer; font-weight:bold; }
            .btn-opt.active { border-color: #E31C24 !important; background: #2d1315 !important; }
            .input-style { width:100%; padding:12px; background:#0f172a; color:white; border:1px solid #334155; border-radius:8px; margin-bottom:15px; }
            .item-lancado { background:#1e293b; padding:10px; border-radius:8px; margin-bottom:8px; border-left:4px solid #E31C24; display:flex; justify-content:space-between; align-items:center; }
            .badge-status { padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer; margin-top: 5px; display: inline-block; }
        </style>
    `;
    if(lancamentosTemporarios.length > 0) atualizarLista();
}

function setTipoLancamento(tipo) {
    lancamentoAtual.tipo = tipo;
    document.getElementById('btn-filme').classList.toggle('active', tipo === 'filme');
    document.getElementById('btn-chapa').classList.toggle('active', tipo === 'chapa');
    
    const area = document.getElementById('area-configuracao');
    document.getElementById('btn-add').style.display = 'block';

    area.innerHTML = `
        <label style="color:#94a3b8; font-size:12px; display:block; margin-top:10px;">POSIÇÃO</label>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin:5px 0 15px 0;">
            <button onclick="setLado('superior')" class="btn-opt btn-lado">SUPERIOR</button>
            <button onclick="setLado('inferior')" class="btn-opt btn-lado">INFERIOR</button>
        </div>
        <div id="detalhes-especificos"></div>
    `;
}

function setLado(lado) {
    lancamentoAtual.lado = lado;
    document.querySelectorAll('.btn-lado').forEach(b => b.classList.toggle('active', b.innerText.toLowerCase() === lado));
    
    const areaDet = document.getElementById('detalhes-especificos');
    
    if(lancamentoAtual.tipo === 'filme') {
        let html = (lado === 'inferior') ? `
            <select id="subtipo_filme" class="input-style">
                <option value="5 Ondas">5 Ondas</option>
                <option value="Fachada Oculta">Fachada Oculta</option>
                <option value="Telha Canudo">Telha Canudo</option>
            </select>` : `<p style="font-size:13px; color:#94a3b8; margin-bottom:10px;">Tipo: 1060</p>`;
        
        html += `
            <label style="display:block; margin-bottom:10px; font-size:12px; color:#94a3b8;">QUANTIDADE</label>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; margin-bottom:15px;">
                ${[1,2,3,4].map(n => `<button type="button" onclick="setQtd(${n})" class="btn-opt btn-qtd">${n}</button>`).join('')}
            </div>
        `;
        areaDet.innerHTML = html;
        setQtd(1);
    } else {
        areaDet.innerHTML = `
            <input type="text" id="num_bobine" placeholder="Nº DA BOBINA" class="input-style">
            <select id="ral_chapa" class="input-style">
                <option value="">SELECIONE O RAL</option>
                <option value="3009">3009</option>
                <option value="9010">9010</option>
                <option value="7016">7016</option>
                <option value="9006">9006</option>
                <option value="6009">6009</option>
            </select>
            <label style="color:#94a3b8; font-size:12px;">ACABOU?</label>
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:5px; margin-top:5px;">
                <button onclick="setStatusForm('SIM')" class="btn-opt btn-status">SIM</button>
                <button onclick="setStatusForm('NÃO')" class="btn-opt btn-status">NÃO</button>
                <button onclick="setStatusForm('ANDAMENTO')" class="btn-opt btn-status">ANDAMENTO</button>
            </div>
        `;
    }
}

function setQtd(n) {
    lancamentoAtual.qtd = n;
    document.querySelectorAll('.btn-qtd').forEach(b => b.classList.toggle('active', parseInt(b.innerText) === n));
}

function setStatusForm(status) {
    lancamentoAtual.status = status;
    document.querySelectorAll('.btn-status').forEach(b => b.classList.toggle('active', b.innerText === status));
}

function adicionarAoLancamento() {
    if(!lancamentoAtual.lado) { alert('Selecione a posição!'); return; }

    if(lancamentoAtual.tipo === 'filme') {
        lancamentoAtual.subtipo = (lancamentoAtual.lado === 'superior') ? '1060' : document.getElementById('subtipo_filme').value;
    } else {
        lancamentoAtual.numBobine = document.getElementById('num_bobine').value;
        lancamentoAtual.ral = document.getElementById('ral_chapa').value;
        if(!lancamentoAtual.numBobine || !lancamentoAtual.ral || !lancamentoAtual.status) {
            alert('Preencha todos os campos!'); return;
        }
    }

    lancamentoAtual.producao = producaoAtiva;
    lancamentosTemporarios.push({...lancamentoAtual});
    
    // Reset
    lancamentoAtual = { tipo: '', lado: '', subtipo: '', qtd: 1, numBobine: '', ral: '', status: '', producao: producaoAtiva };
    renderizarNovoRelatorio();
}

function atualizarLista() {
    const lista = document.getElementById('lista-lancamentos');
    lista.innerHTML = '';
    let ultimaProd = 0;
    
    lancamentosTemporarios.forEach((item, index) => {
        if(item.producao !== ultimaProd) {
            lista.innerHTML += `<div style="color:#E31C24; font-weight:bold; margin: 15px 0 5px 0; font-size:12px; border-bottom:1px solid #334155;">PRODUÇÃO ${item.producao}</div>`;
            ultimaProd = item.producao;
        }

        const corStatus = item.status === 'SIM' ? '#10b981' : (item.status === 'ANDAMENTO' ? '#f59e0b' : '#ef4444');

        lista.innerHTML += `
            <div class="item-lancado">
                <div style="font-size:11px;">
                    <b>${item.tipo.toUpperCase()} ${item.lado.toUpperCase()}</b><br>
                    ${item.tipo === 'filme' ? 'Tipo: '+item.subtipo+' | Qtd: '+item.qtd : 'Bob: '+item.numBobine+' | RAL: '+item.ral}<br>
                    ${item.tipo === 'chapa' ? `<span onclick="alternarStatus(${index})" class="badge-status" style="background:${corStatus}">${item.status}</span>` : ''}
                </div>
                <button onclick="removerLancamento(${index})" style="background:transparent; border:none; color:#ff4444; cursor:pointer;"><i class="fas fa-trash"></i></button>
            </div>`;
    });
    document.getElementById('acoes-finais').style.display = 'grid';
}

function alternarStatus(index) {
    const statusCiclo = ['ANDAMENTO', 'SIM', 'NÃO'];
    let atual = lancamentosTemporarios[index].status;
    let novoIndex = (statusCiclo.indexOf(atual) + 1) % statusCiclo.length;
    lancamentosTemporarios[index].status = statusCiclo[novoIndex];
    atualizarLista();
}

function removerLancamento(index) {
    lancamentosTemporarios.splice(index, 1);
    atualizarLista();
}

function encerrarProducao() {
    producaoAtiva++;
    alert("Próxima Produção: " + producaoAtiva);
    atualizarLista();
}

// --- FUNÇÃO PARA SALVAR E GERAR PDF ---
function fecharDia() {
    const pendente = lancamentosTemporarios.find(i => i.tipo === 'chapa' && i.status === 'ANDAMENTO');
    if(pendente) { alert("Erro: Existe uma bobina em ANDAMENTO."); return; }
    if(lancamentosTemporarios.length === 0) { alert("Erro: Sem dados para fechar o dia."); return; }

    // Pega a data do input manual
    const dataInput = document.getElementById('data-retroativa').value;
    let dataRef = new Date(); // padrão hoje

    if(dataInput) {
        const partes = dataInput.split('-');
        // Criamos a data ajustando o fuso horário local
        dataRef = new Date(partes[0], partes[1] - 1, partes[2]);
    }

    const operadorSistema = window.usuarioLogado || "OPERADOR NÃO IDENTIFICADO";

    const relFinal = {
        id: Date.now(),
        data: dataRef.toLocaleDateString('pt-BR'),
        ano: dataRef.getFullYear(),
        mes: dataRef.getMonth() + 1,
        dia: dataRef.getDate(),
        hora: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        operador: operadorSistema.toUpperCase(),
        itens: [...lancamentosTemporarios]
    };

    // Salva no histórico
    historicoBobines.unshift(relFinal);
    localStorage.setItem('historicoBobines', JSON.stringify(historicoBobines));

    // Gera PDF
    gerarPDF_Bobines(encodeURIComponent(JSON.stringify(relFinal)));

    // Limpa tudo
    lancamentosTemporarios = [];
    producaoAtiva = 1;
    renderizarMenuBobines();
    alert("Relatório fechado com sucesso na data: " + relFinal.data);
}
//FUNÇÃO PARA RENDERIZAR O HISTÓRICO NA TELA ---
function renderizarHistoricoBobines() {
    const render = document.getElementById('render-modulo');
    let agrupado = {};

    // Agrupa os dados
    historicoBobines.forEach(rel => {
        if (!agrupado[rel.ano]) agrupado[rel.ano] = {};
        if (!agrupado[rel.ano][rel.mes]) agrupado[rel.ano][rel.mes] = [];
        agrupado[rel.ano][rel.mes].push(rel);
    });

    const mesesNome = ["", "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

    let html = `
        <div style="padding:15px; color:white;">
            <h2 style="border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">📂 Histórico da Bobines</h2>
    `;

    Object.keys(agrupado).sort((a, b) => b - a).forEach(ano => {
        html += `
            <div style="margin-bottom:10px;">
                <div onclick="toggleElemento('ano-${ano}')" style="background:#1e293b; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer; display:flex; justify-content:space-between; align-items:center; border: 1px solid #334155;">
                    <span>📁 ANO ${ano}</span>
                </div>
                
                <div id="ano-${ano}" style="display:none; padding-left:15px; margin-top:5px; border-left: 2px solid #1e293b;">
        `;

        Object.keys(agrupado[ano]).sort((a, b) => b - a).forEach(mes => {
            html += `
                <div onclick="toggleElemento('mes-${ano}-${mes}')" style="cursor:pointer; padding:8px; color:#3b82f6; background: #0f172a; margin-top:3px; border-radius:4px; display:flex; justify-content:space-between;">
                    <span>📅 ${mesesNome[mes]}</span>
                    <span>➔</span>
                </div>

                <div id="mes-${ano}-${mes}" style="display:none; padding-left:15px; background: #1a202c; border-radius: 0 0 5px 5px;">
            `;

            // LISTA DE DIAS/RELATÓRIOS
            agrupado[ano][mes].forEach(rel => {
                html += `
                    <div style="padding:10px; border-bottom:1px solid #2d3748; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:13px;">📄 Dia ${rel.dia}/${rel.mes} <br> <small style="color:gray;">Op: ${rel.operador}</small></span>
                        <button onclick='gerarPDF_Bobines("${encodeURIComponent(JSON.stringify(rel))}")' 
                                style="background:#10b981; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer;">
                            Ver PDF
                        </button>
                    </div>
                `;
            });

            html += `</div>`; // Fecha div do mês
        });

        html += `</div></div>`; // Fecha div do ano
    });

    html += `</div>`;
    render.innerHTML = html;
}

// Função genérica para abrir/fechar as pastas
function toggleElemento(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
    }
}
function agruparPorRal(itens) {
    let grupos = {};

    itens.forEach(item => {
        if(item.tipo !== 'chapa') return;

        if(!grupos[item.ral]) {
            grupos[item.ral] = { superior: [], inferior: [] };
        }

        grupos[item.ral][item.lado].push(item);
    });

    return grupos;
}

function calcularTotais(itens) {
    let totalFilmeSup = 0;
    let totalFilmeInf = 0;
    let totalBobSup = 0;
    let totalBobInf = 0;

    itens.forEach(i => {
        if(i.tipo === 'filme') {
            if(i.lado === 'superior') totalFilmeSup += i.qtd;
            else totalFilmeInf += i.qtd;
        }

        if(i.tipo === 'chapa') {
            if(i.lado === 'superior') totalBobSup++;
            else totalBobInf++;
        }
    });

    return { totalFilmeSup, totalFilmeInf, totalBobSup, totalBobInf };
}
function deletarHistoricoBobine(index) {
    if(confirm("Excluir este relatório permanentemente?")) {
        historicoBobines.splice(index, 1);
        localStorage.setItem('historicoBobines', JSON.stringify(historicoBobines));
        renderizarHistoricoBobines();
    }
}

// Mantenha suas funções de renderizarNovoRelatorio, atualizarLista, adicionarAoLancamento e as calculadoras EXATAMENTE como você já tem.
// Apenas certifique-se de que a função fecharDia e a gerarPDF_Bobines estejam como abaixo:

function gerarPDF_Bobines(dadosEncoded) {
    const rel = JSON.parse(decodeURIComponent(dadosEncoded));
    const janela = window.open('', '_blank');

    let conteudoGeral = "";
    
    const producoes = {};
    rel.itens.forEach(item => {
        if (!producoes[item.producao]) producoes[item.producao] = [];
        producoes[item.producao].push(item);
    });

    Object.keys(producoes).forEach(numProd => {
        let itensFilme = producoes[numProd].filter(i => i.tipo === 'filme');
        let itensChapa = producoes[numProd].filter(i => i.tipo === 'chapa');

        conteudoGeral += `
            <div style="margin-bottom: 30px; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
                <h3 style="background: #E31C24; color: white; padding: 8px; margin-top: 0; text-align: center !important; font-family: Arial, sans-serif;">PRODUÇÃO ${numProd}</h3>`;

        if (itensFilme.length > 0) {
            conteudoGeral += `
                <div style="text-align: center !important; width: 100%; margin: 15px 0 5px 0;">
                    <strong style="font-size: 16px; font-family: Arial, sans-serif;"> LANÇAMENTO DE FILMES</strong>
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <thead>
                        <tr style="background: #e2e8f0;">
                            <th style="border: 1px solid #000; padding: 5px; text-align: center !important;">POSIÇÃO</th>
                            <th style="border: 1px solid #000; padding: 5px; text-align: center !important;">TIPO DE FILME</th>
                            <th style="border: 1px solid #000; padding: 5px; text-align: center !important;">QUANTIDADE</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itensFilme.map(f => `
                            <tr>
                                <td style="border: 1px solid #000; padding: 5px; text-align:center;">${f.lado.toUpperCase()}</td>
                                <td style="border: 1px solid #000; padding: 5px; text-align:center;">${f.subtipo}</td>
                                <td style="border: 1px solid #000; padding: 5px; text-align:center; font-weight:bold;">${f.qtd}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>`;
        }

        if (itensChapa.length > 0) {
            conteudoGeral += `
                <div style="text-align: center !important; width: 100%; margin: 15px 0 5px 0;">
                    <strong style="font-size: 16px; font-family: Arial, sans-serif;"> LANÇAMENTO DE BOBINAS (CHAPA)</strong>
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #e2e8f0;">
                            <th style="border: 1px solid #000; padding: 5px; text-align: center !important;">POSIÇÃO</th>
                            <th style="border: 1px solid #000; padding: 5px; text-align: center !important;">Nº BOBINA</th>
                            <th style="border: 1px solid #000; padding: 5px; text-align: center !important;">RAL</th>
                            <th style="border: 1px solid #000; padding: 5px; text-align: center !important;">STATUS DE TERMINADA</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itensChapa.map(c => `
                            <tr>
                                <td style="border: 1px solid #000; padding: 5px; text-align:center;">${c.lado.toUpperCase()}</td>
                                <td style="border: 1px solid #000; padding: 5px; text-align:center;">${c.numBobine}</td>
                                <td style="border: 1px solid #000; padding: 5px; text-align:center;">${c.ral}</td>
                                <td style="border: 1px solid #000; padding: 5px; text-align:center; font-weight:bold; color: ${c.status === 'SIM' ? 'green' : 'red'};">${c.status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>`;
        }
        conteudoGeral += `</div>`;
    });

    janela.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                .header-container { background: #000; color: #fff; padding: 15px; border-bottom: 5px solid #E31C24; display: flex; justify-content: space-between; align-items: center; }
                .logo-bar { width: 30px; height: 8px; background: #E31C24; margin-bottom: 4px; }
                .text-atlas { font-family: 'Arial Black', sans-serif; font-size: 24px; line-height: 1; }
                .main-content { padding: 20px; }
                th { background: #e2e8f0; text-align: center !important; }
                .resumo-dia { background: #f2f2f2; border: 2px solid #000; padding: 15px; margin-top: 20px; text-align: center !important; }
                .btn-imprimir { padding: 15px 30px; background: #000; color: #fff; border: 2px solid #E31C24; font-weight: bold; cursor: pointer; border-radius: 8px; font-size: 14px; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header-container">
                <div style="display: flex; align-items: center;">
                    <div style="margin-right:10px;"><div class="logo-bar"></div><div class="logo-bar"></div></div>
                    <div><span class="text-atlas">ATLAS</span><br><span style="font-size:9px; letter-spacing:4px;">P A I N E L</span></div>
                </div>
                <div style="text-align: right;">
                    <h2 style="margin:0; font-size: 16px;">RELATÓRIO DE BOBINES/FILME</h2>
                    <p style="margin:0; font-size: 12px;">DATA: ${rel.data}</p>
                </div>
            </div>

            <div class="main-content">
                ${conteudoGeral}

                <div class="resumo-dia">
                    <p style="margin: 5px 0; font-size: 14px;">Operador: <b>${rel.operador}</b> | Total de Produções: <b>${Object.keys(producoes).length}</b></p>
                </div>

                <div style="margin-top: 40px; text-align: center;">
                    <div style="border-top: 1px solid #000; width: 60%; margin: 0 auto; padding-top: 5px; font-size: 14px;">
                        Assinatura Responsável: <b>${rel.operador}</b>
                    </div>
                </div>

                <div class="no-print" style="margin-top: 30px; text-align: center;">
                    <button onclick="window.print()" class="btn-imprimir">
                        🖨️ CONFIRMAR E GERAR PDF
                    </button>
                </div>
            </div>
        </body>
        </html>
    `);
    janela.document.close();
}
function renderizarCalculadoraBobina() {
    const render = document.getElementById('render-modulo');
    
    // HTML da Calculadora adaptado ao seu tema escuro
    render.innerHTML = `
        <div style="padding: 15px; color: white;">
            <div style="background: #1e293b; padding: 20px; border-radius: 15px; border: 1px solid #334155;">
                
                <label style="display:block; margin-bottom:10px; font-weight:bold; color:#94a3b8;">LARGURA DA ABA (cm)</label>
                <select id="calc_largura" onchange="calcularLogicaBobina()" style="width:100%; padding:15px; background:#0f172a; color:white; border:1px solid #334155; border-radius:8px; font-size:18px; margin-bottom:20px;">
                    </select>

                <label style="display:block; margin-bottom:10px; font-weight:bold; color:#94a3b8;">ESPESSURA (mm)</label>
                <div id="calc_espessuras" style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; margin-bottom:20px;">
                    </div>

                <label style="display:block; margin-bottom:10px; font-weight:bold; color:#94a3b8;">VELOCIDADE (m/min)</label>
                <div id="calc_velocidades" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; margin-bottom:20px;">
                    </div>

                <div style="background:#0f172a; padding:15px; border-radius:10px; border-left:5px solid #E31C24;">
                    <div id="res_metros" style="font-size:18px; margin-bottom:5px;">Metros: <b>0</b></div>
                    <div id="res_tempo" style="font-size:18px; margin-bottom:5px;">Tempo: <b>0</b></div>
                    <div id="res_hora" style="font-size:18px; color:#E31C24; font-weight:bold;">Finaliza às: <b>--:--</b></div>
                </div>
            </div>
        </div>
    `;
   function gerarPDF_Bobines(dadosEncoded) {
    const rel = JSON.parse(decodeURIComponent(dadosEncoded));
    const janela = window.open('', '_blank');

    let conteudoGeral = "";
    
    const producoes = {};
    rel.itens.forEach(item => {
        if (!producoes[item.producao]) producoes[item.producao] = [];
        producoes[item.producao].push(item);
    });

    Object.keys(producoes).forEach(numProd => {
        let itensFilme = producoes[numProd].filter(i => i.tipo === 'filme');
        let itensChapa = producoes[numProd].filter(i => i.tipo === 'chapa');

        conteudoGeral += `
            <div style="margin-bottom: 30px; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
                <h3 style="background: #E31C24; color: white; padding: 5px 10px; margin-top: 0; text-align: center;">PRODUÇÃO ${numProd}</h3>`;

        // Tabela de Filmes
        if (itensFilme.length > 0) {
            conteudoGeral += `
                <p style="font-weight: bold; margin-bottom: 5px; text-align: center;"> LANÇAMENTO DE FILMES</p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <thead>
                        <tr style="background: #e2e8f0;">
                            <th style="border: 1px solid #000; padding: 5px; text-align: center;">POSIÇÃO</th>
                            <th style="border: 1px solid #000; padding: 5px; text-align: center;">TIPO DE FILME</th>
                            <th style="border: 1px solid #000; padding: 5px; text-align: center;">QUANTIDADE</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itensFilme.map(f => `
                            <tr>
                                <td style="border: 1px solid #000; padding: 5px; text-align:center;">${f.lado.toUpperCase()}</td>
                                <td style="border: 1px solid #000; padding: 5px; text-align:center;">${f.subtipo}</td>
                                <td style="border: 1px solid #000; padding: 5px; text-align:center; font-weight:bold;">${f.qtd}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>`;
        }

        // Tabela de Chapas
        if (itensChapa.length > 0) {
            conteudoGeral += `
                <p style="font-weight: bold; margin-bottom: 5px; text-align: center;"> LANÇAMENTO DE BOBINAS (CHAPA)</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #e2e8f0;">
                            <th style="border: 1px solid #000; padding: 5px; text-align: center;">POSIÇÃO</th>
                            <th style="border: 1px solid #000; padding: 5px; text-align: center;">Nº BOBINA</th>
                            <th style="border: 1px solid #000; padding: 5px; text-align: center;">RAL</th>
                            <th style="border: 1px solid #000; padding: 5px; text-align: center;">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itensChapa.map(c => `
                            <tr>
                                <td style="border: 1px solid #000; padding: 5px; text-align:center;">${c.lado.toUpperCase()}</td>
                                <td style="border: 1px solid #000; padding: 5px; text-align:center;">${c.numBobine}</td>
                                <td style="border: 1px solid #000; padding: 5px; text-align:center;">${c.ral}</td>
                                <td style="border: 1px solid #000; padding: 5px; text-align:center; font-weight:bold; color: ${c.status === 'SIM' ? 'green' : 'red'};">${c.status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>`;
        }

        conteudoGeral += `</div>`;
    });

    janela.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Relatório de Bobines - ATLAS</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                .header-container { background: #000; color: #fff; padding: 15px; border-bottom: 5px solid #E31C24; display: flex; justify-content: space-between; align-items: center; }
                .logo-bar { width: 30px; height: 8px; background: #E31C24; margin-bottom: 4px; }
                .text-atlas { font-family: 'Arial Black', sans-serif; font-size: 24px; line-height: 1; }
                .main-content { padding: 20px; }
                th { font-size: 12px; text-align: center; } /* Força centralização global dos headers */
                td { font-size: 13px; }
                .resumo-dia { background: #f2f2f2; border: 2px solid #000; padding: 15px; margin-top: 20px; text-align: center; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header-container">
                <div style="display: flex; align-items: center;">
                    <div style="margin-right:10px;"><div class="logo-bar"></div><div class="logo-bar"></div></div>
                    <div><span class="text-atlas">ATLAS</span><br><span style="font-size:9px; letter-spacing:4px;">P A I N E L</span></div>
                </div>
                <div style="text-align: center;">
                    <h2 style="margin:0; font-size: 16px;">RELATÓRIO DE BOBINES/FILME</h2>
                    <p style="margin:0; font-size: 12px;">DATA: ${rel.data}</p>
                </div>
            </div>

            <div class="main-content">
                ${conteudoGeral}

                <div class="resumo-dia">
                    <p style="margin: 5px 0;">Operador: <b>${rel.operador}</b></p>
                    <p style="margin: 5px 0;">Total de Produções no Dia: <b>${Object.keys(producoes).length}</b></p>
                </div>

                <div style="margin-top: 40px; text-align: center;">
                    <div style="border-top: 1px solid #000; width: 60%; margin: 0 auto; padding-top: 5px;">
                        Assinatura Responsável
                    </div>
                </div>

                <div class="no-print" style="margin-top: 30px; text-align: center;">
                    <button onclick="window.print()" style="padding: 15px 30px; background: #000; color: #fff; border: 2px solid #E31C24; font-weight: bold; cursor: pointer; border-radius: 8px;">
                        🖨️ IMPRIMIR RELATÓRIO
                    </button>
                </div>
            </div>
        </body>
        </html>
    `);
    janela.document.close();
}
//a soma da calculadora

    // 1. Popular Larguras (1 a 50cm)
    const selLargura = document.getElementById("calc_largura");
    for(let i=1; i<=50; i+=0.5){
        let o = document.createElement("option");
        o.value = i;
        o.text = (i % 1 === 0) ? i + " cm" : i.toFixed(1) + " cm";
        if(i === 20) o.selected = true; // Valor padrão
        selLargura.appendChild(o);
    }

    // 2. Popular Espessuras
    let espSel = 0.32;
    const espessuras = [0.28, 0.30, 0.32, 0.35, 0.38, 0.40, 0.43, 0.45, 0.68];
    const divEsp = document.getElementById("calc_espessuras");
    
    espessuras.forEach(e => {
        let b = document.createElement("button");
        b.innerText = e;
        b.style = "padding:12px; border-radius:8px; border:1px solid #334155; background:#0f172a; color:white; font-weight:bold; cursor:pointer;";
        if(e === espSel) b.style.borderColor = "#E31C24";

        b.onclick = () => {
            espSel = e;
            Array.from(divEsp.children).forEach(btn => btn.style.borderColor = "#334155");
            b.style.borderColor = "#E31C24";
            calcularLogicaBobina(parseFloat(selLargura.value), espSel, velSel);
        };
        divEsp.appendChild(b);
    });

    // 3. Popular Velocidades
    let velSel = 10;
    const velocidades = [5, 6, 7, 8, 9, 10, 11, 12];
    const divVel = document.getElementById("calc_velocidades");

    velocidades.forEach(v => {
        let b = document.createElement("button");
        b.innerText = v;
        b.style = "padding:12px; border-radius:8px; border:1px solid #334155; background:#0f172a; color:white; font-weight:bold; cursor:pointer;";
        if(v === velSel) b.style.borderColor = "#E31C24";

        b.onclick = () => {
            velSel = v;
            Array.from(divVel.children).forEach(btn => btn.style.borderColor = "#334155");
            b.style.borderColor = "#E31C24";
            calcularLogicaBobina(parseFloat(selLargura.value), espSel, velSel);
        };
        divVel.appendChild(b);
    });

    // 4. Lógica de Cálculo (Sua fórmula antiga)
    window.calcularLogicaBobina = function() {
        const L = parseFloat(document.getElementById("calc_largura").value);
        const interno = 500;
        const pi = 3.14;
        
        const largura_mm = L * 10;
        const p1 = largura_mm / espSel;
        const p2 = p1 * pi;
        const soma = interno + largura_mm;
        
        const metros = Math.round((p2 * soma) / 1000);
        const tempoTotalMin = Math.round(metros / velSel);
        
        const fim = new Date();
        fim.setMinutes(fim.getMinutes() + tempoTotalMin);
        
        const horas = Math.floor(tempoTotalMin / 60);
        const minutos = tempoTotalMin % 60;
        let textoTempo = (horas > 0) ? `${horas}h ${minutos}min` : `${minutos} min`;

        document.getElementById("res_metros").innerHTML = `Metros: <b>${metros} m</b>`;
        document.getElementById("res_tempo").innerHTML = `Tempo: <b>${textoTempo}</b>`;
        document.getElementById("res_hora").innerHTML = `Finaliza às: <b>${fim.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</b>`;
    };

    // Rodar cálculo inicial
    calcularLogicaBobina();
}
function renderizarCalculadoraAgro() {
    const render = document.getElementById('render-modulo');
    
    render.innerHTML = `
        <div style="padding: 15px; color: white;">
            <div style="background: #1e293b; padding: 20px; border-radius: 15px; border: 1px solid #334155;">
                <h3 style="color:#E31C24; margin-top:0; text-align:center;">CALCULADORA AGROPAINEL</h3>
                <p style="text-align:center; font-size:12px; color:#94a3b8;">Espessura Fixa: 0.60mm | Interno: 200</p>

                <label style="display:block; margin-bottom:10px; font-weight:bold; color:#94a3b8;">LARGURA DA ABA (cm)</label>
                <select id="agro_largura" onchange="calcularLogicaAgro()" style="width:100%; padding:15px; background:#0f172a; color:white; border:1px solid #334155; border-radius:8px; font-size:18px; margin-bottom:20px;">
                </select>

                <label style="display:block; margin-bottom:10px; font-weight:bold; color:#94a3b8;">VELOCIDADE (m/min)</label>
                <div id="agro_velocidades" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; margin-bottom:20px;">
                </div>

                <div style="background:#0f172a; padding:15px; border-radius:10px; border-left:5px solid #E31C24;">
                    <div id="agro_res_metros" style="font-size:18px; margin-bottom:5px;">Metros: <b>0</b></div>
                    <div id="agro_res_tempo" style="font-size:18px; margin-bottom:5px;">Tempo: <b>0</b></div>
                    <div id="agro_res_hora" style="font-size:18px; color:#E31C24; font-weight:bold;">Finaliza às: <b>--:--</b></div>
                </div>
            </div>
        </div>
    `;

    // 1. Popular Larguras (1 a 50cm)
    const selLargura = document.getElementById("agro_largura");
    for(let i=1; i<=50; i+=0.5){
        let o = document.createElement("option");
        o.value = i;
        o.text = (i % 1 === 0) ? i + " cm" : i.toFixed(1) + " cm";
        if(i === 15) o.selected = true; 
        selLargura.appendChild(o);
    }

    // 2. Popular Velocidades
    let velSelAgro = 10;
    const velocidades = [5, 6, 7, 8, 9, 10, 11, 12];
    const divVel = document.getElementById("agro_velocidades");

    velocidades.forEach(v => {
        let b = document.createElement("button");
        b.innerText = v;
        b.style = "padding:12px; border-radius:8px; border:1px solid #334155; background:#0f172a; color:white; font-weight:bold; cursor:pointer;";
        if(v === velSelAgro) b.style.borderColor = "#E31C24";

        b.onclick = () => {
            velSelAgro = v;
            Array.from(divVel.children).forEach(btn => btn.style.borderColor = "#334155");
            b.style.borderColor = "#E31C24";
            calcularLogicaAgro();
        };
        divVel.appendChild(b);
    });

    // 3. Lógica Específica Agropainel
    window.calcularLogicaAgro = function() {
        const L = parseFloat(document.getElementById("agro_largura").value);
        const espAgro = 0.60; // Fixo conforme pedido
        const internoAgro = 200; // Fixo conforme pedido
        const pi = 3.14;
        
        const largura_mm = L * 10;
        const p1 = largura_mm / espAgro;
        const p2 = p1 * pi;
        const soma = internoAgro + largura_mm;
        
        const metros = Math.round((p2 * soma) / 1000);
        const tempoTotalMin = Math.round(metros / velSelAgro);
        
        const fim = new Date();
        fim.setMinutes(fim.getMinutes() + tempoTotalMin);
        
        const horas = Math.floor(tempoTotalMin / 60);
        const minutos = tempoTotalMin % 60;
        let textoTempo = (horas > 0) ? `${horas}h ${minutos}min` : `${minutos} min`;

        document.getElementById("agro_res_metros").innerHTML = `Metros: <b>${metros} m</b>`;
        document.getElementById("agro_res_tempo").innerHTML = `Tempo: <b>${textoTempo}</b>`;
        document.getElementById("agro_res_hora").innerHTML = `Finaliza às: <b>${fim.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</b>`;
    };

    calcularLogicaAgro();
}
//aqui termina as bobines

/* ==========================================================================
   MÓDULO: SERRA
   ========================================================================== */

// --- VARIÁVEIS DE CONTROLE ---
// --- BANCO DE DADOS ---
let db_serra_live = JSON.parse(localStorage.getItem('atlas_serra_live')) || [];
let db_serra_hist = JSON.parse(localStorage.getItem('atlas_serra_hist')) || [];

// --- 1. MENU PRINCIPAL ---
function renderizarMenuSerra() {
    const render = document.getElementById('render-modulo');
    render.innerHTML = `
        <div id="menu-inicial-serra" style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; padding:15px;">
            <div class="card" onclick="exibirSetupSerra()" style="cursor:pointer; background:#1e293b; border-radius:10px; padding:30px 15px; text-align:center; border: 1px solid #334155;">
                <i class="fas fa-plus" style="color:#3b82f6; font-size:2.5rem; margin-bottom:15px;"></i>
                <span style="display:block; color:white; font-weight:bold; font-size:13px; text-transform:uppercase;">Novo Relatório</span>
            </div>
            <div class="card" onclick="listarHistoricoSerra()" style="cursor:pointer; background:#1e293b; border-radius:10px; padding:30px 15px; text-align:center; border: 1px solid #334155;">
                <i class="fas fa-history" style="color:#3b82f6; font-size:2.5rem; margin-bottom:15px;"></i>
                <span style="display:block; color:white; font-weight:bold; font-size:13px; text-transform:uppercase;">Histórico Serra</span>
            </div>
        </div>
        <div id="aba-conteudo-serra" style="padding:0 15px;"></div>
    `;
}

// --- 2. CONFIGURAÇÃO ---
// --- 2. CONFIGURAÇÃO INICIAL (SETUP) ---
function exibirSetupSerra() {
    const menu = document.getElementById('menu-inicial-serra');
    if(menu) menu.style.display = 'none';
    
    const container = document.getElementById('aba-conteudo-serra');
    if(!container) return;

    // Montamos o HTML completo em uma única atribuição para evitar erros
    container.innerHTML = `
        <div style="display:flex; align-items:center; margin-bottom:15px; padding-top:10px;">
            <button onclick="renderizarMenuSerra()" style="background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer; margin-right:15px;">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h3 style="color:#E31C24; font-size:14px; margin:0; text-transform:uppercase;">Configurar Produção</h3>
        </div>

        <div style="margin-bottom: 15px; padding: 10px; background: #1e293b; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 10px; border: 1px solid #334155;">
            <label style="color: #94a3b8; font-weight: bold; font-size: 12px;">DATA DO RELATÓRIO:</label>
            <input type="date" id="data-manual-serra" style="background: #0f172a; color: white; border: 1px solid #3b82f6; padding: 5px; border-radius: 4px; font-weight: bold; outline: none; cursor: pointer;">
        </div>

        <div style="background:#111827; padding:20px; border-radius:12px; border: 1px solid #334155;">
            <label style="color:#94a3b8; font-size:11px;">TIPO DE PAINEL</label>
            <select id="s-tipo" style="background:#1e293b; color:white; border:1px solid #334155; width:100%; padding:12px; border-radius:6px; margin-bottom:15px; font-weight:bold;">
                <option value="5 Ondas">5 Ondas</option>
                <option value="Fachada">Fachada</option>
                <option value="Telha Canudo">Telha Canudo</option>
            </select>

            <label style="color:#94a3b8; font-size:11px;">ESPESSURA (mm)</label>
            <select id="s-esp" style="background:#1e293b; color:white; border:1px solid #334155; width:100%; padding:12px; border-radius:6px; margin-bottom:20px; font-weight:bold;">
                ${[30,40,50,60,80,100,120].map(e => `<option value="${e}">${e} mm</option>`).join('')}
            </select>

            <button onclick="iniciarInterfaceCorte()" style="width:100%; background:white; color:black; font-weight:800; border:none; padding:15px; border-radius:6px; cursor:pointer; text-transform:uppercase;">Abrir Lançamento</button>
        </div>
    `;

    // Define a data de hoje por padrão
    const inputData = document.getElementById('data-manual-serra');
    if(inputData) inputData.valueAsDate = new Date();
}

// --- 3. INTERFACE DE LANÇAMENTO ---
function iniciarInterfaceCorte() {
    const tipo = document.getElementById('s-tipo').value;
    const esp = document.getElementById('s-esp').value;
    const container = document.getElementById('aba-conteudo-serra');
    if(!container) return;

    // Guardamos a data escolhida no setup para não perder
    const dataEscolhida = document.getElementById('data-manual-serra').value;

    container.innerHTML = `
        <div style="background:#1e293b; padding:12px; border-radius:8px; margin-bottom:15px; border-left:4px solid #E31C24; display:flex; justify-content:space-between; align-items:center;">
            <div style="color:white; font-weight:bold; font-size:13px;">${tipo} - ${esp}mm</div>
            <div id="resumo-soma" style="color:#10b981; font-weight:bold; font-size:14px;">Total: 0.00 m</div>
            <input type="hidden" id="h-tipo" value="${tipo}">
            <input type="hidden" id="h-esp" value="${esp}">
            <input type="hidden" id="h-data-rel" value="${dataEscolhida}">
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:15px;">
            <button id="btn-s-ped" onclick="setModoCorte('pedido')" style="background:#3b82f6; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold;">PEDIDO</button>
            <button id="btn-s-stk" onclick="setModoCorte('stock')" style="background:#1e293b; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold;">STOCK</button>
        </div>

        <div id="campos-serra" style="background:#111827; padding:15px; border-radius:10px; border:1px solid #334155;"></div>
        
        <div id="lista-corte" style="margin-top:15px; max-height: 250px; overflow-y: auto;"></div>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:15px;">
            <button onclick="exibirSetupSerra()" style="background:#3b82f6; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold;">MUDAR PAINEL</button>
            <button onclick="fecharDiaSerra()" style="background:#E31C24; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold;">FECHAR DIA</button>
        </div>
    `;
    setModoCorte('pedido');
    atualizarTabelaSerra();
}

function setModoCorte(modo) {
    const container = document.getElementById('campos-serra');
    if(!container) return;

    document.getElementById('btn-s-ped').style.background = modo === 'pedido' ? '#3b82f6' : '#1e293b';
    document.getElementById('btn-s-stk').style.background = modo === 'stock' ? '#3b82f6' : '#1e293b';

    const rals = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
            <select id="s-ral-s" style="padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <option value="9010">SUP: 9010</option>
                <option value="9006">SUP: 9006</option>
                <option value="MAD.NATURAL">SUP: MAD.NATURAL</option>
            </select>
            <select id="s-ral-i" style="padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <option value="3009">INF: 3009</option>
                <option value="9010">INF: 9010</option>
                <option value="7016">INF: 7016</option>
                <option value="9006">INF: 9006</option>
            </select>
        </div>
    `;

    if(modo === 'pedido') {
        container.innerHTML = `
            <input type="text" id="s-ped" placeholder="Nº Pedido" style="width:100%; margin-bottom:10px; padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
            ${rals}
            <input type="number" id="s-metros" placeholder="Comprimento (m)" style="width:100%; margin-bottom:10px; padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
            <button onclick="addLinhaSerra('pedido')" style="width:100%; background:#E31C24; color:white; border:none; padding:12px; border-radius:5px; font-weight:bold;">ADICIONAR</button>
        `;
    } else {
        container.innerHTML = `
            <select id="s-qualidade" style="width:100%; margin-bottom:10px; padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <option value="P1">P1</option><option value="P2">P2</option><option value="Descarte">Descarte</option>
            </select>
            ${rals}
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
                <input type="number" id="s-qtd" placeholder="Qtd" style="padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <input type="number" id="s-metros" placeholder="Metros" style="padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
            </div>
            <button onclick="addLinhaSerra('stock')" style="width:100%; background:#E31C24; color:white; border:none; padding:12px; border-radius:5px; font-weight:bold;">ADICIONAR STOCK</button>
        `;
    }
}

// --- 4. LÓGICA E SOMAS ---
function addLinhaSerra(modo) {
    const metrosInput = document.getElementById('s-metros');
    const metros = parseFloat(metrosInput.value);
    if(!metros || metros <= 0) return alert("Insira a metragem!");

    const item = {
        tipo: document.getElementById('h-tipo').value,
        esp: document.getElementById('h-esp').value,
        ralS: document.getElementById('s-ral-s').value,
        ralI: document.getElementById('s-ral-i').value,
        metros: metros,
        qtd: modo === 'stock' ? (parseInt(document.getElementById('s-qtd').value) || 1) : 1,
        desc: modo === 'pedido' ? `PED: ${document.getElementById('s-ped').value || "S/N"}` : `STOCK: ${document.getElementById('s-qualidade').value}`
    };

    db_serra_live.push(item);
    localStorage.setItem('atlas_serra_live', JSON.stringify(db_serra_live));
    atualizarTabelaSerra();
    
    metrosInput.value = "";
    if(document.getElementById('s-ped')) document.getElementById('s-ped').value = "";
}

function atualizarTabelaSerra() {
    const lista = document.getElementById('lista-corte');
    const totalDisplay = document.getElementById('resumo-soma');
    if(!lista) return;

    const tipoAtual = document.getElementById('h-tipo')?.value;
    const espAtual = document.getElementById('h-esp')?.value;
    let totalDestePainel = 0;

    lista.innerHTML = db_serra_live.map((it, idx) => {
        let metrosLinha = it.metros * it.qtd;
        if(it.tipo === tipoAtual && it.esp === espAtual) totalDestePainel += metrosLinha;

        return `
            <div style="background:#1e293b; padding:8px; border-radius:5px; margin-bottom:5px; border-left:4px solid #3b82f6; display:flex; justify-content:space-between; align-items:center; color:white; font-size:11px;">
                <span>
                    <b style="color:#10b981;">${metrosLinha.toFixed(2)}m</b> 
                    <small>(${it.qtd}x ${it.metros}m)</small> — ${it.desc} 
                    <br><small style="color:#94a3b8;">INF: ${it.ralI} / SUP: ${it.ralS}</small>
                </span>
                <i class="fas fa-trash" onclick="removerCorte(${idx})" style="color:#ef4444; cursor:pointer; padding:5px;"></i>
            </div>
        `;
    }).join('');

    if(totalDisplay) totalDisplay.innerText = `Neste Painel: ${totalDestePainel.toFixed(2)}m`;
}

function removerCorte(i) {
    db_serra_live.splice(i, 1);
    localStorage.setItem('atlas_serra_live', JSON.stringify(db_serra_live));
    atualizarTabelaSerra();
}

// --- 5. FECHAR DIA ---
function fecharDiaSerra() {
    if (db_serra_live.length === 0) return alert("Adicione itens antes de fechar!");

    // Recupera a data do campo oculto (que veio do setup)
    const seletorData = document.getElementById('h-data-rel').value;
    
    let dataFinal, dia, mes, ano;

    if (seletorData) {
        const partes = seletorData.split('-'); 
        ano = partes[0];
        mes = partes[1];
        dia = partes[2];
        dataFinal = `${dia}/${mes}/${ano}`;
    } else {
        const hoje = new Date();
        dataFinal = hoje.toLocaleDateString('pt-BR');
        dia = String(hoje.getDate()).padStart(2, '0');
        mes = String(hoje.getMonth() + 1).padStart(2, '0');
        ano = hoje.getFullYear();
    }

    const novoRelatorio = {
        id: Date.now(),
        data: dataFinal,
        dia: dia,
        mes: parseInt(mes),
        ano: ano,
        operador: document.getElementById('user-nome')?.innerText || "OP. SERRA",
        itens: [...db_serra_live],
        totalGeral: db_serra_live.reduce((acc, cur) => acc + (cur.metros * cur.qtd), 0).toFixed(2)
    };

    db_serra_hist.push(novoRelatorio);
    localStorage.setItem('atlas_serra_hist', JSON.stringify(db_serra_hist));
    
    db_serra_live = [];
    localStorage.removeItem('atlas_serra_live');
    
    alert(`Relatório salvo com sucesso para o dia ${dataFinal}!`);
    renderizarMenuSerra();
}

// --- 6. FUNÇÃO AUXILIAR DE TOGGLE ---
function toggleElemento(id) {
    const el = document.getElementById(id);
    if(el) {
        el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
    }
}
function gerarPDF_Serra(dadosEncoded) {
    const rel = JSON.parse(decodeURIComponent(dadosEncoded));
    const janela = window.open('', '_blank');
    
    // 1. Organização dos dados
    let blocos = {};
    rel.itens.forEach(it => {
        let chave = `${it.tipo} ${it.esp}mm`;
        if(!blocos[chave]) blocos[chave] = { pedidos: [], stock: [] };
        
        if(it.desc.toUpperCase().includes('PED:')) {
            blocos[chave].pedidos.push(it);
        } else {
            blocos[chave].stock.push(it);
        }
    });

    let htmlConteudo = "";

    for(let nome in blocos) {
        htmlConteudo += `
            <div style="margin-bottom:30px;">
                <div style="background:#000; color:#fff; padding:8px; font-weight:bold; text-align:center; font-size:16px; border:2px solid #000;">
                    ${nome.toUpperCase()}
                </div>`;

        // --- LISTA DE PEDIDOS ---
        if(blocos[nome].pedidos.length > 0) {
            htmlConteudo += `
                <div style="text-align: center; padding:5px; background:#ddd; font-weight:bold; font-size:13px; border:2px solid #000; border-top:none; color:#000;"> LISTA DE PEDIDOS</div>
                <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom:10px; color:#000;">
                    <tr style="background:#eee;">
                        <th style="border:2px solid #000; width:55px;">Qtd</th>
                        <th style="border:2px solid #000; width:95px;">Mts Un.</th>
                        <th style="border:2px solid #000; width:110px;">Total Mts</th>
                        <th style="border:2px solid #000;">RAL (INF / SUP)</th>
                        <th style="border:2px solid #000;">Identificação</th>
                    </tr>
                    ${blocos[nome].pedidos.map(i => {
                        let numPedido = i.desc.replace(/PED:\s*/gi, '');
                        return `
                        <tr>
                            <td style="border:2px solid #000; text-align:center;">${i.qtd}</td>
                            <td style="border:2px solid #000; text-align:center;">${Number(i.metros).toFixed(2)}m</td>
                            <td style="border:2px solid #000; text-align:center; font-size:15px;">${(i.qtd * i.metros).toFixed(2)}m</td>
                            <td style="border:2px solid #000; text-align:center;">INF: ${i.ralI} / SUP: ${i.ralS}</td>
                            <td style="border:2px solid #000; text-align:center; text-transform:uppercase;">PEDIDO: ${numPedido}</td>
                        </tr>`;
                    }).join('')}
                </table>`;
        }

        // --- PRODUÇÃO PARA STOCK ---
        if(blocos[nome].stock.length > 0) {
            htmlConteudo += `
                <div style="text-align: center; padding:5px; background:#ddd; font-weight:bold; font-size:13px; border:2px solid #000; border-top:none; color:#000;"> PRODUÇÃO PARA STOCK</div>
                <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom:10px; color:#000;">
                    <tr style="background:#eee;">
                        <th style="border:2px solid #000; width:55px;">Qtd</th>
                        <th style="border:2px solid #000; width:95px;">Mts Un.</th>
                        <th style="border:2px solid #000; width:110px;">Total Mts</th>
                        <th style="border:2px solid #000;">RAL (INF / SUP)</th>
                        <th style="border:2px solid #000;">Qualidade</th>
                    </tr>
                    ${blocos[nome].stock.map(i => `
                        <tr>
                            <td style="border:2px solid #000; text-align:center;">${i.qtd}</td>
                            <td style="border:2px solid #000; text-align:center;">${Number(i.metros).toFixed(2)}m</td>
                            <td style="border:2px solid #000; text-align:center; font-size:15px;">${(i.qtd * i.metros).toFixed(2)}m</td>
                            <td style="border:2px solid #000; text-align:center;">INF: ${i.ralI} / SUP: ${i.ralS}</td>
                            <td style="border:2px solid #000; text-align:center;">${i.desc}</td>
                        </tr>
                    `).join('')}
                </table>`;
        }
        htmlConteudo += `</div>`;
    }

    janela.document.write(`
        <html>
        <head>
            <title>Relatório de Serra - Atlas</title>
            <style>
                @media print { 
                    .no-print { display: none !important; } 
                    body { -webkit-print-color-adjust: exact; }
                }
                body { font-family: Arial, sans-serif; padding: 20px; color: #000 !important; }
                table tr td, table tr th { border: 2px solid #000 !important; padding: 8px; color: #000 !important; }
                /* Negrito Extremo para Leitura Fácil */
                b, td, th, div, span { font-weight: 900 !important; } 
            </style>
        </head>
        <body>
            <div style="display:flex; justify-content:space-between; border-bottom:5px solid #E31C24; background:#000; color:#fff; padding:15px; align-items:center;">
                <div>
                    <b style="font-size:26px;">ATLAS PAINEL</b><br>
                    <span style="font-size:14px;">RELATÓRIO DE PRODUÇÃO - SERRA</span>
                </div>
                <div style="text-align:right; font-size:14px;">
                    DATA: ${rel.data}<br>
                    OPERADOR: ${rel.operador}
                </div>
            </div>

            <div style="margin-top:20px;">${htmlConteudo}</div>

            <div style="margin-top:10px; background:#000; color:#fff; padding:15px; text-align:right; font-size:20px; border: 2px solid #000;">
                TOTAL GERAL PRODUZIDO: ${rel.totalGeral} m
            </div>

            <div style="margin-top:100px; text-align:center; width:100%;">
                <div style="display:inline-block; width:350px; border-top:3px solid #000; padding-top:5px;">
                    <span style="text-transform:uppercase; font-size:16px; color:#000;">${rel.operador}</span><br>
                    <b style="font-size:12px; color:#000;">Responsável pela Produção</b>
                </div>
            </div>

            <div class="no-print" style="margin-top:50px; text-align:center;">
                <button onclick="window.print()" style="padding:20px 60px; background:#000; color:#fff; border:none; border-radius:5px; font-weight:bold; cursor:pointer; font-size:20px;">
                    🖨️ IMPRIMIR RELATÓRIO
                </button>
            </div>
        </body>
        </html>
    `);
    janela.document.close();
}
// --- 4. LÓGICA DE DADOS (CORRIGIDA) ---
function addLinhaSerra(modo) { 
    const metrosInput = document.getElementById('s-metros');
    const metros = parseFloat(metrosInput.value);
    
    if(!metros || metros <= 0) return alert("Insira uma metragem válida!");

    const item = {
        tipo: document.getElementById('h-tipo').value,
        esp: document.getElementById('h-esp').value,
        ralS: document.getElementById('s-ral-s').value,
        ralI: document.getElementById('s-ral-i').value,
        metros: metros,
        qtd: modo === 'stock' ? (parseInt(document.getElementById('s-qtd').value) || 1) : 1,
        desc: modo === 'pedido' ? `PED: ${document.getElementById('s-ped').value || "S/N"}` : `STOCK: ${document.getElementById('s-qualidade').value}`
    };

    db_serra_live.push(item);
    localStorage.setItem('atlas_serra_live', JSON.stringify(db_serra_live));
    
    atualizarTabelaSerra();
    metrosInput.value = ""; // Limpa o campo após add
}

// --- 5. HISTÓRICO (ESTILO BOBINES/INJEÇÃO) ---
function listarHistoricoSerra() {
    const render = document.getElementById('render-modulo');
    let agrupado = {};

    // Organiza por Ano e Mês
    db_serra_hist.forEach(rel => {
        if (!agrupado[rel.ano]) agrupado[rel.ano] = {};
        if (!agrupado[rel.ano][rel.mes]) agrupado[rel.ano][rel.mes] = [];
        agrupado[rel.ano][rel.mes].push(rel);
    });

    const mesesNome = ["", "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

    let html = `
        <div style="padding:15px; color:white;">
            <div style="display:flex; align-items:center; margin-bottom:20px;">
                <button onclick="renderizarMenuSerra()" style="background:none; border:none; color:#94a3b8; font-size:20px; cursor:pointer; margin-right:15px;"><i class="fas fa-arrow-left"></i></button>
                <h2 style="border-bottom: 2px solid #E31C24; padding-bottom: 10px; margin:0; flex:1; font-size:18px;">📂 HISTÓRICO DA SERRA</h2>
            </div>
    `;

    if (db_serra_hist.length === 0) {
        html += `<div style="text-align:center; padding:50px; color:gray;">Nenhum relatório encontrado no sistema.</div>`;
    }

    Object.keys(agrupado).sort((a,b) => b-a).forEach(ano => {
        html += `
            <div style="margin-bottom:10px;">
                <div onclick="toggleElemento('ano-s-${ano}')" style="background:#1e293b; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer; border: 1px solid #334155; display:flex; justify-content:space-between;">
                    <span>📁 ANO ${ano}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div id="ano-s-${ano}" style="display:none; padding-left:10px; margin-top:5px; border-left: 2px solid #E31C24;">`;
            
        Object.keys(agrupado[ano]).sort((a,b) => b-a).forEach(mes => {
            html += `
                <div onclick="toggleElemento('mes-s-${ano}-${mes}')" style="cursor:pointer; padding:10px; color:#3b82f6; background: #0f172a; margin-top:5px; border-radius:4px; font-weight:bold;">
                    📅 ${mesesNome[mes]}
                </div>
                <div id="mes-s-${ano}-${mes}" style="display:none; padding-left:10px; background: #1a202c;">`;
                
            agrupado[ano][mes].forEach((rel, idx) => {
                // Criamos um ID único para cada relatório para o PDF
                const relID = `rel-${ano}-${mes}-${idx}`;
                html += `
                    <div style="padding:12px; border-bottom:1px solid #334155; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:13px;">
                            <b style="color:white;">DIA ${rel.dia}/${rel.mes}</b><br>
                            <small style="color:#94a3b8;">Total: ${rel.totalGeral} m</small>
                        </span>
                        <button onclick='gerarPDF_Serra("${encodeURIComponent(JSON.stringify(rel))}")' 
                                style="background:#10b981; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; font-weight:bold; font-size:11px;">
                            <i class="fas fa-file-pdf"></i> VER PDF
                        </button>
                    </div>`;
            });
            html += `</div>`;
        });
        html += `</div></div>`;
    });

    html += `</div>`;
    render.innerHTML = html;
}

// --- 6. FUNÇÃO AUXILIAR DE TOGGLE ---
function toggleElemento(id) {
    const el = document.getElementById(id);
    if(el) {
        if(el.style.display === 'none' || el.style.display === '') {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    }
}
// finalizou a serra aqui 

//embalagem
// --- 1. BANCO DE DATOS EMBALAGEM ---
let db_emb_live = JSON.parse(localStorage.getItem('atlas_emb_live')) || [];
let db_emb_hist = JSON.parse(localStorage.getItem('atlas_emb_hist')) || [];

function renderizarMenuEmbalagem() {
    const render = document.getElementById('render-modulo');
    render.innerHTML = `
        <div id="container-menu-emb" style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; padding:15px;">
            <div class="card" onclick="exibirSetupEmbalagem()" style="cursor:pointer; background:#1e293b; border-radius:10px; padding:30px 15px; text-align:center; border: 1px solid #334155;">
                <i class="fas fa-plus" style="color:#3b82f6; font-size:2.5rem; margin-bottom:15px;"></i>
                <span style="display:block; color:white; font-weight:bold; font-size:13px; text-transform:uppercase;">Novo Relatório</span>
            </div>
            <div class="card" onclick="listarHistoricoEmbalagem()" style="cursor:pointer; background:#1e293b; border-radius:10px; padding:30px 15px; text-align:center; border: 1px solid #334155;">
                <i class="fas fa-history" style="color:#3b82f6; font-size:2.5rem; margin-bottom:15px;"></i>
                <span style="display:block; color:white; font-weight:bold; font-size:13px; text-transform:uppercase;">Histórico Embalagem</span>
            </div>
        </div>
        <div id="container-acao-emb" style="display:none; padding:15px;"></div>
    `;

    if(db_emb_live.length > 0) {
        iniciarInterfaceCorte();
    }
}

// --- 2. GERENCIAMENTO DE INTERFACE ---
function alternarAbaEmbalagem(mostrarAcao) {
    const menu = document.getElementById('container-menu-emb');
    const acao = document.getElementById('container-acao-emb');
    if(mostrarAcao) {
        if(menu) menu.style.display = 'none';
        if(acao) acao.style.display = 'block';
    } else {
        if(menu) menu.style.display = 'grid';
        if(acao) {
            acao.style.display = 'none';
            acao.innerHTML = '';
        }
    }
}

function exibirSetupEmbalagem() {
    alternarAbaEmbalagem(true);
    const container = document.getElementById('container-acao-emb');
    container.innerHTML = `
        <div style="display:flex; align-items:center; margin-bottom:15px;">
            <button onclick="alternarAbaEmbalagem(false)" style="background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer; margin-right:15px;">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h3 style="color:#E31C24; font-size:14px; margin:0; text-transform:uppercase;">Configurar Embalagem</h3>
        </div>
        <div style="margin-bottom: 15px; padding: 10px; background: #1e293b; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 10px; border: 1px solid #334155;">
            <label style="color: #94a3b8; font-weight: bold; font-size: 12px;">DATA:</label>
            <input type="date" id="data-manual-Embalagem" style="background: #0f172a; color: white; border: 1px solid #3b82f6; padding: 5px; border-radius: 4px; font-weight: bold; outline: none;">
        </div>
        <div style="background:#111827; padding:20px; border-radius:12px; border: 1px solid #334155;">
            <label style="color:#94a3b8; font-size:11px;">TIPO DE PAINEL</label>
            <select id="s-tipo" style="background:#1e293b; color:white; border:1px solid #334155; width:100%; padding:12px; border-radius:6px; margin-bottom:15px; font-weight:bold;">
                <option value="5 Ondas">5 Ondas</option>
                <option value="Fachada">Fachada</option>
                <option value="Telha Canudo">Telha Canudo</option>
            </select>
            <label style="color:#94a3b8; font-size:11px;">ESPESSURA (mm)</label>
            <select id="s-esp" style="background:#1e293b; color:white; border:1px solid #334155; width:100%; padding:12px; border-radius:6px; margin-bottom:20px; font-weight:bold;">
                ${[30,40,50,60,80,100,120].map(e => `<option value="${e}">${e} mm</option>`).join('')}
            </select>
            <button onclick="iniciarInterfaceCorte()" style="width:100%; background:white; color:black; font-weight:800; border:none; padding:15px; border-radius:6px; cursor:pointer; text-transform:uppercase;">Abrir Lançamento</button>
        </div>
    `;
    document.getElementById('data-manual-Embalagem').valueAsDate = new Date();
}

// --- 3. INTERFACE DE LANÇAMENTO ---
function iniciarInterfaceCorte() {
    alternarAbaEmbalagem(true);
    const tipo = document.getElementById('s-tipo')?.value || db_emb_live[0]?.tipo || "5 Ondas";
    const esp = document.getElementById('s-esp')?.value || db_emb_live[0]?.esp || "30";
    const dataEscolhida = document.getElementById('data-manual-Embalagem')?.value || "";

    const container = document.getElementById('container-acao-emb');
    container.innerHTML = `
        <div style="background:#1e293b; padding:12px; border-radius:8px; margin-bottom:15px; border-left:4px solid #E31C24; display:flex; justify-content:space-between; align-items:center;">
            <div style="color:white; font-weight:bold; font-size:13px;">${tipo} - ${esp}mm</div>
            <div id="resumo-soma" style="color:#10b981; font-weight:bold; font-size:14px;">Total: 0.00 m</div>
            <input type="hidden" id="h-tipo" value="${tipo}">
            <input type="hidden" id="h-esp" value="${esp}">
            <input type="hidden" id="h-data-rel" value="${dataEscolhida}">
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:15px;">
            <button id="btn-s-ped" onclick="setModoCorte('pedido')" style="background:#3b82f6; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold;">PEDIDO</button>
            <button id="btn-s-stk" onclick="setModoCorte('stock')" style="background:#1e293b; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold;">STOCK</button>
        </div>
        <div id="campos-Embalagem" style="background:#111827; padding:15px; border-radius:10px; border:1px solid #334155;"></div>
        <div id="lista-corte" style="margin-top:15px; max-height: 250px; overflow-y: auto;"></div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:15px;">
            <button onclick="exibirSetupEmbalagem()" style="background:#3b82f6; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold;">MUDAR PAINEL</button>
            <button onclick="fecharDiaEmbalagem()" style="background:#E31C24; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold;">FECHAR DIA</button>
        </div>
    `;
    setModoCorte('pedido');
    atualizarTabelaEmbalagem();
}

function setModoCorte(modo) {
    const container = document.getElementById('campos-Embalagem');
    if(!container) return;

    document.getElementById('btn-s-ped').style.background = modo === 'pedido' ? '#3b82f6' : '#1e293b';
    document.getElementById('btn-s-stk').style.background = modo === 'stock' ? '#3b82f6' : '#1e293b';

    const rals = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
            <select id="s-ral-s" style="padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <option value="9010">SUP: 9010</option>
                <option value="9006">SUP: 9006</option>
                <option value="MAD.NATURAL">SUP: MAD.NATURAL</option>
            </select>
            <select id="s-ral-i" style="padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <option value="3009">INF: 3009</option>
                <option value="9010">INF: 9010</option>
                <option value="7016">INF: 7016</option>
                <option value="9006">INF: 9006</option>
            </select>
        </div>
    `;

    if(modo === 'pedido') {
        container.innerHTML = `
            <input type="text" id="s-ped" placeholder="Nº Pedido" style="width:100%; margin-bottom:10px; padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
            ${rals}
            <input type="number" id="s-metros" placeholder="Comprimento (m)" style="width:100%; margin-bottom:10px; padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
            <button onclick="addLinhaEmbalagem('pedido')" style="width:100%; background:#E31C24; color:white; border:none; padding:12px; border-radius:5px; font-weight:bold;">ADICIONAR</button>
        `;
    } else {
        container.innerHTML = `
            <select id="s-qualidade" style="width:100%; margin-bottom:10px; padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <option value="P1">P1</option><option value="P2">P2</option><option value="Descarte">Descarte</option>
            </select>
            ${rals}
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
                <input type="number" id="s-qtd" placeholder="Qtd" style="padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <input type="number" id="s-metros" placeholder="Metros" style="padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
            </div>
            <button onclick="addLinhaEmbalagem('stock')" style="width:100%; background:#E31C24; color:white; border:none; padding:12px; border-radius:5px; font-weight:bold;">ADICIONAR STOCK</button>
        `;
    }
}

// --- 4. LÓGICA DE DADOS ---
function addLinhaEmbalagem(modo) {
    const metrosInput = document.getElementById('s-metros');
    const metros = parseFloat(metrosInput.value);
    if(!metros || metros <= 0) return alert("Insira a metragem!");

    const item = {
        tipo: document.getElementById('h-tipo').value,
        esp: document.getElementById('h-esp').value,
        ralS: document.getElementById('s-ral-s').value,
        ralI: document.getElementById('s-ral-i').value,
        metros: metros,
        qtd: modo === 'stock' ? (parseInt(document.getElementById('s-qtd').value) || 1) : 1,
        desc: modo === 'pedido' ? `PED: ${document.getElementById('s-ped').value || "S/N"}` : `STOCK: ${document.getElementById('s-qualidade').value}`
    };

    db_emb_live.push(item);
    localStorage.setItem('atlas_emb_live', JSON.stringify(db_emb_live));
    atualizarTabelaEmbalagem();
    
    metrosInput.value = "";
    if(document.getElementById('s-ped')) document.getElementById('s-ped').value = "";
}

function atualizarTabelaEmbalagem() {
    const lista = document.getElementById('lista-corte');
    const totalDisplay = document.getElementById('resumo-soma');
    if(!lista) return;

    const tipoAtual = document.getElementById('h-tipo')?.value;
    const espAtual = document.getElementById('h-esp')?.value;
    let totalDestePainel = 0;

    lista.innerHTML = db_emb_live.map((it, idx) => {
        let metrosLinha = it.metros * it.qtd;
        if(it.tipo === tipoAtual && it.esp === espAtual) totalDestePainel += metrosLinha;

        return `
            <div style="background:#1e293b; padding:8px; border-radius:5px; margin-bottom:5px; border-left:4px solid #3b82f6; display:flex; justify-content:space-between; align-items:center; color:white; font-size:11px;">
                <span>
                    <b style="color:#10b981;">${metrosLinha.toFixed(2)}m</b> 
                    <small>(${it.qtd}x ${it.metros}m)</small> — ${it.desc} 
                    <br><small style="color:#94a3b8;">INF: ${it.ralI} / SUP: ${it.ralS}</small>
                </span>
                <i class="fas fa-trash" onclick="removerCorteEmbalagem(${idx})" style="color:#ef4444; cursor:pointer; padding:5px;"></i>
            </div>
        `;
    }).join('');

    if(totalDisplay) totalDisplay.innerText = `Neste Painel: ${totalDestePainel.toFixed(2)}m`;
}

function removerCorteEmbalagem(i) {
    db_emb_live.splice(i, 1);
    localStorage.setItem('atlas_emb_live', JSON.stringify(db_emb_live));
    atualizarTabelaEmbalagem();
}

function fecharDiaEmbalagem() {
    if (db_emb_live.length === 0) return alert("Adicione itens antes de fechar!");

    const seletorData = document.getElementById('h-data-rel').value;
    let dataFinal, dia, mes, ano;

    if (seletorData) {
        const partes = seletorData.split('-'); 
        ano = partes[0];
        mes = partes[1];
        dia = partes[2];
        dataFinal = `${dia}/${mes}/${ano}`;
    } else {
        const hoje = new Date();
        dataFinal = hoje.toLocaleDateString('pt-BR');
        dia = String(hoje.getDate()).padStart(2, '0');
        mes = String(hoje.getMonth() + 1).padStart(2, '0');
        ano = hoje.getFullYear();
    }

    const novoRelatorio = {
        id: Date.now(),
        data: dataFinal,
        dia: dia,
        mes: parseInt(mes),
        ano: ano,
        operador: document.getElementById('user-nome')?.innerText || "OP. EMBALAGEM",
        itens: [...db_emb_live],
        totalGeral: db_emb_live.reduce((acc, cur) => acc + (cur.metros * cur.qtd), 0).toFixed(2)
    };

    db_emb_hist.push(novoRelatorio);
    localStorage.setItem('atlas_emb_hist', JSON.stringify(db_emb_hist));
    
    db_emb_live = [];
    localStorage.removeItem('atlas_emb_live');
    
    alert(`Relatório salvo com sucesso!`);
    renderizarMenuEmbalagem();
}

// --- 5. HISTÓRICO ---
function listarHistoricoEmbalagem() {
    alternarAbaEmbalagem(true);
    const container = document.getElementById('container-acao-emb');
    let agrupado = {};

    db_emb_hist.forEach(rel => {
        if (!agrupado[rel.ano]) agrupado[rel.ano] = {};
        if (!agrupado[rel.ano][rel.mes]) agrupado[rel.ano][rel.mes] = [];
        agrupado[rel.ano][rel.mes].push(rel);
    });

    const mesesNome = ["", "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

    let html = `
        <div style="color:white;">
            <div style="display:flex; align-items:center; margin-bottom:20px;">
                <button onclick="alternarAbaEmbalagem(false)" style="background:none; border:none; color:#94a3b8; font-size:20px; cursor:pointer; margin-right:15px;"><i class="fas fa-arrow-left"></i></button>
                <h2 style="border-bottom: 2px solid #E31C24; padding-bottom: 10px; margin:0; flex:1; font-size:18px; text-transform:uppercase;">📂 Histórico Embalagem</h2>
            </div>
    `;

    if (db_emb_hist.length === 0) {
        html += `<div style="text-align:center; padding:50px; color:gray;">Nenhum relatório encontrado.</div>`;
    }

    Object.keys(agrupado).sort((a,b) => b-a).forEach(ano => {
        html += `
            <div style="margin-bottom:10px;">
                <div onclick="toggleElemento('ano-emb-${ano}')" style="background:#1e293b; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer; border: 1px solid #334155; display:flex; justify-content:space-between;">
                    <span>📁 ANO ${ano}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div id="ano-emb-${ano}" style="display:none; padding-left:10px; margin-top:5px; border-left: 2px solid #E31C24;">`;
            
        Object.keys(agrupado[ano]).sort((a,b) => b-a).forEach(mes => {
            html += `
                <div onclick="toggleElemento('mes-emb-${ano}-${mes}')" style="cursor:pointer; padding:10px; color:#3b82f6; background: #0f172a; margin-top:5px; border-radius:4px; font-weight:bold;">
                    📅 ${mesesNome[mes]}
                </div>
                <div id="mes-emb-${ano}-${mes}" style="display:none; padding-left:10px; background: #1a202c;">`;
                
            agrupado[ano][mes].forEach((rel) => {
                html += `
                    <div style="padding:12px; border-bottom:1px solid #334155; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:13px;">
                            <b style="color:white;">DIA ${rel.dia}/${rel.mes}</b><br>
                            <small style="color:#94a3b8;">Total: ${rel.totalGeral} m</small>
                        </span>
                        <button onclick='gerarPDF_Embalagem("${encodeURIComponent(JSON.stringify(rel))}")' 
                                style="background:#10b981; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; font-weight:bold; font-size:11px;">
                            <i class="fas fa-file-pdf"></i> PDF
                        </button>
                    </div>`;
            });
            html += `</div>`;
        });
        html += `</div></div>`;
    });

    html += `</div>`;
    container.innerHTML = html;
}

// --- 6. FUNÇÕES AUXILIARES ---
function toggleElemento(id) {
    const el = document.getElementById(id);
    if(el) el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
}

function gerarPDF_Embalagem(dadosEncoded) {
    const rel = JSON.parse(decodeURIComponent(dadosEncoded));
    const janela = window.open('', '_blank');
    
    let blocos = {};
    rel.itens.forEach(it => {
        let chave = `${it.tipo} ${it.esp}mm`;
        if(!blocos[chave]) blocos[chave] = { pedidos: [], stock: [] };
        if(it.desc.toUpperCase().includes('PED:')) blocos[chave].pedidos.push(it);
        else blocos[chave].stock.push(it);
    });

    let htmlConteudo = "";
    for(let nome in blocos) {
        htmlConteudo += `
            <div style="margin-bottom:30px; page-break-inside: avoid;">
                <div style="background:#000; color:#fff; padding:8px; font-weight:bold; text-align:center; font-size:16px; border:2px solid #000;">${nome.toUpperCase()}</div>`;
        
        if(blocos[nome].pedidos.length > 0) {
            htmlConteudo += `<div style="text-align: center; padding:5px; background:#ddd; font-weight:bold; border:2px solid #000; border-top:none; color:#000;"> LISTA DE PEDIDOS</div>
                <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom:10px; color:#000;">
                    <thead>
                        <tr style="background:#eee;">
                            <th style="border:2px solid #000; width:50px;">Qtd</th>
                            <th style="border:2px solid #000; width:90px;">Mts Un.</th>
                            <th style="border:2px solid #000; width:100px;">Total</th>
                            <th style="border:2px solid #000;">RAL (INF/SUP)</th>
                            <th style="border:2px solid #000;">Identificação</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${blocos[nome].pedidos.map(i => `<tr>
                            <td style="border:2px solid #000; text-align:center;">${i.qtd}</td>
                            <td style="border:2px solid #000; text-align:center;">${Number(i.metros).toFixed(2)}m</td>
                            <td style="border:2px solid #000; text-align:center; font-weight:bold;">${(i.qtd * i.metros).toFixed(2)}m</td>
                            <td style="border:2px solid #000; text-align:center;">${i.ralI}/${i.ralS}</td>
                            <td style="border:2px solid #000; text-align:center;">${i.desc}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>`;
        }
        
        if(blocos[nome].stock.length > 0) {
            htmlConteudo += `<div style="text-align: center; padding:5px; background:#ddd; font-weight:bold; border:2px solid #000; border-top:none; color:#000;"> PRODUÇÃO STOCK</div>
                <table style="width:100%; border-collapse:collapse; font-size:14px; color:#000;">
                    <thead>
                        <tr style="background:#eee;">
                            <th style="border:2px solid #000; width:50px;">Qtd</th>
                            <th style="border:2px solid #000; width:90px;">Mts Un.</th>
                            <th style="border:2px solid #000; width:100px;">Total</th>
                            <th style="border:2px solid #000;">RAL (INF/SUP)</th>
                            <th style="border:2px solid #000;">Qualidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${blocos[nome].stock.map(i => `<tr>
                            <td style="border:2px solid #000; text-align:center;">${i.qtd}</td>
                            <td style="border:2px solid #000; text-align:center;">${Number(i.metros).toFixed(2)}m</td>
                            <td style="border:2px solid #000; text-align:center; font-weight:bold;">${(i.qtd * i.metros).toFixed(2)}m</td>
                            <td style="border:2px solid #000; text-align:center;">${i.ralI}/${i.ralS}</td>
                            <td style="border:2px solid #000; text-align:center;">${i.desc}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>`;
        }
        htmlConteudo += `</div>`;
    }

    janela.document.write(`
        <html>
        <head>
            <title>Relatório Embalagem</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
                table tr td, table tr th { border: 2px solid #000 !important; padding: 8px; }
                @media print { 
                    .no-print { display: none !important; } 
                    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            </style>
        </head>
        <body>
            <div style="display:flex; justify-content:space-between; border-bottom:5px solid #E31C24; background:#000; color:#fff; padding:15px; align-items:center;">
                <div><b style="font-size:22px;">ATLAS PAINEL</b><br>RELATÓRIO DE EMBALAGEM</div>
                <div style="text-align:right; font-weight:bold;">DATA: ${rel.data}<br>OP: ${rel.operador}</div>
            </div>

            <div style="margin-top:20px;">${htmlConteudo}</div>

            <div style="margin-top:20px; background:#000 !important; color:#fff !important; padding:20px; text-align:right; border: 3px solid #000;">
                <span style="font-size:18px; font-weight:normal; text-transform:uppercase; display:block; margin-bottom:5px;">Total Geral Produzido</span>
                <b style="font-size:35px; display:block; line-height:1;">${rel.totalGeral} m</b>
            </div>

            <div style="margin-top:80px; text-align:center; width:100%;">
                <div style="display:inline-block; width:350px; border-top:2px solid #000; padding-top:5px;">
                    <b style="text-transform:uppercase; font-size:14px;">${rel.operador}</b><br>
                    <span>Responsável pela Produção</span>
                </div>
            </div>

            <div class="no-print" style="margin-top:40px; text-align:center;">
                <button onclick="window.print()" style="padding:15px 50px; background:#E31C24; color:#fff; border:none; border-radius:5px; font-weight:bold; cursor:pointer; font-size:18px;">
                    🖨️ IMPRIMIR AGORA
                </button>
            </div>
        </body>
        </html>
    `);
    janela.document.close();
}
