    await Promise.all(historico.map((rel, index) => {
        const partes = rel.ano ? {} : atlasDataPartes(rel.data);
        const id = atlasDocId(rel.id || `${rel.data}_${index}`);

        return atlasSetDoc([nomeColecao, id], {
            id,
            data: rel.data || "",
            dia: rel.dia || partes.dia,
            mes: rel.mes || partes.mes,
            ano: rel.ano || partes.ano,
            operador: rel.operador || "",
            totalGeral: Number(rel.totalGeral || 0),
            itens: rel.itens || [],
            editadoPor: rel.editadoPor || "",
            editadoEm: rel.editadoEm || "",
            historicoEdicoes: rel.historicoEdicoes || []
        });
    }));


async function atlasEnviarPlanos() {
    const historico = atlasParseJSON("atlas_plano_hist", []);
    await atlasLimparColecao("planos");

    await Promise.all(historico.map((rel, index) => {
        const id = atlasDocId(rel.id || `${rel.data}_${index}`);

        return atlasSetDoc(["planos", id], {
            id,
            data: rel.data || "",
            dataISO: rel.dataISO || "",
            dia: rel.dia || null,
            mes: rel.mes || null,
            ano: rel.ano || null,
            operador: rel.operador || "",
            totalGeral: Number(rel.totalGeral || 0),
            tiposLancamento: rel.tiposLancamento || [],
            resumo: rel.resumo || {},
            itens: rel.itens || [],
            editadoPor: rel.editadoPor || "",
            editadoEm: rel.editadoEm || "",
            historicoEdicoes: rel.historicoEdicoes || []
        });
    }));
}

async function atlasEnviarConferencia() {
    const pedidos = atlasParseJSON("atlas_conferencia_serra", []);
    await atlasLimparColecao("conferencia");

    await Promise.all(pedidos.map((pedido, index) => {
        const id = atlasDocId(pedido.id || `${pedido.data}_${pedido.pedidoNumero}_${index}`);

        return atlasSetDoc(["conferencia", id], {
            id,
            chavePedido: pedido.chavePedido || "",
            pedidoNumero: pedido.pedidoNumero || "",
            data: pedido.data || "",
            dia: pedido.dia || null,
            mes: pedido.mes || null,
            ano: pedido.ano || null,
            operadorSerra: pedido.operadorSerra || "",
            status: pedido.status || "aberto",
            finalizadoPor: pedido.finalizadoPor || "",
            finalizadoEm: pedido.finalizadoEm || "",
            unidades: pedido.unidades || []
        });
    }));
}

async function atlasEnviarDestinosPlano() {
    const destinos = atlasParseJSON("atlas_plano_destinos", []);
    await atlasSetDoc(["configuracoes", "destinos_plano"], {
        destinos
    });
}

async function atlasEnviarBackupLocalStorage() {
    const backup = {};

    for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        if (
            chave.startsWith("atlas_") ||
            chave === "historicoBobines"
        ) {
            backup[chave] = localStorage.getItem(chave);
        }
    }

    await atlasSetDoc(["backups_localstorage", "ultimo_backup"], {
        dados: backup
    });
}

async function atlasFirebaseEnviarTudoOrganizadoInterno() {
    if (atlasFirebaseBloqueado) return;

    await atlasEnviarUsuarios();
    await atlasEnviarInjecao();
    await atlasEnviarBobines();
    await atlasEnviarCorte("serra", "atlas_serra_hist");
    await atlasEnviarCorte("embalagem", "atlas_emb_hist");
    await atlasEnviarPlanos();
    await atlasEnviarConferencia();
    await atlasEnviarDestinosPlano();
    await atlasEnviarBackupLocalStorage();
}

function atlasFirebaseAgendarEnvio(chave) {
    if (!chave) return;
    if (!(chave.startsWith("atlas_") || chave === "historicoBobines")) return;

    clearTimeout(atlasFirebaseTimer);
    atlasFirebaseTimer = setTimeout(() => {
        atlasFirebaseEnviarTudoOrganizadoInterno().catch(erro => {
            console.error("Erro ao sincronizar Firebase:", erro);
        });
    }, 1000);
}

const atlasLocalStorageSetItemOriginal = localStorage.setItem;

localStorage.setItem = function(chave, valor) {
    const resultado = atlasLocalStorageSetItemOriginal.call(localStorage, chave, valor);
    atlasFirebaseAgendarEnvio(chave);
    return resultado;
};

window.atlasFirebaseEnviarTudo = function() {
    atlasFirebaseEnviarTudoOrganizadoInterno()
        .then(() => alert("Dados organizados enviados para a nuvem."))
        .catch(erro => {
            console.error(erro);
            alert("Erro ao enviar dados para a nuvem: " + erro.message);
        });
};

window.atlasFirebaseStatus = {
    app: atlasFirebaseApp,
    db: atlasFirestore
};

setTimeout(() => {
    atlasFirebaseEnviarTudoOrganizadoInterno().catch(erro => {
        console.error("Erro inicial Firebase:", erro);
    });
}, 2500);

/* Botao temporario para testar sem F12. Pode apagar depois. */
setTimeout(() => {
    if (document.getElementById("btn-teste-firebase-atlas")) return;

    const btn = document.createElement("button");
    btn.id = "btn-teste-firebase-atlas";
    btn.innerText = "TESTAR FIREBASE";
    btn.style = `
        position: fixed;
        right: 12px;
        bottom: 12px;
        z-index: 99999;
        background: #10b981;
        color: white;
        border: none;
        padding: 14px;
        border-radius: 10px;
        font-weight: bold;
        box-shadow: 0 10px 24px rgba(0,0,0,0.35);
    `;

    btn.onclick = function() {
        atlasFirebaseEnviarTudoOrganizadoInterno()
            .then(() => alert("Firebase funcionando. Dados organizados enviados."))
            .catch(erro => alert("Erro Firebase: " + erro.message));
    };

    document.body.appendChild(btn);
}, 1500);
