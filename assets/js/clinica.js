/**
 * Dados da clínica usados pelas páginas.
 * Centralizado aqui para que telefone, especialidades e corpo clínico
 * sejam alterados em um único lugar.
 */
const CLINICA = {
    nome: "Clinical Excellence",
    // Formato internacional, somente dígitos (55 + DDD + número)
    whatsapp: "5511999999999",
    telefone: "(11) 3000-0000",
    email: "contato@clinicalexcellence.com.br",
    endereco: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
    horario: "Seg. a Sex., 8h às 19h · Sáb., 8h às 12h",

    /**
     * Envio automático da solicitação para o WhatsApp da clínica (CallMeBot).
     * Enquanto a chave estiver vazia, o site apenas abre o WhatsApp para o
     * usuário enviar — nada é disparado sozinho.
     *
     * Para ativar (grátis, sem servidor):
     *  1. No WhatsApp da clínica (o número em `whatsapp` acima), envie
     *     "I allow callmebot to send me messages" para +34 644 51 95 23.
     *  2. O bot responde com uma apikey. Cole-a abaixo.
     *  3. A mensagem chega automaticamente nesse WhatsApp a cada agendamento.
     *
     * Observação: só funciona para esse número fixo pré-autorizado. Enviar
     * para o número de cada paciente exigiria a API paga do WhatsApp Business.
     */
    callmebotApikey: "",

    especialidades: [
        { id: "clinica-geral", nome: "Clínica Geral" },
        { id: "cardiologia", nome: "Cardiologia" },
        { id: "dermatologia", nome: "Dermatologia" },
        { id: "psicologia", nome: "Psicologia" },
        { id: "nutricao", nome: "Nutrição" },
        { id: "pediatria", nome: "Pediatria" },
    ],

    profissionais: [
        { id: "ana-silva", nome: "Dra. Ana Silva", especialidade: "clinica-geral" },
        { id: "carlos-mendes", nome: "Dr. Carlos Mendes", especialidade: "cardiologia" },
        { id: "beatriz-costa", nome: "Dra. Beatriz Costa", especialidade: "dermatologia" },
        { id: "roberto-almeida", nome: "Dr. Roberto Almeida", especialidade: "pediatria" },
    ],

    periodos: [
        { id: "manha", nome: "Manhã (08:00 - 12:00)" },
        { id: "tarde", nome: "Tarde (13:00 - 18:00)" },
    ],
};

/** Devolve o nome legível de uma especialidade a partir do id. */
CLINICA.nomeEspecialidade = function (id) {
    const item = CLINICA.especialidades.find((e) => e.id === id);
    return item ? item.nome : "";
};

/** Devolve o nome legível de um profissional a partir do id. */
CLINICA.nomeProfissional = function (id) {
    const item = CLINICA.profissionais.find((p) => p.id === id);
    return item ? item.nome : "Qualquer profissional";
};

/** Devolve o nome legível de um período a partir do id. */
CLINICA.nomePeriodo = function (id) {
    const item = CLINICA.periodos.find((p) => p.id === id);
    return item ? item.nome : "";
};
