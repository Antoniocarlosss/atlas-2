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

    // MÓDULO INJEÇÃO (Mantido como você já tem)
    if (nome === 'injecao') {
        render.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; padding:15px;">
                <div class="card" onclick="exibirFormulario('injecao')"><i class="fas fa-plus"></i><span>Novo Relatório</span></div>
                <div class="card" onclick="exibirHistoricoModulo('injecao')"><i class="fas fa-history"></i><span>Histórico</span></div>
            </div>`;
    } 
    // NOVO MÓDULO BOBINES
    else if (nome === 'bobines') {
        renderizarMenuBobines();
    } 
    // MÓDULOS EM DESENVOLVIMENTO
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
    let html = "";

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
function moduloBobine(tipo) {
    const render = document.getElementById('render-modulo');
    
    switch(tipo) {
        case 'novo':
            // Aqui chamaremos a função para criar o relatório (próximo passo)
            render.innerHTML = `<h2 style="color:white; text-align:center;">Novo Relatório de Bobines</h2>`;
            break;
        case 'historico':
            render.innerHTML = `<h2 style="color:white; text-align:center;">Histórico de Bobines</h2>`;
            break;
        case 'calculadora':
            renderizarCalculadoraBobina(); // Vamos criar essa função a seguir
            break;
       case 'calculadora_agro':
    renderizarCalculadoraAgro();
    break;
    }
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

