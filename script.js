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
    
    // Criamos um container temporário para o PDF
    const conteudoFinal = document.createElement('div');
    conteudoFinal.style.padding = "10px";
    conteudoFinal.style.fontFamily = "Arial, sans-serif";
    conteudoFinal.style.color = "#000";
    conteudoFinal.style.background = "#fff";

    // Montagem das linhas da tabela com TODOS os dados
    let tabelaItens = "";
    rel.itens.forEach(item => {
        tabelaItens += `
            <tr>
                <td style="border: 1px solid #000; padding: 6px; font-size: 9px;">${item.nome}</td>
                <td style="border: 1px solid #000; padding: 6px; text-align:center; font-size: 9px;">${item.esp}mm</td>
                <td style="border: 1px solid #000; padding: 6px; text-align:center; font-size: 9px; font-weight:bold;">${item.metros} m</td>
                <td style="border: 1px solid #000; padding: 6px; text-align:center; font-size: 9px;">${item.vel}</td>
                <td style="border: 1px solid #000; padding: 6px; text-align:center; font-size: 9px;">${item.pol}</td>
                <td style="border: 1px solid #000; padding: 6px; text-align:center; font-size: 9px;">${item.mdi}</td>
                <td style="border: 1px solid #000; padding: 6px; text-align:center; font-size: 9px;">${item.pen}</td>
                <td style="border: 1px solid #000; padding: 6px; text-align:center; font-size: 9px;">${item.cat1}</td>
                <td style="border: 1px solid #000; padding: 6px; text-align:center; font-size: 9px;">${item.cat2}</td>
                <td style="border: 1px solid #000; padding: 6px; text-align:center; font-size: 9px;">${item.cat3}</td>
                <td style="border: 1px solid #000; padding: 6px; text-align:center; font-size: 9px;">${item.cat4}</td>
            </tr>`;
        
        // Se houver paragens registradas para este item, adiciona uma linha de observação
        if(item.paragens && item.paragens.length > 0) {
            let pTexto = item.paragens.map(p => `• ${p.motivo} (${p.tempo}min)`).join("  |  ");
            tabelaItens += `
                <tr>
                    <td colspan="11" style="border: 1px solid #000; padding: 4px; font-size: 8px; background: #f0f0f0;">
                        <b>PARAGENS:</b> ${pTexto}
                    </td>
                </tr>`;
        }
    });

    // Estrutura do Documento (Cabeçalho com Logo + Tabela)
    conteudoFinal.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 3px solid #000; padding-bottom: 10px; margin-bottom: 10px;">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAb8AAAG/CAYAAADIE9lyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAImbSURBVHhe7Z0FmGRXnfZvactYbDLS7j49Mz0+USKE4OziLIvbQhY+CLoBFggOi7vL7uIQiBI8wKIRCCEh7slMZiIEh//3vKfqrTl97q3uqpbpnpv3PM/vuVWnbt17/D1+oiiKTAghhLiPEbMQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MYsDikyF7LTXXBRZLnadHfveP1PgvpnhwiATWZQtX5OIhZP/3nh4CiHEfYSYxQEDCm+IWN6Rd9dclC8LW+lK+2KUt4Yoa41R3hqjrDWXrwD2M6U4a/IzxglgLrKoEFmUL4PvEEMKYlko94XTvvfiswRQCHEfJWZxQFESun2ErSPas9CnaPnCV4yiGZMvtwBndi2JM4R6JlcIW1Xxq7T8JosfhbPBXb0WpBBC3LeIWRw4+N17bO0kUaUrMPaMegnfMxP4nJlcq+H8BlFLrgj4LWOJnxDiPkrM4sCBQoDWThJsCfn4wsPW0mxhy6ve62zJ7uv6TSJsBVMQJ5MQrkIIkX5iFgcOtYpfKBpzCYRsLuCz6rlm0X2KrttSN2apK7MEu0djwpfYShRCiPscMYsDDxbiSVfit/jYAgxbgjMhFNz9SQbiB9ErOIqOkvD54jeppeeHhwRQCHHfJWZxwIAuP0wc8SegNHiEk1K4NCF8Rrh8oR7iSwj2L6WxuwbLRQXLTAITYsqTYpJafBRviZ8Q4r5JzOKAAYV/tVmcPlySUFoKsa8bsCQeJXGcDXzG/r/CHxC4Qhl+DoQvSfzU6hNC3LeJWRxAZC2fbbBcpmj5qGCFqGCNUbHcDZg0/kVRyFuU2fc5nBgyEyiq+/PqRC1bsCiXL4PveYuyuO4TvFwhb/k8/Lov7LKZUuUBn4vFomUymcpvuVwuIaxnDp4fvh/gPXhvNpt1n3H1fysUIOTx5/n4//H9wGeE9x+IIOz88PPDCmHEMOTv+Mz78dtUhO+qRmNjozU0NFS+I07Dew5EfD/hsx+O84H//KQ84VNP/NQL438qN/j5ciZphuAdYT6d7jn4fb7j4oAXPydiTshKLR50ARaikhhC9BozTdaQbbRCtsnyuUbL5ZssU2i0qNBkUQHfQbH8W33XvHctzPgKYah+zWWQcPKJ1wyELl9e60fwvZCrTIhBODkhyUHk2Vre14LMZSYnMCZKXFGwIgFOBe6ZCr6fCTlJkJjQ/QyBz0n3VoPPwDtZUOP/FI5qhO6tlzA85oPQr2FFgXYE7qpW4Qjx/5cE31PNLWkD6Qhhh/QTppUwbBjWPuF/8Bw+i8/H/2op/Ke7ZzaEz29ubrZly5ZNWalB/MMfuIeE/g+ZqR8kftOBlo0r7LMWIXGh5ZNvcOKUzRTLrTJO+ih3A0IocR9bSij8XfffQl297sd6r+XP4TjgvvHAEsVsxkHBa0AGd63HyJobmyrPomDgMzN2LMxnARIznw/8jIHfwowSfq8G3Ok/N02E/koKExRISfb8bSrC+6eDhSYLwfD3Aw344eCDD3aFP+3mu9DFO5uaSvmO4VmN8L9zwXTPp/uYr6rdVwvTpd+kfM/7kuznmJjFomZSxGUzFjVA/PZN4MjnMtaUy1lzlLGmKLIVUc6xLJOzJdmc+60xn7NiAWSsKZ+xJbmZszQ7G6JpWZbLVGV5LrJDM5EdGkV2SCayw7KRHVaIbGUxZ4cWsrYij23cIkdTpjwhKJOxhlzWChlUDCJX22PYstvHFz7WXKsRtlJC/ATsFyr4LwscvjPMaPUkfr4PGXfp0qUOtADDmnpI6N56CZ831/h+DEUeYUi/8wp/s6Vx6KGHxsIpJKyph+BZK1assCVLllR114FOmOb4Hf5EGkU6QlggfPEb450tmzAtsGLB8MNniIlf2fDjLGQ+C34+238f3MmWHPyLNET3VQP+xP2h20N8P+M/fC4+4z34nfbV4mEeiVksWsKIg9A15iJrzpWE4uAossOiyNZEkbVEkbVFkXWX6Ywi6yjb4Tfe01q2myl4Jp49X+D51eiKIusr0+sB/8Jth0eRrcpl7SAKYFQSPiQ4dJ1GmVICROb2EzK/+2FejTCOQqrdg8KU4slWBEBG8OM5/F816G4KAgjdmkT4nMUK3BoKH8QNV4YbC2T/f75gJRG+JwkUiHwu4goVJtix9XIggzBAulm+fLkddthhDnzHbxQvCp//v2rp00+7LNBxRRxRCPDMgw46yLU4GQ9+azwUgrnAT/N0G90P9yBOkSfhd8QrPgPEMz/jvtm4y/8vPuPZ7Dr1/b0f82fMYtHCiGOCaS4LHkRirDGyTUsKtq0xbzvyWTsqm7X7ZXN2VBRVODKKbEcU2fYosq1l8H3nLMAzAZ8/19ejy5+TruB+UWTHRZEdG0V2TJSxo3IF25Yv2vp8wQZyOetvbLRVaGWWW38Y+8vmMSaI8cKCNTQ1ukzoZ3hm+pUrV8YSY70gI/FKQcVniC4+s8CmcPk1bBCmgRAWKn5Nm4LA901F6N7FBsKCcUI/+gKHQgn2bJ3ADt/RWmOcToVf6CaBe9iahHtQYOEK+1rF80AAYYew5HekHfgTfkwSOZ8wzhhvxH+WXznzhQ/vpxDAjmE8W6ZyV+geEFYgfXzB5LPC54fQ/3gmw9L3n5/v+ftc+b0GYhaLEj8wmWBWlFs5x+Uje2LLSnt+f4+d2tdrp3Z02ktbO+y0ti57bXtvhdd09NqrO3vtVZ29dlpXiVd3ds+Y13Ts47XtM7x2dNlrOjvstR0didfXd3fb6T3dVa69dnp3n722Z8Be3Ttkpw2O2cuGx+0Fo+P2jJFxe8LIOptYusI6snlbhoTGAsuNk+Ytaig6ITzkkEMqrQeKEhLlAx7wAPvIRz4yJR/+8Ien5IMf/KC9+93vdvfi8zvf+U772Mc+Zm9605vc81m4U7QQr/UmfmYmPGfdunX2vOc9z97xjnc4PvShD01J6N56gV/mk/e///0OhOF73vMe5+Y3vvGN9sAHPtC1VhhWCDsIE8BvuPejH/2off7zn5+Sz372s1OCe77whS/YJz/5Sfv4xz9ur3/9623z5s3unag0hXFxoMHCHJUF5INVq1bZ4x//eBe373vf+1x4I91Ww08LYdoCDEPEIdL+W97yFjvhhBMqlb6kSttM8kA1QiHyhQ+w9Q43oLK7evVql4YoWkhLj3vc4+wFL3iBnX766c4P8NenPvUp+5//+Z9Yfgh517veZR/4wAdcWOK/CAfYv+ENb7DnPOc5lR4E+vu+JX6YvFGewBFO2Jj0e7YUeflszhqzWVsS5W1tFNm2KLKnLWmw/xobts8dfbSdcfT97IytO+ysie32zU077Jvrt1Y4t8w5G0qcvXHf55nCZ86IDZvLTFTlrHXrK5w5HlzXbbSzxifsG+Ob7CsbNtvnNu2wT287xt6/4372ph3H2MuPONaOXH6Y9eSKtry88N+JXy5jUSFjUWPBhS0yPmuBLNCQIF/0ohfZH//4xyn505/+NCV/+9vf7N577zWYf/zjH84O5oorrrBXvepVLqEj0bOl5twXppFp8LvfjjvuODv33HPt73//u3vfn//85ykJ3bvYgD8QhvwMc/nll9szn/lM519WVvzW4FOf+lS76qqr3H/+8pe/zIq//vWvds8999jdd9/t3v3rX//aFYh4Ty0ty8UOewfoF4Tnm9/8Zhfm8P8f/vCHSencTzO+PfMD7kd6J7///e9duN11110uHPfs2WOvec1rXLenK8/KaR95j62g+RC/JOFjXsPveDdb+qhUPfvZz7Yf//jHdskll9g111xje/furfgTfrnjjjts9+7dsfSaBNItrgwLmBtuuMG+/vWvu9Y28i9bf/cd8XOi5k3JdzuylBakV9ax4R43hR/r1bBgPXKtmNVR1jZEWXtEFNnb1661r26csG+un7Cfbdxqv5nYZr8d2WBXDIzY5f3DdkX/kF3RN1xm1HFlb+n624Exu2xw5uD/V0zB5f2jdXFZwG8G9nHp4OTrZQPDdllPr13a1W0X9/bbhesm7JdHnGjfPuaB9rEtx9rLhzfbRJSzrihvh0Q5K0TlRIWJQoWcZdD6wzrAsvAxM+CKsY+enh775S9/6RIrMi4ydvi5FsPEjwKFBpnnd7/7natt452cpEIxjKWVKaC7kXmOOuoo+9nPflYpvFB4UzRgIIgUxgPB0J3wBz7DXyhA0bplq8Hv7sT1X//1X+3OO+90/vTB/+v1N+9nGKLSggqGH+4HMmz54QpBQhii9+D66693fvbTOdIwDfIAw2UqKAAQQqR5mN/+9rd2/PHHV9zAbkakfY6vwh1zEb7M2/wOsWE+o9jwN4jeS1/6Uid2MIh75CGkOT/dMB3it1oMwwL/YTretWuX/d///Z9t2bLFvdsXPLiDbg39M8fELPYfFDZQXnvGHVmwG4sTPwgjWikNaIbnbUlUmt3YE2E8L2/PLzbb//b02w82brWfDI/bb4bG7br+Mbuhs99ubuuxWztBd/naY7d39Nmu9j7b3TZgu9oG7JbOAbuxa8BumsEV4P9zDZ9N8D5wQ/dkburqsdvb22xvT7fd3Ntnl/cO2SXrd9oPt59oHxjcYk9d0Wobo7x1RQU7KMpZHuJXbkUjTFGZ8AtQZBQkQnaHIBGimwI1PRhmftR+wwwxlWFmYQGKK2qBqDk+8YlPdHHPqdVMG3RHLM0kwPvgF1/8kNHSIn4Mb1/84O8k8UOYSvzqAy0fFsDo+vuv//ovl3b8Ap5hgSt7M8IwTgL34jnIP/jvbbfdZqeddprLXxAmjs+y+3OuWz4QOL9lh/fgO4UP79y5c6d94hOfqIg6WngwsxU/3EvB8w3CApXfRzziEU7w2fKDe+qt/M6CmMX+g+JXbvlB/LhNWUX88hmLilmLGjErq2gHRRk3U3MkarCTMk32lrWddt74RvvZpu32i8F1dlnPqF3XPWw3tvXarW0Qu8lA+CaJX3u/3djRbzd31H8leEY1bu0YqJtqYkgRJLd09tntre12d/+A3TowbL/uGbKfjm2xczcfY6e3DdoJUdbGopy1RnlbHmUt64lfJlduSQcLcPHZT3xInBdddJFLsBA9iBZbcH5NuJqplmmYoc4++2w7/PDDK10yfC8L9liaSSBJ/FDoUABZcNMNFIIDwdCdDHOK33Of+9xKtxnji+Eg8asPChC/ozDGuObtt98+KfwYHuxRYFqaChiIH8MRLUnE4Y9+9CPbsWOHex/izx/z8vPBXEFh5XemGbQC0U3+gx/8oJLGYChs8Gc18cNv05mp7kPr7xnPeIZzC8oetvTu0+I3qdsTvxezlmnIWTPWr5Wn+W/JNdujGw6yD3X12w/Xb7GL12+xS3rH7MruMbu5a8Rube2zO9r7bXcbBK8ExW93W5/taR1wAnhb2z4Bq/fqg+ckXW9vLwla0rUa1cQwbBFC/G5r6bBdHd12XfeAXTq4zn60frt9bmyrnXJwi212yyBytjLKW7PbGQYt6dL6SCd+uXgXI777otPZ2Wmf/vSnK4kYrTWIIAwz91TGz1D87meGW2+91R7zmMe4d/ljILG0MgV+d+2RRx5ZET+QFvGjH3CF+P3bv/1bpXXs+x9XiV99oNfBn+2Mz7DDRB+IAPyOlhBbb6z0URSmgmHHNM+8g0rkf/7nf1bSOrs6kQcgUswLoVvrxY8jdqvyOz4/6lGPckJMdyJ/+y06+DHML8xDYd5OMrjXvw/+Z9ggjb785S+vuIfj1xz7r7ccmAExi/1HMOYH8YuN+ZXH+7CQfUmutHZtIIrshOaD7LmHtNjneobtl2MTdtnoZvttz6jd2D1muzpGbNeaXtvb2md72nomCSCEj+LnBLB90G7rHLRdHfVfffCcpCtalxC0pGs1qolh2CK8taPP7uzosxtXtdvl7X126fqt9u2JHfaW1h77p2yTjbm1jBm3yL+YzZW2QyuLX668IUBSLZO1T4BMiVlZV155pUu8qMXW0uKjCQsC2jHzoCb8la98pdLPj3fW29fPDI7/HnHEEU78+M40i58fV/yMK8WPfpX4TQ1Fhq1oitBJJ51kN998s/M30rw/qQUGIuGn7yRY8LMbkQa//fSnP7UNGza4Qh6Cy67JuVw/ifxLwYP4YTYrfzv55JPt/PPPd5NPwtad78567JOMn/8QDhw2QQUAM5o57k93JpVJ80TMYv9B8Stv0UXxQ5en25IMW4+VxwSzuciN92Fh+kQmb485ZK2d3jlo5w2tt8vXbbGrBzfZNR2jdnvnqO1pHbJdK7vsjlU9MQEsCV+f7W0ZcNzRXhKq2cLnhFd2ryZdfdgS5e9JYui3HPn53p5Ru35Nl/22c9gumthhnx/ZaM9pXu7WMGIZyKFRxhqzecvmyhtgo9WHwW6s+cOuL/l9Nc4wfli4jY+P2xe/+MVKRsYVCdhP1FMZZJLwXogSChEUIJgIcP/737/iBopfrTU//g/+ovj570mD+PlXiB8qJPQzx4h4lfjVDrv68Znjzn4XHJYpUOQggEhPnLXIVtxUxm/xMf/Aji1IzNrFRBu6Bcyl+AE+D/mErav29na35ADphK3aJHfPhfFbfhzygME7vvnNb9rQ0JBzE9NTrcMdc0DMYv/htfwmi1/5BAaKH1opmdKCduxgcmyuaKe09NjHxza7Ma6bxrbajb0b7MbWIbuzbdTuWjtkew7rtrvW9NtdLSWxg+jt6/Lsc/al3+JCNBP4nHquPhDiSms0eLYvgmHL8I6OEbuxY8h+Ozhh31u3xd7e1mMPiTLWj91dyju7uEQF4UPfeq7coiuLn1v0niB8hC2LF7/4xXbttddWMgULhJkaCiiegWdhHRnWGeGdzKy1FgK++GHg/r4gfpiKHoaDxK9+OGEIfkF3I7s/OQaIZR3o9WB6hcEEsLD7vppBuLGwZ3zAsCUIce3r65vkJgrvXIqAL/J4PtIPJpxw4g4M/Ad3wV9JXZozST8wfjgxLfIzZpMfffTRlbQLN3LLxbn0fxViFvuPQPxK59SVjh8qHTtUmu2ZyWJrLixviGw8iuxh+UZ7dcegnTlxpF02tsV2D0/YbR0jdsuqPrundcT+0Dpq964esD93jNldTlQmix9agxXxW9tvd7TMH6HIhbAFSvzfkgRwcmtwyK5b1WPX9q23S8d32leH1tuLD13tdn5px5RhhCnCF4k+VyyJH06EyJaFzzvWiCAR+mLI7siHPexh9r3vfc+NCczGJIkPWn4Y+xsZGXHvZwFU65iH7960ip//XeI391DsOCkEFS+mK3QNQiQoWAj/Wlp9NJwtDcNWI1t/SPvoXoUg4X1I80lrN2cK/YVnszKJyTxf/epXXdz6FVC/9efnGZqZpB8YX0hZacBz4H8sKXnkIx9Z6fJE+PtDIKF/5piYxbzBZj0LWLRC2LJzNZMIFCyL44kyBYuyOSeQKKSxmwv2q8SWX/9+6Gr7+Mgm++HEUXZF3zq7tWPIdrcOuRbfPWuG7N7VJe5ZUxIUJx6VWZ7oCu2xu1t67O61EMC4AC00vgDeuqbH9nQMOW5b22u3QbA7hx03tw3YDZ3r7KqRrXbh1uPsg50D9mA3Ezay9jyWNqDLGDNmIXxF1/pzxyF54ocjjVhohnHlt6ggSBicpvhhJlyS8Wt2oWHmCQtkTK9GRsCyCr4/XEANt3ByR+hef8yPE174LhRYofglfV7sxm89cJYc44b+5/Vf/uVfnPjNhUm7+DFNVQNpCusmb7rpJud/Ctls046fF7BzDt0Tpnu/zEwi9E81fCFB2oE//FZetTw7X4b+v/HGG+3Vr351pfUN9/n5OfTHHBOzmDf8SKuIHyaz5MuFWybvzuLD4bSZLCjV/LGwHbM8h6LI/ilTsDe2dNlZ63fabzYda9f2DFdac3evHXAtPorf3ej+bPVaSh2B+LX0uNZfKD4LjS9+EDyMH0L8bm/B7M594ofuzt/1jNvFY9vsnPGt9upVrW6PTzfWV0AXJ8K2aFEBwlcK03rFDzUx1h6xjAALdDngzwTsJ+h6xY9A/DDdGu+o5hYWRqF7JX4Sv5mCNDMVuGd0dNTtRgLj79pST+svNH7eufjiiyvpHi1ACm8odEmE/glhvuG92MEJ24whDyNOF1r8sHMMtiHEpBd/4hGutfhvlsQs5g0/0irihwXsWHDtIrzgTmbPZxotm8OOIwV3CgF2dMFEF2xC/dylB9mnekbtZxuOtOvXH2E3dQ65CS13lVtyJfEbcMK3t2XIdrUN7Zss4onfPWu77Z61sxe/sBuzXqZ6HlqsFD9MnoHw3d7ab3egpds5ZDd0Ddsl/Rvt++PbXavvyY3NbnkD1kE25CLLNDdYVCiTbXBnHKKCAfEjSWLCuMJv6H9nHzwmoGCPPrb+kPn9zAPwOWm8ACZJ/GggUuhOwvPZ9YQr3SHxk/jNB6GYhPAe7G0J4UM8IPxhqqXzWgzTJ/MPBADv4jR/Cm/onpDQPyG4x48nTC7Bziqcsb3Q4of3Yo/Q/v7+ikijFUj/zzMxi3nDj7SS+EWWwRq+IhZcY4px+YTzXOnUdZxmflBDo2v1YaLLA6O8vW5li509sMF+O7TNburb6ARtT1u33dXa7Vpy96wttQDRBYquUIyL3dIx5NbFYWkAuj4Xq/jRzh/rQ2uvMs7X2l/6XF5ecV3PmP1ibKt9ff02e8Uhq+wEdHnipIvyDNrs8qUl4cvhZIUm16IuYEzViV7kwj9JTBhX+M2fKYYrxAX99CgIkHAhgFz0C/wFwKGZSvwopJdeeqlt3LjRvQt9/6wFs0BIcq/ET+I3XzD9YxsurIdDeKCSNlvD9MnhA2wkwQ3DwVyJn/8sgDFxpA1/7HEhxQ/mW9/6lsu3dCPSVa3j/bMkZjFvJIlftiFn2YaM5YsFyxcarJBvskK+2dGYa7IVhaJb27cOA/lNy+3D7f32f4Ob7PqeCbttLbo8e2xPW6cTP7b+SpNcKHzDdmPXUGlLsq5Q/PCf2YtfODuzHnwhDH+j4GHBPHCzPTsGK0sdru5fZz+a2GkfH93gWn0bccZfPrIl6EpGlycGzvNNFmWbLBc1WTFqsGJZ/EpdorjGxYRxhThiIkQrjBvwYoo0Z3ChBjlb8eNEAlwhqi95yUvce5AJuPiX4peU6SV+Er/5gnkAvR+vfe1rK60/VtZmapg+0e0HgzE4nJjBtM10H4pdSOjeJPx8jCVFMBhnx/sXg/ih2/ef//mfJ7l5Lib71EDMYt7wI81v+UUNkdtkOZcvuhZfqeXXZA3ZRre2D914R0R5e9HKFvvKwAb7zfA2u6Njwu5aM+hafbvb221vW6ftLQsgZneiuxMTYW7sHLYbutBFCAHsq7QU726ZvfglCVa9JD0jnNWJ3WoAFtff3jVU2VXmyqFx++bG7faGzl57cCZjw5gRm8Pi9fJEl8amcqtviRWjJmv0xI8bB9QifmiBcecL2E1MTFRqvxQ7ZCBf/JIyU5L44X6KH7tiUBPE4l+4g6LLtYhJmV/iJ/GbTzj7EovCL7vsMhcOGDObC/EDXGKAlmV3d7d7F9I70n2Y3kNCtyaB+ziUgO0K8U7kO8TpQosf3otJL//+7/8+yT+1rvGdJTGLecOPNIqf27czQfwK2SZrzDS6Q1i7o6w9ZNnB9ua+Mfvu+BF27dBOu6dlvf1p1YATPYgfWn8QNbTqMAEGrT6MB2Jc7LruIUeS+LlF8AndkbUSilW9VBM9wJbeLS29dlNrrxM+cFN7n9ti7YqhDfal0Q32nOUHuwNucaL7ciwfgbAVS4fVQvyy0RJrjJqsKWqwxjrFDwUcxA+J0Z+RhfPiOL5HIaMA1iN+FD4Y/gdjilhXSMFFxvXFz09L+Czxk/jNJ5yBiYXhOCMRlbTZTHaBYfqEQRckx7y5cw/DNhS7kNCtIWzx8XnYSpDHU4Vj9vvT+GUB/I7zPdHFTD+Fs17niZjFvOFHWkn89k14ifI5d7Cqm+iSbbBipmDLopytjTK2Odtgzzy81S1q//mmY+z6oa22d+2o3XM4ujC7JwkfxQzigZYfBBDdnjyBgd2eED+MEc6F+M0GvwUZiiLs72obsj2re2336n7b0z5iu7pH7fr2Qbumc9AuGt9s7xsat4cUm91WZp2Z0oG1bu1kI8b6IH6Y6FLq8myMiqWWH2Z41tjtye/o9vG7QAcHByszxvyEXK/4sbXHdWlca4Qtzzo6OlyGwPs4CE63+plf4ifxmymhmISE3W9PecpT3KJ3v9I2E8P0ibyCZzGcv/GNb7iN3jnWGLonJPRPSNiCwsG0WFMLg67PhRY/GgylYKcbhnetG1zMkpjFvIIIY4sCsGvNnS2HfSfd+XIZW5rNuLE+dOWdHOXsbb1D9r2d97OfjUzYZd0jdlvvOtvV2j9pwXqJgUlr90Kxgh3uw9ggKN1Xmhk6EzC2OFO4LhH4M1MhfnAXZq1a5yb7Q3On2ep1Zp2b7YolbbZ3/dF2cc+onbtxmz19bZdtWbbSOqK8rczkbFkOu+Nw03Cc2o4F7nlrbGx2Mz25mUBzscEasAQiIY58uOAUNTHEFxejIqFi+rdfyEK48J2CVs8eoKyNIkOiRnrLLbe4E7X5LmSKaju/sEsH4Jy0Cy64IHz8lMbPhDyMdK5MuHgYhmNGtRgWSn4XG8IG3UTwL/IPZwhSjLAuDeE5FwUan8Ewwq4gFD+/crTQhKLAciW8LxSDWsB/mO7RLXneeee5Mbq5qDyx5QOD8b/rrruustmzv9k2rkj3jON6978Fhx56qNtNhUMN3GKN2wzSVKu8TmXwDIYHK2o0PMcQBvdxqZT/ji9/+cs2Njbm3Ak/+nl6HolZzCuh+Lmp97mCa/Wh9YcxwKZC1g7LltarYer+05uW2mdGNtrPth1jFw2tt8s6+1xrDl2C+wRtZtd9wlhaE7g/rxA8CB+WZWBmKiaxlGalltz0B4jfmnGzFYNmh4zaH9estxvb1ttv+ifswk077AN9w3biipXWnl/mdnNZEmXc6Q0QN7dfKioU6P5ESzCXtSXLSgfGQvhK28hF7pijsOAIQbwxMfoFypOe9CSXsJFZ0HXD8b6Z1IqZ+ZhxcH3ve99bmfGJ99MNHAuhOzguiALh2GOPtXe9611uNxqIIK7f/e537Tvf+U4FfIc9wE4XZ555phtvwanV+B3/Q9drPQf2TmdQyEDYUTn41a9+5Wr4cMd0fP/733dT0wFO1v7JT35iX/rSl1zFgLuQSPxK+GkWYcFxM6R5P93C3SyDwrSeBO7zK17omoRIhZWamRqmeTwPFa///u//tra2toqfuNSIE7/ojtD/SeD/9Ds+DwwMuNY7DOIW7+b4Hw3iOhSwaoZh4E98QzrHZtmoJCBvYQszpN2zzjrLpWds6I0r8hrsf/jDH9pb3vIWN9uVS6tq9d8siVnMK4gAX/wymTK5rJvx2dRYtEMaCtaWiWwUpzdEkb2+rdu+ufkou3DTEXbZ4Lhd2dZr17d0297uIW/nlpldAcYBuQh+f17ZvYnPEL0buvvs2t4+d8WyDIjzH1YN2d/WrrO9hw/ZDWuH7YYNR9q3eofsu0cdZS84+BDbnG+2Q6O8WwuJfTybeGgtwhrLR5obK+K3bMVyt5h0xZKltryx2Q5Zutx1gbIwqAae5dc0mTCxFye3foJhAcmuxlpqxhRKtmz87hDMAuOJ1xz7w2e4ibVhjkVOl87wmYWZX/ixWxXfWUjgnDWcMzibCQ004axAfMdaRhyYGoZzEnBv6LewIJf47SOMd9jxSvw0E4Z3CO7DM1nRwH/Wrl3rKia1pO+ZGHSrcuNygIXpoV+SWrXV8FtR6EWBuPo9ChCtUOw4nl+LQR7GAb1+T88555xTWbiPd7LFDff7C/lD9xGE9X4Y94tZzCth4sSOI66VghlJxbwdVCzY6lzWbcy8PYrsaU0H2X+v22o/3XY/u2howq7uG7MbIBarO+zuLojHPhGbKU6MFggeVUThA9f19Lmz+tyYIBbtt6+zW9aO2G/bR+zSzUfaWes32MfWDdsj8xkbyzXYyqhYFr+sLckWrIA9URHWGFPFTi5LmqxhSbOrXMC+tIdqZA2odCTEkQ8LCT8hombGQvnJT36yXX311S7BszuFhX0thS9bV+xqQYFCQUQNEkLB7h5/wk2Y+VnDR/cUfsO93C8xSUQohKF/AbpfUCudC8PasN+VhFPCw3dOB/yEcKBYw28oVCR+k5lctmSdcFDA2HIC1eK+GniGX0i/8pWvnJNxVYavLzT4fMYZZ1Q2ekdcs7fDT/ehqFeDLWB8xhXCyqOaUBnjBJ6ZtP4okhRRTNphCxbj9qi80s0cQgEoQxCe8APSNMIXIA/PpGt6hsQs5pWY+KG7syx+TbmcHZLNWmsU2QY31pexN7X327e23s8u3nCkXdKOZQujbneT3Ws67fftpTG/mYIlEQuJm5XaURI6zESFAAI3K7W9POll7aDtahmxGzrX26/6xu3bYxvt7KOPsX8/qNmOjyIbzORtZdRgyyB8Uc6JXx5n9yFzY9wPxxY1N1mhoeg+I3EddtDB1oyZtejyTIijML5w9Qs62DHjYd0QugyR4CFWSPT1tJiYwfwWHwfhYVDYrlu3rvJu/zBOugWZBuKMayh0LPBCe1/8ICLIgBgTQcbDMgsctVKPP6Yy8AsEnYL0oQ99yGV8vM/3SxIMd9aEw1bufV38QhGDmxjn+M2vtHHcOnzGdPA/fqGMkxi+9rWvBaFVv+HYL8OZ3zH931/7xq59P/7DCmASDB/8n0uVsGAfPTZ8L0E69dNMrekH+YTpA8MgrLzCDmGESWhMv3QX8xw+++kI5RN+ozCG/pljYhbzii9+HOdzu5GgYM5m3G4uXdhHMsrZk4sr7H/Gt9sPJ46xi4e22WVtI3Zj+4jt7Rqxve29dndrb2XiCnZ1mcm1NEFmYa4Q4NKsVAhg6WR2XCl8bkLN2iG7tWXUrunZaBcNb7GvDY7b53busIeXt3vDZt8roqzr8sQeqG4sL1veHgkTiDCOirG/TOS6PR/3mMfaG1//Bnvj606317zyVfb2t77N3va26mAK8ute9zp7+9vf7sbg3vzmN9vpp5/u+uhh94lPfMIuv/zyytgfDA+8rSXz8B5c/W4kjiWgMHje855XqXUzA/ni5QN/o1aJDIQru0tRaPg1f8DCI5w8gL0cebr1bA0KFBZobP0hHPku3z1JhG6jH1EJOOywwyR+QRpAGIQ9BGj94VSSt771rS7NvuENb3CfkZbD9B6C9P/ud7/b3Ys0j/+BF77whZUDnmdjwgoWhQNp5lOf+pS1tLRU/IU498O8lvCnWCKcKN5IN6eddpob1w67bv18WGv6Qe8NF+vDwE9wP/YBxhXbl3HXJuRF5E34B27id7rNd+d+IGYxr8TFr9Q1B/Fblt13UvvDCkvttFXdds7m4+wHg9vs0v6tdm3vhBO/XR3DtqdnyHavxY4u/mbW9V9Lsy0X5gq3Y+JLaZlD6YqJLxC9u9cM291rRm3P4SO2q3OTXdm1yX4+vN3O3rDD3tTRZQ/Eob7lM/sw0QVLHCB+6M7EOJ5LXLmsNS1bWmkBHn3sMXbeOefavff83v70+3vN/v4P+8uf/uwSaDWQsDkrDAYZgi08ZFR8ZjcHDQpe/DfM2EmG4uDXPJH52BWDZ3z729+e1PoDFC6/Ns9av0+S+DH9MQOiMMD/kQlxPw7vxWSYuZrw4nfjApxejfeglgu3TAXdCT+g24g1Zhb693XxC92AMGB40A4TKTBJiDMbMTkLaQ0FdpjeQxB3bLnjf/g/ZnrilIe5mvACE1b+4Facn4nWH+N6JiedU/zwH37GFb0bn/nMZ1w3pZ9P6xU/hgGfEQohDEQW64IhgEjzrMgSP66Yh323zyMxi3klJn65UvecO7YoUzqzD0fyPHbpYfa2vvV27pbj7Zs9G+1Xg9vspvGj7KqucbumY9huHhi369qx5dew7W4dnTG7QNvwglxvbxu1WzpG7aaO0hXADr/tbsFSjvV2w+p1dtvQUXZh92b7zsh2O+/Yk+0ZxWZ7UHkZCMRvWaZgzVHOiuXxPIqfO7W9PO6HVt+pp55qd+7Za/YPsz/cfY+71mo4mwuGXZTIHL4owsxkqYBfiKDAwbNhx2nRyFj/9E//NCkzMAP5GYddO/zO7lDYo0AMW378L0/SZrcQxM8/E3C2BoIHA79gnAji54vXVDC/EBbuaBHitA3YSfz2fef4FsMCnzEufc011zj3+9P6axnTSjJM35jROFeGIkvD8cTXvOY1FdFj2mZFLgyLJJjOUGHi/xlmSCeY+envVRqK8HSG+R8VA37mGCD8wN4OpEcIILv6WYnz0y2u/izP/dACjFnMG+yqYoYuHWmEs/tKhTam62Mrs4moYM9q67VPHHGifXnD0fat0Z32f8Pb7aLhbfbr4c126fCE/Wp4g/1qcL1dPjBhv5uCK/o31sCGBbn+FgxOOOiPq/sm7JrezXZt72a7um+rXTFwhF00tNN+uuVEO/+ok90uNzizD4f6juYy7pzDxihrjdm8NRWK1pgvjfm5gr881odwxoJx18//D7M9u+9w1z//sdQ1WWtiR6L278V3rs9jzQ/P89f11GN8USW0w/IDLP5FOvKnfqNggLj5Ilgv+C8LCTwT4oep2HNh6B8YtiBwpMxs3BtCt/vih9bJfUH8/B4AXP1KESsLmLyEShUNKiP1CB/TOAp3f5ILx3Fpx7P+WPjX8w7fIMz5DGz0jtnH9C/96VfyagFphELjVwKf9axn2S9+8Qv3XsQx3skWMkyY5+s1CCP+H61lrGGkwLHyhjzst26ZrtIvfm5mYtaJ38G5nHXmCrZtyXJ7Zu+Ivf+YB9inNx9jX9lwpJ2z7kj7zrqd9t112+0749vs/PGtdt74FvvW+m1ltidezy/fW/0KNi8QW+28dVvtm+u22rfGttp3Rrba94e32gVDJb43vN3OGd5mXxrZap/ZeIS9e9MR9uz2btsZZd0pFz2FnKswNLmjn/KlNXvllh+7/dxEl2ymUsv765//4oD4/e0v+2ZYVjN+AUoh4md2DcGgWwldhWzlzMQkiR/NVVddZY997GNdOkLm8bs1WdNnBqoXiV91s9jFzwdxx9mwrCht27atMhuZaZWiVG+3Jf4fdvMhzX/gAx9w9hAN2DMPzIX4YeILjlOCXxC/FHe/hVQL1cQPY4oYU/dbxhQ+7CSUJH7h9+kMN66AwRrXZz/72ZWZrPAPBI/jtMjPtbZq54CYxbwRip+rmeGw1bL4LclkbWUma325vB1/0GH2zM5+e9HaXjf2d/rKLnvjYV32hpUd9rqVrfbqlS32isPX2staWu3FraA98XpqS5ud2tIyxXXtAtJip65ptZesbreXrm61Vxzeaq9c2WqvOqzEaStLv52ypt2e0tJhD1u9xrYsW+ImuRyMlnIOwpezpgYc/7QvwUAMkKgQzrhiTRmmTiMhs5aKDIYMO534heN2FCgW5Mjw2C4JBe4TnvCESV1BUz03yUwlfshAn//85yuZhl0/4Vge01eY9qZC4lfdHAjiRyFgDwCu3IwaYc3uOKRldsPBcCx2KuN361P4cCUvetGL3NIYTn7B83ne5UzD3xc/dLFisTgWvUMYmL7nquWH3/AsLNzHUWUweC/j2/9ME36fyiCM6R/+D5URCLovcsjHXP8Xun0eiVnMG3Hxy1tjw1J3yGomylohyrhTHFCwd7rlDlk36/OEKGMnRZE9AFPro8iOc7NBS+sAN5WXRVRj/TSE9+9vcAwR/LAVtVSct+VOsCgB/23BfbmcDedzbgkIwmYp9vDM7TuQlq0fhjESEcBnFAKY6YYtsWDCbcSmE7+w9sr7KYB43uc+9zk3fRrdGOhaDQvMWk2S+LH7CJ+xqwY25mVhj+5PZmKfegtliV91E8blYhY/juvSHpM6UBljOqKpZyITBZKFOEFcYmeSkZER966Pf/zjlTCaabc/jS9+eCbG5BCn9Fs4oacWqokfKwn4/PznP78yWYXjmn5lgYb5tBbD8gbGn12KXV6wPy023aAbUX74s1N5nYrQn3USs5g3fEdT/HByeybCnpNZ112HlgxOcsCSB5zeju69QZxAXL7i5AIII37DZA/cd8gUQCymIrx/oViJ44iwe4QHvh8EyjNhC0j4uciamwq2pBlrvkqTWoqNDQ58Rrii5stE1N7aZu9/7/uc2DER44oWIDPyVAnZ/433+wYJGuMGbJEhA9W71o8mSfxYEMCgFo7tyHjsC94ZCp/E774nfgSiwAoRvn/2s591bka4+5Ow/PG/Wgz+zxYgr8hPOHeS7370ox9d6fWopUU5lfHFj2kfC8YpVOz6rCf8q4kf4OJzhB2WdrCswEJ49g7RMD1PVWaEBvci/P1KB9InhjKwRSK7qOEWVORRdiEu/Z6caoT+rJOYxbwRih/29cxHBctFBcvgmiu4XUhQqKNlg7Vrq4tFW5Mr2KpM3g6PCnaw282kwZpyDVbMN1hTvtFt0Fzt2ujuKyReMTmkKZ+xpny0INfGfM6dYJHLNlox02BNUaG0UB17dEYZayrPgs0XcNJ96QQMJAx0czYXmtyp7O4kDIRZQ9FyWM8XhPnJJz3ALvzFL10NjAPynEkJU09C9rsuYPBf1OAwrsL4xcSaX//61zPa/aIW8cM4BPa1xLuQWdXtKfEDiDfAHX6wVtNvgUFIkH78MKl1zM//H4UTe61y7RpEqaury3XL85n1CqxvfPGj2OLEd5527rcAw3CoBtJIkvgx3PjMNWvW2Dve8Q43exNxDv/4vT9+/qzVsLyBX9iLA78hjLBNHE4h8QWds0D5fSpCf9ZJzGLeSBK/Ao7ZyTS6rs8oi5ZM+RRyXLORFRuyVizkygu3sUlz0aJ8o0XFJRYVlrhTyrOZBndSedI1GzVaJiomXrPuWtoLM78AVwh+FKHLBjU6LGbGieuoDJRawm4sFIKGiUG50ufGbNEaI7SOC7YUYVdsLK2VzOcs39hQmkRUTjSHHHSwW8S+9449hjV9WN8HgwT4l7/91a10qFX8wgSPxIsuEiyfwCJivJM105e97GWV8YN6TJL4QSxYkHA6ONYnceNfTXi5b4sfC00W5PiMafQ4dR1hTTGC+/0WmV+gT2fY9UchQrp/9atfXdmAAIU1Pj/96U+vbBqNd9WSr5KML35I+6x0YtE9zhQM/V4L1cSPrT7EJcNvaGjI5TG8n+JHv9BttZYbaPHhfgABZF7Gc1GRRTide+659shHPrIyi9vPG6HYhYT+rJOYRf2UF1FXKNtj5iGP0AE8QcDtPIJz5NDtGUEAC04Eo0ypGy8q5ixqzLmDbjMNuOJgVggfhKBgEQr8hiUWNS4tHdaaqU7GiV01IH4FJ4Azv86cCIKfW2ZRbrlFWeyXucSJdiGCeOMcvqIVis3lSkHOCsVGa8QJ91HeVkRFOzS3zBqLTaUwz2bc0gbu34mENNg/YD/8wQWV2Z3/+FspA7sa3d/+an/+6/QTXlh4h60+1AzRzYMaL96HvnsmXmz8yxOv6zFJ4of3+LVouAMz03A0C96lpQ73bfFjgQ24Hg5nTcKdKHjhbn9WMgwK3lrH5XAvngEh4H+Qtk844QT3Lra+IICbNm1yGzLAcObnTIwvfhz3wxVLErZu3Vrx71y0/BCHEEDkIb/X5JhjjnEtWV98/bJgunLDN4gHv9sZn1GB8MMHs8WxpIPxCXdx3e1UhP6sk5hFfbiCt9xaY4sNe3WWBQ87j5RAawf22HarvK1ZIe8OrcUCbZxGgLVqDblSS48U8qiRlFo9le3QEEBoEeEcwCwOZ50tpVboTK7YRHoqSq28ZHCaRYTZrrlGizIQrYLrBi6WQYUg6yoFBYuyOJi2WKowZAvWkCmBODjokINLu+Rks5UWERIRZnBVS6hMzLUYdlmw5guD/2KrqHDWGTIURBDjgDCc9o37/QKZ7qrF+O6EeGACAA6/5Du5cJaZN9z/czrmU/xg2MqAf1GYoFtpDjJuhfuS+FV6jcqFN+OaQoD4e8UrXuGEihWnsPVSr2HBzWdhez8/jeGd7PXApuUo2GsVVxpfWNji8sfb0EqCQesP7+EuPxAtvJ/h4ndh1oIfh8i33HUIvTnYVekHP/hBZRkEDIZPuCies1pnYuhfGO4ShYrD9u3bnfsx+QVuYs8Ohjdgh/FBzmeYgwpkzKI+fPHLTxZAd3KAJ4ANlQI/bxGa7EW0njLuHvyGe7A3ZQP2d8vmrJjNlIQmW87gvCa0MtFFuBBXtm6rgfFFJ+QJV9dKcwv9USHAeFXOtYIbyqBVjBYgxgWjPChYplAa28PSBoCEwloQwgYJBSCRfOtb35q1+LG1whooxw1x9h0LQbwX3T5+NwzO1UNNFcLJbb38bg+YWgrn0J2sDWPhMratwruQGfyaYD2ZH0j8qpvFLn4s7JkGEHdoscAg3FGoIr3MRvzYckRYYJ0athzzK30UQrhj586drmU40/WuvgjS/TBMQxAjvAPvYxgw/v0wCsOtGv4sceRfP07RfYwW4M9//nPnJogdKhQ0s5nYQ3+iTMBn+A9pFofaYtNwvB8T2uAmAnHmwnj8ThGcBTGL+qD4JbT+0PLDllsErR03bgdHO/FrcF15bmJKsckaiw3uigkdOHncqX5DU2k2Y0OT5RrQDdjoJnhkiw0BTQtyzRdKMysLVa6hWE66IuxQYSgg3EpbkaE7NOcOmsXaRwh/g1sLCdEDeC6EEwvbm9Byxg455f5/JgpkCKy5g5kL8WPGg2FtDwt7WdjivUiYfjcMao5YzAqDmjMzMQsjmJlMCuBzsHTjP//zPytTpfF++p+Zv9ZCQOJX3Sx28YMdK11IAziuh2vu2HrimF0t6T00zCdsneCgZHTr+xUslFNwC93x0Y9+1MVzUrcnnzdV/uNvcLM/cxo9L5hIhk22/fSKdyfFRZJdiJ922MKCHb7DXwDLmHC2Jlp8FPXZbu1G/3FiHPzJniVs/M79dhnfcBuHOOj2xSF+vgCScquM430c83Pjeki05UkcEIFSKwkFf2kiCK7sVnQtRfcutrR8EfFBYtz/V7iH7q/3Cn9kGzKWacRszshy+dK6PVQSEF5u+QdOuS/DFh+6hpdkc25ZCJ7F6cHMCOgSQQ0RZrbih3vYbYTEiUyNbYowtRvuD3eaYObBZ9TcsEMFDd1BEaincOb/WNuEe3DsEGea+meFsVCU+NUevtXMYhc/X3SGh4fdQa0UC/ZYVMsDtRg/7lDgP+QhD6m4hd2N+IyNJGh/0kknuU2pk8SPZqr854sf97ZFHkTXJ+yxvhBrGPEu5Df4n2VAGFZh+FWDz+GeschPftcuxuNwegsM8j8MhJBurUY1Q//BwH94FoUQfsa4OPfcJX4Fn+kg9EedxCzqJ5zwMqlbMnBg8Du6N5swtT+Tt+YMzqTLu4Id59K5K76X7TH9H0sB3DKAKOtw+1o68gtyLbkDJ6gnX333x6+RLclH1pyLrBFh4VrHpeUN6PJFq84l4PIG1VnMfs1mrCEbuWUQIJ8rjXHhPib+hz/84S4Rcff6pIw/XeKkQWGNgpSbMsN88pOftFWrVrl3cqyDwA2+IOIwWnaV+uMg9XaZ0L34HzMNdorAuCbfy3f6hVItSPyqm8UufiikEWdIc5gyj2N0YFi58sVvJsbPIzibDtuBMbxRGDPM2VLhmBnObJxK/Gh8oYAbQ9g7AvHj8gMse8C4I7teWQFA66iedE/Y6kM4UgD9Xhyuw0O5gqEMf61jKHYh1Qz9C4NygT06LCtQacbRUVw/DPyKNcN9lsQsZgEyQ3m/ToDMge4BOLQihqWxMBTyEIfDoqytjrK2pszaKFehLcpbS4TDbUu0uWvGgUXuWAi+JsrYqiizINcSpc24q4EjmqYCi9sPKy90xz6dPJcPC9ohgojsEqVWoRPGsvBBBLHYnYUQC32M9cH462rChDhd4qRBokSCREbG8zDgjS5VvI97bPIz0wHt4BacxoBxEhiIJ9/pT56ZyvB+ZhRcKSYoDHBWGCf5kHoLZYlfdbPYxY+VL8zwRFc8u+X8jZmT0j9Mkl2SwX3Ywu+UU05x70Za97vimH4A88EDHvAA1zVPEauW30KxC+EYG4UUdsiTWF/LdYYMFxKG2XT44ckWIPMwwxfr/3CFv/yxv9C9IdUMxc8//gzPRPwhztjSxY5OfLcvfn638yyIWdRFqRuvRKkrEAenlsH4HjZWdhM7Si0YFN7Lclk7tFCw9nyDO5YHJxRwu7GJKOPYVGZzeYuvEGwHht9wph22CVuIay3siApTkHPbmO3MRLY5l7XRfNa681k7PJuxZeVxUoQXtzFDK6+I1l8usoZ8ZIV8VJoR681+wnqZ8HgRJLIw41XLjEkGBQkTMqYkDwwMuPf5NU1/Xz4WinAX7sXWTxQAX/RoV4thzRCGtWH8H+sJH/GIR7j3+Ytj6b4wvSYh8atu+IzFKn4sBB/1qEfZRRddVAljjvfNRfrHc7CzEM+UxPvZ6uO4GOw5NR+f0WWHbf/gFronqQvWFwq6yScUP45fovWHWa3s7vRFb6ZCiLDEsyiAEHb/lAU8D7+h8otJPXCb7/4kqhmKH3uTUC7cdtttMX+eeeaZdvLJJ7u8DTf5bg3dPwNiFnWxT/ywMLssfhRAbLbcjDV5WJhemrW5LJOx1fmC9TU02ZZCkz21pcOed3ir45RVbfb8VW32gtXt9v9WlVnZZi8Ch7Y6XnxIq516cIu9+KAWd/1/h7bY8xcxcH9VDm+xFx++1l64us2e09Juj29rt/uvWWMbDj7E2pqabQXG7zAbFjOxcllryEHsMlYoRhUQB1xkjsyIBaPoRkCGQ0YLM5uf+EK7agbixwHppz71qS7D+ZsJ4+p3NXIaNt2Exb/YKgkG08ApZPXsseiLJrtzKYI4JgXvR/cMCyJk2HDMoBoSv+qGz1is4ocKDlonWHTONML0xS7yaum/1vDBc171qldNGnPiAvckWDAj3XONG54B9/mCXMv7eQ/v93s90MODblhM+vKFgWFUi/j5IhLGJ5+J8PUFFhOLcJI9WsN0VzWqGT/8w3v9yS8IL2yZiO5Pf4btgoofaxaYvYnJKVj0XRLA0nq10k4sBYuWNpdmNGYjW9FQsFVZdFtGdvTSg+3UsQ328Y3b7Csbt9nXNm63L45tsq+MbbYzJ3baWRM77Wvrttg31m21M8e22lkB54yWrt8Y3WJfH1u8nDm+zQF/OL+Uv+NEdnDW+p321Y1H2ie3HGUfPfFB9qaTHmT3X9vmukJXZvO2smmJLS80WiO6WdDtWcxYoTGyCBQjKzaWdkNHnKD2ixoZ99FDAkKiCjN+aJgQw/vwHYU1W35nnXWWEwa8i+twkjKYX0DhO9buYGkCjN8qrcXQXUnAQOgxC42L3lljxWdkGGRavzWY5GaJX+0G4nf88ce798xFAcRypBp+6w5hxnDjGBW+o/sPW+rBcE2ePzY8nWF68nsXuEML7JCnenp6nHv8iVUojMO0RD8x/aNbngYVQI51c2xrpgb5CC2lpz3taZOED2UBw8hPY7472V0bursa+C+XUNEOeQS7O2FsjuUEDPcMDk9zn86EZQ8rtwAHS6P703dTrb060xCzqAkmzlKChPhhij7WpSGh4oBaiF/RImy+nCuN8x2az5RPa4js8Yettfdu2G7nrttsPx/dZL8Y3WQ/GVxvPx/cYBePbbFLRrfYLwc32kVDE45LBvfxq4F9XDyw0S4cXLz8on+94+d94w58/uXABvfbLwc32c8Httr3R3bYNzYeZZ/Zcbydtn6LHbvs4NJ4YTZvBxeabGkOW5ph+UNpRmgGLb6G8hKJ8jgqWj0YBGeiQ7dBNVGrxyARskvitNNOi01wmS7z4ztqpqg5sz+fphYRDAUvBIUTxO+Nb3yjexfEjoUSu3AkfrM3TENzLX7TwbTE8gZ28CfSId//H//xH5V0j/RQj7+ZjmD8/7Ewh3nDG95QqWCi0PXHt8O05LsZ7nzoQx/q4p/uw7v8fXVrNeG9HH//xCc+URmGwHuZBugGv8WW1BpEGE4FKxn8P4dYILi9vb3upHmkNfgRG1XTzGSRv2/8nh3MssWG2+jhmst8M2vxwyzE0vo0TM/H2rRSKxC7kTjxQ6svH9nSQumUgpEosgdlinZae799fdPRTthu6Bt3XNczZtd3j9nN/RscN/Sss5t7xx239Ozj1u593NQ1sqDc2D02Jdd3jjiu6xiugO83dI3add0b7IquCbuwf7v9YOOx9ol12+yph6yxiShnHVHWDsvkbFmm4Da8boiwAD5jWayjhOiVW34ZfEeYPuhBbpNYJiK/wA0TVj0GIoraKg7tZOvKz2BhZqI9Mz8TKxbmXnjhhbFn12NYUMFPgH5EbR/rkLC9FN6FWi0LK4nf3BimIexdSfELw3U+YaELUPD6EzGYrujfemcSw/hpC3HEtIlJK1hC4bvFPzkiTEu0Y/oHyDvcoQWG41y1upPugpv8cUOAVikmleG904kyCMMx/D3Er8TiM7tA+Tv2GkXFk9sZYjcYCDMmxdQzrBGWUb74oULzox/9yPUgVStzZkjMoiacA7APJ1oiuciybkeXjBVcIV20bK6htJi9mLGm5rwdUoisvXxO3XOWHGwf7hmzC0a329U96+yO9kG7o23YdrcN2O7WoUnf97YN2962wdj1ztZhu7N10Pas7bc9Lb0Lc13bb3e0kMHEK9y7p3XA9rQOVa7O/e0jdkfXmF3but5+3bvNfrTpWHtf7zo7Ocq6o5s6CkVblsm5JRXFKO92fMEVk16wJtC1/BpL3Z4Y28K2R+iDZ4JjDXgm4ucXmhAWtPqwoBxrmRDvHOT3RSNMG8w07J7AFmSoQcN9HPeAYaFTjdD4wscCCp/R+sPWUng3BIzjjhK/uTG++HHMLwzXJFhYVSO8vxp+N5c/sQRjT0ijCFd2efqVoloN/gM/ouDG//AZPRVYsoD3IF1QLPw8kOQHP/3jO4YjEBccPgjdOZXx45CCAGiPFha2GUSFzxclAnf4Ipc0SW0qcB/+D/Ad+QrgOf6uTthuEAbhxs29/d1gpjNhXqdfGUYQ08c97nGVuPCvsyBmURMuALGY3e1Osk/8XEGdwYLrotu+C4u4lzZl3RgWzuJ7eJSxt67usnMHt9pFvRvtlo5Ru3Ntr925tt/uaumzu1oGYt9x3dsyYHtb911pf+fqHrtzTdfCXFf32N41pC/xek/bkN3d2m93tw5Wrve0Ddjv24dtb9eYXdk2ZhcObLFvbjzCXtfS6Q60xTKO1djdBidZlPf4bIoarTnC2F++tN9pQ2S5RiwnidxC7wsuuMBlCGQGzpTiuEeYsKYyuNcXTTwD2xuh5YbMxRYVa97TZX52PcIO25Fh8S8KGHZ5hmIXEpok8cMVBQvWeHHRO7tsJH6zM4wDPgsLneuZ8BKKXUh4fzVYsOOdFEKMO3MrMaQnpge4GWHuj+FNZxAv+J9fMcNOMdjeC+9iwc+xMhb8SX7w0z+Fgxtt+4KQlL5DEwok/MiJMxRUbDWIVhHfz3W/DCfmwdCdtYI8Uc2f/IzwQEWBLdy56vbkvAX4G6fFMF/TXaGb6iRmURPO4xQ/tP7cziTYwxN7c5b3sCzm3RjVkmypyxNT/5+zZIX9b/96u3D0SLuqe8L2dq2zu9f22d1rB+zetkH7fetQRfwgEmjd3dnW765729CSmnyFAN7d0lN6xn6+lsS5ryLGSVeIH9wP0eP1rvaS+O3pHrMrutfZj4Y22mcHRuw5y1fYuvK6v6U4zQI74GAyUabBlmSabWmmyZZERbcZgFvm0IAMlnELvXlSu7+nYK3ix8KC9/qFBxLdxz72Mdffjjin6LGLpVqmYObnzFAWWmeccYZ7J8WLYlaN0J2Av7FgYGsXhQtqwXAD3ofMIfGbnfHFD58hfve73/3ce2rxA+6ZilAMQ/gc+o3LWfAbWlQw3GgZBmkK6bbWLkUKZng/7LFHqL+UAXBmNe3CtEQ7pn8W0BiXREHuT3SpRZzDOPRFgS1AAGHwx+PgBlZU4Q5M2IFA4lQIVBBxxSn069evn5KJiQl3L/LE2NiYewYqwthhht8xHILzE/EdFVD4C+6bi25PvxKMbeMwt4FhmhT2dRKzqAn3YogfJl8USuKHNWml3Vqybt/JhmJpecOKbGTdmchOKOTs1ata7JyRTXbFyBF2c9eE3dk9XmrNtQzZPR0jdlfHqO1e22e71w7Yno4h290+bLs6Bm1XR+l6W+ew3dY5aLeWr+ga3dPaV+5S3N/XAff+XeXu2qSr674td+Py+x0dQ7a3Y9Ru7V1nvxncYOePrLc3rl5lDy63jpdxXK8JJz6g1dRkTZmltixqLh3kW94EHEsfxkaHK0ePhImI4hImrNDgHmYm3osEDDHBIDY28kUGQoZGBmPGZuGVlDZ4D7uoOEsOs7bQjcp3hWIXwsRfDRj6HRmGrVS8S+I3e/HjM+CH+RC/6eBz6DekI/gX+2tiezsYv5BlmqllMhUMBYhdkkxXSPfYMQbv9Cd5cdYj3RamJdrhdz/dQSywOwq7PGvJlzDhPfgfBd4XTyx7gPj47sT7UVlACxknpmOHGiyFOvvss90JCvh+zjnnTMnXv/51xxe/+EV3mjz+d/755zu7b3zjG+4ZmMn9hS98wU2+wSG/YWu1FhP6k+Ln/46xUwh2tXCfATGLmqiIX3kza3R7YucRbD3mtirLF625WLAluchW5yKbKObs8UtX2DvXdNv3+zfZDT3bbHfbBru7Y53tWTtod6wZcMKHsbBbV/c5IHy3tw/ZrR0lbvG4qbN0vb2133YtILe3Djpuaxu0W9onAzsndhDA1iHb3Qr/DNttHSN2S/eoXTOwwX6+Ybt9ef0mO2XFMrdovy0bWSMqFJgotKSxdJRR1GDNUZMtj9Dyy7kdYNxeqZlSQcdZViyo/IxfSyZDZuJaJF9QUIBiUXu4rIG1X2TwpEToZ37+jhobPyOzsHskFLskQsFLEj76HYveX/e617n3IONL/GZn+Iwk8QvDMYlQzELg5qmgv/iZPRBolcBgxiMMhMDv9YC7a2lZseUH8WOXIp6JAp4Hx/o9F/jud7slhYGf/nkv1uNhTJrv81ur0xmEO/yDOCDMGzDwJybRPPGJT3TvBsyjcCPc8eIXv3jSfACYmYgUTCi8jAM+D3kb/qzn+WEZ5bf88BnP+81vflPp3g3z9AyJWUxiqsh1O4641l4JbM3VHGHfyqItyTbYsmzRDo2y1hPl7YSGpXbqYW325d4Ju2L4aLuza6fdffi43b1muDx+h9ZfCb9VxZYVuL29xK0dJfC51PJbSEqidmv7sN3UOWw3dg05IMy72obs3vZ1dm/LqN0Df64dtdtbRuy6tiG7smvYLhreZOdvO85e3zVkD8k12BAyt0uw5QktxUz5wN+sHZxf5sJ2eQ4H9Ea25OAVtnTlIfalr3x5kpDQMJPVYpC4kJiZAPFfZE5kKBR0PC8PrTiMJ9SS6SE6yPgc88DvqLXD/mEPe1jlvDXf+OJbT8bxn4NnYD0iZ35imQW7g3w3s1CiCLHQANjJA7PLwgw5U3Mgix+MX9BhjA3T27HrBsbDcHTVVCD94D60xo866ii7//3vP2kcje7HZ6QrFtZh+vLDCy0xtDL8bj+/klSvYZcnKoDwK3omnve858XCuRp+2vHdS/+wi/Txj3+8G/ujG6eKnyS/0M73Mwy7UlFh47v9blmkf4jveeedV0mLHCZBGMLPFCv/2bVAN/nu8kW6FuP/x/ez/xnuw3wBlB0MY787eobELCYRJkLauZpQFhtNR24rrqVl8cOGzs2ZkvitiAq2OsrbSJS3RzYeYv/VMWbfHTrCruzebneu3WL/aNniRAHjffUKIHDdiwssfuiupfhB9K7rHrIbyuKH1h78d+/hQ3bv4SN295pRu71tnV3bOWaX9Yzaj0Y32afHd9gLWvrt6GyDdZTD0S1nKLf+sIQE25wtdRt7Y0PtUqaKChm7/z891C781SWVwomZAYYFw3TGT7QwrHHBYHwOYwV+jZddPqBa2mBBRtGB6OF+iiD24vz0pz/t3sHMB4NrrRnGN6HQY9zhmc98Zqzbk4KMzyxMJX7TG7aKYNAyQk8DRBCLtjG1fSpwH2b/YRNytMrRcsTCb5zZ5k+aqiZ+/O7X9LG/JLq3YZIK4noN/uMXvOgaxCkGYThXYyrxw2emOayLw6kTtaTzJL+EIsP45dIJnrYCd3BWJgQCm26j0vqSl7zE3ReOO1L4kt7nv6sWKGJ4ZpgvqxmGf+iG0D2oOODEjDnMOzGLSVQr4Cril6HwoZDOupPZQWO2aAdFOWuJMrYlKtpzD2m3z40fZReuP96u6Nhku1atN+vaZnevHaoIXy3i54vgYhE/tP7QPYuuWAjfjV2llil+v2vVgN1zWL/9fuWg3blmxG7tGLdresft1/3j9u2RCXtT+6A9YcUq21TeqBtjeZUz/nB1FQqcZJGtiB/WGWWaC/ahz37c7vnjvvEOP7ExUU9nmAmZ0FjQ4f/YJ5SChTjnQDpgxg7TB9OGL344AYLTqvk8HA3DKep8J9zgi3aY+Kcyfk0TbkcBC+HGu3yhDrtLJH7TGxZOMIgnxNtMZ+vCoNu7v7+/4nZWpihyYeXKDyukq/e///2VAtwveKd6ZzXDMGLXHYQE22kxndaCn3Zo54sflwbgM7Y8w76c04lfkqH/fD/D+GOeGAflZDS2jHiF+KIywp4ixKPf4ksyobhVIxS9mYif7wb60097P/7xjytHOTFsZ0nMYhJh4Ua7kvjlbCkoz/DE2XPY0gznzuGw1UOj0o4uD86vsLd0jdv5E8fZb8aOsavbJ+z2NevsTx0b7a4DWPzgTrgfAgjxu6VzwAnfTV19zn245+7V/fb7VYN25+EDtmv1kN3UNW5XDW2yXw6N29dHxu3flxxqD8gtcRt845QHHG3khI+4Da4hfHk7KNfswhUZc/NR2+3y668yZHUkDmQAf4C4WmIODQsL/pddQOgi8fcvZBcmPqOAYmZOSh9+QYaMiHWIvJ+Hz2IMkDM/4Va/ZcHPtWYeGIom/YNMjtmAeC8n6YTuhH8kflMbFkoshFjAIZ5qOa0c6Qnd0tyPFf/DZgyYuECRmwrffwBdqRj7YaXJL4CTxM8X4mrAcPchjPVxA2t/0fhUTCV+uCKdcdwck1Iw4QTv9d0cfk8y/n0EhvECA0HzNyGAG+g2tP5e+9rXVp7HCjLw845vwrAK4btD8QvHBacyvt9pWCYwz8CgQsujo9AACONhBsQsJpFUuE0SP0zDj7AFDrYyK1jUWLSosWDNBRxPFNloFNkph7TZl8aPtJ+sO8p+07PFzfLc0zFuu1f3O+Gg4PlQYCh+1URwwcWv7F645daOPruls89u7eyxXe2lJRB/aBu0e+HH1QN20+oBt6j/N2Ob7IKhMftM/5A9KlO0rVHWurAQHOLnLWCPGrOuIoGdcxqjnB1UWFLa4iyXs7e88232F/ubEz8UAv5stZkUeuH425Of/GQX1yyA2P2EzxATCuFU6QNwlifv8wsUtCwptszMfjeoL+bVDDNM2HWKmjymRmPSQtj1yZpwePq7xC9umKYQrhCIcPp6WNMPSQpDHLTMXVNCsQvxuzyR5t7znve4MES6YYWHsED2TVhYhzBuYDAOjSUDqDAhvc+F+PlDBlwU/+xnP7uyNpH5leIRioBv6Gbfz3wG/ss8gK5VjPHhvUjv9As+YzIXFozDsMJMEfTDMQzTavC+JAEEtRg+yzd4JvMy4wjLmFjuuN6vhLKnTmIWk0h6QUX8MgVbEjW6BdhRvsEiOKw5b1FT3pbnMdElshOjrL2tY9R+tPlEu2Rgu/22dcx290zYXT3jdtPhnRURCaHATCV+Cyl8gOKHtX672/rs9o4eJ3y3d3Tb7rYe29vaY/e2Yv3isNvx5drWQbusf739bHzCvtbXb29eu8aOxwnU5S7Pg3BqQ0OmJH6gqWBNy5a7UzNcl3J5f8+Bvn677Mrf2l/t7078/DVKfmKpxTAB+4XapZdeWjkjLyn+kZn8AfWke2jPzI/7w65S7BiDqdE0zID1ih8LDRjWOPEdY1OcXAFQiMIdFGSOX/ruBRK/ZIN0BljA1bKDClsBLAhRycIUenTB0c0UOoa/L3xMZ/iOghvLBRAvTK++EFQrRKfC72b/yU9+4lqWeF+9Gz+H+YDi5y+TYK8HhB+bNdMNvmDgc+gHmlBwgD+zm/kG3aoPfOADK27zW0lwEyYswWBSG5c48d1h+ExnphPCWk3oZ/wX7uJz4b4XvehFlfTAIZVZErOYRLWCzUVutmCNUYMVoiaLCo0WNTZYtKRgueacHZ6PbAyL2lccbv/Tu9F+s+F+dk3vZrt+zZDd0TFie7pH7Ja1XTULWCiCJLxvfwLx42L3PW09tquj2wnfro5O29PWbXe1dtve1Z1uYTuWOFzVPWYXj07Yd9ZvtA+2tdmzmxvd2YTY9g2tPux/muWG1Zjw0pi3QhO2LWpwMz7BiiVL7aUvOdX+YX+3v9hfnfj5IoHEzERbS82LBQAM7keLCZkD8Rx2F/ppwe9OSUojhAWyL36sEeM3f1NiupcZutbMw0zPTAKDZ8Aem3GzIKOb/YkWEr+pzXQVkLCwDKFhvCBOsBsRdvvBdHz2KPhpCJ/ZZceaPmYco1WGSTYsqMP3z0T8kE7wLIQXtgjE+kG8j2klDOskkvIBxY/LJJD+2fUJu1e+8pUur8ENFD+/BZZkQpFJuo+C8e53v9t1EeJdON0E4QjgJkzm4UG7rCxS+HwxC8OyFhOK4UwNwoHlACpZmDCFGcZMF2EczJCYxSSSEgALDYhfIWq0bIRji8otvyV5a2zKWHs2su1RZG9u7bNzejfaNcNH2u6ezbarZcjtebm7q69E274F41MRit5iEj8A8dvdXhK+kvh1OvG77ZC1hkX7N3eN2G8HNtjPNm61MzZO2OtWr7SHRJFb3nA4DvjNRtZUzFRmeTqK2L4sa83NS60p32iN+YIN9vbZ97/3HSd+d91TOj7Eb/mhZs1EG+5akWT8/yORYToxF4kD1rAQ3343ENNAmOlDWLP37ZgR8RktM2wjBTezQGOtvtbMx4IVXUkUQtRq8RljOJj44ndBQfzgLrhB4le7YW0c4VpP2LBgpcGUfE54mU782FWIMUIsck7awYgkFdj+70mwlwAzhB/72MdOqvBRrKZjKvHDZ/gFz/LzAsQfM1/xboQP3MEWWLV480WF0J6VFKY19Ho8+MEPrrgH/uIYPnp1MCQA47f45tqEcVGPgbtYLmGCDhbXcwIb/MI0EsZFncQsJpFUsPni15RbZhm0/PINllnS7LrrMGNxOBPZvyxbbl8c32o/w6L2zg22d+2oG/u6Y22P7erstd29A25sLBS0hRa1WvHFD12cFL/d7Z22tyx+u1Z32J29Y3Z157D9on+dXbD9KPvQ8JA9Phu5GZ44umgpNgcolLo8s01Zi5pyFmF7szy2OEMEZ625cYkVcnn79+edYn/765/tL3/9g/3jH6VMwxqjX3tLMtUyDwwnJXzkIx+pdM/UehhsvSDt+DV79OUz88NQwKYyYUFHf/m1aAAhxfZveC/8w5l3zDgSv/k1dAPDAGGKCS9Y6kB3o2XuF2RIExx3ozA+4xnPcMLH1hJMLZU7GLbuYBgH+A4Yx5/85Cdd69LvToO76I6pysHwN9hxjI92aH3xN/ZEoIfFnzlLYYddOLY6lfHH6zkLFuGEzabhdgDho99Q+cPuNWhNwfjv4udaeo1mY5hfaRgf/u8MF7RSX/CCF1QqE/V0SU9DzGISYcTSrlSAFayYQxdSk0XZBis2NlhzrlSgH9eYt5etWm3njm62S3s2uPVt96wZsrtW9dneNV22q73HdvX0p0D8SgKIyS0Y50PXJ8Vvb2u37V7b47Ziu6Jvnf1kdMK+snGLvbqrwx6QLW1ldkh5kgtOZc9jUTtEryFvUbFgUQHr+ZBgkZkarauj08746tfsD/cikyBx7usqYeKZSvx844sHCgMUJBjrw0ntLIiS4n4u8MUP3x/+8Ie7WjCM74epWhhTiZ8vgDDYlok7g+DdfotP4je/phbxAwiPEApfd3e3217L74Kt1W9+RQr/hyhw5ikMnoN1iGj1hQfVUsRmIn6cFMY0zlYk7Lj7Clp/FCDkPxb2tYo6TdjzA4P0j5Yyd0SBG/2hh8HBQTvzzDNdOCQNM+wv8fPfAzuOK7PyCuBOf+x+jsb7QMxiEmHE0o7il802WyZqtFymaEuzGVsVRbYxE9nTDj3IPtTTZz8enrCrusZtb+uI3bt6wH6/utedirALraLOXid+4SSWJBEMJ8SEE2MWgn0TXvDdF79uN+ZX6godtKtb++yyoQm7YGKHvad/yJ500Arbmo1cWC3Ll0TPHVNUwBFRuZLgORrdxtbFZgxYZ90MTOw+8fvfY03SX83+kSx89RbazHhYeI6CBnHMbsn5IBQ/jLN86lOfcm7xa7FT+Se05/dQAGEwpoiZpXgXuz5Ze5T4za+ZTvz88gVpjt9RwDGucF4d/ONP7uC6vOmMX6AjbbGrlPkG5rOf/azrFfDFjwLFmcJTlYPhb7BjNzv+C9HxN5n2J6C8733vc26gfzihCKbW9OfHM8f8AboLcRQZ8zJ7WujeU045xR2Dhnu55pbP88NtPgzzKj+HBv6Am7AxAk6MZ+UBYcl0vqDdnlms68s2WC7b6HZ1wWkE/VFkD8zl7bUtrfaN0fX2q6GN7lBXnL9375o+J353re22OyB+rb2JSxcOFPEDpaUaQ2X39rkWLcUPYnhH76hd1tpnvxrbaudvPsJevmqtHZfJWn95c4AGtPYaMyXhc6c45NyWZjgPMZdvdIcCNyxZbg1LltrZ555j97pF7X+3v/z5XvvrX/5gf/vbvnP7KBbTGQoF70Wiv+666yrLG5DhIQ5zWUD7+OKHxIyuSGz9hB0qkOB9P1TzVyh+tPPDwhfAr371qy7dctySXbsSv/k1dEM18fNr8QwTXCEWTB9Y3gDjd8+FS3OmM0gH/uxUFK4QGtg/61nPcu/1x/gohH7Xa1K4k9Der9zBDxy75D3sEkXr74c//GGlheq3bmtpfflxjM/0J8IKYY0NBTCGz7BFvuaEr6GhIbfmkPmEccT/zqfxxQ9+DuMT4QH3YBs7HlPmj1uCOchDMYtJhBFLu4r45RqskG+ygzN5a40idx7dMxqW2Ec7euzHoxvtysENdkv3iDuCiONjAMcWoUsQgscF60kiuE9kJre0uL4uFKP9y5DtaRl2wK2uFYvuXAggWoHtfXZH37hd1jFkP1u31T4/ttmetmSFrcdYXyayQjYqjfE1orWXc4cDZzI4wy9n+WyD5XONVmxYYplCoz3gwQ+xvffcbX/4y5/dZJe//u2P9o+/Y2ZXadwiFDQa394XBYLvSHjYwJqtPiYwZt65Jmz5oSaMdUnYIR4ZgQUArsyU1QQw/B7CLiGs4TrhhBMqboAIMh3ju8Rvfsx04sdWkp/WUMhRFE888US3rRWfVa+f8D6kIaQDjvVB+NiKxJpDLrtgFyc+8+rKuYTWXTXh83/z0xafz3s4/ozPmPEcmlqED4ZpNBQvtiQxXoaWE9MG38s8iOUDmEHrP49CVG9Y12NYHvmtTaw/5MxvxA8q5Dg7kuGEcmKOy6SYxSSqRe4+8UPfdpMdns27mYsPibL2moNX2RndI3bxwHq7fmCd3d6FllFpSQAOdL2npd8J4B1rSl2eMxW/hRfAkvjtbh11m1g7t5cFEOJ3e0efO7bo8r719t2hjfautT328GyDG+tbkYks45YzQPyyTvwyOSxnyLkDgYtR0R1ii4rFikMPt49++tN271//bEjef/kbCvRStydagVMZFhi+6CGjEBiMO6ALBJkB8erXesO4nwtC8WONG3sPIgNQ6Nj3D3fWIn5JhhkYz0EtEmmX74XIS/zm10wnfnAvJ5bQD7RHGPGEcP/0Bhq/lVTN4P3+f1C4clIIDLYbw7v4fl/QYOeniyTCuAjxZ0j74uq3eLEjC7oomcZx9bt4pzL8jy+W/v8R7tgZZc2aNe5d7PEg2AAeY2o0CFPku/CZc23oT//QWwofzMUXX2zPfe5zK+GEsENXNPON3/05C2IWk0iKYNg5R7jZiFlraGq0tlzRNkUZe2p+qX2opdd+ODjhCv1b+ta5c/fQxYkxMBxQ6w6tXTvoTjuHwIWbVdciftwMe6HFD8JXEr/S8UsQPAARxP6e13UM2+9GttjXO4ftJYVldlwUuQ2scRqGm9WJ5QyY5OLGFgrWEDVYY1S0hqhouahgmahgD3zoI+zya66xu//0Byd+9/5x35jfdOKHRMaE5gugD1p92DMP8QohYqtoDgeWJ+GLH9MSEjfWH2FvQr8Q4KB3UuuvHnFCV9ANN9zg1goxA7EGjM9+gSbxmztTi/j5C8EpFggfdNdhzAf/4UxItuJgap0R6RfiWALDtIWF5pyF6RekTPd+5Y9pA+6qR/z81h6f7T8Xn7HVH8a8IVislNYad/ALwjbMF/7/sZQIwwqchEN3cywSxx1h7A+Gk8zY6zJfhm5EvmQ5RDcjn6K16re+kUb8JUpwdy3hPw0xi0kkvYCJIAvxy0S2PJ+zvkzOjo0y9sKmQ+2LPWN2yeg2u7p33Hb1jNkd7f1ujA/id1fHoN3TOWR3tZXX+wUtPl/4ksQvbP0ttPjhmCIs4Si1AEutP4g49vnECQ+XtA/YJRuPsE+099vjo6w7sw+n2iPcouaG0lhfARUJZIqi2xAc4pePsK1Z3rX83vPe99vv//RnN78TRQi6Pf9hED7Y1JZJYEIhBKhtoduFrT62wvbXmB/fR9HF9G/U8llzRSasJn61GGYozvBD6w/v04SX/WOmEz8WbPQL4wUtlJe//OXuPzz7jvHBsbta48e/n60+tDhe8YpXuHexm59C5bfW/DB2ZV6wG014T/g/4k/Pp7j6E1+e8IQnVLYbY1jxOp3x78P/kXdghytbxx/72Mcq/gv3x8QpGb/85S8r5QMMwmw+048v0NhMHJUbfP/Vr35l/+///T9rbW11bqPocdIOw2+qsK6DmMUkWCiGL8N3bLWF44xWYuospqxHRXvr2m777voddsW6HXZt54jbzQWtvXtae+3Otl4nhNgD86bOAYc75Rzi6LG3bWru9Ah/m2tKp7YnA/H9w6ph+/OqEfvj6hG7t2XEHca7q3vUbugfs8tHN9pPJ7bZ/wyN2akrV9lxmZzbxgyH0bpW89IlpUku2Yw1NjeVamWI3FzRljYvc9eTTjq5tKWTE70SpZovWkWlRD4VMNxHkMaf2YWd0jHtGULEzOHPepstSWkHdngXJ7vA3xA/XEdHR11GhKHo+a0/37DWOxU0KFjwHcs5sOG17x5mLF7hBoQL3zEV0xm/yw1uQG36ne98p3uPvw5sNviFNcIWBSkX+S+0CcMI6RBT8LHIHYLAtMGwpxAibDCzmd3eiLukwjiM7xAaigK7Ty+55BJ3IC7SPcu4MFznC7wL7yV4f2dnp5t1Sj8x3EL/hDAdImzwHWGFMKN/YY/yAt2qPOkdYu+LMfIeJhVBhNjawzOYZwAry2F8hvkhhLNrea8/mcaf5ILPOB0eeZMVYogzwoZMV/mYATGLSfgv8+3xHYU4ZniiG29LlLGnHLra3jeywb699Si7aHyr/aZr2G7sRHfggN3W1m83d/TbNZ0D9rvuAbu0b9Au6x20q7vQNbh4uba9vyrXt/Xb7WuH7Y7Vw+56a8uw3dAxYlf2jNglA2N2wbr19pXx9fb6jk57RGPpsNoVCDuEITJ7U6PbvoxhigwfbraMU8l58ORMDQf7mYBpIIKvetWrKjVfxjEL5bkoEJLSDuzCLhiCQgBbM6FFyszLTB1mvFpMePIAnoud7dHVhPdBOFgTZwZD9yu24PJnB87U+LvOsMLxgQ98IBZOs8EXUYQnTvRmweIXXH4B5hea841fOCMsMMkELT+6Pexep4DzRHAfVoTIdAYtvbAQxt6Xb3jDG1whuxDihzhizwftMJ6F7dsw45kmTLv1GMavb7htIcD7KS74jtYfxtlgWEmbawP3+OO0eA8EF7NdUc5h7JOtUoQRKuFTCV9YdsyAmMUkkgovvhiHrOIwW7T8NuaL9sy+AfvAkfezM44+3r6zaaeb7Xnp6IRdPjzuuHRknV08ut5+sW6j/d94iZ+PbbALR8cXLb8cWVeVC4fX26VDm+3Xg5scFw9vtAtHNtpP1m20723YYGdt2Wyf2jRhL+1stxMLOXe803J0r2Sxng/HP+UtW9y34BqtIdaA8RkLO9H9xtovCjQWKDBJBVuIbygiMHgmuhg2btxYiVcWBHSDP614piSlH9ixpYmaPvd4ZOLG1OYLL7yw4k6/5ccMzcI09G8IMhv+g0xGQcBYD9aOwS3wL8WDYrx161Y3RZxhNhXh+0J8w908IH5JXWszhYUowxO7d2CmHNy30AYFHOLODwscRMtz2QALYMxEhBAi/LHhuT8xpZoJwzuEBmHBghfii1PlOf42n+KXVEjjO9O6Pya4ZcsW+/znP19xcy2VE/8e5m8/z6ACwVMckCY4oxvvhfhxIgzyALc8Y7ix3GHLOynNh/khxN/Bhgb/g5uQx08//XSXF+kOgnhB/EwlfGG4zoCYxSSSXsLIQyF++NIl1lpstO2rVtu/bd1u73zAg+xjx59o/7vjSPvGth32ne077Ptbtju+t2W7nb91h529fYedueMIO2PHTjt75047Z8fiBW6divO2H1Xh7O1H2Jnbd9oZO7bbl3busM8evdNeM9xvT1qz0nbks24D64OR0NDliSOgcnmLMqUdRyph6nU9PuYxj5lUuw0TUS3G/w8SMWdyofaLAt4v+NkaY03cH4uZKdXST1jz9Qsf1P4wy4+D8LMxFACEI4WT07+xnRW6f0IhQssPewnOhWHXEQyuEOAPfvCDlYkWswVu9wtQhCMOCkYBj1YEKjjk17/+tev2xXl4BN9nA7oPpwI792DfTBR0F110kXMXFnajEEY6QPpj3LOWj3SPygrEimO+LIhZ+Ca1bJKMP4aG/+H7//7v/7p9Ijn7cj7Fzy+0fXvmC+RzXFHRxJILtEghDBy3myvDsEKvAPJXmLcRBthCDnFK8ZtLAxHEGZuYeYqxXEw86+jocBUeVn4Ayh7EC8OrmvCF4TxDYhbTwoI6n81ZMxaiutZfxiYOPsROOnyVndzcbA9D10U+Z0/KRPbUKLKnRJE9OYrsiVHGHhdF9uhM1vG4fM4eV8guWh6bz1TlMfmsPapY2Echa4/OR/bIfGT/lI/socXITihmbFMmsu5yFzEWtmOPTrd7CwQQBwF7g7kokClIOAEdCcFPHAz/ME6qwYSDQh41PVyR4cICn+/wnx12R82EJLcyAcNd7OYIxxnhVh6rNBv8CgVJKuxQCMItaIWyEhA+aybgOf67UOgwfsN4nSkIS8SnH4ahn/17/fAPf58P+B62Ntjl7Icx0iXHoXAfdv1h2qUosjXAArKaH324U4tf0WKPBgrehRY/pgE/jHAGJXtGwufNBrSu+D7EA2dMIhxQ7sAecRKWDXOBX9lNypO08/MEw47hF4bhHBCzmBYmSHjmoOUrbFlDkx1cKFh78xLrb2x0k1+wkHtHLrKtUel0B4LZjtjQeWP5nokosg2LGLixGuPlDbyHsqUrjnCCHVkXRe6QWrT4sJWZa/UxHDN5i7KlfTv9Kfd+ywt2TIiwZyZlwvELhmpUSzAUQz4n/B34BcZ8Qz9BGPy1SPADCzt2g/gFeOjfED4DfuUYAp+N/3ONGcM1XD8UPi/Ez6BJhP5EPM5luDLc4Bf6A+4KW4QLCcWe6ZppEmNutPMrWvwM91dLvySMjxDe5+9sAnsK73yLX1Khje9MH/iM8IEAJY1/hv4JCdNbCMKQFQDAzerDdM44QniwEoXwwneGUdI7Q/ckwef66Z75gGk2KZzwu5/X/d/miJjFtNDTznHunDkszM5aU7llc1B5Oj+ONWrBERplMNMRYONr/A5BOHyRg/HMamBTaozh4VSG5ZmSuKF1h//Bb2B1JrJV+cgOLWRteTFnRezk4mZ4QvyQGEotP3/SAkDhhdoYCzC/IKun8KR4Ir78jIX38b18HjMl3+FnjvkC7+DsM3b/smDicgtf/OrNBL6f6T88i+/jZ4ijHxbAn4peDT9zJoFnIg7COKulYK8H+BMFm7+DBwuWaoXLXBD6NwT3ME2xiy/JHYxfuJ0tQLZCAMKR99QjWPwP8Gc4+rsY1fqsuQL+Z/mJ73QX7H13+O6dKzihDuGJ96G3wy97kH58sZwtzH+IS7yboseyxfcv0yx/C9PRPBCzmBY4Eh4oFBpKG1o3LLPlTcvceXMFFLg4oicb2ZJsZEvL4Lw6bHy9JJO1JVHelkRFa44KTjDRGlqsYEZrNeBX7MoCMcvkIsvnImvMRe5ki6W58hl9eE4msiJ+L0SWa8xbBuv7ljS52Z55HABcDlcWlCyYYceE6M8CZQ0WiYI1qmowQyGzM/H5U53xPiYuX1zCwnouqJaI/entSPx4N65sBcMe7qU4MUOwAJkKhhmfh8+wZ/cjBZZuQQGNAgDPR9iw4KxG+L4Qvi+sfMxV1xIrRXg+w46/Mfz4foqg/3+K43wRhgOvDA+/oPMrW/jNF+8Q3FtL/ONZLNwRHmzVIN55z/4WvzBcmP7hX46BMX+G/gmpFi6Ea+QA/chKL9MCuqHxbqYlwIofK4h+JcIPtzA/hCQdiwZ3MC/QDbRjmPC3BRW/pBezQMV5fg3ZRmvMNLprQ7bo1qZVAqdQXgifz7krtkPDhs3ZXKPbDNuRKVoukz8gr9lMsXSIbxn4z2XIXMZNBipmIysWMlYoZtzJDVkeV9QIChY1FNxid4YnMzMzflKi8wsxFhhT4SfU8PmsWeOK35LiObSbL8IwCMPB97/vLv4vhP4NM2OIX5D44QSSCpOQ8HkhobtCwnCYKdXCL3xfiF/AzISk5/juCOOP94buJ/wv72Ph66d9PjsM6yTC+ArxnzuVu2ZKGN6+2+Ev5j+6l+HFsPL/R3y3hv4NCf0bApGDQLLCzffS/eH91Qjdyvf7eYrpAfb+OxaQmMUkkhIEEzjED8LXHJUEsJBDzbxouXzRMoWiRahJ4Fw6R4NFxcbyRI9mi3AOYK7ZMtkGRzZzYF7hBwJRd6cxOBEsJ7xC3jLYwgw7ueCkdgig29IsWz6pPV5g+JmDCchPRExk/F9YIIVx5RdKTIBsZbK1hecmxXNoN1/4bgzDIcxEvp+TnhH6eSqmysS1/H+2hOEQEroryd9ThV/4vpAwvOol6Rm+G/z4YxyG/wn969/H//I/9CvfEfqnXsI0FYbrbEkKG74X/qLw0R0MM3wO709ya+ifemG8hPmNhPcn4cdjGP++e327+QjrGRCzmESSI+lBN9szU3RgW65Sy6/RHcWDkwic0BWwhReg8JWhYGRKQpKLDrwryGeaPRpLuGOeSiKI44ncGB/ANmY4tw8bWuOajyaJn59o/EwQEiY+PxGGcRXew+ez5cfCJfwv3RQ+bz7xM46fUZKgf8Jn1EsYfknhMBXh80LC8A8J7w+ZquUf3psUfuH7QkL/1Iv/jNANU8VfGJf8H9P9dH6tldC9IaEbwv/PFf47/fAPhc53D/7H+5LCK3xHEqF/Q/x7/fBn+RDeHxK+z38v3c77fLvw/gUiZjGJJA/SExC/hkzOmqKCNWQKVswUXGvQFfxoHeXQMsJ6tjhsPZW6EUsnGBxo10LUYMWoqQK+E9yDbtGYAOaiEk749okfw9RP5NUKL/+eajVrJjq/2ygp0yTZ+W4J434+8cOB70+y88OHv4fPqpXZ/n86+PxqTHd/KHxJ/wn/mxR+803oDr4/Kd0yrfpCx99Z8PqiED5/LvHdNx/vYliEaZd2frzyntAu6b9z5c4wHgnfG95fC6G7+ZzZPnceiFlMIimQ6QmIX7EsgLhWKAshKI2PJZF1FLB5szvC58C7AmxC3ehOYoAQUhRLAgnxc93A7AJ1CSGybC6yHK5uvC9eaPkkJUgfX/iYafzMFRYkYVwmsZCJNMyEoT3cRD8m+Tf830IT+ick6V76Bf7yu779gqQa4fP3B0luoPv5md990QuFDvYc86Kdn9b9OA7fOVP8NFPNP7OB/vL96vvN/4xrWNnxw85P63PlTj9MZ/LM8H9+3DP9snLjp4G59MMsiFlMIsmBkzyYLRXkoAAxy2TdsgfQiGn8Uc4aoowVHKUZkj7YIu3Ahf4DmOlasHxUsGyFnJsAhEXtpYpBxh1l5M8mLQlgvEAhYaYP8eNkKqrFYWgfPiv8bSGhm/3MlST6vtvDcKhG+K5aCZ8TEt4/Fbg/9Btn6iWJYLX4q4fQvfUSPs9/rp92Q39REPwxL18UWUCG//H9H7olidBdIeH9IeH99eL7k/j+8/2Da1ghCMPO9zueH7o3JHRPLdTz/6T8Rvcy/dKvvj39ET5vPxOzmERSAPgexBR/wNZMAdP6MZW7QqbyOVw+4MQPJ5ofyEQ43QKUTmAHOI2dJ7KjlcsKAfyOcMB+qADfcTJGmGB9/AxQS4L04waEv4f3hfaLlTBcGCZJwjfV/6YjfO90hP8PCe+vBu/3CwhfDHzh8/0bPqdeQvfWS/g8/7mMIz89+n4DfkHv/+bKliA8/DDgu0P3hITuSiL8T73/nwq4lYLmix/jzk+zuPr+rBZ+4X+mInTPdOA//jvD32uFz4G/w/gK/bCAxCwmkeRAesx5iuJXaf2VxI8FfbV1c5XWn/e/A/EK8cpGmQoUvn0CSHEshQv8jnBonkL8/LBOSvBJMFEx8zCz8b/h/SFJ714MhGETwow6U7f7BUxSGITvCwmfN1PoF18AEI/h++bynSB8dr2Ez/OfGxbaSYTdYvQ706z/nPC3WgjdGzLVffW8pxp0O/NkKAYhvJ/pkeHihxl/C/+bROinuSZ8X/huX+hDN4X3LwAxi7ooRY43K6k8lufG83BFAe6B43xC8JwD9Qp/0u/VmBwmJeEkJcGsjp9wTjzxRMexxx5rJ5xwgj3oQQ9y37ERM09nQOHA+6faqWERJcAYSX5HpseyDOz4j+NX4O+RkZFJJ09wYfBcnEaxv2EByfg77rjj7NnPfrY97nGPs4c//OH2/Oc/39njHlwRPqjchM9ZLDAO/V1KkB7hT6RVpF34cWhoyN2HtWb4jf/FMpwjjzzSHvjAB7p7ccAwf+PzeP9iBv6A37ipARaU47QWcL/73c+lY3yGH3HFpuQPfvCDHfDz6tWr3f8Qjox7pO/FHPchiPeuri7nX5zggFNbYO/vLLNAxCzqIizoQ8L700bo33oJxS6EW2Mh8eDIke9///vuNAYcCPqtb33Lgd3zP/KRj7gDKZ/1rGe5DbHpPtYU/XfxN//zYgDuoVtZy+V6RNSYkXHOPPNMd8wTjsXB4ZcoPPBfji3gMwuaA6FwTCrEEH9ve9vb3KkLONnimmuusauuusodvlrLlmuLAaY17qQCO8QhTrPAuXI/+clP3NFS733ve91RPvwfxAH/w3l/55xzjkvn3/jGN+zf/u3fKrv8+O8I37sYoTtxvf/972+f+tSnXB5GGPz0pz91ByfjyjCBv/H5S1/6kh199NEuHSPs6He/grvYgZ9xWsWb3/xmF5c4XeQLX/hCZd/Q8P79TMyiLsLCPCS8P22E/q2XUOxC+J7Nmze7M85wJE7SIZc8+uh3v/udO7KFhep0Sx0WC3AX3EfRYxcXfoM9Pr/1rW+tHMoLg1O5cTwQ7qEo4DmsIScJy2LFLwhw3M8Xv/hF50f/bDWexA0Wu9+YfhGXEC3GK44SOuOMM5yfcGQP4hOVOlbYeMoHBJHn7+FYKBSeHC/z3xG+d7Hhp2Pw5Cc/2VVkaJCXw0OTeY4hjqR6/OMfP2lLNt//yBfh+xYjOKHjm9/8psuvMNdff33sngUiZlEXYWEdEt6fNkL/zjUoMHBF1yZqg8goTEQQOpz7xQNDYXAOGgy6zFBTDMUvdHfon4UE7gkFkJ/R3YmaI84l49lu8CvCAAWq/xxWLBZBzbJm/D1WcfTMJz7xCedHFowQQV/8FkGX0ZT46Qt+Yw8EhP0rX/mKS7co3BGfEICXvvSlk7pI0d25d+/eStp+y1ve4uwZt/wcvnexgbzn++tf//Vf7dprr50kcnv27HHX8Py+G2+80XV/UvyQl/09YRd7BQjA/zi3Dz1UiE/EO/yF3xZB/MUs6iIsrEPC+9NG6N+5BokH70GXFwp/GmQgjH0hM6Hr6JOf/GTllHYcWIuCBf/jTDo8y3c3RSb0z0JDf7OQ42bWr3zlK10XIPwIIYAfedDpk570JPdffzzML3AWM4wXPy4gfp/5zGe8YrBkMFbC9LDYhZ3xyAoM7dF9/+Uvf9mJHoTt5ptvdn5D1/0///M/V+5FiweVPArE+9///sqEEcbzYky/SUCkWNA/9alPdYcpw8B/5557rhvne9SjHuXy80Mf+lB3mO9JJ53kuvRRsaPgwd94VlK4LlbgVlTazj//fOdn5F104/vj2wtIzELsR0KxC+F96Pb0TxfHeJCfeI4//nh3WjYKFdYgYU/xC9+7mFtGvgDiiq4wdJWhpYea4w033GBXXnllpUsQp0Oj24w1Yfh3rk5NmG8Yx34tuLOz0/kJBnEJgYffMQGC93MmaPi8xQLjkLMbYYf0NjAw4Fp+bMHDQAQRlxjDxSQX3HvUUUe5uGbXJ8a0WaFJCrPFDFu++IyKGgUf/se4Ho4uYw8H/MheAHTlw46HzlL88ZzFmneTQLr1u7pRdiWVSQtAzELsR0KxC8E9SPCY3XnBBRe4QgIFx+233+6OC8Gpz7gHhQW6yq644gp3zx133FERAYhCmNgWc8uPrT64D4X8ox/9aNfqQyGJlt8HPvAB+/CHP+xafzAYQ0ALGAUC/k8RXMziEII4hnvhX7SO0JL3x4IQp2j98/7FXvj5aRh+Q3wiXvr7+914JuJy165dzm/ouoZBKw8tPMwAHRwcdIKPwhItpHe9612TunoXu/8JxYtC/S//8i+VMT9092Ic/znPeY498pGPtCc+8Yn2lKc8xbV6n/a0p1VmcOPQX/jXP4rsQBF+gHT71a9+1fkZFRr0WoXDMAtEzELsR0KxC+F9ExMTdt5557lCEKD2CHuMoWBywAte8AInfBBG/I6Mhd8xXoBMwwLIf+8iSHwVQtFD5mAB9453vMNlHEz2QQGJpR6Y+ckaNAwmTeBeFJBc6nAgjImwAuLHRVtbm/33f/+38xcFHmZ8fLxyz2JfzuGnX1+0WlpaKq0AVuIwHsTeiuuuu87+4z/+w037R3zDoCKHNMCxL4TVgdKyB0zHcPcznvEMNyTBuAVoAe7evdulbVyRruF3iCL+h6UC+C9EEMAO6YatwMUOZu6itQ9/oly67bbbYvcsEDELsUD4okchQAJHIY7a8A9/+MNKgYAWEAr8z33uc/bd737Xrr76ajegTPOxj31s0kQDX0j994V2+xvfDX5LlAUGxB1jJPAvMg9msvIeVAZQkwQXXXSRK1hRQLJg5PhQ2MJdDP4mdIs/iw+t+c9+9rOuEsP4hhkeHq7cg/sXQ+UlKSyZfhHu/J3fEZ9oBaDlh3hDK+jkk0+2yy67rOJPTP1H2qbfUWBiwovf2sPnxSCA0/mfXZUUqic84QmuF4OG4/QwYXy/7nWvc8/xD3v2l7qE6XohmM7/iCdMeDn77LOdn9CKh8DzXvoH6dmPz/00Zh+zEAtEkvjxNywIZvcQaswAhQdrzMg0HEPB2AnGCPG/xS5+PiggkMExxseM8+IXv9h1f7ErFxME0C2ECQIQQr/wwDpHPIeFArtNw0JisfkbsGUO/6PLD2NBMOj65LgX4jRMFwtNUlj6hR/8gzjg2B8mcJx11lkuPpF2MXaL7nssZcBECBp0jcHvuAfpHN2haPUsJr+D6fzPtMeeDLT80LJDXoW/0PLF2lXkWazvw5IApHHYYVkE/kt/+2kZzwrT9UIwnf8hYqOjo/b5z3/eCR/yK8oq+IWbHtAvgLPT8btfIZwnYhZigUgSP3ZvoWsTM6bQumPXJw0LSHShYCYdZokhw+C/i138UDiGmZjdW1gQjRYdW7RoLaDWiNYCChDUoNEqQMsQGerSSy+tdLEh00FEF7v4+a1z2mHyzsc//vFK5Qbxi7jlLicAftgPhcO0JIWlX/iFLR+0AlCwI72im+/yyy939hjfwjguxzk5/R/xi0Lz7W9/eyWMKAThexeC6fwfCjbG9dBLg7SMMECLaOfOna6rG4vBIRSoIKCrkPkA+Rjp2u/mPFD8j++Y7YnKHFu1yK+8F/fRn4Czu8NnzhMxC7FAJIkfEwLW+WGpAwsH9Ju/7GUvs1e84hX2whe+0F7/+tfbi170IjebDvej8OdsscUsfj6cEo7MAHejoIDhuka2bHGF+HNNIydOoDA59dRTK8/DMxa7+BG/MEP3bdJSB06A8NNH+Jz9TVJYhoUfvjMdo4BHNz0M4vHiiy929mj9YU0bJnUhHhnnNJjkxDCiqIbvXQim8z9b9LwPE1pQgaNBb8UhhxyS+Dz8H3nY7xVgOCa9dyFIckcY/xirRovWH6JABY/bL7KMCndm2g9rWWMWYoGg8PmFGxM71nhhSy/UllFrxHR/Jg6sC/MLQvaXs+A/EMQPbkRmoJuwKwTGLTklHqL/i1/8ws3sRPcYJvcQrgVDaxCZDLVoPIM7ghwI4odxHbgVbkN8YswL8YwFwRQCTnhBYbgfa8dTkhSWfuHnT7jCbyj0MPkB8YnWHTZu4MQk3IOuPrQGYVCpQasf8evP9oTfF4Pwg+n8j+/+WB3G/DDhBSLAnguEB7Y7Q88OxB9gEhBayNgPk2N+CB9/zeBioBb/t7a2uvF5TniBQbwjnlERQBpHnkYreMOGDfuzYhOzEAtEkvihRozf0B2C9TE06AYL/w/Y3UcBXOziV21GJqaEczEwzPve9z7XqsWECbSMuFkwWkOYCMQwgQCecsop7hmoUS928aPg+WLGXVBCQ/GDf0I/LRRJYekXfuj287vsMJnna1/7WmWsOuwCQzhgf1rfQCggfv6EiMUSBtP5H/5BWuUsTWxU7s9SRiWAsz/RLcjNGxA+uA87NWEdIP4b5uPFUAGazv+o/KALF3uXwqAiwxnpMFy+BIOKLdI4/ov/MczmkZiFWCCSxI/fMdkBtUPUntDqwwa4+A8TCMQONSwmxgNF/MJaLGrIEHyIHSYDoGsTmQITXHgv3A1/sTDErDi0IpCp0B2M/T4pqotd/EK3wU84rQKzeFEwwKB2jFYQCob9WCuuiaSw9As/2iE+EK+YtQy/odUDf2GdG/wEf6O1j3shlujmxD1o+UEc3vjGN7q04XcPh2lnIZjO/wDfObb92Mc+1nX7YfIW8jL3N+XyJIghfoNBmsb6P7Z46Xf6O0w7C8F0/oebUS6hMod4hJ/gT1RocOX2dezZQSU/6ZnzRMxCLBAUOiYeJnJkegyCY4d3ZAascXv605/ufmPBwf/7rT7OolrM4gf8sQx28WDLp4c97GFu3A+1Zd7L+3BFjRh+wyQKdCchbLBFFjYEgP2B0O1J/yAe/YIdQoejjLDAH/tcvuQlL3Huxn30z34YE5mWpLD0Cz+6F/FK4cbJBmjZI44RV/5/2cpB1y/iHWkAu6Js2rTJ2ftdvknv3t8kucH3PyesMW5RuKNrF9uYwW+PeMQj3GfEMdIuZjJjZjfCB1ucobKA/8HfzBuLZbILmM7/dCsm4WH7Nog/yi/kVWzjBn8zjSMs4EdOgAnz7TwQsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQIu3ELIQQQoi0E7MQQggh0k7MQgghhEg7MQshhBAi7cQshBBCiLQTsxBCCCHSTsxCCCGESDsxCyGEECLtxCyEEEKItBOzEEIIIdJOzEIIIYRIOzELIYQQItX8f9Lg1N7fYk5BAAAAAElFTkSuQmCC" alt="" width="80" height="auto" />   
   <div style="text-align: right;">
            <h1 style="margin: 0; font-size: 22px; color: #000;">RELATÓRIO DE INJEÇÃO</h1>
            <p style="margin: 5px 0 0 0; font-size: 12px;"><b>DATA:</b> ${rel.data}</p>
            <p style="margin: 2px 0 0 0; font-size: 12px;"><b>OPERADOR:</b> ${rel.operador}</p>
        </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
        <thead>
            <tr style="background: #e2e8f0;">
                <th style="border: 1px solid #000; padding: 8px; font-size: 10px;">PRODUTO</th>
                <th style="border: 1px solid #000; padding: 8px; font-size: 10px;">ESP.</th>
                <th style="border: 1px solid #000; padding: 8px; font-size: 10px;">METROS</th>
                <th style="border: 1px solid #000; padding: 8px; font-size: 10px;">VEL.</th>
                <th style="border: 1px solid #000; padding: 8px; font-size: 10px;">POL</th>
                <th style="border: 1px solid #000; padding: 8px; font-size: 10px;">MDI</th>
                <th style="border: 1px solid #000; padding: 8px; font-size: 10px;">PEN</th>
                <th style="border: 1px solid #000; padding: 8px; font-size: 10px;">C1</th>
                <th style="border: 1px solid #000; padding: 8px; font-size: 10px;">C2</th>
                <th style="border: 1px solid #000; padding: 8px; font-size: 10px;">C3</th>
                <th style="border: 1px solid #000; padding: 8px; font-size: 10px;">C4</th>
            </tr>
        </thead>
        <tbody>
            ${tabelaItens}
        </tbody>
    </table>
`;

    // Configurações do html2pdf
const opt = {
        margin: [10, 10, 10, 10],
        filename: `Relatorio_Injecao_${rel.data}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            logging: true, // Isso nos ajuda a ver erros no console se travar de novo
            allowTaint: true // Permite imagens de pastas locais
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // Executa a geração e abre em nova aba
  // 1. Abrimos a aba IMEDIATAMENTE após o clique para evitar bloqueio de pop-up
    const novaAba = window.open('', '_blank');

    // 2. Iniciamos a geração do PDF
    html2pdf().set(opt).from(conteudoFinal).toPdf().get('pdf').then(function (pdf) {
        const blobUrl = pdf.output('bloburl');
        
        if (novaAba) {
            // Se a aba abriu com sucesso, injetamos o PDF nela
            novaAba.location.href = blobUrl;
        } else {
            // Se o navegador bloqueou a aba, ele faz o download automático
            pdf.save(`Relatorio_Injecao_${rel.data}.pdf`);
            alert("O navegador bloqueou a abertura da nova aba. O download foi realizado automaticamente.");
        }
    }).catch(err => {
        console.error("Erro ao gerar PDF:", err);
        alert("Erro ao gerar o arquivo PDF.");
    });
}
