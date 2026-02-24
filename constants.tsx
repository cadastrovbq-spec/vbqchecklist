
import { Sector, ChecklistType, TaskStatus } from './types';

export const INITIAL_SECTORS: Sector[] = [
  {
    id: 'kitchen',
    name: 'Cozinha',
    icon: '🍳',
    employeeName: {},
    observations: {},
    finalizedAt: {},
    tasks: {
      [ChecklistType.OPENING]: [
        { id: 'k-o-1', title: 'PEDIDO DE HORTIFRUTI FOI FEITO?', description: 'Confirmar se o pedido de hortifruti para a cozinha foi realizado.', status: TaskStatus.PENDING },
        { id: 'k-o-2', title: 'Rotatividade de produtos (PVPS)', description: 'Verificar e aplicar a rotatividade correta (Primeiro que Vence, Primeiro que Sai).', status: TaskStatus.PENDING },
        { id: 'k-o-3', title: 'Organizar camara fria 01', description: 'Garantir a organização interna da câmara fria 01.', status: TaskStatus.PENDING },
        { id: 'k-o-4', title: 'Realizar a triagem das verduras e legumes', description: 'Fazer a seleção e triagem de qualidade de hortifruti.', status: TaskStatus.PENDING },
        { id: 'k-o-5', title: 'Organizar geladeira de horti fruti', description: 'Limpar e organizar a geladeira específica de hortifruti.', status: TaskStatus.PENDING },
        { id: 'k-o-6', title: 'Área do Fogão organizada?', description: 'Limpa, organizada e com insumos suficientes para o plantão.', status: TaskStatus.PENDING },
        { id: 'k-o-7', title: 'Área da Boqueta organizada?', description: 'Limpa, organizada e com insumos suficientes para o plantão.', status: TaskStatus.PENDING },
        { id: 'k-o-8', title: 'Área da Fritura organizada?', description: 'Limpa, organizada e com insumos suficientes para o plantão.', status: TaskStatus.PENDING },
        { id: 'k-o-9', title: 'Área da Chapa e Josper organizada?', description: 'Limpa, organizadas e com insumos suficientes para o plantão.', status: TaskStatus.PENDING },
        { id: 'k-o-10', title: 'Área da Sobremesa organizada?', description: 'Limpa, organizada e com insumos suficientes para o plantão.', status: TaskStatus.PENDING },
        // EQUIPAMENTOS EM GERAL
        { id: 'k-o-11', title: 'Bancada refrigerada de molhos e sobremesas', description: 'Limpa e ligada.', status: TaskStatus.PENDING },
        { id: 'k-o-12', title: 'Bancada refrigerada do fogão', description: 'Limpa e ligada.', status: TaskStatus.PENDING },
        { id: 'k-o-13', title: 'Bancada refrigerada da fritadeira', description: 'Limpa e ligada.', status: TaskStatus.PENDING },
        { id: 'k-o-14', title: 'Chapa limpa e ligada', description: 'Verificar limpeza e funcionamento.', status: TaskStatus.PENDING },
        { id: 'k-o-15', title: 'Coletor de gordura da chapa', description: 'Vazio e limpo.', status: TaskStatus.PENDING },
        { id: 'k-o-16', title: 'Josper ligada', description: 'Limpa e ligada.', status: TaskStatus.PENDING },
        { id: 'k-o-17', title: 'Lixeiras limpas e vazias', description: 'Prontas para o serviço.', status: TaskStatus.PENDING },
        { id: 'k-o-18', title: 'Coifas e exaustores ligados', description: 'Verificar sucção.', status: TaskStatus.PENDING },
        { id: 'k-o-19', title: 'Forno combinado', description: 'Limpo e ligado.', status: TaskStatus.PENDING },
        { id: 'k-o-20', title: 'Fritadeiras limpas e ligadas', description: 'Conferir nível do óleo.', status: TaskStatus.PENDING },
        { id: 'k-o-21', title: 'Filtragem de óleo e troca semanal', description: 'Filtragem diária e conferir troca semanal na tabela adesivada.', status: TaskStatus.PENDING },
        { id: 'k-o-22', title: 'Micro-ondas', description: 'Limpo e funcionando.', status: TaskStatus.PENDING },
        { id: 'k-o-23', title: 'Aquecedor de fritas', description: 'Limpo e funcionando.', status: TaskStatus.PENDING },
        { id: 'k-o-24', title: 'Liquidificadores', description: 'Limpos, organizados e funcionando.', status: TaskStatus.PENDING },
        { id: 'k-o-25', title: 'Lâmpadas aquecedoras', description: 'Limpa e funcionando.', status: TaskStatus.PENDING },
        // ITENS COMPLEMENTARES
        { id: 'k-o-26', title: 'Impressoras ligadas?', description: 'Verificar conexão e papel.', status: TaskStatus.PENDING },
        { id: 'k-o-27', title: 'Câmaras de resfriamento/congelamento', description: 'Todas ligadas e devidamente fechadas.', status: TaskStatus.PENDING },
        { id: 'k-o-28', title: 'Geladeiras', description: 'Todas ligadas e devidamente fechadas.', status: TaskStatus.PENDING },
        { id: 'k-o-29', title: 'Depósitos/estoques', description: 'Limpos e organizados.', status: TaskStatus.PENDING },
        { id: 'k-o-30', title: 'Planilha de troca de gordura e limpeza', description: 'Geral - Planilha atualizada.', status: TaskStatus.PENDING },
        { id: 'k-o-31', title: 'Armazenamento (rotação)', description: 'Refrigerado, congelado, rotação conforme PVPS.', status: TaskStatus.PENDING },
        { id: 'k-o-32', title: 'Gás e iluminação ligados?', description: 'Verificar registros e interruptores.', status: TaskStatus.PENDING },
        { id: 'k-o-33', title: 'Máquina de lavar louça', description: 'Lavada, verificar filtro e nível de detergente/secante.', status: TaskStatus.PENDING },
        { id: 'k-o-34', title: 'Copa', description: 'Limpa e organizada. Utensílios nos devidos lugares.', status: TaskStatus.PENDING },
        { id: 'k-o-35', title: 'Perfex', description: 'Colocados de molho clorado para o dia seguinte.', status: TaskStatus.PENDING },
        { id: 'k-o-36', title: 'Nível de gás', description: 'Verificar se é suficiente.', status: TaskStatus.PENDING },
        { id: 'k-o-37', title: 'RELAÇÃO DE INSUMOS AO ESTOQUISTA', description: 'Enviar relação para separação da matéria prima.', status: TaskStatus.PENDING }
      ],
      [ChecklistType.CLOSING]: [
        { id: 'k-c-1', title: 'Limpezas gerais', description: 'Piso, Bancadas, Pias, Boquetas, Prateleiras.', status: TaskStatus.PENDING },
        { id: 'k-c-2', title: 'Compartimento de pães', description: 'Limpos e sacos amarrados/embalados com filme PVC.', status: TaskStatus.PENDING },
        { id: 'k-c-3', title: 'Fogão limpo', description: 'Bordas, Trempes, Queimadores e Bandejas. ATENÇÃO: não molhar queimadores quentes.', status: TaskStatus.PENDING },
        { id: 'k-c-4', title: 'Ralos e Calhas', description: 'Limpos, recolhendo o excesso de alimentos.', status: TaskStatus.PENDING },
        { id: 'k-c-5', title: 'Utensílios e Tábuas', description: 'Limpas. Hortifruti em caixa com produto clorado.', status: TaskStatus.PENDING },
        { id: 'k-c-6', title: 'Insumos da fritadeira', description: 'Guardar batatas fritas e insumos na câmara ou freezer.', status: TaskStatus.PENDING },
        { id: 'k-c-7', title: 'Molhos e decorativos', description: 'Guardar os itens da boqueta na bancada refrigerada.', status: TaskStatus.PENDING },
        { id: 'k-c-8', title: 'Caixas de temperos e cereais', description: 'Verificar limpeza e etiquetagem.', status: TaskStatus.PENDING },
        { id: 'k-c-9', title: 'Rotatividade (PVPS)', description: 'Verificar validades e ordem de uso.', status: TaskStatus.PENDING },
        { id: 'k-c-10', title: 'DISJUNTOR 21 BUFETT SALAO', description: 'DESLIGAR disjuntor do buffet.', status: TaskStatus.PENDING },
        // EQUIPAMENTOS EM GERAL
        { id: 'k-c-11', title: 'Bancada molhos/sobremesas', description: 'Limpa e ligada.', status: TaskStatus.PENDING },
        { id: 'k-c-12', title: 'Bancada fogão', description: 'Limpa e ligada.', status: TaskStatus.PENDING },
        { id: 'k-c-13', title: 'Bancada fritadeira', description: 'Limpa e DESLIGADA.', status: TaskStatus.PENDING },
        { id: 'k-c-14', title: 'Freezer fritadeira', description: 'Limpa e ligada.', status: TaskStatus.PENDING },
        { id: 'k-c-15', title: 'Chapa', description: 'Limpa, DESLIGADA e coletor vazio.', status: TaskStatus.PENDING },
        { id: 'k-c-16', title: 'Coletor de gordura da chapa', description: 'Vazio e limpo.', status: TaskStatus.PENDING },
        { id: 'k-c-17', title: 'Josper', description: 'Verificar excesso de carvão.', status: TaskStatus.PENDING },
        { id: 'k-c-18', title: 'Lixeiras', description: 'Limpas e vazias.', status: TaskStatus.PENDING },
        { id: 'k-c-19', title: 'Lixeira externa', description: 'Limpa e guardada.', status: TaskStatus.PENDING },
        { id: 'k-c-20', title: 'Coifas e exaustores DESLIGADOS', description: 'Verificar interrupção.', status: TaskStatus.PENDING },
        { id: 'k-c-21', title: 'Forno combinado (Pastilhas)', description: 'Limpeza diária com pastilhas (exceto dias de costela/cupim).', status: TaskStatus.PENDING },
        { id: 'k-c-22', title: 'Fritadeiras', description: 'Limpas e desligadas.', status: TaskStatus.PENDING },
        { id: 'k-c-23', title: 'Filtragem diária e troca semanal', description: 'Conferir tabela adesivada.', status: TaskStatus.PENDING },
        { id: 'k-c-24', title: 'Micro-ondas', description: 'Limpo e desligado.', status: TaskStatus.PENDING },
        { id: 'k-c-25', title: 'Aquecedor de fritas', description: 'Limpo e desligado.', status: TaskStatus.PENDING },
        { id: 'k-c-26', title: 'Liquidificadores', description: 'Limpos e organizados.', status: TaskStatus.PENDING },
        { id: 'k-c-27', title: 'Etiquetagem Geral', description: 'Produtos etiquetados em câmaras e cozinha.', status: TaskStatus.PENDING },
        // ITENS COMPLEMENTARES
        { id: 'k-c-28', title: 'Impressoras desligadas', description: 'Verificar todas as unidades.', status: TaskStatus.PENDING },
        { id: 'k-c-29', title: 'Câmaras frias', description: 'Ligadas e devidamente fechadas.', status: TaskStatus.PENDING },
        { id: 'k-c-30', title: 'Geladeiras', description: 'Ligadas e devidamente fechadas.', status: TaskStatus.PENDING },
        { id: 'k-c-31', title: 'Depósitos limpos', description: 'Organizados.', status: TaskStatus.PENDING },
        { id: 'k-c-32', title: 'Planilha de gordura/limpeza', description: 'Devidamente preenchida.', status: TaskStatus.PENDING },
        { id: 'k-c-33', title: 'Armazenamento', description: 'Refrigerado, congelado e rotação.', status: TaskStatus.PENDING },
        { id: 'k-c-34', title: 'Gás, Luz e Torneiras', description: 'Desligados e fechadas.', status: TaskStatus.PENDING },
        { id: 'k-c-35', title: 'Máquina de lavar louça', description: 'Lavada, verificar filtro e níveis.', status: TaskStatus.PENDING },
        { id: 'k-c-36', title: 'Copa limpa', description: 'Copos, taças e pratos organizados.', status: TaskStatus.PENDING },
        { id: 'k-c-37', title: 'Perfex em molho clorado', description: 'Para reuso nas tábuas no dia seguinte.', status: TaskStatus.PENDING },
        { id: 'k-c-38', title: 'Pano de chão de molho', description: 'No balde.', status: TaskStatus.PENDING },
        { id: 'k-c-39', title: 'Contagem de porcionados', description: 'Realizar contagem diária.', status: TaskStatus.PENDING }
      ]
    }
  },
  {
    id: 'bar',
    name: 'Bar',
    icon: '🍸',
    employeeName: {},
    observations: {},
    finalizedAt: {},
    tasks: {
      [ChecklistType.OPENING]: [
        // ── OPERAÇÃO GERAL ──
        { id: 'br-o-1', title: 'Freezers, câmara fria e máquina de gelo ligados e funcionando', description: 'Conferir se todos os freezers, câmara fria e máquina de gelo estão ligados e operando corretamente.', status: TaskStatus.PENDING },
        { id: 'br-o-2', title: 'Temperatura da câmara fria e freezers está correta?', description: 'Verificar a temperatura da câmara fria e dos freezers e confirmar que estão adequadas.', status: TaskStatus.PENDING },
        { id: 'br-o-3', title: 'Bancadas higienizadas com álcool 70%', description: 'Limpar e higienizar todas as bancadas com álcool 70% antes do início da operação.', status: TaskStatus.PENDING },
        { id: 'br-o-4', title: 'Gás da chopeira e bicos de chopp operando?', description: 'Conferir o gás da chopeira e verificar se todos os bicos de chopp estão funcionando.', status: TaskStatus.PENDING },
        { id: 'br-o-5', title: 'Barris de chopp cheios e prontos para uso', description: 'Conferir os barris de chopp; garantir que estão cheios e prontos para o serviço.', status: TaskStatus.PENDING },
        { id: 'br-o-6', title: 'Lixeiras limpas com sacos', description: 'Verificar se as lixeiras estão limpas e com seus respectivos sacos.', status: TaskStatus.PENDING },
        { id: 'br-o-7', title: 'Higienizar mãos e sanitizar frutas a usar', description: 'Higienizar as mãos conforme orientação nutricional e sanitizar todas as frutas que serão utilizadas.', status: TaskStatus.PENDING },
        { id: 'br-o-8', title: 'Verificar faltas no cardápio de bebidas e drinks', description: 'Conferir o cardápio de bebidas e drinks identificando possíveis faltas.', status: TaskStatus.PENDING },
        { id: 'br-o-9', title: 'Abastecer freezers de refrigerante e cerveja (se necessário)', description: 'Repor refrigerantes e cervejas nos freezers conforme necessidade.', status: TaskStatus.PENDING },
        { id: 'br-o-10', title: 'Cortar 2 laranjas em meia lua — vasilha com pegador inox no balcão', description: 'Cortar 2 unidades de laranja em meia lua, armazenar em vasilha e deixar no balcão com pegador inox.', status: TaskStatus.PENDING },
        { id: 'br-o-11', title: 'Cortar 5 limões em rodela — vasilha com pegador inox no balcão', description: 'Cortar 5 unidades de limão em rodela, armazenar em vasilha e deixar no balcão com pegador inox.', status: TaskStatus.PENDING },
        { id: 'br-o-12', title: 'Cortar limão ao meio para espremer — bisnagas e jarras refrigeradas', description: 'Cortar limões ao meio para espremedor; armazenar em bisnagas e jarras sob refrigeração.', status: TaskStatus.PENDING },
        { id: 'br-o-13', title: 'Cortar laranja ao meio para espremer — jarras refrigeradas', description: 'Cortar laranjas ao meio; armazenar em jarras sob refrigeração.', status: TaskStatus.PENDING },
        { id: 'br-o-14', title: 'Abastecer cooler com gelo e deixar pá para servir', description: 'Encher o cooler com gelo e posicionar a pá de gelo para uso durante o serviço.', status: TaskStatus.PENDING },
        { id: 'br-o-15', title: 'Abastecer porta-canudos identificando finalidade', description: 'Abastecer: drinks (mexedor), sucos (flexível) e cremosos (especial), identificando cada um.', status: TaskStatus.PENDING },
        // ── BAR STATION (BAR 01 E 03) ──
        { id: 'br-o-16', title: 'Bar Station — conferir frutas nas cubas de inox', description: 'Verificar o abastecimento de frutas nas cubas de inox da bar station.', status: TaskStatus.PENDING },
        { id: 'br-o-17', title: 'Bar Station — sanitizar frutas a utilizar', description: 'Sanitizar todas as frutas que serão usadas na bar station.', status: TaskStatus.PENDING },
        { id: 'br-o-18', title: 'Bar Station — cortar e etiquetar frutas para o movimento', description: 'Cortar as quantidades adequadas de frutas, etiquetando e identificando cada produto.', status: TaskStatus.PENDING },
        { id: 'br-o-19', title: 'Bar Station — completar cuba de gelo com gelo filtrado em cubos', description: 'Encher a cuba de gelo com gelo filtrado em cubos na bar station.', status: TaskStatus.PENDING },
        { id: 'br-o-20', title: 'Bar Station — utensílios limpos e prontos (macerador, faca, tábua, pegador, bailarina, funil)', description: 'Verificar que todos os utensílios estão limpos e prontos para uso.', status: TaskStatus.PENDING },
        { id: 'br-o-21', title: 'Bar Station — sifão de espuma de gengibre abastecido e com reserva', description: 'Verificar o sifão da espuma de gengibre e confirmar que há reserva para o plantão.', status: TaskStatus.PENDING },
        { id: 'br-o-22', title: 'Bar Station — lavar e separar alecrim e hortelã em água', description: 'Lavar alecrim e hortelã com água corrente; separar em raminhos e deixar em baldinho com água.', status: TaskStatus.PENDING },
        { id: 'br-o-23', title: 'Bar Station — conferir garrafas de destilados para o movimento', description: 'Verificar todas as garrafas de destilados; repor se houver falta.', status: TaskStatus.PENDING },
        { id: 'br-o-24', title: 'Bar Station — temos todos insumos para drinks? (xaropes, energéticos, espumante, frutas, decorações)', description: 'Conferir presença de todos os insumos necessários para preparar os drinks do cardápio.', status: TaskStatus.PENDING },
        { id: 'br-o-25', title: 'Bar Station — perfex com álcool 70% (bancada) e perfex seco (station)', description: 'Separar um perfex com álcool 70% para bancadas e outro para limpeza da bar station.', status: TaskStatus.PENDING },
        // ── CHOPPEIRAS E GÁS (BAR 01 E 03) ──
        { id: 'br-o-26', title: 'Limpeza da máquina de lavar copos', description: 'Realizar a limpeza completa da máquina de lavar copos antes do serviço.', status: TaskStatus.PENDING },
        { id: 'br-o-27', title: 'Conferir quantidade e pressão do gás do cilindro', description: 'Verificar a quantidade de gás no cilindro e se a pressão está adequada para o serviço.', status: TaskStatus.PENDING },
        { id: 'br-o-28', title: 'Verificar se todas as polpas de chopp estão funcionando', description: 'Testar e conferir o funcionamento de todas as polpas de chopp.', status: TaskStatus.PENDING },
        { id: 'br-o-29', title: 'Conferir barril acabando e deixar um cheio próximo para troca', description: 'Identificar barris próximos do fim e deixar um barril cheio ao lado para troca imediata.', status: TaskStatus.PENDING },
        { id: 'br-o-30', title: 'Chave de troca de gás próxima do cilindro?', description: 'Verificar se a chave de troca do gás está no local correto, próxima ao cilindro.', status: TaskStatus.PENDING },
        { id: 'br-o-31', title: 'Conferir cilindro reserva cheio', description: 'Verificar se há pelo menos um cilindro de gás reserva cheio disponível.', status: TaskStatus.PENDING },
        { id: 'br-o-32', title: 'Todas as extratoras de chopp estão abaixadas?', description: 'Verificar se todas as extratoras de chopp estão na posição correta (abaixadas).', status: TaskStatus.PENDING },
        { id: 'br-o-33', title: 'Verificar se não há vazamento de gás', description: 'Inspecionar toda a instalação de gás para detectar possíveis vazamentos.', status: TaskStatus.PENDING },
        // ── ÁREA DE SUCOS E CREMES ──
        { id: 'br-o-34', title: 'Conferir quantidade de polpas para o movimento', description: 'Verificar se a quantidade de polpas de frutas é suficiente para o movimento esperado.', status: TaskStatus.PENDING },
        { id: 'br-o-35', title: 'Abastecer bisnagas com xarope de açúcar', description: 'Encher as bisnagas com xarope de açúcar para uso durante o serviço.', status: TaskStatus.PENDING },
        { id: 'br-o-36', title: 'Separar insumos para cremes (leite condensado, leite, creme de leite)', description: 'Separar e deixar disponíveis os insumos para preparo de cremes.', status: TaskStatus.PENDING },
        { id: 'br-o-37', title: 'Deixar 10 und de polpas (morango, maracujá, abacaxi, acerola) descongelando', description: 'Deixar 10 unidades de cada polpa descongelando no balcão refrigerado.', status: TaskStatus.PENDING },
        { id: 'br-o-38', title: 'Preparar suco batendo a polpa cortada em 4 partes', description: 'Ao preparar sucos, cortar a polpa em 4 partes antes de bater.', status: TaskStatus.PENDING },
        { id: 'br-o-39', title: 'Perfex com álcool 70% para limpeza do balcão e utensílios (sucos)', description: 'Separar um perfex com álcool 70% exclusivo para o balcão e utensílios da área de sucos.', status: TaskStatus.PENDING },
        // ── PIA — LAVAGEM E LIMPEZA ──
        { id: 'br-o-40', title: 'Pia — conferir sabão, bucha e baldinho com água', description: 'Verificar disponibilidade de sabão, bucha e balde com água para lavagem de copos e utensílios.', status: TaskStatus.PENDING },
        { id: 'br-o-41', title: 'Caixas brancas ou escorredor em bom estado e em quantidade', description: 'Verificar se as caixas brancas ou escorredores estão em bom estado e suficientes na praça.', status: TaskStatus.PENDING },
        { id: 'br-o-42', title: 'Reserva de sabão e bucha amarela disponíveis', description: 'Manter sempre reserva de sabão e bucha amarela para reposição.', status: TaskStatus.PENDING },
        { id: 'br-o-43', title: 'Rodo e pano para passar no chão disponíveis', description: 'Manter rodo e pano de chão acessíveis na área da pia.', status: TaskStatus.PENDING },
        { id: 'br-o-44', title: 'Perfex com álcool 70% para higienização da pia', description: 'Deixar um perfex com álcool 70% específico para higienizar a pia.', status: TaskStatus.PENDING },
        // ── 30 MINUTOS ANTES DA ABERTURA ──
        { id: 'br-o-45', title: 'Impressoras testadas e operando (solicitar teste ao gerente)', description: 'Conferir se todas as impressoras estão operando; solicitar teste de impressão ao gerente.', status: TaskStatus.PENDING },
        { id: 'br-o-46', title: 'LEDs ligados e funcionando (balcão e logo)', description: 'Verificar se todos os LEDs do balcão e logo estão ligados e funcionando.', status: TaskStatus.PENDING },
        { id: 'br-o-47', title: 'Todos os freezers funcionando adequadamente', description: 'Verificar novamente o funcionamento de todos os freezers 30 min antes da abertura.', status: TaskStatus.PENDING },
        { id: 'br-o-48', title: 'Máquina de gelo operando corretamente', description: 'Conferir a máquina de gelo e verificar seu funcionamento 30 min antes da abertura.', status: TaskStatus.PENDING },
        { id: 'br-o-49', title: 'Limpeza final — piso, bancadas e pia limpos e organizados', description: 'Realizar limpeza final do piso, bancadas e pia antes de abrir.', status: TaskStatus.PENDING },
        { id: 'br-o-50', title: 'Gela-caneca ligado e funcionando', description: 'Ligar o gela-caneca e verificar seu funcionamento antes da abertura.', status: TaskStatus.PENDING },
        // ── EQUIPE DE BAR ──
        { id: 'br-o-51', title: 'Higiene pessoal — barba feita (homens) e uniforme completo e limpo', description: 'Verificar higiene pessoal de toda a equipe: barba feita, uniforme completo e limpo.', status: TaskStatus.PENDING },
        { id: 'br-o-52', title: 'Unhas curtas, sem esmalte e higienizadas', description: 'Verificar unhas da equipe: curtas, sem esmalte e devidamente higienizadas.', status: TaskStatus.PENDING },
        { id: 'br-o-53', title: 'Sem acessórios, adornos, perfume ou maquiagem', description: 'Confirmar ausência de acessórios, adornos, perfume e maquiagem na equipe.', status: TaskStatus.PENDING },
        // ── ITENS COMPLEMENTARES ──
        { id: 'br-o-54', title: 'Verificar validades, etiquetas e rotatividade (PVPS)', description: 'Conferir datas de validade, etiquetagem e aplicar rotatividade PVPS nos produtos.', status: TaskStatus.PENDING },
        { id: 'br-o-55', title: 'Depósito/estoques limpos e organizados', description: 'Organizar e manter limpos os depósitos e estoques do bar.', status: TaskStatus.PENDING },
        { id: 'br-o-56', title: 'Anotar no controle de desperdício produtos vencidos ou perdidos', description: 'Registrar no controle de desperdício todos os produtos vencidos ou inutilizados.', status: TaskStatus.PENDING },
        { id: 'br-o-57', title: 'Alguma manutenção necessária?', description: 'Identificar e registrar nas observações qualquer necessidade de manutenção.', status: TaskStatus.PENDING },
        { id: 'br-o-58', title: 'Algum utensílio precisando substituição ou aquisição?', description: 'Verificar utensílios com necessidade de troca ou compra e registrar nas observações.', status: TaskStatus.PENDING }
      ],
      [ChecklistType.CLOSING]: [
        // ── OPERAÇÃO GERAL ──
        { id: 'br-c-1', title: 'Conferir e anotar toda reposição do bar (anotar o que foi pego do estoque)', description: 'Registrar no caderno todos os itens retirados do estoque durante o turno.', status: TaskStatus.PENDING },
        { id: 'br-c-2', title: 'Contabilizar desperdício — anotar data, produto, quantidade e motivo', description: 'Registrar no caderno de desperdício tudo que foi dispensado com data e motivo.', status: TaskStatus.PENDING },
        { id: 'br-c-3', title: 'Abastecimento de produtos seguindo PVPS (primeiro que vence, primeiro que sai)', description: 'Realizar o abastecimento respeitando a rotatividade PVPS.', status: TaskStatus.PENDING },
        { id: 'br-c-4', title: 'Abastecer cervejas, refrigerantes, água, energéticos etc.', description: 'Repor estoque de bebidas nos freezers para o próximo dia.', status: TaskStatus.PENDING },
        { id: 'br-c-5', title: 'Abastecer gelo — ensacar quantidade que saiu no dia', description: 'Ensacar e repor o gelo consumido, deixando estoque para o próximo turno.', status: TaskStatus.PENDING },
        { id: 'br-c-6', title: 'Retirar vasilhas de limão e laranja do balcão', description: 'Remover do balcão as vasilhas de frutas cortadas ao encerrar o serviço.', status: TaskStatus.PENDING },
        { id: 'br-c-7', title: 'Lavar caixas térmicas e coolers', description: 'Higienizar todas as caixas térmicas e coolers com água e sabão.', status: TaskStatus.PENDING },
        { id: 'br-c-8', title: 'Desligar o gela-caneca e deixar as portas abertas', description: 'Desligar o gela-caneca e manter as portas abertas após o encerramento.', status: TaskStatus.PENDING },
        // ── ÁREA DE SUCOS E CREMES ──
        { id: 'br-c-9', title: 'Guardar todas as polpas que sobraram', description: 'Recolher e armazenar adequadamente todas as polpas de frutas que não foram usadas.', status: TaskStatus.PENDING },
        { id: 'br-c-10', title: 'Passar papel filme no leite, creme de leite e leite condensado — guardar na câmara fria', description: 'Cobrir e proteger os laticínios com papel filme; guardar na câmara fria.', status: TaskStatus.PENDING },
        { id: 'br-c-11', title: 'Lavar mesa de inox com água e sabão e secar com pano', description: 'Higienizar toda a mesa de inox da área de sucos com água e sabão, secando em seguida.', status: TaskStatus.PENDING },
        { id: 'br-c-12', title: 'Limpar liquidificador com pano e lavar paredes com água e sabão', description: 'Limpar o exterior do liquidificador com pano e higienizar as paredes da área de sucos.', status: TaskStatus.PENDING },
        // ── BAR STATION (BAR 01 E 03) ──
        { id: 'br-c-13', title: 'Bar Station — retirar cubas de frutas, verificar aproveitamento e passar papel filme', description: 'Retirar as cubas, verificar o que pode ser aproveitado, e cobrir tudo com papel filme.', status: TaskStatus.PENDING },
        { id: 'br-c-14', title: 'Bar Station — etiquetar todos os produtos', description: 'Fazer a etiquetagem completa de todos os produtos retirados da bar station.', status: TaskStatus.PENDING },
        { id: 'br-c-15', title: 'Bar Station — guardar cubas tampadas e etiquetadas na câmara fria', description: 'Armazenar todas as cubas devidamente tampadas e etiquetadas na câmara fria.', status: TaskStatus.PENDING },
        { id: 'br-c-16', title: 'Bar Station — lavar utensílios e cubas usados para frutas', description: 'Higienizar todos os utensílios e cubas que foram usados com frutas.', status: TaskStatus.PENDING },
        // ── CHOPPEIRAS E GÁS (BAR 01 E 03) ──
        { id: 'br-c-17', title: 'Desligar o gás da choppeira', description: 'Fechar o registro de gás da choppeira ao encerrar o serviço.', status: TaskStatus.PENDING },
        { id: 'br-c-18', title: 'Lavar todos os bicos da choppeira com água e sabão e secar', description: 'Higienizar e secar todos os bicos da choppeira ao final do turno.', status: TaskStatus.PENDING },
        { id: 'br-c-19', title: 'Lavar todo o pinga-chopp (retirar grade, lavar com água e sabão)', description: 'Desmontar e lavar completamente o pinga-chopp com água e sabão.', status: TaskStatus.PENDING },
        { id: 'br-c-20', title: 'Barris de chopp suficientes para o dia seguinte — colocar quantidade adequada', description: 'Verificar e garantir estoque de barris para o próximo turno.', status: TaskStatus.PENDING },
        { id: 'br-c-21', title: 'Conferir se a câmara fria está ligada e com a porta fechada', description: 'Verificar o funcionamento e o fechamento correto da câmara fria ao encerrar.', status: TaskStatus.PENDING },
        { id: 'br-c-22', title: 'Retirar barris vazios da câmara fria e guardar no local adequado', description: 'Remover os barris vazios e armazená-los no local correto para devolução.', status: TaskStatus.PENDING },
        // ── LIMPEZA GERAL — TODOS OS BARES ──
        { id: 'br-c-23', title: 'Separar lixo seco do orgânico e levar até o container indicado', description: 'Fazer a coleta seletiva e encaminhar cada tipo de lixo ao container correto.', status: TaskStatus.PENDING },
        { id: 'br-c-24', title: 'Lavar todas as lixeiras com água e sabão', description: 'Higienizar completamente as lixeiras com água e sabão.', status: TaskStatus.PENDING },
        { id: 'br-c-25', title: 'Lavar o chão com água e sabão — esfregar embaixo de todos os freezers', description: 'Lavar todo o piso do bar, incluindo embaixo e ao redor de todos os freezers.', status: TaskStatus.PENDING },
        { id: 'br-c-26', title: 'Passar pano com álcool em todos os freezers e balcões refrigerados', description: 'Higienizar a superfície externa de freezers e balcões refrigerados com álcool.', status: TaskStatus.PENDING },
        { id: 'br-c-27', title: 'Lavar o balcão do bar com água e sabão e secar com pano', description: 'Higienizar o balcão do bar com água e sabão; secar completamente.', status: TaskStatus.PENDING },
        { id: 'br-c-28', title: 'Lavar todos os utensílios e materiais do bar', description: 'Higienizar todos os utensílios e materiais utilizados durante o serviço.', status: TaskStatus.PENDING },
        { id: 'br-c-29', title: 'Verificar validades, etiquetas e rotação correta (PVPS)', description: 'Conferir datas de validade e etiquetagem; aplicar rotatividade PVPS.', status: TaskStatus.PENDING },
        // ── ITENS COMPLEMENTARES ──
        { id: 'br-c-30', title: 'Pedido de hortifruti foi feito?', description: 'Confirmar que o pedido de hortifruti para o próximo dia foi realizado.', status: TaskStatus.PENDING },
        { id: 'br-c-31', title: 'Enviar contagem de cascos vazios no grupo', description: 'Registrar e enviar no grupo a contagem de cascos (garrafas) vazios do turno.', status: TaskStatus.PENDING },
        { id: 'br-c-32', title: 'Enviar contagem de barris de chopp, nitrogênio, CO2 e suco de laranja no grupo', description: 'Registrar e enviar no grupo a contagem de barris e cilindros.', status: TaskStatus.PENDING },
        { id: 'br-c-33', title: 'Ensacar gelo e enviar foto da máquina zerada no grupo', description: 'Ensacar o gelo produzido, zerar a máquina e enviar foto ao grupo confirmando.', status: TaskStatus.PENDING },
        { id: 'br-c-34', title: 'Alguma manutenção identificada?', description: 'Registrar nas observações qualquer necessidade de manutenção identificada no turno.', status: TaskStatus.PENDING }
      ]

    }
  },

  {
    id: 'salon',
    name: 'Salão',
    icon: '🍽️',
    employeeName: {},
    observations: {},
    finalizedAt: {},
    tasks: {
      [ChecklistType.OPENING]: [
        // ── LIMPEZA E ORGANIZAÇÃO ──
        { id: 'sl-o-1', title: 'Limpeza do chão e entrada (verificar chicletes no chão)', description: 'Varrer e limpar o piso do salão e da entrada, removendo chicletes grudados.', status: TaskStatus.PENDING },
        { id: 'sl-o-2', title: 'Tapete de entrada limpo e sem detritos', description: 'Limpar e sacudir o tapete da entrada do restaurante.', status: TaskStatus.PENDING },
        { id: 'sl-o-3', title: 'Limpeza do fumódromo', description: 'Higienizar a área do fumódromo: piso, cinzeiros e mobiliário.', status: TaskStatus.PENDING },
        { id: 'sl-o-4', title: 'Cadeiras limpas e sem pó no encosto', description: 'Passar pano em todas as cadeiras, verificando encostos e assentos.', status: TaskStatus.PENDING },
        { id: 'sl-o-5', title: 'Mesas limpas, higienizadas e com balanço conferido', description: 'Limpar e higienizar as mesas; verificar estabilidade (nenhuma bamba).', status: TaskStatus.PENDING },
        { id: 'sl-o-6', title: 'Aparadores limpos, higienizados e completos', description: 'Limpar os aparadores e garantir que estão completos (cardápios, guardanapos, etc.).', status: TaskStatus.PENDING },
        { id: 'sl-o-7', title: 'Vidros e sofás limpos', description: 'Limpar vidros (sem manchas) e higienizar sofás e estofados.', status: TaskStatus.PENDING },
        { id: 'sl-o-8', title: 'Banheiros higienizados, abastecidos e sem odor', description: 'Verificar limpeza, papel higiênico, sabão, toalhas e odor nos banheiros.', status: TaskStatus.PENDING },
        { id: 'sl-o-9', title: 'Cardápios limpos e organizados (recepção e aparadores)', description: 'Limpar e organizar os cardápios nos aparadores e na recepção.', status: TaskStatus.PENDING },
        { id: 'sl-o-10', title: 'Mesas posicionadas conforme plano de chão', description: 'Conferir o posicionamento das mesas de acordo com o plano de layout.', status: TaskStatus.PENDING },
        { id: 'sl-o-11', title: 'Lavar tampas do molho de pimenta', description: 'Higienizar as tampas dos recipientes de molho de pimenta.', status: TaskStatus.PENDING },
        { id: 'sl-o-12', title: 'Talheres e pratos polidos e organizados (talheres ensacados)', description: 'Polir talheres e pratos; ensacar ou organizar talheres conforme padrão.', status: TaskStatus.PENDING },
        // ── ELETRO-ELETRÔNICOS ──
        { id: 'sl-o-13', title: 'Televisores e telões funcionando corretamente', description: 'Ligar e testar todos os televisores e telões do salão.', status: TaskStatus.PENDING },
        { id: 'sl-o-14', title: 'Telões com as promoções do Marketing', description: 'Confirmar que os telões estão exibindo o conteúdo de marketing atualizado.', status: TaskStatus.PENDING },
        { id: 'sl-o-15', title: 'Lâmpadas: todas funcionando corretamente', description: 'Verificar todas as lâmpadas do salão e substituir as queimadas.', status: TaskStatus.PENDING },
        { id: 'sl-o-16', title: 'Som funcionando em todos os salões e banheiro', description: 'Testar o sistema de som em todos os ambientes, incluindo banheiros.', status: TaskStatus.PENDING },
        // ── BUFFET (quando aplicável) ──
        { id: 'sl-o-17', title: 'Buffet limpo e ligado com 60 min de antecedência', description: 'Ligar e higienizar o buffet com pelo menos 60 minutos antes da abertura.', status: TaskStatus.PENDING },
        { id: 'sl-o-18', title: 'Talheres e pratos no buffet em quantidade suficiente', description: 'Posicionar talheres e pratos no buffet na quantidade adequada para o serviço.', status: TaskStatus.PENDING },
        { id: 'sl-o-19', title: 'Placas com nomes dos pratos posicionadas no buffet', description: 'Organizar e posicionar as placas identificadoras dos pratos no buffet.', status: TaskStatus.PENDING },
        // ── 30 MINUTOS ANTES ──
        { id: 'sl-o-20', title: 'Praças divididas entre a equipe', description: 'Dividir e comunicar as praças/setores de cada garçom antes da abertura.', status: TaskStatus.PENDING },
        { id: 'sl-o-21', title: 'Mesas e cadeiras conforme plano de chão (30 min antes)', description: 'Conferir novamente o posicionamento de mesas e cadeiras 30 minutos antes.', status: TaskStatus.PENDING },
        { id: 'sl-o-22', title: 'Mesas alinhadas e firmes — nenhuma mesa bamba', description: 'Verificar estabilidade de todas as mesas e calçar se necessário.', status: TaskStatus.PENDING },
        // ── RECEPÇÃO E BRINQUEDOTECA ──
        { id: 'sl-o-23', title: 'Brinquedoteca limpa', description: 'Verificar e limpar a brinquedoteca antes da abertura.', status: TaskStatus.PENDING },
        { id: 'sl-o-24', title: 'Brinquedos e equipamentos ligados', description: 'Ligar os equipamentos e brinquedos da brinquedoteca.', status: TaskStatus.PENDING },
        { id: 'sl-o-25', title: 'Banheiro da recepção abastecido e limpo', description: 'Verificar limpeza e abastecimento do banheiro da área de recepção.', status: TaskStatus.PENDING },
        { id: 'sl-o-26', title: 'Recepção limpa e organizada (máquina de pegar urso ligada)', description: 'Organizar a recepção e ligar a máquina de pegar urso.', status: TaskStatus.PENDING },
        { id: 'sl-o-27', title: 'Catracas funcionando', description: 'Testar o funcionamento das catracas da entrada.', status: TaskStatus.PENDING },
        { id: 'sl-o-28', title: 'Prancheta com reservas do dia (quando aplicável)', description: 'Montar a prancheta com as reservas confirmadas para o dia.', status: TaskStatus.PENDING },
        { id: 'sl-o-29', title: 'Reservas repassadas para salão, cozinha, pizzaria, sushi e recepção', description: 'Comunicar as reservas do dia a todos os setores envolvidos.', status: TaskStatus.PENDING },
        // ── EQUIPE ──
        { id: 'sl-o-30', title: 'Higiene pessoal e uniforme completo e limpo', description: 'Verificar se toda a equipe está com uniforme completo, limpo e em ordem.', status: TaskStatus.PENDING },
        { id: 'sl-o-31', title: 'Sem acessórios extravagantes — barba, cabelo e sapato em ordem', description: 'Confirmar: barba aparada, cabelo penteado, sapato limpo, sem acessórios fora do padrão.', status: TaskStatus.PENDING },
        { id: 'sl-o-32', title: 'Caneta, comanda/tablet e passo a passo no bolso', description: 'Cada colaborador deve ter caneta, comanda ou tablet e o passo a passo individual.', status: TaskStatus.PENDING }
      ],
      [ChecklistType.CLOSING]: [
        { id: 'sl-c-1', title: 'Aparadores limpos e higienizados?', description: 'Limpar e higienizar todos os aparadores do salão.', status: TaskStatus.PENDING },
        { id: 'sl-c-2', title: 'Trancar porta do caixa', description: 'Verificar e trancar a porta do caixa ao encerrar.', status: TaskStatus.PENDING },
        { id: 'sl-c-3', title: 'Mesas e cadeiras limpas — cadeiras em cima das mesas (1º e térreo)', description: 'Limpar mesas e cadeiras; empilhar as cadeiras sobre as mesas nos dois andares.', status: TaskStatus.PENDING },
        { id: 'sl-c-4', title: 'Fechar portas automáticas (verificar trilhos)', description: 'Fechar todas as portas automáticas e verificar o estado dos trilhos.', status: TaskStatus.PENDING },
        { id: 'sl-c-5', title: 'Todas as janelas devidamente fechadas?', description: 'Percorrer o salão para garantir que todas as janelas estão fechadas.', status: TaskStatus.PENDING },
        { id: 'sl-c-6', title: 'Gás da pizzaria está fechado?', description: 'Confirmar que o registro de gás da pizzaria foi fechado.', status: TaskStatus.PENDING },
        { id: 'sl-c-7', title: 'Telões e TVs foram todos desligados?', description: 'Verificar e desligar todos os telões e televisores do salão.', status: TaskStatus.PENDING },
        { id: 'sl-c-8', title: 'Som ambiente desligado? (salão e banheiro)', description: 'Desligar o sistema de som de todos os ambientes, incluindo banheiros.', status: TaskStatus.PENDING },
        { id: 'sl-c-9', title: 'Aparelhos de TV foram desligados?', description: 'Confirmar que todos os aparelhos de TV estão desligados.', status: TaskStatus.PENDING },
        { id: 'sl-c-10', title: 'Conferir freezers que devem ser desligados (check list BAR)', description: 'Verificar quais freezers devem ser desligados conforme o checklist do bar.', status: TaskStatus.PENDING },
        { id: 'sl-c-11', title: 'Todas as luzes do salão estão desligadas?', description: 'Percorrer o salão para garantir que todas as luzes foram apagadas.', status: TaskStatus.PENDING },
        { id: 'sl-c-12', title: 'Logo VBQ está desligado?', description: 'Verificar e desligar o letreiro/logo VBQ.', status: TaskStatus.PENDING },
        { id: 'sl-c-13', title: 'Geladeiras e freezers ligados e funcionando? (cozinha)', description: 'Confirmar que geladeiras e freezers da cozinha estão ligados e em perfeito estado.', status: TaskStatus.PENDING },
        { id: 'sl-c-14', title: 'Câmaras na temperatura correta, organizadas e funcionando?', description: 'Verificar temperatura, organização e funcionamento das câmaras frias.', status: TaskStatus.PENDING },
        { id: 'sl-c-15', title: 'Chaves do estoque, produção, gás e adega no lugar certo?', description: 'Conferir que todas as chaves foram guardadas nos locais corretos.', status: TaskStatus.PENDING },
        { id: 'sl-c-16', title: 'Estoque e produção estão trancados?', description: 'Verificar e trancar as áreas de estoque e produção.', status: TaskStatus.PENDING },
        { id: 'sl-c-17', title: 'Equipamentos da cozinha desligados?', description: 'Confirmar que todos os equipamentos da cozinha foram desligados.', status: TaskStatus.PENDING },
        { id: 'sl-c-18', title: 'Todos os malotes dos caixas foram entregues e guardados?', description: 'Verificar a entrega e guarda de todos os malotes de cada caixa.', status: TaskStatus.PENDING },
        { id: 'sl-c-19', title: 'Todo o lixo foi colocado nos containers?', description: 'Confirmar que todo o lixo do salão foi encaminhado aos containers externos.', status: TaskStatus.PENDING },
        { id: 'sl-c-20', title: 'Alarme acionado corretamente?', description: 'Verificar e acionar o sistema de alarme antes de sair.', status: TaskStatus.PENDING },
        { id: 'sl-c-21', title: 'Alguma manutenção identificada?', description: 'Registrar nas observações qualquer necessidade de manutenção identificada no turno.', status: TaskStatus.PENDING },
        { id: 'sl-c-22', title: 'Chave do estoque, produção, brinquedoteca e adega no local certo?', description: 'Confirmar que as chaves foram deixadas nos locais corretos ao encerrar.', status: TaskStatus.PENDING },
        { id: 'sl-c-23', title: 'Enviar venda do dia ao gestor', description: 'Enviar o relatório de vendas do dia ao gestor responsável.', status: TaskStatus.PENDING }
      ]
    }
  },

  {
    id: 'sushi',
    name: 'Sushi',
    icon: '🍣',
    employeeName: {},
    observations: {},
    finalizedAt: {},
    tasks: {
      [ChecklistType.OPENING]: [
        // ── ROTATIVIDADE DE PRODUTOS ──
        { id: 'su-o-1', title: 'Rotatividade de produtos (PVPS)', description: 'Verificar e aplicar a rotatividade correta dos produtos — Primeiro que Vence, Primeiro que Sai.', status: TaskStatus.PENDING },
        { id: 'su-o-2', title: 'Área do Sushi — limpa, organizada e com insumos', description: 'Confirmar que a área está limpa, organizada e com insumos suficientes para o plantão.', status: TaskStatus.PENDING },
        { id: 'su-o-3', title: 'Peixe suficiente para o plantão?', description: 'Verificar estoque de peixe e solicitar reposição se necessário antes de iniciar o serviço.', status: TaskStatus.PENDING },
        // ── EQUIPAMENTOS EM GERAL ──
        { id: 'su-o-4', title: 'Bancada refrigerada do Sushi — limpa e ligada', description: 'Conferir limpeza da bancada refrigerada e se está ligada na temperatura correta.', status: TaskStatus.PENDING },
        { id: 'su-o-5', title: 'Lixeiras limpas e vazias', description: 'Verificar se todas as lixeiras da área estão higienizadas e prontas para uso.', status: TaskStatus.PENDING },
        // ── ITENS COMPLEMENTARES ──
        { id: 'su-o-6', title: 'Impressoras ligadas?', description: 'Confirmar que as impressoras estão ligadas e funcionando antes de iniciar o serviço.', status: TaskStatus.PENDING },
        { id: 'su-o-7', title: 'Geladeiras todas ligadas e devidamente fechadas', description: 'Verificar todas as geladeiras: temperatura, porta fechada e funcionamento adequado.', status: TaskStatus.PENDING },
        { id: 'su-o-8', title: 'Geral — Depósitos/estoques limpos e organizados', description: 'Inspecionar o estado geral dos depósitos e estoques da área do Sushi.', status: TaskStatus.PENDING },
        { id: 'su-o-9', title: 'Armazenamento dos produtos (refrigerado/congelado/rotação)', description: 'Verificar se os produtos estão armazenados corretamente: temperatura e rotação adequadas.', status: TaskStatus.PENDING },
        { id: 'su-o-10', title: 'Anotar desperdício do salmão', description: 'Registrar nas observações o peso/quantidade de salmão descartado neste plantão.', status: TaskStatus.PENDING },
        { id: 'su-o-11', title: 'Anotar quantidade de filé aproveitado do salmão', description: 'Registrar nas observações a quantidade de filé de salmão aproveitado neste plantão.', status: TaskStatus.PENDING }
      ],
      [ChecklistType.CLOSING]: [
        // ── LIMPEZAS ──
        { id: 'su-c-1', title: 'Limpeza — Piso, Bancadas, Pias, Boquetas, Prateleiras', description: 'Realizar limpeza completa de todas as superfícies da área do Sushi.', status: TaskStatus.PENDING },
        { id: 'su-c-2', title: 'Limpeza de Ralos e Calhas — recolher excesso de alimentos', description: 'Limpar ralos e calhas removendo resíduos de alimentos acumulados.', status: TaskStatus.PENDING },
        { id: 'su-c-3', title: 'Limpeza — Utensílios, Tábuas de corte, Hortifruti em caixa clorada', description: 'Higienizar utensílios e tábuas de corte; deixar hortifruti em solução clorada.', status: TaskStatus.PENDING },
        { id: 'su-c-4', title: 'Guardar insumos do Sushi (câmara / balcão refrigerado / freezer)', description: 'Acondicionar todos os insumos nos equipamentos de refrigeração adequados.', status: TaskStatus.PENDING },
        { id: 'su-c-5', title: 'Guardar produtos decorativos da boqueta no local correto', description: 'Organizar e guardar os itens decorativos da boqueta nos seus devidos lugares.', status: TaskStatus.PENDING },
        { id: 'su-c-6', title: 'Verificar limpeza e etiquetagem', description: 'Conferir se todos os produtos estão limpos e etiquetados corretamente.', status: TaskStatus.PENDING },
        { id: 'su-c-7', title: 'Rotatividade de produtos (PVPS)', description: 'Verificar e aplicar a rotatividade — Primeiro que Vence, Primeiro que Sai.', status: TaskStatus.PENDING },
        // ── EQUIPAMENTOS EM GERAL ──
        { id: 'su-c-8', title: 'Bancada refrigerada do Sushi — limpa e ligada?', description: 'Confirmar que a bancada refrigerada está limpa e permanecerá ligada durante o período fechado.', status: TaskStatus.PENDING },
        { id: 'su-c-9', title: 'Lixeiras do Sushi — limpas e vazias?', description: 'Esvaziar e higienizar todas as lixeiras da área ao final do turno.', status: TaskStatus.PENDING },
        { id: 'su-c-10', title: 'Coifas e exaustores desligados?', description: 'Verificar e desligar todas as coifas e exaustores da área do Sushi.', status: TaskStatus.PENDING },
        { id: 'su-c-11', title: 'Produtos devidamente etiquetados — Bancada do Sushi?', description: 'Confirmar que todos os produtos na bancada estão com etiqueta de validade/data.', status: TaskStatus.PENDING },
        { id: 'su-c-12', title: 'Estante e prateleiras — limpas e organizadas?', description: 'Verificar o estado de limpeza e organização de estantes e prateleiras.', status: TaskStatus.PENDING },
        { id: 'su-c-13', title: 'Ventilador do Sushi está desligado?', description: 'Confirmar que o ventilador da área do Sushi foi desligado ao término do turno.', status: TaskStatus.PENDING },
        // ── ITENS COMPLEMENTARES ──
        { id: 'su-c-14', title: 'Impressoras desligadas?', description: 'Verificar se todas as impressoras da área estão desligadas.', status: TaskStatus.PENDING },
        { id: 'su-c-15', title: 'Geral — Depósitos/estoques limpos e organizados?', description: 'Inspecionar depósitos e estoques da área ao final do turno.', status: TaskStatus.PENDING },
        { id: 'su-c-16', title: 'Armazenamento dos produtos (refrigerado/congelado/rotação)?', description: 'Verificar correta armazenagem de todos os produtos conforme temperatura e rotação.', status: TaskStatus.PENDING },
        { id: 'su-c-17', title: 'Iluminação desligada e torneiras fechadas?', description: 'Confirmar que todas as luzes foram apagadas e torneiras estão fechadas.', status: TaskStatus.PENDING },
        { id: 'su-c-18', title: 'Copa — limpa e organizada; copos, taças e utensílios nos devidos lugares?', description: 'Verificar a copa: limpeza geral e utensílios guardados corretamente.', status: TaskStatus.PENDING },
        { id: 'su-c-19', title: 'Perfex usados de molho em clorado para reutilizar nas tábuas de corte?', description: 'Deixar os perfex usados em solução clorada para higienização e reuso no dia seguinte.', status: TaskStatus.PENDING },
        { id: 'su-c-20', title: 'Pano de chão de molho no balde?', description: 'Confirmar que o pano de chão foi colocado de molho no balde ao final do turno.', status: TaskStatus.PENDING },
        { id: 'su-c-21', title: 'Limpeza do ralo da porta do Sushi realizada?', description: 'Verificar e limpar o ralo localizado na porta da área do Sushi.', status: TaskStatus.PENDING },
        { id: 'su-c-22', title: 'Limpeza da porta do Sushi realizada?', description: 'Confirmar que a porta do Sushi foi limpa ao término do turno.', status: TaskStatus.PENDING }
      ]

    }
  },
  {
    id: 'pizzaria',
    name: 'Pizzaria',
    icon: '🍕',
    employeeName: {},
    observations: {},
    finalizedAt: {},
    tasks: {
      [ChecklistType.OPENING]: [
        // ── ROTATIVIDADE DE PRODUTOS ──
        { id: 'pz-o-1', title: 'Rotatividade de produtos (PVPS)', description: 'Verificar e aplicar a rotatividade correta — Primeiro que Vence, Primeiro que Sai.', status: TaskStatus.PENDING },
        { id: 'pz-o-2', title: 'Área da Pizzaria — limpa, organizada e com insumos', description: 'Confirmar que a área está limpa, organizada e com insumos suficientes para o plantão.', status: TaskStatus.PENDING },
        // ── EQUIPAMENTOS EM GERAL ──
        { id: 'pz-o-3', title: 'Bancada refrigerada da Pizzaria — limpa e ligada', description: 'Conferir limpeza da bancada refrigerada e se está ligada na temperatura correta.', status: TaskStatus.PENDING },
        { id: 'pz-o-4', title: 'Lixeiras limpas e vazias', description: 'Verificar se todas as lixeiras da área estão higienizadas e prontas para uso.', status: TaskStatus.PENDING },
        { id: 'pz-o-5', title: 'Coifas e exaustores ligados', description: 'Confirmar que as coifas e exaustores estão ligados antes de iniciar o serviço.', status: TaskStatus.PENDING },
        { id: 'pz-o-6', title: 'Forno — limpo e ligado (30 min antes do rodízio)', description: 'Ligar o forno ao menos 30 minutos antes de iniciar o rodízio e verificar limpeza.', status: TaskStatus.PENDING },
        // ── ITENS COMPLEMENTARES ──
        { id: 'pz-o-7', title: 'Impressoras ligadas?', description: 'Confirmar que as impressoras estão ligadas e funcionando.', status: TaskStatus.PENDING },
        { id: 'pz-o-8', title: 'Geladeiras todas ligadas e devidamente fechadas', description: 'Verificar todas as geladeiras: temperatura, porta fechada e funcionamento adequado.', status: TaskStatus.PENDING },
        { id: 'pz-o-9', title: 'Geral — Depósitos/estoques limpos e organizados', description: 'Inspecionar o estado geral dos depósitos e estoques da área da Pizzaria.', status: TaskStatus.PENDING },
        { id: 'pz-o-10', title: 'Armazenamento dos produtos (refrigerado/congelado/rotação)', description: 'Verificar se os produtos estão armazenados corretamente: temperatura e rotação.', status: TaskStatus.PENDING },
        { id: 'pz-o-11', title: 'Gás e iluminação ligados?', description: 'Confirmar que o gás está aberto e a iluminação da área está funcionando.', status: TaskStatus.PENDING },
        { id: 'pz-o-12', title: 'Verificar nível de gás', description: 'Checar o botijão/medidor de gás e solicitar reposição se necessário.', status: TaskStatus.PENDING },
        { id: 'pz-o-13', title: 'O LED do Sushi está ligado?', description: 'Confirmar que a iluminação LED do Sushi está ligada para o serviço.', status: TaskStatus.PENDING }
      ],
      [ChecklistType.CLOSING]: [
        // ── LIMPEZAS ──
        { id: 'pz-c-1', title: 'Limpeza — Piso, Bancadas, Pias, Boquetas, Prateleiras', description: 'Realizar limpeza completa de todas as superfícies da área da Pizzaria.', status: TaskStatus.PENDING },
        { id: 'pz-c-2', title: 'Limpeza de Ralos e Calhas — recolher excesso de alimentos', description: 'Limpar ralos e calhas removendo resíduos de alimentos acumulados.', status: TaskStatus.PENDING },
        { id: 'pz-c-3', title: 'Limpeza — Utensílios, Tábuas de corte, Hortifruti em caixa clorada', description: 'Higienizar utensílios e tábuas; deixar hortifruti em solução clorada.', status: TaskStatus.PENDING },
        { id: 'pz-c-4', title: 'Guardar insumos da Pizzaria/Sushi (câmara / balcão / freezer)', description: 'Acondicionar todos os insumos nos equipamentos de refrigeração adequados.', status: TaskStatus.PENDING },
        { id: 'pz-c-5', title: 'Guardar produtos decorativos da boqueta no local correto', description: 'Organizar e guardar os itens decorativos da boqueta nos seus devidos lugares.', status: TaskStatus.PENDING },
        { id: 'pz-c-6', title: 'Verificar limpeza e etiquetagem', description: 'Conferir se todos os produtos estão limpos e etiquetados corretamente.', status: TaskStatus.PENDING },
        { id: 'pz-c-7', title: 'Rotatividade de produtos (PVPS)', description: 'Verificar e aplicar a rotatividade — Primeiro que Vence, Primeiro que Sai.', status: TaskStatus.PENDING },
        // ── EQUIPAMENTOS EM GERAL ──
        { id: 'pz-c-8', title: 'Bancada refrigerada da Pizzaria — limpa e ligada?', description: 'Confirmar que a bancada refrigerada está limpa e permanecerá ligada.', status: TaskStatus.PENDING },
        { id: 'pz-c-9', title: 'Lixeiras da Pizzaria — limpas e vazias?', description: 'Esvaziar e higienizar todas as lixeiras da área ao final do turno.', status: TaskStatus.PENDING },
        { id: 'pz-c-10', title: 'Coifas e exaustores desligados', description: 'Verificar e desligar todas as coifas e exaustores da Pizzaria.', status: TaskStatus.PENDING },
        { id: 'pz-c-11', title: 'Forno de pizza — limpeza diária', description: 'Realizar a limpeza completa do forno ao final de cada turno.', status: TaskStatus.PENDING },
        { id: 'pz-c-12', title: 'Peneirar o fubá diariamente', description: 'Peneirar o fubá ao final do serviço para reutilização no dia seguinte.', status: TaskStatus.PENDING },
        { id: 'pz-c-13', title: 'Produtos devidamente etiquetados — Bancada da Pizzaria?', description: 'Confirmar que todos os produtos na bancada estão com etiqueta de validade/data.', status: TaskStatus.PENDING },
        // ── ITENS COMPLEMENTARES ──
        { id: 'pz-c-14', title: 'Impressoras desligadas', description: 'Verificar se todas as impressoras da área estão desligadas.', status: TaskStatus.PENDING },
        { id: 'pz-c-15', title: 'Geral — Depósitos/estoques limpos e organizados', description: 'Inspecionar depósitos e estoques da área ao final do turno.', status: TaskStatus.PENDING },
        { id: 'pz-c-16', title: 'Armazenamento dos produtos (refrigerado/congelado/rotação)', description: 'Verificar correta armazenagem conforme temperatura e rotação.', status: TaskStatus.PENDING },
        { id: 'pz-c-17', title: 'Gás e iluminação desligados, torneiras fechadas', description: 'Confirmar que o gás foi fechado, luzes apagadas e torneiras fechadas.', status: TaskStatus.PENDING },
        { id: 'pz-c-18', title: 'Copa — limpa e organizada; utensílios nos devidos lugares', description: 'Verificar a copa: limpeza geral e utensílios guardados corretamente.', status: TaskStatus.PENDING },
        { id: 'pz-c-19', title: 'Perfex usados de molho em clorado para reutilizar nas tábuas', description: 'Deixar os perfex em solução clorada para higienização e reuso no dia seguinte.', status: TaskStatus.PENDING },
        { id: 'pz-c-20', title: 'Pano de chão de molho no balde', description: 'Confirmar que o pano de chão foi colocado de molho no balde ao final do turno.', status: TaskStatus.PENDING },
        { id: 'pz-c-21', title: 'O LED do Sushi está desligado?', description: 'Confirmar que a iluminação LED do Sushi foi desligada ao encerrar o serviço.', status: TaskStatus.PENDING },
        { id: 'pz-c-22', title: 'Pedido de hortifruti foi feito?', description: 'Confirmar que o pedido de hortifruti para o próximo dia foi realizado.', status: TaskStatus.PENDING }
      ]
    }
  }
];

