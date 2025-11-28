import { useNavigate, useParams } from "react-router-dom";

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { useEffect, useState } from "react";
import { IDetalhePessoa, PessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { useForm, } from "react-hook-form";
import { VTextField } from "../../shared/forms";


 
interface IFormData {
    nomeCompleto: string;
    email: string;
    cidadeId: string; // formulário sempre devolve string
}



export const DetalheDePessoas: React.FC = () => {
    const { id = 'nova' } = useParams<'id'>();
    const navigate = useNavigate();


    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    const { handleSubmit, control, reset } = useForm({
    defaultValues: {
        nomeCompleto: '',
        email: '',
        cidadeId: ''
    }
});


    const onSubmit = (data: any) => {
        console.log(data);
        handleSave(data);
};

    useEffect(() => {
        if (id !== 'nova') {
            setIsLoading(true);

            PessoasService.getById(Number(id))
            .then((result) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    alert(result.message);
                    navigate('/pessoas');
                } else {
                    setNome(result.nomeCompleto);
                    console.log(result);
                    reset({
                        nomeCompleto: result.nomeCompleto,
                        email: result.email,
                        cidadeId: String(result.cidadeId)
                    });
                }
            });
        }
    }, [id]);

     const handleSave = (data: IFormData) => {
        setIsLoading(true);
        // Converter cidadeId de string para number
        const baseData = {
            nomeCompleto: data.nomeCompleto,
            email: data.email,
            cidadeId: Number(data.cidadeId)
        };

        if (id === 'nova') {
            // Para criação sem o id
            PessoasService.create(baseData).then((result) => {
                setIsLoading(false);
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    alert('Pessoa criada com sucesso!');
                    navigate(`/pessoas/detalhe/${result}`);
                }
            });
        } else {
            // Para atualização com o id
            const dataToUpdate: IDetalhePessoa = {
                id: Number(id),
                ...baseData
            };
            
            PessoasService.updateById(Number(id), dataToUpdate).then((result) => {
                setIsLoading(false);
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    alert('Pessoa atualizada com sucesso!');
                }
            });
        }
    };




    const handleDelete = (id: number) => {
        if (window.confirm('Realmente deseja apagar?')) {
        PessoasService.deleteById(id)
            .then(result => {
            if (result instanceof Error) {
                alert(result.message);
            } else {
                alert('Registro apagado com sucesso!');
                navigate('/pessoas');
            }
        
            });

        }

    };


    return (
        <LayoutBaseDePagina 
        titulo={id === 'nova' ? 'Nova Pessoa' : nome} 
        barraDeFerramentas={
            <FerramentasDeDetalhe
            textoBotaoNovo="Nova"
            mostrarBotaoSalvarEVoltar
            mostrarBotaoNovo = {id !== 'nova'}
            mostrarBotaoApagar = {id !== 'nova'}

            aoClicarEmApagar={() => handleDelete(Number(id))}
            aoClicarEmNovo={() => navigate('/pessoas/detalhe/nova')}
            aoClicarEmSalvar={handleSubmit(onSubmit)}
            aoClicarEmVoltar={() => navigate('/pessoas')}
            aoClicarEmSalvarEVoltar={handleSubmit(onSubmit)}
            />
        }
        >

        <form onSubmit={handleSubmit(handleSave)}>
            <VTextField
                control={control}
                name="nomeCompleto"
                placeholder="Nome Completo"

            />
            <VTextField
                control={control}
                name="email"
                placeholder="E-mail"

            />
            <VTextField
                control={control}
                name="cidadeId"
                placeholder="Cidade ID"

            />

            <button type="submit">submit</button>
        </form>




        </LayoutBaseDePagina>
    );
}; 