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
    } else {
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
                <td style="border: 1px solid #000; padding: 8px;">${item.nome}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center;">${item.esp}mm</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center; font-weight:bold;">${metrosNum.toFixed(2)} m</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center;">${item.vel}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center;">${item.pol}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center;">${item.mdi}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center;">${item.pen}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center;">${item.cat1}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center;">${item.cat2}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center;">${item.cat3}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align:center;">${item.cat4}</td>
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
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { box-sizing: border-box; }
                body { padding: 15px; font-family: Arial, sans-serif; color: #000; margin: 0; width: 100%; }

                /* CABEÇALHO PRETO */
                .header-table { width: 100%; background: #000; color: #fff; padding: 15px; border-bottom: 5px solid #E31C24; margin-bottom: 20px; }
                .logo-wrapper { display: flex; align-items: center; }
                .logo-bar { width: 35px; height: 10px; background: #E31C24; margin-bottom: 4px; }
                .text-atlas { font-family: 'Arial Black', sans-serif; font-size: 26px; line-height: 1; color: #fff; }
                .text-painel { font-size: 10px; letter-spacing: 5px; color: #fff; text-transform: uppercase; }

                /* TABELA */
                .table-container { width: 100%; overflow-x: auto; margin-top: 10px; } 
                table { width: 100%; border-collapse: collapse; min-width: 900px; } 
                th { background: #e2e8f0; border: 1px solid #000; padding: 10px; font-size: 13px; }
                td { border: 1px solid #000; padding: 10px; font-size: 13px; }

                /* CAIXA DE TOTAL E FINALIZAÇÃO */
                .resumo-final { 
                    margin-top: 25px; 
                    padding: 20px; 
                    background: #f8f9fa; 
                    border: 2px solid #000; 
                    text-align: center; 
                }
                .total-texto { font-size: 22px; font-weight: bold; margin-bottom: 10px; }
                .info-finalizacao { font-size: 14px; color: #333; border-top: 1px solid #ccc; pt: 10px; margin-top: 10px; }

                /* CAMPO DE ASSINATURA */
                .assinatura { margin-top: 50px; text-align: center; }
                .linha-assinatura { border-top: 1px solid #000; width: 300px; margin: 0 auto; padding-top: 5px; font-size: 12px; }

                @media print { 
                    .no-print { display: none !important; } 
                    @page { size: landscape; margin: 1cm; }
                    body { padding: 0; }
                    .table-container { overflow: visible; }
                    table { min-width: 100%; }
                    .header-table { background: #000 !important; color: #fff !important; -webkit-print-color-adjust: exact; }
                }
            </style>
        </head>
        <body>
            <div class="header-table">
                <table width="100%">
                    <tr>
                        <td>
                            <div class="logo-wrapper">
                                <div style="margin-right:12px;">
                                    <div class="logo-bar"></div><div class="logo-bar"></div>
                                </div>
                                <div><span class="text-atlas">ATLAS</span><br><span class="text-painel">P A I N E L</span></div>
                            </div>
                        </td>
                        <td style="text-align: right;">
                            <h1 style="margin:0; font-size: 20px;">RELATÓRIO DE INJEÇÃO</h1>
                        </td>
                    </tr>
                </table>
            </div>

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
                <div class="total-texto">
                    TOTAL PRODUZIDO: <span style="color: #E31C24;">${totalMetrosDia.toFixed(2)} metros</span>
                </div>
                <div class="info-finalizacao">
                    Relatório finalizado por: <b>${rel.operador}</b> <br>
                    Data da Produção: <b>${rel.data}</b>
                </div>
            </div>

            <div class="assinatura">
                <div class="linha-assinatura">
                    Assinatura do Operador: ${rel.operador}
                </div>
                <p style="font-size: 10px; color: #666;">Gerado em: ${new Date().toLocaleString()}</p>
            </div>

            <div style="text-align: center; margin-top: 30px;" class="no-print">
                <button onclick="window.print()" style="padding: 20px 40px; background: #000; color: #fff; border: 3px solid #E31C24; cursor: pointer; border-radius: 10px; font-weight: bold; font-size: 20px; width: 90%;">
                    🖨️ CONFIRMAR E IMPRIMIR PDF
                </button>
            </div>
        </body>
        </html>
    `);
    janela.document.close();
}
//final da injeççao
