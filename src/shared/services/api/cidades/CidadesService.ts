import { Enviroment } from "../../../enviroment";
import { api } from "../axios-config";

export interface IListagemCidade {
    id: string | number;
    nome: string;
};

export interface IDetalheCidade {
    id: string | number;
    nome: string;
};

type TCidadesComTotalCount = {
    data: IListagemCidade[];
    totalCount: number;
};

// FUNÇÃO CHAVE: Mantém o ID como está (string ou número)
const preserveId = (id: any): string | number => {
    if (id === null || id === undefined || id === '') {
        return 'novo'; // Para novos registros
    }
    
    // Se for número, mantém como número
    if (typeof id === 'number') {
        return id;
    }
    
    // Se for string, mantém como string
    if (typeof id === 'string') {
        return id;
    }
    
    // Para qualquer outro tipo, converte para string
    return String(id);
};

const getAll = async (page = 1, filter = '', noPagination = false): Promise<TCidadesComTotalCount | Error> => {
  try {
    // Busca tudo com limite alto
    const urlRelativa = `/cidades?_limit=1000&size=1000`; 

    const { data } = await api.get(urlRelativa);
    
    if (data) {
      let listaDados: any[] = [];
      if (Array.isArray(data)) {
        listaDados = data;
      } else if (data.data && Array.isArray(data.data)) {
        listaDados = data.data;
      } else if (data.content && Array.isArray(data.content)) {
        listaDados = data.content;
      }

      const cidadesConvertidas: IListagemCidade[] = listaDados.map((c: any) => ({
        id: preserveId(c.id),
        nome: c.nome
      }));

      // FILTRO
      const filtradas = filter
        ? cidadesConvertidas.filter(c => c.nome.toLowerCase().includes(filter.toLowerCase()))
        : cidadesConvertidas;

      // **CORREÇÃO AQUI**: Se for sem paginação, retorna tudo
      let listaFinal = filtradas;
      
      if (!noPagination) {
        // Aplica paginação apenas se não for desativada
        const limite = Enviroment.LIMITE_DE_LINHAS;
        const inicio = (page - 1) * limite;
        const fim = Math.min(inicio + limite, filtradas.length);
        listaFinal = filtradas.slice(inicio, fim);
      }

      return {
        data: listaFinal, 
        totalCount: filtradas.length,
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error('Erro no getAll:', error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getById = async (id: string | number): Promise<IDetalheCidade | Error> => {
    try {
        console.log(`🔍 Buscando cidade ID: ${id} (tipo: ${typeof id})`);
        
        // Converte para string para a URL (json-server aceita strings)
        const idString = String(id);
        const { data } = await api.get(`/cidades/${idString}`);
        
        if (data) {
            console.log('✅ Cidade encontrada:', data);
            return {
                id: preserveId(data.id),
                nome: data.nome
            };
        }
        return new Error('Erro ao consultar o registro.');
    } catch (error) {
        console.error(`❌ Erro ao buscar cidade ${id}:`, error);
        const axiosError = error as any;
        
        if (axiosError.response?.status === 404) {
            // Tenta buscar na lista completa
            const todas = await getAll();
            if (!(todas instanceof Error)) {
                const encontrada = todas.data.find(c => String(c.id) === String(id));
                if (encontrada) {
                    console.log('✅ Encontrada na listagem local:', encontrada);
                    return encontrada;
                }
            }
            return new Error(`Cidade com ID "${id}" não encontrada`);
        }
        
        return new Error(axiosError.message || 'Erro ao consultar o registro.');
    }
};

const create = async (dados: Omit<IDetalheCidade, 'id'>): Promise<string | number | Error> => {
    try {
        console.log('➕ Criando nova cidade:', dados);
        
        // Envia sem ID, json-server gera
        const response = await api.post(`/cidades`, dados);
        
        console.log('📨 Resposta da criação:', response.data);
        
        if (response.data) {
            const idCriado = preserveId(response.data.id);
            console.log(`✅ Cidade criada com ID: ${idCriado}`);
            return idCriado;
        }
        return new Error('Erro ao registrar.');
    } catch (error) {
        console.error('❌ Erro na criação:', error);
        return new Error((error as { message: string }).message || 'Erro ao registrar.');
    }
};

const updateById = async (id: string | number, dados: IDetalheCidade): Promise<void | Error> => {
    try {
        console.log(`✏️ Atualizando cidade ID: ${id}`, dados);
        
        // Converte para string para a URL
        const idString = String(id);
        await api.put(`/cidades/${idString}`, { ...dados, id: preserveId(id) });
        console.log(`✅ Cidade ${id} atualizada com sucesso`);
        
    } catch (error) {
        console.error(`❌ Erro ao atualizar cidade ${id}:`, error);
        const axiosError = error as any;
        
        if (axiosError.response?.status === 404) {
            return new Error(`Cidade com ID "${id}" não encontrada`);
        }
        
        return new Error(axiosError.message || 'Erro ao atualizar.');
    }
};

const deleteById = async (id: string | number): Promise<void | Error> => {
    try {
        console.log(`🗑️ Deletando cidade ID: ${id}`);
        
        // Converte para string para a URL
        const idString = String(id);
        await api.delete(`/cidades/${idString}`);
        console.log(`✅ Cidade ${id} deletada com sucesso`);
        
    } catch (error) {
        console.error(`❌ Erro ao deletar cidade ${id}:`, error);
        const axiosError = error as any;
        
        if (axiosError.response?.status === 404) {
            return new Error(`Cidade com ID "${id}" não encontrada`);
        }
        
        return new Error(axiosError.message || 'Erro ao deletar.');
    }
};

export const CidadesService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
};