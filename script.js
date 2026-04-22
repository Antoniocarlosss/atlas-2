// --- BANCO DE USUARIOS ---
let usuariosSistema = JSON.parse(localStorage.getItem('atlas_usuarios')) || [
    { id: "admin", senha: "123", cargo: "admin" }
];

let usuarioLogado = null;

function inicializarUsuarios() {
    const existeAdmin = usuariosSistema.some(u => u.id === "admin");
    if (!existeAdmin) {
        usuariosSistema.push({ id: "admin", senha: "123", cargo: "admin" });
        localStorage.setItem('atlas_usuarios', JSON.stringify(usuariosSistema));
    }
}

inicializarUsuarios();

function fazerLogin() {
    const usuarioInput = document.getElementById('login-email').value.trim();
    const senhaInput = document.getElementById('login-senha').value.trim();

    const usuarioEncontrado = usuariosSistema.find(
        u => u.id === usuarioInput && u.senha === senhaInput
    );

    if (usuarioEncontrado) {
        if (usuarioEncontrado.bloqueado) {
            alert("Usuário bloqueado. Fale com o administrador.");
            return;
        }

        usuarioLogado = usuarioEncontrado;
        document.getElementById('tela-login').style.display = 'none';
        document.getElementById('app-principal').style.display = 'block';
        document.getElementById('user-display').innerText = usuarioEncontrado.id.toUpperCase();

        aplicarPermissoesUsuario();

        if (typeof producoesDoDia !== "undefined") {
            producoesDoDia = [];
        }
    } else {
        alert("Acesso Negado!");
    }
}

function aplicarPermissoesUsuario() {
    const cardGestao = document.getElementById('card-gestao');
    if (!cardGestao || !usuarioLogado) return;

    if (usuarioLogado.cargo === 'admin' || usuarioLogado.cargo === 'supervisor') {
        cardGestao.style.display = 'flex';
    } else {
        cardGestao.style.display = 'none';
    }
}

function voltarHome() {
    document.getElementById('grid-home').style.display = 'grid';
    document.getElementById('conteudo-modulo').style.display = 'none';
}

function fecharModal() {
    document.getElementById('modal-edicao').style.display = 'none';
}


