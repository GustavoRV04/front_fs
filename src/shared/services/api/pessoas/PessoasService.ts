import { Enviroment } from "../../../enviroment";
import { api } from "../axios-config";


interface IListagemPessoa {
    id: number;
    cidadeId: number;
    nomeCompleto: string;
    email: string;
};

interface IDetalhePessoa {
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
        const urlRelativa = `/pessoas?_page=${page}&_limit=${Enviroment.LIMITE_DE_LINHAS}&nomeCompleto_like=${filter}`;

        const { data, headers } = await api.get(urlRelativa);

        if (data) {
            return {
                data,
                totalCount: Number(headers['x-total-count'] || Enviroment.LIMITE_DE_LINHAS),
            };
        }
        return new Error('Erro ao listar os registros.');

    } catch (error) {
        console.error(error);
        return new Error((error as { massage: string}).massage || 'Erro ao listar os registros.');

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

const UpdateById = async (id: number, dados: IDetalhePessoa): Promise<void | Error> => {
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
    UpdateById,
    deleteById,
};