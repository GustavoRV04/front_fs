import { useNavigate, useParams } from "react-router-dom";

import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { useEffect, useState } from "react";
import { PessoasService } from "../../shared/services/api/pessoas/PessoasService";
import {  } from "@unform/web";
import { useForm, } from "react-hook-form";
import { VTextField } from "../../shared/forms";

 


export const DetalheDePessoas: React.FC = () => {
    const { id = 'nova' } = useParams<'id'>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    const { handleSubmit, control } = useForm({
    defaultValues: {
        nomeCompleto: ''
    }
});


    const onSubmit = (data: any) => {
        console.log(data);
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
                }
            });
        }
    }, [id]);

    const handleSave = () => {
        console.log('Salvo');
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
            aoClicarEmSalvar={handleSave}
            aoClicarEmVoltar={() => navigate('/pessoas')}
            aoClicarEmSalvarEVoltar={handleSave}
            />
        }
        >

        <form onSubmit={handleSubmit(onSubmit)}>
            <VTextField
                control={control}
                name="nomeCompleto"
            />

            <button type="submit">submit</button>
        </form>




        </LayoutBaseDePagina>
    );
}; 