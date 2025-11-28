import { Enviroment } from "../../../enviroment";
import { api } from "../axios-config";


export interface IListagemPessoa {
    id: number;
    cidadeId: number;
    nomeCompleto: string;
    email: string;
};

export interface IDetalhePessoa {
    id: number;
    cidadeId: number;
    nomeCompleto: string;
    email: string;
};



type TPessoasComTotalCount = {
    data: IListagemPessoa[];
    totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TPessoasComTotalCount | Error> => {
  try {
    // 1. Buscamos TODOS os dados (sem paginar na URL)
    // Usamos '/pessoas' direto. Se o server limitar, tentamos forçar um limite alto.
    const urlRelativa = `/pessoas?_per_page=10000`; 

    const { data } = await api.get(urlRelativa);

    if (data) {
      // 2. Normalização dos Dados (Compatibilidade v1 vs Antigo)
      // Se vier no formato novo { data: [...], items: ... }, pegamos o array interno.
      // Se vier no formato antigo [...], usamos ele direto.
      let listaCompleta: IListagemPessoa[] = [];
      
      if (data.data && Array.isArray(data.data)) {
        listaCompleta = data.data;
      } else if (Array.isArray(data)) {
        listaCompleta = data;
      }

      // 3. Filtragem Manual (Front-end)
      // Se houver filtro, mantemos apenas quem tem o nome parecido
      if (filter) {
        listaCompleta = listaCompleta.filter(item => 
          item.nomeCompleto.toLowerCase().includes(filter.toLowerCase())
        );
      }

      // 4. Paginação Manual (Front-end)
      // Calculamos onde começa e onde termina a página atual
      const limite = Enviroment.LIMITE_DE_LINHAS; // Ex: 7
      const inicio = (page - 1) * limite;
      const fim = inicio + limite;

      const listaPaginada = listaCompleta.slice(inicio, fim);

      // 5. Retorno
      return {
        data: listaPaginada,
        totalCount: listaCompleta.length, // Total filtrado
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};


const getById = async (id: number): Promise<IDetalhePessoa | Error> => {
    try {
        const { data } = await api.get(`/pessoas/${id}`);

        if (data) {
            return data;
        }
        return new Error('Erro ao consultar o registro.');

    } catch (error) {
        console.error(error);
        return new Error((error as { massage: string}).massage || 'Erro ao consultar o registro.');

    }
};

const create = async (dados: Omit<IDetalhePessoa, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await api.post<IDetalhePessoa>(`/pessoas`, dados);

        if (data) {
            return data.id;
        }
        return new Error('Erro ao registrar.');

    } catch (error) {
        console.error(error);
        return new Error((error as { massage: string}).massage || 'Erro ao registrar.');

    }

};

const updateById = async (id: number, dados: IDetalhePessoa): Promise<void | Error> => {
    try {
        await api.put(`/pessoas/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as { massage: string}).massage || 'Erro ao atualizar.');

    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await api.delete(`/pessoas/${id}`);
    } catch (error) {
        console.error(error);
        return new Error((error as { massage: string}).massage || 'Erro ao deletar.');

    }
};

export const PessoasService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
};