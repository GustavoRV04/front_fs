import { Enviroment } from "../../../enviroment";
import { api } from "../axios-config";

// Funções utilitárias direto no arquivo
const ensureNumberId = (id: any): number => {
    if (id === null || id === undefined) {
        return 0;
    }
    
    if (typeof id === 'number') {
        return id;
    }
    
    if (typeof id === 'string') {
        const num = parseInt(id, 10);
        if (!isNaN(num)) {
            return num;
        }
        
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = ((hash << 5) - hash) + id.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash) % 10000;
    }
    
    return Date.now() % 10000;
};

export interface IListagemCidade {
    id: number;
    nome: string;
};

export interface IDetalheCidade {
    id: number;
    nome: string;
};

type TCidadesComTotalCount = {
    data: IListagemCidade[];
    totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TCidadesComTotalCount | Error> => {
  try {
    const urlRelativa = `/cidades?_per_page=10000`;
    const { data } = await api.get(urlRelativa);

    if (data) {
      let rawData: any[] = [];
      
      if (data.data && Array.isArray(data.data)) {
        rawData = data.data;
      } else if (Array.isArray(data)) {
        rawData = data;
      }

      // Converte IDs para números
      const listaCompleta: IListagemCidade[] = rawData.map(item => ({
        id: ensureNumberId(item.id),
        nome: item.nome || ''
      })).filter(item => item.nome);

      // Filtra
      const listaFiltrada = filter
        ? listaCompleta.filter(item => 
            item.nome.toLowerCase().includes(filter.toLowerCase()))
        : listaCompleta;

      // Pagina
      const limite = Enviroment.LIMITE_DE_LINHAS;
      const inicio = (page - 1) * limite;
      const fim = inicio + limite;
      const listaPaginada = listaFiltrada.slice(inicio, fim);

      return {
        data: listaPaginada,
        totalCount: listaFiltrada.length,
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getById = async (id: number): Promise<IDetalheCidade | Error> => {
    try {
        const numericId = ensureNumberId(id);
        const { data } = await api.get(`/cidades/${numericId}`);

        if (data) {
            return {
                id: ensureNumberId(data.id),
                nome: data.nome
            };
        }
        return new Error('Erro ao consultar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
    }
};

const create = async (dados: Omit<IDetalheCidade, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await api.post(`/cidades`, dados);
        if (data) {
            const numericId = ensureNumberId(data.id);
            console.log('ID retornado:', data.id, '→ ID normalizado:', numericId);
            return numericId;
        }
        return new Error('Erro ao registrar.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao registrar.');
    }
};

const updateById = async (id: number, dados: IDetalheCidade): Promise<void | Error> => {
    try {
        const numericId = ensureNumberId(id);
        await api.put(`/cidades/${numericId}`, { ...dados, id: numericId });
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar.');
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        const numericId = ensureNumberId(id);
        await api.delete(`/cidades/${numericId}`);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao deletar.');
    }
};

export const CidadesService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
};