function abrirModulo(nome) {
    if (nome === 'gestao' && (!usuarioLogado || (usuarioLogado.cargo !== 'admin' && usuarioLogado.cargo !== 'supervisor'))) {
        alert("Apenas ADMIN ou SUPERVISOR podem acessar a Gestão.");
        return;
    }

    document.getElementById('grid-home').style.display = 'none';
    document.getElementById('conteudo-modulo').style.display = 'block';

    const titulos = {
        injecao: "INJEÇÃO",
        bobines: "BOBINES",
        serra: "SERRA",
        embalagem: "EMBALAGEM",
        plano: "PLANO",
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
        renderizarMenuEmbalagem();
    }
    else if (nome === 'plano') {
        renderizarMenuPlanoNovo();
    }
    else if (nome === 'gestao') {
        renderizarMenuGestao();
    }
    else if (nome === 'config') {
        render.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:200px; color:#94a3b8; text-align:center; padding:20px;">
                <i class="fas fa-laptop-code" style="font-size:40px; margin-bottom:15px; color:#3b82f6;"></i>
                <h3 style="color:white;">MÓDULO EM DESENVOLVIMENTO</h3>
                <p>Esta funcionalidade estará disponível em breve.</p>
            </div>`;
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
let producoesDoDia = []; // Deve ficar no topo do script
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

    // PEGA A DATA DO INPUT
    const dataInput = document.getElementById('data-retroativa').value;
    let dataRef = new Date();

    if(dataInput) {
        const partes = dataInput.split('-');
        dataRef = new Date(partes[0], partes[1] - 1, partes[2]);
    }

    // --- CORREÇÃO AQUI: BUSCA O NOME DA TELA OU DA VARIÁVEL ---
    const elementoNome = document.getElementById('user-display');
    const operadorSistema = elementoNome ? elementoNome.innerText : (window.usuarioLogado || "OPERADOR");

    const relFinal = {
        id: Date.now(),
        data: dataRef.toLocaleDateString('pt-BR'),
        ano: dataRef.getFullYear(),
        mes: dataRef.getMonth() + 1,
        dia: dataRef.getDate(),
        hora: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        operador: operadorSistema.toUpperCase().replace("OPERADOR: ", ""), // Limpa o prefixo se existir
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
    alert("Relatório fechado com sucesso!");
}
//FUNÇÃO PARA RENDERIZAR O HISTÓRICO NA TELA ---
function renderizarHistoricoBobines() {
    const container = document.getElementById('render-modulo');
    
    // Simulação de estrutura organizada (Ano > Mês > Registros)
    // No seu sistema real, essa estrutura vem do seu Banco de Dados/Firebase
    let htmlHistorico = `
        <div style="padding: 20px; color: white;">
            <h3 style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px; font-size: 18px;">
                <span style="color: #E31C24;">📁</span> HISTÓRICO DE BOBINES
            </h3>
    `;

    // --- PASTA ANO (Exemplo: 2026) ---
    htmlHistorico += `
        <div class="pasta-ano" style="margin-bottom: 10px;">
            <div style="background: #1e293b; padding: 10px; cursor: pointer; border-radius: 4px; font-weight: bold; display: flex; align-items: center; gap: 10px;" 
                 onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
                <span>📁</span> ANO 2026
            </div>
            
            <div class="meses-container" style="display: none; padding-left: 20px; margin-top: 5px;">
                
                <div class="pasta-mes">
                    <div style="background: #334155; padding: 8px; cursor: pointer; border-radius: 4px; font-size: 14px; font-weight: bold; display: flex; align-items: center; gap: 10px; margin-bottom: 2px;"
                         onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
                        <span>📅</span> ABRIL
                    </div>

                    <div class="dias-container" style="display: none; background: rgba(15, 23, 42, 0.5); border-radius: 0 0 4px 4px;">
    `;

    // AQUI entram os registros do dia com o visual novo (AMARELO da sua marcação)
    historicoBobines.forEach(rel => {
        htmlHistorico += `
    <div style="
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        padding: 12px 15px; 
        background: #1e293b; 
        border: 1px solid rgba(255, 255, 255, 0.05); 
        border-radius: 8px; 
        margin-bottom: 8px;
        -webkit-print-color-adjust: exact;
    ">
        
        <div>
            <div style="font-weight: bold; font-size: 14px; color: #fff;">
                ${rel.data}
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px; text-transform: uppercase;">
                Op: ${rel.operador}
            </div>
        </div>
        
        <div style="display: flex; gap: 8px;">
            <button onclick="gerarPDF_Bobines('${encodeURIComponent(JSON.stringify(rel))}')" 
                style="
                    background: #10b981; 
                    color: white; 
                    border: none; 
                    padding: 8px 15px; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    font-size: 11px; 
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                ">
                <span style="font-size: 14px;">📄</span> PDF
            </button>
        </div>
    </div>
`;
    });

    // Fechamento das tags
    htmlHistorico += `
                    </div> </div> </div> </div> </div>`;

    container.innerHTML = htmlHistorico;
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

// --- VERSÃO ATUALIZADA COM TEMA ESCURO (ESTILO SEGUNDA IMAGEM) ---
function gerarPDF_Bobines(dadosEncoded) {
    const rel = JSON.parse(decodeURIComponent(dadosEncoded));
    const janela = window.open('', '_blank');

    let conteudoGeral = "";
    
    // Agrupamento por produção
    const producoes = {};
    rel.itens.forEach(item => {
        if (!producoes[item.producao]) producoes[item.producao] = [];
        producoes[item.producao].push(item);
    });

    // Gera o conteúdo para cada produção
    Object.keys(producoes).sort((a,b) => a-b).forEach(numProd => {
        let itensFilme = producoes[numProd].filter(i => i.tipo === 'filme');
        let itensChapa = producoes[numProd].filter(i => i.tipo === 'chapa');

        // Cálculo das somas de filmes (Superior e Inferior)
        const somaSuperior = itensFilme
            .filter(f => f.lado.toLowerCase() === 'superior')
            .reduce((acc, curr) => acc + Number(curr.qtd), 0);
            
        const somaInferior = itensFilme
            .filter(f => f.lado.toLowerCase() === 'inferior')
            .reduce((acc, curr) => acc + Number(curr.qtd), 0);

        conteudoGeral += `
            <div style="margin-bottom: 30px; border: 2px solid #000; padding: 10px; border-radius: 5px; -webkit-print-color-adjust: exact;">
                <div style="background: #000; color: #fff; padding: 8px; text-align: center; font-weight: bold; margin-bottom: 15px; -webkit-print-color-adjust: exact;">
                    PRODUÇÃO ${numProd}
                </div>`;

        // Tabela de Filmes
        if (itensFilme.length > 0) {
            conteudoGeral += `
                <div style="text-align: center; font-weight: bold; font-size: 15px; margin-bottom: 5px;">▶ LANÇAMENTO DE FILMES</div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px;">
                    <thead>
                        <tr style="background: #e2e8f0; -webkit-print-color-adjust: exact;">
                            <th style="border: 2px solid #000; padding: 6px; font-size: 11px;">POSIÇÃO</th>
                            <th style="border: 2px solid #000; padding: 6px; font-size: 11px;">TIPO DE FILME</th>
                            <th style="border: 2px solid #000; padding: 6px; font-size: 11px;">QUANTIDADE</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itensFilme.map(f => `
                            <tr style="font-weight: bold;">
                                <td style="border: 2px solid #000; padding: 6px; text-align: center;">${f.lado.toUpperCase()}</td>
                                <td style="border: 2px solid #000; padding: 6px; text-align: center;">${f.subtipo}</td>
                                <td style="border: 2px solid #000; padding: 6px; text-align: center; font-size: 14px;">${f.qtd}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div style="display: flex; justify-content: space-around; background: #000; color: #fff; padding: 5px; margin-bottom: 20px; border: 2px solid #000; -webkit-print-color-adjust: exact;">
                    <span style="font-size: 11px; font-weight: bold;">TOTAL SUPERIOR: <span style="font-size: 14px;">${somaSuperior}</span></span>
                    <span style="font-size: 11px; font-weight: bold;">TOTAL INFERIOR: <span style="font-size: 14px;">${somaInferior}</span></span>
                </div>`;
        }

        // Tabela de Bobinas (Chapa)
        if (itensChapa.length > 0) {
            conteudoGeral += `
                <div style="text-align: center; font-weight: bold; font-size: 15px; margin-bottom: 5px;">▶ LANÇAMENTO DE BOBINAS (CHAPA)</div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                    <thead>
                        <tr style="background: #e2e8f0; -webkit-print-color-adjust: exact;">
                            <th style="border: 2px solid #000; padding: 6px; font-size: 11px;">POSIÇÃO</th>
                            <th style="border: 2px solid #000; padding: 6px; font-size: 11px;">Nº BOBINA</th>
                            <th style="border: 2px solid #000; padding: 6px; font-size: 11px;">RAL</th>
                            <th style="border: 2px solid #000; padding: 6px; font-size: 11px;">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itensChapa.map(c => `
                            <tr style="font-weight: bold;">
                                <td style="border: 2px solid #000; padding: 6px; text-align: center;">${c.lado.toUpperCase()}</td>
                                <td style="border: 2px solid #000; padding: 6px; text-align: center;">${c.numBobine}</td>
                                <td style="border: 2px solid #000; padding: 6px; text-align: center;">${c.ral}</td>
                                <td style="border: 2px solid #000; padding: 6px; text-align: center; color: ${c.status === 'SIM' ? '#059669' : '#dc2626'};">${c.status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>`;
        }
        conteudoGeral += `</div>`;
    });

    // Estrutura HTML do Documento (Visual da Imagem 2)
    janela.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                .header-black {
                    background: #000; color: #fff; padding: 15px;
                    display: flex; justify-content: space-between; align-items: center;
                    border-bottom: 5px solid #E31C24; -webkit-print-color-adjust: exact;
                }
                .main-content { padding: 20px; }
                .resumo-final {
                    background: #000; color: #fff; padding: 15px; margin-top: 20px;
                    text-align: center; border-radius: 5px; -webkit-print-color-adjust: exact;
                }
                .assinatura-area { margin-top: 50px; text-align: center; }
                .linha { border-top: 2px solid #000; width: 60%; margin: 0 auto 5px auto; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header-black">
                <div>
                    <b style="font-size: 22px;">ATLAS PAINEL</b><br>
                    <span style="font-size: 11px; text-transform: uppercase;">Relatório de Bobines / Filme</span>
                </div>
                <div style="text-align: right; font-size: 12px; font-weight: bold;">
                    DATA: ${rel.data}<br>
                    OPERADOR: ${rel.operador.toUpperCase()}
                </div>
            </div>

            <div class="main-content">
                ${conteudoGeral}

                <div class="resumo-final">
                    <b style="font-size: 16px;">TOTAL GERAL DE PRODUÇÕES: ${Object.keys(producoes).length}</b>
                </div>

                <div class="assinatura-area">
                    <div class="linha"></div>
                    <b style="font-size: 13px;">${rel.operador.toUpperCase()}</b><br>
                    <span style="font-size: 11px;">Responsável pela Produção</span>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <div class="no-print" style="text-align: center;">
                    <button onclick="window.print()" style="padding: 20px; background: #000; color: #fff; border: 3px solid #E31C24; width: 100%; font-size: 18px; font-weight: bold; border-radius: 10px;">
                        🖨️ CONFIRMAR E GERAR PDF
                    </button>
                </div>
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
            <div class="card" onclick="exibirSetupSerra()" style="cursor:pointer; background:#1e293b; border-radius:10px; padding:30px 15px; text-align:center; border:1px solid #334155;">
                <i class="fas fa-plus" style="color:#3b82f6; font-size:2.5rem; margin-bottom:15px;"></i>
                <span style="display:block; color:white; font-weight:bold; font-size:13px; text-transform:uppercase;">Novo Relatório</span>
            </div>
            <div class="card" onclick="listarHistoricoSerra()" style="cursor:pointer; background:#1e293b; border-radius:10px; padding:30px 15px; text-align:center; border:1px solid #334155;">
                <i class="fas fa-history" style="color:#3b82f6; font-size:2.5rem; margin-bottom:15px;"></i>
                <span style="display:block; color:white; font-weight:bold; font-size:13px; text-transform:uppercase;">Histórico Serra</span>
            </div>
        </div>
        <div id="container-acao-serra" style="display:none; padding:15px;"></div>
    `;
}

// --- 2. GERENCIAMENTO DE INTERFACE ---
function alternarAbaSerra(mostrarAcao) {
    const menu = document.getElementById('menu-inicial-serra');
    const acao = document.getElementById('container-acao-serra');

    if (mostrarAcao) {
        if (menu) menu.style.display = 'none';
        if (acao) acao.style.display = 'block';
    } else {
        if (menu) menu.style.display = 'grid';
        if (acao) {
            acao.style.display = 'none';
            acao.innerHTML = '';
        }
    }
}

// --- 3. CONFIGURAÇÃO INICIAL ---
function exibirSetupSerra() {
    alternarAbaSerra(true);

    const container = document.getElementById('container-acao-serra');
    if (!container) return;

    container.innerHTML = `
        <div style="display:flex; align-items:center; margin-bottom:15px;">
            <button onclick="alternarAbaSerra(false)" style="background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer; margin-right:15px;">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h3 style="color:#E31C24; font-size:14px; margin:0; text-transform:uppercase;">Configurar Produção</h3>
        </div>

        <div style="margin-bottom:15px; padding:10px; background:#1e293b; border-radius:8px; display:flex; align-items:center; justify-content:center; gap:10px; border:1px solid #334155;">
            <label style="color:#94a3b8; font-weight:bold; font-size:12px;">DATA DO RELATÓRIO:</label>
            <input type="date" id="data-manual-serra" style="background:#0f172a; color:white; border:1px solid #3b82f6; padding:5px; border-radius:4px; font-weight:bold; outline:none; cursor:pointer;">
        </div>

        <div style="background:#111827; padding:20px; border-radius:12px; border:1px solid #334155;">
            <label style="color:#94a3b8; font-size:11px;">TIPO DE PAINEL</label>
            <select id="s-tipo-serra" style="background:#1e293b; color:white; border:1px solid #334155; width:100%; padding:12px; border-radius:6px; margin-bottom:15px; font-weight:bold;">
                <option value="5 Ondas">5 Ondas</option>
                <option value="Fachada">Fachada</option>
                <option value="Telha Canudo">Telha Canudo</option>
            </select>

            <label style="color:#94a3b8; font-size:11px;">ESPESSURA (mm)</label>
            <select id="s-esp-serra" style="background:#1e293b; color:white; border:1px solid #334155; width:100%; padding:12px; border-radius:6px; margin-bottom:20px; font-weight:bold;">
                ${[30, 40, 50, 60, 80, 100, 120].map(e => `<option value="${e}">${e} mm</option>`).join('')}
            </select>

            <button onclick="iniciarInterfaceCorteSerra()" style="width:100%; background:white; color:black; font-weight:800; border:none; padding:15px; border-radius:6px; cursor:pointer; text-transform:uppercase;">
                Abrir Lançamento
            </button>
        </div>
    `;

    const inputData = document.getElementById('data-manual-serra');
    if (inputData) inputData.valueAsDate = new Date();
}

// --- 4. INTERFACE DE LANÇAMENTO ---
function iniciarInterfaceCorteSerra() {
    alternarAbaSerra(true);

    const tipo = document.getElementById('s-tipo-serra')?.value || "5 Ondas";
    const esp = document.getElementById('s-esp-serra')?.value || "30";
    const dataEscolhida = document.getElementById('data-manual-serra')?.value || "";

    const container = document.getElementById('container-acao-serra');
    if (!container) return;

    container.innerHTML = `
        <div style="background:#1e293b; padding:12px; border-radius:8px; margin-bottom:15px; border-left:4px solid #E31C24; display:flex; justify-content:space-between; align-items:center;">
            <div style="color:white; font-weight:bold; font-size:13px;">${tipo} - ${esp}mm</div>
            <div id="resumo-soma-serra" style="color:#10b981; font-weight:bold; font-size:14px;">Neste Painel: 0.00m</div>
            <input type="hidden" id="h-tipo-serra" value="${tipo}">
            <input type="hidden" id="h-esp-serra" value="${esp}">
            <input type="hidden" id="h-data-rel-serra" value="${dataEscolhida}">
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
            <button id="btn-s-ped-serra" onclick="setModoCorteSerra('pedido')" style="background:#3b82f6; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold;">PEDIDO</button>
            <button id="btn-s-stk-serra" onclick="setModoCorteSerra('stock')" style="background:#1e293b; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold;">STOCK</button>
        </div>

        <div id="campos-serra" style="background:#111827; padding:15px; border-radius:10px; border:1px solid #334155;"></div>
        <div id="lista-corte-serra" style="margin-top:15px; max-height:250px; overflow-y:auto;"></div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:15px;">
            <button onclick="exibirSetupSerra()" style="background:#3b82f6; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold;">MUDAR PAINEL</button>
            <button onclick="fecharDiaSerra()" style="background:#E31C24; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold;">FECHAR DIA</button>
        </div>
    `;

    setModoCorteSerra('pedido');
    atualizarTabelaSerra();
}

function setModoCorteSerra(modo) {
    const container = document.getElementById('campos-serra');
    if (!container) return;

    const btnPed = document.getElementById('btn-s-ped-serra');
    const btnStk = document.getElementById('btn-s-stk-serra');

    if (btnPed) btnPed.style.background = modo === 'pedido' ? '#3b82f6' : '#1e293b';
    if (btnStk) btnStk.style.background = modo === 'stock' ? '#3b82f6' : '#1e293b';

    const rals = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
            <select id="s-ral-s-serra" style="padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <option value="9010">SUP: 9010</option>
                <option value="9006">SUP: 9006</option>
            </select>
            <select id="s-ral-i-serra" style="padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <option value="3009">INF: 3009</option>
                <option value="7016">INF: 7016</option>
            </select>
        </div>
    `;

    if (modo === 'pedido') {
        container.innerHTML = `
            <input type="text" id="s-ped-serra" placeholder="Nº Pedido" style="width:100%; margin-bottom:10px; padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
            ${rals}
            <input type="number" id="s-metros-serra" placeholder="Comprimento (m)" style="width:100%; margin-bottom:10px; padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
            <button onclick="addLinhaSerra('pedido')" style="width:100%; background:#E31C24; color:white; border:none; padding:12px; border-radius:5px; font-weight:bold;">ADICIONAR</button>
        `;
    } else {
        container.innerHTML = `
            <select id="s-qualidade-serra" style="width:100%; margin-bottom:10px; padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="Descarte">Descarte</option>
            </select>
            ${rals}
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                <input type="number" id="s-qtd-serra" placeholder="Qtd" style="padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <input type="number" id="s-metros-serra" placeholder="Metros" style="padding:10px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
            </div>
            <button onclick="addLinhaSerra('stock')" style="width:100%; background:#E31C24; color:white; border:none; padding:12px; border-radius:5px; font-weight:bold;">ADICIONAR STOCK</button>
        `;
    }
}

// --- 5. LÓGICA DE DADOS ---
function addLinhaSerra(modo) {
    const metrosInput = document.getElementById('s-metros-serra');
    if (!metrosInput) return;

    const metros = parseFloat(metrosInput.value);
    if (!metros || metros <= 0) return alert("Insira a metragem!");

    const item = {
        tipo: document.getElementById('h-tipo-serra').value,
        esp: document.getElementById('h-esp-serra').value,
        ralS: document.getElementById('s-ral-s-serra').value,
        ralI: document.getElementById('s-ral-i-serra').value,
        metros: metros,
        qtd: modo === 'stock' ? (parseInt(document.getElementById('s-qtd-serra')?.value) || 1) : 1,
        desc: modo === 'pedido'
            ? `PED: ${document.getElementById('s-ped-serra')?.value || "S/N"}`
            : `STOCK: ${document.getElementById('s-qualidade-serra')?.value || "P1"}`
    };

    db_serra_live.push(item);
    localStorage.setItem('atlas_serra_live', JSON.stringify(db_serra_live));
    atualizarTabelaSerra();

    metrosInput.value = "";
    const ped = document.getElementById('s-ped-serra');
    if (ped) ped.value = "";
}

function atualizarTabelaSerra() {
    const lista = document.getElementById('lista-corte-serra');
    const totalDisplay = document.getElementById('resumo-soma-serra');
    if (!lista) return;

    const tipoAtual = document.getElementById('h-tipo-serra')?.value;
    const espAtual = document.getElementById('h-esp-serra')?.value;
    let totalDestePainel = 0;

    lista.innerHTML = db_serra_live.map((it, idx) => {
        const metrosLinha = it.metros * it.qtd;
        if (it.tipo === tipoAtual && it.esp === espAtual) totalDestePainel += metrosLinha;

        return `
            <div style="background:#1e293b; padding:8px; border-radius:5px; margin-bottom:5px; border-left:4px solid #3b82f6; display:flex; justify-content:space-between; align-items:center; color:white; font-size:11px;">
                <span>
                    <b style="color:#10b981;">${metrosLinha.toFixed(2)}m</b>
                    <small>(${it.qtd}x ${it.metros}m)</small> - ${it.desc}
                    <br><small style="color:#94a3b8;">INF: ${it.ralI} / SUP: ${it.ralS}</small>
                </span>
                <i class="fas fa-trash" onclick="removerCorteSerra(${idx})" style="color:#ef4444; cursor:pointer; padding:5px;"></i>
            </div>
        `;
    }).join('');

    if (totalDisplay) totalDisplay.innerText = `Neste Painel: ${totalDestePainel.toFixed(2)}m`;
}

function removerCorteSerra(i) {
    db_serra_live.splice(i, 1);
    localStorage.setItem('atlas_serra_live', JSON.stringify(db_serra_live));
    atualizarTabelaSerra();
}

// --- 6. FECHAR DIA ---
function fecharDiaSerra() {
    if (db_serra_live.length === 0) return alert("Adicione itens antes de fechar!");

    const seletorData = document.getElementById('h-data-rel-serra').value;
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
       operador: document.getElementById('user-display')?.innerText || "OP. SERRA",
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

// --- 7. HISTÓRICO ---
function listarHistoricoSerra() {
    const render = document.getElementById('render-modulo');
    let agrupado = {};

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
                <h2 style="border-bottom:2px solid #E31C24; padding-bottom:10px; margin:0; flex:1; font-size:18px;">📂 Histórico da Serra</h2>
            </div>
    `;

    if (db_serra_hist.length === 0) {
        html += `<div style="text-align:center; padding:50px; color:gray;">Nenhum relatório encontrado no sistema.</div>`;
    }

    Object.keys(agrupado).sort((a, b) => b - a).forEach(ano => {
        html += `
            <div style="margin-bottom:10px;">
                <div onclick="toggleElemento('ano-s-${ano}')" style="background:#1e293b; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer; border:1px solid #334155; display:flex; justify-content:space-between;">
                    <span>📁 ANO ${ano}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div id="ano-s-${ano}" style="display:none; padding-left:10px; margin-top:5px; border-left:2px solid #E31C24;">`;

        Object.keys(agrupado[ano]).sort((a, b) => b - a).forEach(mes => {
            html += `
                <div onclick="toggleElemento('mes-s-${ano}-${mes}')" style="cursor:pointer; padding:10px; color:#3b82f6; background:#0f172a; margin-top:5px; border-radius:4px; font-weight:bold;">
                   📅 ${mesesNome[mes]}
                </div>
                <div id="mes-s-${ano}-${mes}" style="display:none; padding-left:10px; background:#1a202c;">`;

            agrupado[ano][mes].forEach(rel => {
                html += `
                    <div style="padding:12px; border-bottom:1px solid #334155; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:13px;">
                            <b style="color:white;">DIA ${rel.dia}/${rel.mes}</b><br>
                            <small style="color:#94a3b8;">Total: ${rel.totalGeral} m</small>
                        </span>
                        <button onclick='gerarPDF_Serra("${encodeURIComponent(JSON.stringify(rel))}")' style="background:#10b981; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; font-weight:bold; font-size:11px;">
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

// --- 8. AUXILIAR ---
function toggleElemento(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
    }
}
function gerarPDF_Serra(dadosEncoded) {
    const rel = JSON.parse(decodeURIComponent(dadosEncoded));
    const janela = window.open('', '_blank');

    let blocos = {};
    rel.itens.forEach(it => {
        let chave = `${it.tipo} ${it.esp}mm`;
        if (!blocos[chave]) blocos[chave] = { pedidos: [], stock: [] };

        if (it.desc.toUpperCase().includes('PED:')) {
            blocos[chave].pedidos.push(it);
        } else {
            blocos[chave].stock.push(it);
        }
    });

    let htmlConteudo = "";

    for (let nome in blocos) {
        htmlConteudo += `
            <div style="margin-bottom:30px; page-break-inside: avoid;">
                <div style="background:#000; color:#fff; padding:8px; font-weight:bold; text-align:center; font-size:16px; border:2px solid #000;">
                    ${nome.toUpperCase()}
                </div>`;

        if (blocos[nome].pedidos.length > 0) {
            htmlConteudo += `
                <div style="text-align:center; padding:5px; background:#ddd; font-weight:bold; border:2px solid #000; border-top:none; color:#000;">
                    LISTA DE PEDIDOS
                </div>
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
                        ${blocos[nome].pedidos.map(i => `
                            <tr>
                                <td style="border:2px solid #000; text-align:center;">${i.qtd}</td>
                                <td style="border:2px solid #000; text-align:center;">${Number(i.metros).toFixed(2)}m</td>
                                <td style="border:2px solid #000; text-align:center; font-weight:bold;">${(i.qtd * i.metros).toFixed(2)}m</td>
                                <td style="border:2px solid #000; text-align:center;">${i.ralI}/${i.ralS}</td>
                                <td style="border:2px solid #000; text-align:center;">${i.desc}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>`;
        }

        if (blocos[nome].stock.length > 0) {
            htmlConteudo += `
                <div style="text-align:center; padding:5px; background:#ddd; font-weight:bold; border:2px solid #000; border-top:none; color:#000;">
                    PRODUÇÃO STOCK
                </div>
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
                        ${blocos[nome].stock.map(i => `
                            <tr>
                                <td style="border:2px solid #000; text-align:center;">${i.qtd}</td>
                                <td style="border:2px solid #000; text-align:center;">${Number(i.metros).toFixed(2)}m</td>
                                <td style="border:2px solid #000; text-align:center; font-weight:bold;">${(i.qtd * i.metros).toFixed(2)}m</td>
                                <td style="border:2px solid #000; text-align:center;">${i.ralI}/${i.ralS}</td>
                                <td style="border:2px solid #000; text-align:center;">${i.desc}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>`;
        }

        htmlConteudo += `</div>`;
    }

    janela.document.write(`
        <html>
        <head>
            <title>Relatório Serra</title>
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
                <div><b style="font-size:22px;">ATLAS PAINEL</b><br>RELATÓRIO DE SERRA</div>
                <div style="text-align:right; font-weight:bold;">DATA: ${rel.data}<br>OP: ${rel.operador}</div>
            </div>

            <div style="margin-top:20px;">${htmlConteudo}</div>

            <div style="margin-top:20px; background:#000 !important; color:#fff !important; padding:20px; text-align:right; border:3px solid #000;">
                <span style="font-size:18px; font-weight:normal; text-transform:uppercase; display:block; margin-bottom:5px;">Total Geral Produzido</span>
                <b style="font-size:35px; display:block; line-height:1;">${rel.totalGeral} m</b>
            </div>

            <div style="margin-top:80px; text-align:center; width:100%;">
                <div style="display:inline-block; width:350px; border-top:2px solid #000; padding-top:5px;">
                    <b style="text-transform:uppercase; font-size:14px;">${rel.operador}</b><br>
                    <span>Responsável pela Produção</span>
                </div>
            </div>

            <div class="no-print" style="text-align:center;">
                <button onclick="window.print()" style="padding:20px; background:#000; color:#fff; border:3px solid #E31C24; width:100%; font-size:18px; font-weight:bold; border-radius:10px;">
                    🖨️ CONFIRMAR E GERAR PDF
                </button>
            </div>
        </body>
        </html>
    `);

    janela.document.close();
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
        operador: document.getElementById('user-display')?.innerText || "OP. EMBALAGEM",
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

//  Modulo Da Gestao
function renderizarMenuGestao() {
    const render = document.getElementById('render-modulo');
    render.innerHTML = `
        <div id="menu-gestao" style="display:grid; grid-template-columns:1fr 1fr; gap:15px; padding:15px;">
            <div class="card" onclick="exibirCriarUsuario()" style="cursor:pointer; background:#1e293b; border-radius:10px; padding:30px 15px; text-align:center; border:1px solid #334155;">
                <i class="fas fa-user-plus" style="color:#3b82f6; font-size:2.5rem; margin-bottom:15px;"></i>
                <span style="display:block; color:white; font-weight:bold; font-size:13px; text-transform:uppercase;">Criar ID</span>
            </div>
            <div class="card" onclick="listarUsuariosSistema()" style="cursor:pointer; background:#1e293b; border-radius:10px; padding:30px 15px; text-align:center; border:1px solid #334155;">
                <i class="fas fa-users" style="color:#3b82f6; font-size:2.5rem; margin-bottom:15px;"></i>
                <span style="display:block; color:white; font-weight:bold; font-size:13px; text-transform:uppercase;">Lista de Usuários</span>
            </div>
        </div>
        <div id="gestao-conteudo" style="padding:15px;"></div>
    `;
}

function exibirCriarUsuario() {
    const container = document.getElementById('gestao-conteudo');
    if (!container) return;

    container.innerHTML = `
        <div style="background:#111827; padding:20px; border-radius:12px; border:1px solid #334155;">
            <h3 style="color:white; margin-top:0; margin-bottom:15px;">Criar Usuário</h3>

            <input type="text" id="novo-id-usuario" placeholder="ID do funcionário" style="width:100%; margin-bottom:10px; padding:12px; background:#1e293b; color:white; border:1px solid #334155; border-radius:6px;">

            <input type="password" id="nova-senha-usuario" placeholder="Senha" style="width:100%; margin-bottom:10px; padding:12px; background:#1e293b; color:white; border:1px solid #334155; border-radius:6px;">

            <select id="novo-cargo-usuario" style="width:100%; margin-bottom:15px; padding:12px; background:#1e293b; color:white; border:1px solid #334155; border-radius:6px;">
                <option value="operario">Operário</option>
                <option value="supervisor">Supervisor</option>
            </select>

            <button onclick="criarUsuarioSistema()" style="width:100%; background:#10b981; color:white; border:none; padding:14px; border-radius:8px; font-weight:bold;">
                CRIAR USUÁRIO
            </button>
        </div>
    `;
}

function criarUsuarioSistema() {
    const id = document.getElementById('novo-id-usuario')?.value.trim();
    const senha = document.getElementById('nova-senha-usuario')?.value.trim();
    const cargo = document.getElementById('novo-cargo-usuario')?.value;

    if (!id || !senha) {
        alert("Preencha o ID e a senha.");
        return;
    }

    const jaExiste = usuariosSistema.some(u => u.id.toLowerCase() === id.toLowerCase());
    if (jaExiste) {
        alert("Este ID já existe.");
        return;
    }

    usuariosSistema.push({
        id,
        senha,
        cargo,
        bloqueado: false
    });

    localStorage.setItem('atlas_usuarios', JSON.stringify(usuariosSistema));
    alert("Usuário criado com sucesso!");
    exibirCriarUsuario();
}

function listarUsuariosSistema() {
    const container = document.getElementById('gestao-conteudo');
    if (!container) return;

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:10px;">
            ${usuariosSistema.map((u, index) => `
                <div style="background:#1e293b; padding:15px; border-radius:10px; border:1px solid #334155;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <div>
                            <div style="color:white; font-weight:bold;">${u.id.toUpperCase()}</div>
                            <div style="color:#94a3b8; font-size:12px;">Cargo atual: ${u.cargo.toUpperCase()}</div>
                        </div>
                        <div style="color:#94a3b8; font-size:12px;">
    Cargo atual: ${u.cargo.toUpperCase()} | Status: ${u.bloqueado ? 'BLOQUEADO' : 'ATIVO'}
</div>

                    </div>

                        ${u.cargo === 'admin' ? `
                            <button disabled style="background:#475569; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold;">
                                ADMIN FIXO
                            </button>
                        ` : `
                            <select onchange="alterarCargoUsuario(${index}, this.value)" style="padding:10px; background:#0f172a; color:white; border:1px solid #334155; border-radius:6px; font-weight:bold;">
                                <option value="operario" ${u.cargo === 'operario' ? 'selected' : ''}>Operário</option>
                                <option value="supervisor" ${u.cargo === 'supervisor' ? 'selected' : ''}>Supervisor</option>
                            </select>
                        `}
                    </div>

                    <div id="senha-usuario-${index}" style="display:none; color:#f8fafc; background:#0f172a; padding:10px; border-radius:6px; border:1px solid #334155;">
                        Senha: ${u.senha}
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:10px;">
    <button onclick="verSenhaUsuario(${index})" style="background:#3b82f6; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold;">
        VER SENHA
    </button>

    <button onclick="alternarBloqueioUsuario(${index})" style="background:${u.bloqueado ? '#10b981' : '#f59e0b'}; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold;">
        ${u.bloqueado ? 'DESBLOQUEAR' : 'BLOQUEAR'}
    </button>

    <button onclick="excluirUsuario(${index})" style="background:#ef4444; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold;">
        EXCLUIR
    </button>
</div>

                </div>
            `).join('')}
        </div>
    `;
}

function alterarCargoUsuario(index, novoCargo) {
    if (!usuariosSistema[index]) return;
    if (usuariosSistema[index].cargo === 'admin') {
        alert("O cargo ADMIN não pode ser alterado.");
        listarUsuariosSistema();
        return;
    }

    usuariosSistema[index].cargo = novoCargo;
    localStorage.setItem('atlas_usuarios', JSON.stringify(usuariosSistema));
    alert("Cargo atualizado com sucesso.");
    listarUsuariosSistema();
}

function verSenhaUsuario(index) {
    const senhaConfirmacao = prompt("Digite sua senha para ver a senha deste usuário:");
    if (!senhaConfirmacao || !usuarioLogado) return;

    if (senhaConfirmacao !== usuarioLogado.senha) {
        alert("Senha incorreta.");
        return;
    }

    const blocoSenha = document.getElementById(`senha-usuario-${index}`);
    if (blocoSenha) {
        blocoSenha.style.display = blocoSenha.style.display === 'none' ? 'block' : 'none';
    }
}
function aplicarPermissoesUsuario() {
    const cardGestao = document.getElementById('card-gestao');
    if (!cardGestao || !usuarioLogado) return;

    if (usuarioLogado.cargo === 'admin' || usuarioLogado.cargo === 'supervisor') {
        cardGestao.style.display = 'flex';
    } else {
        cardGestao.style.display = 'none';
    }
}
function alternarBloqueioUsuario(index) {
    if (!usuariosSistema[index]) return;

    if (usuariosSistema[index].cargo === 'admin') {
        alert("O usuário ADMIN não pode ser bloqueado.");
        return;
    }

    usuariosSistema[index].bloqueado = !usuariosSistema[index].bloqueado;
    localStorage.setItem('atlas_usuarios', JSON.stringify(usuariosSistema));

    alert(usuariosSistema[index].bloqueado ? "Usuário bloqueado." : "Usuário desbloqueado.");
    listarUsuariosSistema();
}
function excluirUsuario(index) {
    if (!usuariosSistema[index]) return;

    if (usuariosSistema[index].cargo === 'admin') {
        alert("O usuário ADMIN não pode ser excluído.");
        return;
    }

    const confirmar = confirm(`Deseja excluir o usuário ${usuariosSistema[index].id}?`);
    if (!confirmar) return;

    usuariosSistema.splice(index, 1);
    localStorage.setItem('atlas_usuarios', JSON.stringify(usuariosSistema));

    alert("Usuário excluído com sucesso.");
    listarUsuariosSistema();
}
 
// --- MÓDULO PLANO ---
// --- MÓDULO PLANO ---
var db_plano_live = JSON.parse(localStorage.getItem('atlas_plano_live')) || null;
var db_plano_hist = JSON.parse(localStorage.getItem('atlas_plano_hist')) || [];
var destinosPlano = JSON.parse(localStorage.getItem('atlas_plano_destinos')) || ["Ansião", "Leiria", "Algarve", "Sobreda", "Abrantes"];

var OPCOES_TIPO_PLANO = ["5 Ondas", "Fachada", "Telha Canudo"];
var OPCOES_ESPESSURA_PLANO = [30, 40, 50, 60, 80, 100, 120];
var OPCOES_RAL_SUP = ["9010", "9006", "MAD.NATURAL"];
var OPCOES_RAL_INF = ["3009", "9010", "7016", "9006"];
var OPCOES_QUALIDADE = ["P1", "P2", "Descarte"];
var MESES_PT = ["", "JANEIRO", "FEVEREIRO", "MARCO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

function usuarioPodeCriarPlano() {
    if (!usuarioLogado) return false;
    return usuarioLogado.cargo !== 'operador' && usuarioLogado.cargo !== 'operario';
}
function usuarioPodeVerAnalisePlano() {
    if (!usuarioLogado) return false;
    return usuarioLogado.cargo === 'admin' || usuarioLogado.cargo === 'supervisor';
}
function salvarPlanoLive() {
    localStorage.setItem('atlas_plano_live', JSON.stringify(db_plano_live));
}
function salvarDestinosPlano() {
    localStorage.setItem('atlas_plano_destinos', JSON.stringify(destinosPlano));
}
function formatarDataPlanoBR(dataISO) {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}
function togglePlanoElemento(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
}
function renderizarMenuPlanoNovo() {
    const render = document.getElementById('render-modulo');
    if (!render) return;
    render.innerHTML = `
        <div id="container-menu-plano" style="display:grid; grid-template-columns:1fr 1fr; gap:15px; padding:15px;">
            <div class="card" onclick="exibirMenuCriacaoPlano()" style="cursor:pointer; background:#1e293b; border-radius:10px; padding:30px 15px; text-align:center; border:1px solid #334155; ${usuarioPodeCriarPlano() ? '' : 'opacity:0.55;'}">
                <i class="fas fa-plus" style="color:#3b82f6; font-size:2.5rem; margin-bottom:15px;"></i>
                <span style="display:block; color:white; font-weight:bold; font-size:13px; text-transform:uppercase;">Criar Plano</span>
                <small style="color:#94a3b8;">${usuarioPodeCriarPlano() ? 'Pedidos e stock' : 'Sem permissao para criar'}</small>
            </div>
            <div class="card" onclick="listarHistoricoPlano()" style="cursor:pointer; background:#1e293b; border-radius:10px; padding:30px 15px; text-align:center; border:1px solid #334155;">
                <i class="fas fa-history" style="color:#3b82f6; font-size:2.5rem; margin-bottom:15px;"></i>
                <span style="display:block; color:white; font-weight:bold; font-size:13px; text-transform:uppercase;">Historico</span>
                <small style="color:#94a3b8;">Planos finalizados</small>
            </div>
            ${usuarioPodeVerAnalisePlano() ? `
            <div class="card" onclick="listarAnaliseMensalComprador()" style="cursor:pointer; background:#1e293b; border-radius:10px; padding:30px 15px; text-align:center; border:1px solid #334155; grid-column:1 / -1;">
                <i class="fas fa-chart-pie" style="color:#10b981; font-size:2.5rem; margin-bottom:15px;"></i>
                <span style="display:block; color:white; font-weight:bold; font-size:13px; text-transform:uppercase;">Historico por Comprador</span>
                <small style="color:#94a3b8;">Resumo mensal da empresa</small>
            </div>` : ''}
        </div>
        <div id="container-acao-plano" style="display:none; padding:15px;"></div>
    `;
}
function alternarAbaPlano(mostrarAcao) {
    const menu = document.getElementById('container-menu-plano');
    const acao = document.getElementById('container-acao-plano');
    if (!menu || !acao) return false;
    menu.style.display = mostrarAcao ? 'none' : 'grid';
    acao.style.display = mostrarAcao ? 'block' : 'none';
    if (!mostrarAcao) acao.innerHTML = '';
    return true;
}
function criarEstruturaPlanoSeNecessario() {
    if (!db_plano_live) {
        db_plano_live = {
            id: Date.now(),
            dataISO: document.getElementById('plano-data')?.value || new Date().toISOString().slice(0, 10),
            operador: document.getElementById('user-display')?.innerText || 'SEM USUARIO',
            linhasAbertas: [],
            gruposFinalizados: [],
            modoAtual: 'pedido',
            pedidoAtual: null
        };
        salvarPlanoLive();
    }
}
function exibirMenuCriacaoPlano() {
    if (!usuarioPodeCriarPlano()) return alert('Sem permissao para criar plano.');
    if (!alternarAbaPlano(true)) return;
    const c = document.getElementById('container-acao-plano');
    const dataAtual = db_plano_live?.dataISO || new Date().toISOString().slice(0, 10);
    c.innerHTML = `
        <div style="display:flex; align-items:center; margin-bottom:15px;">
            <button onclick="alternarAbaPlano(false)" style="background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer; margin-right:15px;"><i class="fas fa-arrow-left"></i></button>
            <h3 style="color:#E31C24; font-size:14px; margin:0; text-transform:uppercase;">Criar Plano</h3>
        </div>
        <div style="margin-bottom:15px; padding:10px; background:#1e293b; border-radius:8px; border:1px solid #334155;">
            <label style="color:#94a3b8; font-size:12px;">DATA DO PLANO</label>
            <input type="date" id="plano-data" value="${dataAtual}" style="background:#0f172a; color:white; border:1px solid #3b82f6; padding:10px; border-radius:4px; width:100%; margin-top:8px;">
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
            <div class="card" onclick="abrirFormularioPlano('pedido')" style="cursor:pointer; background:#111827; border-radius:10px; padding:25px 15px; text-align:center; border:1px solid #334155;">
                <i class="fas fa-file-signature" style="color:#10b981; font-size:2.2rem; margin-bottom:12px;"></i><span style="display:block; color:white; font-weight:bold; font-size:13px; text-transform:uppercase;">Pedidos</span>
            </div>
            <div class="card" onclick="abrirFormularioPlano('stock')" style="cursor:pointer; background:#111827; border-radius:10px; padding:25px 15px; text-align:center; border:1px solid #334155;">
                <i class="fas fa-boxes-stacked" style="color:#f59e0b; font-size:2.2rem; margin-bottom:12px;"></i><span style="display:block; color:white; font-weight:bold; font-size:13px; text-transform:uppercase;">Stock</span>
            </div>
        </div>
        ${db_plano_live ? `<div style="margin-top:15px;"><button onclick="retomarPlanoEmAndamento()" style="width:100%; background:#3b82f6; color:white; border:none; padding:14px; border-radius:8px; font-weight:bold;">RETOMAR PLANO EM ANDAMENTO</button></div>` : ''}
    `;
}
function abrirFormularioPlano(modo) {
    if (!usuarioPodeCriarPlano()) return alert('Sem permissao para criar plano.');
    criarEstruturaPlanoSeNecessario();
    db_plano_live.modoAtual = modo;
    db_plano_live.dataISO = document.getElementById('plano-data')?.value || db_plano_live.dataISO;
    salvarPlanoLive();
    if (!alternarAbaPlano(true)) return;
    const c = document.getElementById('container-acao-plano');
    const pedidoAtual = db_plano_live.pedidoAtual;
    c.innerHTML = `
        <div style="display:flex; align-items:center; margin-bottom:15px;">
            <button onclick="exibirMenuCriacaoPlano()" style="background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer; margin-right:15px;"><i class="fas fa-arrow-left"></i></button>
            <h3 style="color:#E31C24; font-size:14px; margin:0; text-transform:uppercase;">${modo === 'pedido' ? 'Plano de Pedidos' : 'Plano de Stock'}</h3>
        </div>
        <div style="background:#1e293b; padding:12px; border-radius:8px; margin-bottom:15px; border-left:4px solid ${modo === 'pedido' ? '#10b981' : '#f59e0b'};">
            <div style="color:white; font-weight:bold; font-size:13px;">Plano em andamento</div>
            <div style="color:#94a3b8; font-size:12px; margin-top:4px;">Data: ${formatarDataPlanoBR(db_plano_live.dataISO)} | Operador: ${db_plano_live.operador}</div>
            ${pedidoAtual && modo === 'pedido' ? `<div style="color:#10b981; font-size:12px; margin-top:6px;"><b>Pedido travado:</b> ${pedidoAtual.numero} | ${pedidoAtual.destino}</div>` : ''}
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
            <div><label style="color:#94a3b8; font-size:11px;">TIPO DE CHAPA</label><select id="plano-tipo" onchange="atualizarTelaPlanoAtual()" style="background:#1e293b; color:white; border:1px solid #334155; width:100%; padding:12px; border-radius:6px; margin-top:5px;">${OPCOES_TIPO_PLANO.map(v=>`<option value="${v}">${v}</option>`).join('')}</select></div>
            <div><label style="color:#94a3b8; font-size:11px;">ESPESSURA</label><select id="plano-esp" onchange="atualizarTelaPlanoAtual()" style="background:#1e293b; color:white; border:1px solid #334155; width:100%; padding:12px; border-radius:6px; margin-top:5px;">${OPCOES_ESPESSURA_PLANO.map(v=>`<option value="${v}">${v} mm</option>`).join('')}</select></div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
            <div><label style="color:#94a3b8; font-size:11px;">RAL SUPERIOR</label><select id="plano-ral-sup" style="background:#1e293b; color:white; border:1px solid #334155; width:100%; padding:12px; border-radius:6px; margin-top:5px;">${OPCOES_RAL_SUP.map(v=>`<option value="${v}">${v}</option>`).join('')}</select></div>
            <div><label style="color:#94a3b8; font-size:11px;">RAL INFERIOR</label><select id="plano-ral-inf" style="background:#1e293b; color:white; border:1px solid #334155; width:100%; padding:12px; border-radius:6px; margin-top:5px;">${OPCOES_RAL_INF.map(v=>`<option value="${v}">${v}</option>`).join('')}</select></div>
        </div>
        ${modo === 'pedido' ? `
        <div style="background:#111827; padding:15px; border-radius:10px; border:1px solid #334155;">
            <input type="text" id="plano-pedido-numero" placeholder="Numero do pedido" value="${pedidoAtual?.numero || ''}" ${pedidoAtual ? 'disabled' : ''} style="width:100%; margin-bottom:10px; padding:12px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
            <select id="plano-destino-fixo" ${pedidoAtual ? 'disabled' : ''} onchange="sincronizarDestinoPlano()" style="width:100%; margin-bottom:10px; padding:12px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <option value="">Selecione o comprador fixo</option>
                ${destinosPlano.map(v=>`<option value="${v}" ${pedidoAtual?.destino===v ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
            <input type="text" id="plano-destino-manual" placeholder="Ou digite novo comprador" value="${pedidoAtual && !destinosPlano.includes(pedidoAtual.destino) ? pedidoAtual.destino : ''}" ${pedidoAtual ? 'disabled' : ''} style="width:100%; margin-bottom:10px; padding:12px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <input type="number" id="plano-pedido-qtd" placeholder="Quantidade de chapas" style="padding:12px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <input type="number" id="plano-pedido-metros" placeholder="Metros por chapa" style="padding:12px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
            </div>
            <button onclick="adicionarLinhaPlano('pedido')" style="width:100%; background:#10b981; color:white; border:none; padding:12px; border-radius:5px; font-weight:bold; margin-top:10px;">ADICIONAR PEDIDO</button>
        </div>` : `
        <div style="background:#111827; padding:15px; border-radius:10px; border:1px solid #334155;">
            <input type="date" id="plano-stock-data" value="${db_plano_live.dataISO}" style="width:100%; margin-bottom:10px; padding:12px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
            <select id="plano-stock-qualidade" style="width:100%; margin-bottom:10px; padding:12px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">${OPCOES_QUALIDADE.map(v=>`<option value="${v}">${v}</option>`).join('')}</select>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <input type="number" id="plano-stock-qtd" placeholder="Quantidade de chapas" style="padding:12px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
                <input type="number" id="plano-stock-metros" placeholder="Metros por chapa" style="padding:12px; background:#1e293b; color:white; border:1px solid #334155; border-radius:5px;">
            </div>
            <button onclick="adicionarLinhaPlano('stock')" style="width:100%; background:#f59e0b; color:white; border:none; padding:12px; border-radius:5px; font-weight:bold; margin-top:10px;">ADICIONAR STOCK</button>
        </div>`}
        <div id="plano-resumo-atual" style="margin-top:15px;"></div>
        <div id="plano-lista-aberta" style="margin-top:15px;"></div>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-top:15px;">
            <button onclick="finalizarPedidoPlano()" style="background:#3b82f6; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold;">FINALIZAR ${modo === 'pedido' ? 'PEDIDO' : 'STOCK'}</button>
            <button onclick="finalizarEspessuraPlano()" style="background:#7c3aed; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold;">FINALIZAR ESPESSURA</button>
            <button onclick="finalizarPlanoCompleto()" style="background:#E31C24; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold;">FINALIZAR PLANO</button>
        </div>
        <div id="plano-grupos-finalizados" style="margin-top:15px;"></div>
    `;
    atualizarTelaPlanoAtual();
}
function sincronizarDestinoPlano() {
    const fixo = document.getElementById('plano-destino-fixo');
    const manual = document.getElementById('plano-destino-manual');
    if (fixo && manual && fixo.value) manual.value = '';
}
function adicionarLinhaPlano(modo) {
    criarEstruturaPlanoSeNecessario();
    const tipo = document.getElementById('plano-tipo')?.value;
    const espessura = document.getElementById('plano-esp')?.value;
    const ralSuperior = document.getElementById('plano-ral-sup')?.value;
    const ralInferior = document.getElementById('plano-ral-inf')?.value;
    let item = null;
    if (modo === 'pedido') {
        const numero = db_plano_live.pedidoAtual?.numero || document.getElementById('plano-pedido-numero')?.value.trim();
        const destino = db_plano_live.pedidoAtual?.destino || document.getElementById('plano-destino-manual')?.value.trim() || document.getElementById('plano-destino-fixo')?.value;
        const quantidade = parseInt(document.getElementById('plano-pedido-qtd')?.value, 10);
        const metros = parseFloat(document.getElementById('plano-pedido-metros')?.value);
        if (!numero) return alert('Informe o numero do pedido.');
        if (!destino) return alert('Informe para onde vai o pedido.');
        if (!quantidade || quantidade <= 0) return alert('Informe a quantidade de chapas.');
        if (!metros || metros <= 0) return alert('Informe os metros por chapa.');
        if (!db_plano_live.pedidoAtual) {
            db_plano_live.pedidoAtual = { numero, destino };
            if (!destinosPlano.includes(destino)) {
                destinosPlano.push(destino);
                destinosPlano.sort();
                salvarDestinosPlano();
            }
        }
        item = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            modo, tipo, espessura, ralSuperior, ralInferior,
            quantidadeChapas: quantidade, metrosUnidade: metros,
            totalMetros: Number((quantidade * metros).toFixed(2)),
            pedidoNumero: numero, destino: destino,
            descricao: `PEDIDO ${numero}`
        };
    } else {
        const quantidade = parseInt(document.getElementById('plano-stock-qtd')?.value, 10);
        const metros = parseFloat(document.getElementById('plano-stock-metros')?.value);
        const qualidade = document.getElementById('plano-stock-qualidade')?.value || 'P1';
        if (!quantidade || quantidade <= 0) return alert('Informe a quantidade de chapas.');
        if (!metros || metros <= 0) return alert('Informe os metros por chapa.');
        item = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            modo, tipo, espessura, ralSuperior, ralInferior,
            quantidadeChapas: quantidade, metrosUnidade: metros,
            totalMetros: Number((quantidade * metros).toFixed(2)),
            qualidade, destino: '', pedidoNumero: '',
            descricao: `STOCK ${qualidade}`
        };
    }
    db_plano_live.linhasAbertas.push(item);
    salvarPlanoLive();
    if (modo === 'pedido') {
        document.getElementById('plano-pedido-qtd').value = '';
        document.getElementById('plano-pedido-metros').value = '';
    } else {
        document.getElementById('plano-stock-qtd').value = '';
        document.getElementById('plano-stock-metros').value = '';
    }
    atualizarTelaPlanoAtual();
    if (modo === 'pedido') abrirFormularioPlano('pedido');
}
function editarLinhaPlano(idLinha) {
    const item = db_plano_live?.linhasAbertas.find(x => x.id === idLinha);
    if (!item) return;
    const qtd = prompt('Quantidade de chapas:', item.quantidadeChapas);
    if (qtd === null) return;
    const mts = prompt('Metros por chapa:', item.metrosUnidade);
    if (mts === null) return;
    item.quantidadeChapas = Number(qtd);
    item.metrosUnidade = Number(mts);
    item.totalMetros = Number((item.quantidadeChapas * item.metrosUnidade).toFixed(2));
    salvarPlanoLive();
    atualizarTelaPlanoAtual();
}
function removerLinhaPlano(idLinha) {
    if (!db_plano_live) return;
    db_plano_live.linhasAbertas = db_plano_live.linhasAbertas.filter(item => item.id !== idLinha);
    if (db_plano_live.modoAtual === 'pedido') {
        const aindaTemPedido = db_plano_live.linhasAbertas.some(x => x.modo === 'pedido' && x.pedidoNumero === db_plano_live.pedidoAtual?.numero);
        if (!aindaTemPedido) db_plano_live.pedidoAtual = null;
    }
    salvarPlanoLive();
    atualizarTelaPlanoAtual();
    if (db_plano_live.modoAtual === 'pedido') abrirFormularioPlano('pedido');
}
function atualizarTelaPlanoAtual() {
    if (!db_plano_live) return;
    const tipoAtual = document.getElementById('plano-tipo')?.value;
    const espAtual = document.getElementById('plano-esp')?.value;
    const modoAtual = db_plano_live.modoAtual || 'pedido';
    const linhasDoBloco = db_plano_live.linhasAbertas.filter(item => item.modo === modoAtual && item.tipo === tipoAtual && String(item.espessura) === String(espAtual));
    const totalBloco = linhasDoBloco.reduce((a, b) => a + b.totalMetros, 0);
    const totalPlano = calcularTotalPlano(db_plano_live);
    document.getElementById('plano-resumo-atual').innerHTML = `<div style="background:#1e293b; padding:12px; border-radius:8px; border:1px solid #334155; color:white; display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;"><span><b>Bloco atual:</b> ${tipoAtual} ${espAtual} mm</span><span style="color:#10b981;"><b>Total do bloco:</b> ${totalBloco.toFixed(2)} m</span><span style="color:#3b82f6;"><b>Total do plano:</b> ${totalPlano.toFixed(2)} m</span></div>`;
    document.getElementById('plano-lista-aberta').innerHTML = linhasDoBloco.length === 0 ? `<div style="background:#111827; color:#94a3b8; padding:15px; border-radius:8px; border:1px dashed #334155;">Nenhuma linha adicionada neste bloco ainda.</div>` : linhasDoBloco.map(item => `
        <div style="background:#1e293b; padding:10px; border-radius:6px; margin-bottom:8px; border-left:4px solid ${item.modo === 'pedido' ? '#10b981' : '#f59e0b'}; display:flex; justify-content:space-between; gap:12px; align-items:center; color:white; font-size:12px;">
            <span><b>${item.descricao}${item.destino ? ' | ' + item.destino : ''}</b><br><small>${item.ralInferior}/${item.ralSuperior} | ${item.quantidadeChapas} x ${item.metrosUnidade} m = ${item.totalMetros.toFixed(2)} m</small></span>
            <span style="display:flex; gap:8px;">
                <i class="fas fa-pen" onclick="editarLinhaPlano(${item.id})" style="color:#f59e0b; cursor:pointer; padding:5px;"></i>
                <i class="fas fa-trash" onclick="removerLinhaPlano(${item.id})" style="color:#ef4444; cursor:pointer; padding:5px;"></i>
            </span>
        </div>`).join('');
    document.getElementById('plano-grupos-finalizados').innerHTML = db_plano_live.gruposFinalizados.length === 0 ? '' : `<div style="margin-bottom:8px; color:white; font-weight:bold;">Blocos ja finalizados</div>${db_plano_live.gruposFinalizados.map((g,i)=>`<div style="background:#111827; padding:12px; border-radius:8px; margin-bottom:8px; border:1px solid #334155; color:white;"><div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;"><span><b>${g.tipo}</b> ${g.espessura} mm</span><span>${g.modo.toUpperCase()}</span><span style="color:#10b981;">${g.totalMetros.toFixed(2)} m</span></div><small style="color:#94a3b8;">${g.itens.length} linha(s)</small><button onclick="removerGrupoFinalizadoPlano(${i})" style="margin-top:8px; background:#334155; color:white; border:none; padding:8px 10px; border-radius:6px; cursor:pointer;">REMOVER BLOCO</button></div>`).join('')}`;
}
function finalizarPedidoPlano() {
    if (!db_plano_live) return alert('Nenhum plano em andamento.');
    if (db_plano_live.modoAtual === 'pedido') {
        if (!db_plano_live.pedidoAtual) return alert('Nenhum pedido aberto.');
        const num = db_plano_live.pedidoAtual.numero;
        const tem = db_plano_live.linhasAbertas.some(x => x.modo === 'pedido' && x.pedidoNumero === num);
        if (!tem) return alert('Adicione itens antes de finalizar o pedido.');
        db_plano_live.pedidoAtual = null;
        salvarPlanoLive();
        abrirFormularioPlano('pedido');
        alert('Pedido finalizado. Agora pode abrir outro pedido.');
        return;
    }
    moverBlocoAtualParaFinalizados(false);
}
function finalizarEspessuraPlano() {
    moverBlocoAtualParaFinalizados(true);
}
function moverBlocoAtualParaFinalizados(mensagemEspessura) {
    if (!db_plano_live) return alert('Nenhum plano em andamento.');
    const tipoAtual = document.getElementById('plano-tipo')?.value;
    const espAtual = document.getElementById('plano-esp')?.value;
    const modoAtual = db_plano_live.modoAtual || 'pedido';
    const linhasDoBloco = db_plano_live.linhasAbertas.filter(item => item.modo === modoAtual && item.tipo === tipoAtual && String(item.espessura) === String(espAtual));
    if (linhasDoBloco.length === 0) return alert('Nao ha linhas para finalizar neste bloco.');
    const ids = new Set(linhasDoBloco.map(item => item.id));
    db_plano_live.linhasAbertas = db_plano_live.linhasAbertas.filter(item => !ids.has(item.id));
    db_plano_live.gruposFinalizados.push({ id: Date.now(), modo: modoAtual, tipo: tipoAtual, espessura: espAtual, itens: linhasDoBloco, totalMetros: Number(linhasDoBloco.reduce((a,b)=>a+b.totalMetros,0).toFixed(2)), finalizadoEm: new Date().toLocaleString('pt-BR') });
    salvarPlanoLive();
    atualizarTelaPlanoAtual();
    alert(mensagemEspessura ? 'Espessura finalizada.' : 'Bloco finalizado.');
}
function removerGrupoFinalizadoPlano(indice) {
    if (!db_plano_live) return;
    db_plano_live.gruposFinalizados.splice(indice, 1);
    salvarPlanoLive();
    atualizarTelaPlanoAtual();
}
function finalizarPlanoCompleto() {
    if (!db_plano_live) return alert('Nenhum plano em andamento.');
    if (db_plano_live.linhasAbertas.length > 0 && !confirm('Ainda existem linhas abertas. Deseja finalizar o plano mesmo assim?')) return;
    const todosOsItens = [...db_plano_live.gruposFinalizados.flatMap(g=>g.itens), ...db_plano_live.linhasAbertas];
    if (todosOsItens.length === 0) return alert('Adicione algum item antes de finalizar o plano.');
    const [ano, mes, dia] = db_plano_live.dataISO.split('-');
    const planoFinal = {
        id: Date.now(), dataISO: db_plano_live.dataISO, data: `${dia}/${mes}/${ano}`, dia, mes: parseInt(mes,10), ano,
        operador: db_plano_live.operador, itens: todosOsItens,
        tiposLancamento: Array.from(new Set(todosOsItens.map(x=>x.modo))),
        totalGeral: Number(todosOsItens.reduce((a,b)=>a+b.totalMetros,0).toFixed(2)),
        resumo: gerarResumoPlano(todosOsItens)
    };
    db_plano_hist.push(planoFinal);
    localStorage.setItem('atlas_plano_hist', JSON.stringify(db_plano_hist));
    db_plano_live = null;
    localStorage.removeItem('atlas_plano_live');
    alert('Plano finalizado e enviado para o historico.');
    renderizarMenuPlanoNovo();
}
function gerarResumoPlano(itens) {
    const porEspessura = {}, porCor = {};
    itens.forEach(item => {
        const e = `${item.tipo} ${item.espessura} mm`;
        const c = `${item.tipo} ${item.espessura} mm|${item.ralInferior}/${item.ralSuperior}`;
        porEspessura[e] = (porEspessura[e] || 0) + item.totalMetros;
        porCor[c] = (porCor[c] || 0) + item.totalMetros;
    });
    return {
        porEspessura: Object.entries(porEspessura).map(([nome,total]) => ({ nome, total:Number(total.toFixed(2)) })),
        porCor: Object.entries(porCor).map(([chave,total]) => { const [painel, cores] = chave.split('|'); return { painel, cores, total:Number(total.toFixed(2)) }; })
    };
}
function calcularTotalPlano(plano) {
    if (!plano) return 0;
    return Number((plano.gruposFinalizados.reduce((a,b)=>a+b.totalMetros,0) + plano.linhasAbertas.reduce((a,b)=>a+b.totalMetros,0)).toFixed(2));
}
function listarHistoricoPlano() {
    if (!alternarAbaPlano(true)) return;
    const c = document.getElementById('container-acao-plano');
    const agrupado = {};
    db_plano_hist.forEach(rel => {
        agrupado[rel.ano] ||= {};
        agrupado[rel.ano][rel.mes] ||= {};
        agrupado[rel.ano][rel.mes][rel.dia] ||= [];
        agrupado[rel.ano][rel.mes][rel.dia].push(rel);
    });
    let html = `<div style="color:white;"><div style="display:flex; align-items:center; margin-bottom:20px;"><button onclick="alternarAbaPlano(false)" style="background:none; border:none; color:#94a3b8; font-size:20px; cursor:pointer; margin-right:15px;"><i class="fas fa-arrow-left"></i></button><h2 style="border-bottom:2px solid #E31C24; padding-bottom:10px; margin:0; flex:1; font-size:18px; text-transform:uppercase;">Historico de Planos</h2></div>`;
    if (db_plano_hist.length === 0) html += `<div style="text-align:center; padding:50px; color:gray;">Nenhum plano encontrado.</div>`;
    Object.keys(agrupado).sort((a,b)=>b-a).forEach(ano => {
        html += `<div style="margin-bottom:10px;"><div onclick="togglePlanoElemento('ano-plano-${ano}')" style="background:#1e293b; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer; border:1px solid #334155; display:flex; justify-content:space-between;"><span>ANO ${ano}</span><i class="fas fa-chevron-down"></i></div><div id="ano-plano-${ano}" style="display:none; padding-left:10px; margin-top:5px; border-left:2px solid #E31C24;">`;
        Object.keys(agrupado[ano]).sort((a,b)=>b-a).forEach(mes => {
            html += `<div onclick="togglePlanoElemento('mes-plano-${ano}-${mes}')" style="cursor:pointer; padding:10px; color:#3b82f6; background:#0f172a; margin-top:5px; border-radius:4px; font-weight:bold;">${MESES_PT[mes]}</div><div id="mes-plano-${ano}-${mes}" style="display:none; padding-left:10px; background:#1a202c;">`;
            Object.keys(agrupado[ano][mes]).sort((a,b)=>b-a).forEach(dia => {
                html += `<div onclick="togglePlanoElemento('dia-plano-${ano}-${mes}-${dia}')" style="cursor:pointer; padding:10px; color:white; border-bottom:1px solid #334155;">DIA ${dia}/${String(mes).padStart(2,'0')}</div><div id="dia-plano-${ano}-${mes}-${dia}" style="display:none; padding:8px 0 8px 10px;">`;
                agrupado[ano][mes][dia].forEach(rel => {
                    html += `<div style="background:#111827; border:1px solid #334155; border-radius:8px; padding:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;"><span style="font-size:13px;"><b style="color:white;">${rel.data}</b><br><small style="color:#94a3b8;">${Number(rel.totalGeral || 0).toFixed(2)} m</small></span><button onclick='gerarPDF_Plano("${encodeURIComponent(JSON.stringify(rel))}")' style="background:#10b981; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer; font-weight:bold; font-size:11px;">PDF</button></div>`;
                });
                html += `</div>`;
            });
            html += `</div>`;
        });
        html += `</div></div>`;
    });
    c.innerHTML = html + `</div>`;
}
function listarAnaliseMensalComprador() {
    if (!usuarioPodeVerAnalisePlano()) return alert('Sem permissao.');
    if (!alternarAbaPlano(true)) return;
    const c = document.getElementById('container-acao-plano');
    const meses = {};
    db_plano_hist.forEach(rel => {
        const chaveMes = `${rel.ano}-${String(rel.mes).padStart(2,'0')}`;
        meses[chaveMes] ||= {};
        rel.itens.filter(i=>i.modo==='pedido' && i.destino).forEach(item => {
            meses[chaveMes][item.destino] ||= { total:0, tipos:{}, cores:{} };
            meses[chaveMes][item.destino].total += item.totalMetros;
            const t = item.tipo;
            const cor = `${item.ralInferior}/${item.ralSuperior}`;
            meses[chaveMes][item.destino].tipos[t] ||= 0;
            meses[chaveMes][item.destino].tipos[t] += item.totalMetros;
            meses[chaveMes][item.destino].cores[`${t}|${cor}`] ||= 0;
            meses[chaveMes][item.destino].cores[`${t}|${cor}`] += item.totalMetros;
        });
    });
    let html = `<div style="color:white;"><div style="display:flex; align-items:center; margin-bottom:20px;"><button onclick="alternarAbaPlano(false)" style="background:none; border:none; color:#94a3b8; font-size:20px; cursor:pointer; margin-right:15px;"><i class="fas fa-arrow-left"></i></button><h2 style="border-bottom:2px solid #10b981; padding-bottom:10px; margin:0; flex:1; font-size:18px; text-transform:uppercase;">Historico por Comprador</h2></div>`;
    Object.keys(meses).sort().reverse().forEach(chave => {
        const [ano, mes] = chave.split('-');
        html += `<div style="margin-bottom:10px;"><div onclick="togglePlanoElemento('analise-${chave}')" style="background:#1e293b; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer; border:1px solid #334155;">${MESES_PT[parseInt(mes,10)]} / ${ano}</div><div id="analise-${chave}" style="display:none; margin-top:8px;">`;
        Object.keys(meses[chave]).sort((a,b)=>meses[chave][b].total-meses[chave][a].total).forEach(dest => {
            const d = meses[chave][dest];
            html += `<div style="background:#111827; border:1px solid #334155; border-radius:8px; padding:12px; margin-bottom:10px;"><div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;"><span><b>${dest}</b></span><span style="color:#10b981;"><b>${d.total.toFixed(2)} m</b></span></div><div style="margin-top:8px; color:#94a3b8; font-size:12px;">${Object.entries(d.tipos).map(([t,v])=>`${t}: ${v.toFixed(2)} m`).join(' | ')}</div><div style="margin-top:8px; color:white; font-size:12px;">${Object.entries(d.cores).map(([k,v])=>{ const [tipo, cor] = k.split('|'); return `${tipo} - ${cor}: ${v.toFixed(2)} m`; }).join('<br>')}</div></div>`;
        });
        html += `</div></div>`;
    });
    c.innerHTML = html + `</div>`;
}
function visualizarPlanoDigital(dadosEncoded) {
    gerarPDF_Plano(dadosEncoded);
}
function gerarPDF_Plano(dadosEncoded) {
    const rel = JSON.parse(decodeURIComponent(dadosEncoded));
    const janela = window.open('', '_blank');
    janela.document.write(montarHTMLPlano(rel, true));
    janela.document.close();
}
function montarHTMLPlano(rel, comBotaoImpressao) {
    const gruposPorPainel = {};

    rel.itens.forEach(item => {
        const painel = `${item.tipo} ${item.espessura} mm`;
        if (!gruposPorPainel[painel]) gruposPorPainel[painel] = [];

        gruposPorPainel[painel].push(item);
    });

    let htmlGrupos = '';

    Object.keys(gruposPorPainel).forEach(nomePainel => {
        const itensPainel = gruposPorPainel[nomePainel];

        const pedidosAgrupados = {};
        const stockAgrupado = [];

        itensPainel.forEach(item => {
            if (item.modo === 'pedido') {
                const chavePedido = `${item.pedidoNumero}|||${item.destino}`;
                if (!pedidosAgrupados[chavePedido]) pedidosAgrupados[chavePedido] = [];
                pedidosAgrupados[chavePedido].push(item);
            } else {
                stockAgrupado.push(item);
            }
        });

        htmlGrupos += `
            <div style="margin-bottom:24px; page-break-inside:avoid;">
                <div style="background:#000; color:#fff; padding:8px; font-weight:bold; text-align:center; font-size:16px; border:2px solid #000;">
                    ${nomePainel.toUpperCase()}
                </div>
        `;

        Object.keys(pedidosAgrupados).forEach(chavePedido => {
            const itensPedido = pedidosAgrupados[chavePedido];

            itensPedido.sort((a, b) => Number(b.metrosUnidade) - Number(a.metrosUnidade));

            const pedidoNumero = itensPedido[0].pedidoNumero || 'S/N';
const destino = itensPedido[0].destino || '';
const totalPedido = itensPedido.reduce((acc, item) => acc + Number(item.totalMetros || 0), 0);

htmlGrupos += `
    <div style="margin-top:12px; background:#f1f5f9; color:#000; padding:8px; text-align:center; font-weight:bold; border:2px solid #000; border-bottom:none;">
        PEDIDO ${pedidoNumero}${destino ? ' - ' + destino : ''} - TOTAL ${totalPedido.toFixed(2)} m
    </div>

                <table style="width:100%; border-collapse:collapse; font-size:13px; color:#000; margin-bottom:12px;">
                    <thead>
                        <tr style="background:#eee;">
                            <th style="border:2px solid #000;">RAL</th>
                            <th style="border:2px solid #000;">Qtd</th>
                            <th style="border:2px solid #000;">Mts Un.</th>
                            <th style="border:2px solid #000;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itensPedido.map(item => `
    <tr>
        <td style="border:2px solid #000; text-align:center;">${item.ralInferior}/${item.ralSuperior}</td>
        <td style="border:2px solid #000; text-align:center;">${item.quantidadeChapas} un.</td>
        <td style="border:2px solid #000; text-align:center; font-weight:bold;">${formatarMedidaRelatorio(item.metrosUnidade)}un</td>
        <td style="border:2px solid #000; text-align:center; font-weight:bold;">${formatarTotalRelatorio(item.totalMetros)}</td>
  </tr>
`).join('')}

                    </tbody>
                </table>
            `;
        });

        if (stockAgrupado.length > 0) {
            stockAgrupado.sort((a, b) => Number(b.metrosUnidade) - Number(a.metrosUnidade));

            htmlGrupos += `
                <div style="margin-top:12px; background:#f1f5f9; color:#000; padding:8px; text-align:center; font-weight:bold; border:2px solid #000; border-bottom:none;">
                    STOCK
                </div>
                <table style="width:100%; border-collapse:collapse; font-size:13px; color:#000;">
                    <thead>
                        <tr style="background:#eee;">
                            <th style="border:2px solid #000;">Qualidade</th>
                            <th style="border:2px solid #000;">RAL</th>
                            <th style="border:2px solid #000;">Qtd</th>
                            <th style="border:2px solid #000;">Mts Un.</th>
                            <th style="border:2px solid #000;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${stockAgrupado.map(item => `
                            <tr>
                                <td style="border:2px solid #000; text-align:center;">${item.qualidade || '-'}</td>
                                <td style="border:2px solid #000; text-align:center;">${item.ralInferior}/${item.ralSuperior}</td>
                                <td style="border:2px solid #000; text-align:center;">${item.quantidadeChapas} un.</td>
                                <td style="border:2px solid #000; text-align:center; font-weight:bold;">${formatarMedidaRelatorio(item.metrosUnidade)}</td>
                               <td style="border:2px solid #000; text-align:center; font-weight:bold;">${formatarTotalRelatorio(item.totalMetros)}</td>

                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        htmlGrupos += `</div>`;
    });

    const resumoCores = (rel.resumo?.porCor || []).map(item => `
        <tr>
            <td style="border:2px solid #000; text-align:center;">${item.painel}</td>
            <td style="border:2px solid #000; text-align:center;">${item.cores}</td>
            <td style="border:2px solid #000; text-align:center; font-weight:bold;">${item.total.toFixed(2)} m</td>
        </tr>
    `).join('');

    const resumoEsp = (rel.resumo?.porEspessura || []).map(item => `
        <tr>
            <td style="border:2px solid #000; text-align:center;">${item.nome}</td>
            <td style="border:2px solid #000; text-align:center; font-weight:bold;">${item.total.toFixed(2)} m</td>
        </tr>
    `).join('');

    return `
        <html>
        <head>
            <title>Plano de Relatorio</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
                table { width: 100%; border-collapse: collapse; }
                table tr td, table tr th { padding: 8px; }
                @media print {
                    .no-print { display: none !important; }
                    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            </style>
        </head>
        <body>
            <div style="display:flex; justify-content:space-between; border-bottom:5px solid #E31C24; background:#000; color:#fff; padding:15px; align-items:center;">
                <div><b style="font-size:22px;">ATLAS PAINEL</b><br>PLANO DE RELATORIO</div>
                <div style="text-align:right; font-weight:bold;">DATA: ${rel.data}<br>OP: ${rel.operador}</div>
            </div>

            <div style="margin-top:20px;">${htmlGrupos}</div>

            <div style="margin-top:30px;">
                <div style="background:#000; color:#fff; padding:8px; font-weight:bold; text-align:center; font-size:16px; border:2px solid #000;">RESUMO POR COR</div>
                <table style="font-size:13px; color:#000;">
                    <thead>
                        <tr style="background:#eee;">
                            <th style="border:2px solid #000;">Painel</th>
                            <th style="border:2px solid #000;">RAL INF / SUP</th>
                            <th style="border:2px solid #000;">Metros</th>
                        </tr>
                    </thead>
                    <tbody>${resumoCores}</tbody>
                </table>
            </div>

            <div style="margin-top:30px;">
                <div style="background:#000; color:#fff; padding:8px; font-weight:bold; text-align:center; font-size:16px; border:2px solid #000;">TOTAIS DO PLANO</div>
                <table style="font-size:13px; color:#000;">
                    <thead>
                        <tr style="background:#eee;">
                            <th style="border:2px solid #000;">Grupo</th>
                            <th style="border:2px solid #000;">Metros Totais</th>
                        </tr>
                    </thead>
                    <tbody>${resumoEsp}</tbody>
                </table>
            </div>

            <div style="margin-top:20px; background:#000; color:#fff; padding:20px; text-align:right; border:3px solid #000;">
                <span style="font-size:18px; font-weight:normal; text-transform:uppercase; display:block; margin-bottom:5px;">Total Geral do Plano</span>
                <b style="font-size:35px; display:block; line-height:1;">${Number(rel.totalGeral).toFixed(2)} m</b>
            </div>

            ${comBotaoImpressao ? `
                <div class="no-print" style="text-align:center; margin-top:20px;">
                    <button onclick="window.print()" style="padding:20px; background:#000; color:#fff; border:3px solid #E31C24; width:100%; font-size:18px; font-weight:bold; border-radius:10px;">
                        CONFIRMAR E GERAR PDF
                    </button>
                </div>
            ` : ''}
        </body>
        </html>
    `;
}
function formatarMedidaRelatorio(metros) {
    const valor = Number(metros || 0);
    const mm = Math.round(valor * 1000);

    let metrosTexto = valor.toFixed(2).replace('.', ',');
    metrosTexto = metrosTexto.replace(/,00$/, '');
    metrosTexto = metrosTexto.replace(/(\,\d*[1-9])0$/, '$1');

    return `${mm} (${metrosTexto} metros)`;
}
function formatarTotalRelatorio(metros) {
    const valor = Number(metros || 0);
    const mm = Math.round(valor * 1000);

    let metrosTexto = valor.toFixed(2).replace('.', ',');
    metrosTexto = metrosTexto.replace(/,00$/, '');
    metrosTexto = metrosTexto.replace(/(\,\d*[1-9])0$/, '$1');

    return `${mm} (${metrosTexto} metros)`;
}

