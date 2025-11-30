import { useNavigate, useParams } from "react-router-dom";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { useEffect, useState } from "react";
import { IDetalhePessoa, PessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { useForm } from "react-hook-form";
import { VTextField, useVForm } from "../../shared/forms";
import { Box, Paper, Stack, Typography, LinearProgress } from "@mui/material";
import * as yup from 'yup';

interface IFormData {
    nomeCompleto: string;
    email: string;
    cidadeId: string;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    nomeCompleto: yup.string().required('Nome completo é obrigatório').min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
    email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
    cidadeId: yup.string().required('O Id da Cidade é obrigatório')
});

export const DetalheDePessoas: React.FC = () => {
    const { id = 'nova' } = useParams<'id'>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');

    const { handleSubmit, control, reset } = useForm<IFormData>({
        defaultValues: {
            nomeCompleto: '',
            email: '',
            cidadeId: ''
        }
    });

    const handleSaveAction = async (data: IFormData): Promise<void> => {
        try {
            // Validação com Yup
            await formValidationSchema.validate(data, { abortEarly: false });
            
            setIsLoading(true);

            // Converter cidadeId de string para number
            const baseData = {
                nomeCompleto: data.nomeCompleto,
                email: data.email,
                cidadeId: Number(data.cidadeId)
            };

            if (id === 'nova') {
                // Para criação sem o id
                const result = await PessoasService.create(baseData);
                if (result instanceof Error) {
                    alert(result.message);
                    throw result;
                } else {
                    alert('Pessoa criada com sucesso!');
                    // Navega para o detalhe do novo registro
                    navigate(`/pessoas/detalhe/${result}`);
                }
            } else {
                // Para atualização com o id
                const dataToUpdate: IDetalhePessoa = {
                    id: Number(id),
                    ...baseData
                };
                
                const result = await PessoasService.updateById(Number(id), dataToUpdate);
                if (result instanceof Error) {
                    alert(result.message);
                    throw result;
                } else {
                    alert('Pessoa atualizada com sucesso!');
                }
            }
        } catch (error: any) {
            // Tratamento de erros de validação do Yup
            if (error.name === 'ValidationError') {
                const errorMessages = error.errors.join('\n');
                alert(errorMessages);
            } 
            // Tratamento de erros da API
            else if (error instanceof Error) {
                alert(error.message);
            } 
            // Erro genérico
            else {
                alert('Erro ao salvar os dados');
            }
            // Não relançar o erro para evitar que o useVForm tente processá-lo novamente
            return;
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAndNewAction = async (data: IFormData): Promise<void> => {
        await handleSaveAction(data);
        // Se for criação nova, já navegamos no handleSaveAction
        // Se for edição, navegamos para novo
        if (id !== 'nova') {
            reset({
                nomeCompleto: '',
                email: '',
                cidadeId: ''
            });
            setNome('');
            navigate('/pessoas/detalhe/nova');
        }
    };

    const handleSaveAndCloseAction = async (data: IFormData): Promise<void> => {
        await handleSaveAction(data);
        // Navega para a listagem independente de ser novo ou edição
        navigate('/pessoas');
    };

    const {
        handleSave,
        handleSaveAndNew,
        handleSaveAndClose,
        handleIsSaveAndNew,
        handleIsSaveAndClose
    } = useVForm({
        handleSubmit,
        onSave: handleSaveAction,
        onSaveAndNew: handleSaveAndNewAction,
        onSaveAndClose: handleSaveAndCloseAction
    });

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
                    reset({
                        nomeCompleto: result.nomeCompleto,
                        email: result.email,
                        cidadeId: String(result.cidadeId)
                    });
                }
            });
        } else {
            reset({
                nomeCompleto: '',
                email: '',
                cidadeId: ''
            });
        }
    }, [id]);

    const handleDelete = (id: number) => {
        if (window.confirm('Realmente deseja apagar?')) {
            setIsLoading(true);
            PessoasService.deleteById(id)
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/pessoas');
                    }
                })
                .catch(() => setIsLoading(false));
        }
    };

    return (
        <LayoutBaseDePagina 
            titulo={id === 'nova' ? 'Nova Pessoa' : nome} 
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    textoBotaoNovo="Nova"
                    mostrarBotaoSalvarEVoltar
                    mostrarBotaoNovo={id !== 'nova'}
                    mostrarBotaoApagar={id !== 'nova'}
                    aoClicarEmApagar={() => handleDelete(Number(id))}
                    aoClicarEmNovo={() => navigate('/pessoas/detalhe/nova')}
                    aoClicarEmSalvar={handleSave}
                    aoClicarEmVoltar={() => navigate('/pessoas')}
                    aoClicarEmSalvarEVoltar={handleSaveAndClose}
                    aoClicarEmSalvarENovo={handleSaveAndNew}
                />
            }
        >
            <form>
                <Paper
                    elevation={1}
                    sx={{
                        margin: 1,
                        width: '100%',
                        padding: 2
                    }}
                >
                    <Box 
                        sx={{ 
                            width: '100%',
                            maxWidth: { xs: '80%', sm: 400, md: 600, lg: 700 },
                        }}
                    >
                        {(isLoading) && (
                            <LinearProgress variant="indeterminate" />
                        )}

                        <Stack margin={1}>
                            <Typography variant="h6">Geral</Typography>
                        </Stack>

                        <Stack spacing={2}>
                            <VTextField
                                fullWidth
                                control={control} 
                                name="nomeCompleto" 
                                label="Nome Completo"
                                disabled={isLoading} 
                                onChange={e => setNome(e.target.value)}
                            />
                            <VTextField 
                                fullWidth
                                control={control} 
                                name="email" 
                                label="E-mail" 
                                disabled={isLoading} 
                            />
                            <VTextField
                                fullWidth 
                                control={control}
                                name="cidadeId" 
                                label="Cidade" 
                                disabled={isLoading} 
                            />
                        </Stack>
                    </Box>
                </Paper>
            </form>
        </LayoutBaseDePagina>
    );
};