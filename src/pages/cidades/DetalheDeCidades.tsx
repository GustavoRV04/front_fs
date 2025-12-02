import { useNavigate, useParams } from "react-router-dom";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { useEffect, useState } from "react";
import { IDetalheCidade, CidadesService } from "../../shared/services/api/cidades/CidadesService";
import { useForm } from "react-hook-form";
import { VTextField } from "../../shared/forms";
import { Box, Paper, Stack, Typography, LinearProgress } from "@mui/material";
import * as yup from 'yup';

interface IFormData {
    nome: string;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
});

export const DetalheDeCidades: React.FC = () => {
    const { id = 'nova' } = useParams<'id'>();

    const ensureNumberId = (id: any): number => {
    if (typeof id === 'number') return id;
    if (typeof id === 'string') {
        const num = parseInt(id, 10);
        return isNaN(num) ? 0 : num;
    }
    return 0;
};

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [nome, setNome] = useState('');

    const { handleSubmit, control, reset } = useForm<IFormData>({
        defaultValues: {
            nome: '',
        }
    });

   const handleSaveAction = (data: IFormData): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (isSaving) {
            resolve();
            return;
        }

        setIsSaving(true);
        
        formValidationSchema
            .validate(data, { abortEarly: false })
            .then((dadosValidados) => {
                setIsLoading(true);

                const baseData = {
                    nome: dadosValidados.nome,
                };

                if (id === 'nova') {
                    CidadesService
                        .create(baseData)
                        .then((result) => {
                            setIsLoading(false);
                            setIsSaving(false);

                            if (result instanceof Error) {
                                alert(result.message);
                                reject(result);
                            } else {
                                // result JÁ É número graças ao serviço
                                console.log('Cidade criada com ID (número):', result);
                                alert('Cidade criada com sucesso!');
                                resolve();
                            }
                        })
                        .catch((error) => {
                            setIsLoading(false);
                            setIsSaving(false);
                            console.error('Erro na criação:', error);
                            alert(error.message || 'Erro ao salvar');
                            reject(error);
                        });
                } else {
                    // Garante que o ID seja número
                    const numericId = ensureNumberId(id);
                    const dataToUpdate: IDetalheCidade = {
                        id: numericId,
                        ...baseData
                    };

                    CidadesService
                        .updateById(numericId, dataToUpdate)
                        .then((result) => {
                            setIsLoading(false);
                            setIsSaving(false);

                            if (result instanceof Error) {
                                alert(result.message);
                                reject(result);
                            } else {
                                alert('Cidade atualizada com sucesso!');
                                resolve();
                            }
                        })
                        .catch((error) => {
                            setIsLoading(false);
                            setIsSaving(false);
                            alert(error.message || 'Erro ao salvar');
                            reject(error);
                        });
                }
            })
            .catch((errors: yup.ValidationError) => {
                setIsSaving(false);
                const errorMessages = errors.inner.map(error => error.message).join('\n');
                alert(errorMessages);
                resolve();
            });
    });
};

    // Funções para os botões - VERSÃO SEGURA
    const handleSave = () => {
        handleSubmit(async (data) => {
            try {
                await handleSaveAction(data);
                // Para salvar simples, não faz nada
            } catch (error) {
                // Ignora erros
            }
        })();
    };

    const handleSaveAndClose = () => {
        handleSubmit(async (data) => {
            try {
                await handleSaveAction(data);
                // Navega para listagem sem tentar consultar o registro
                navigate('/cidades');
            } catch (error) {
                // Não navega em caso de erro
            }
        })();
    };

    const handleSaveAndNew = () => {
        handleSubmit(async (data) => {
            try {
                await handleSaveAction(data);
                // Reseta o formulário para novo cadastro
                reset({ nome: '' });
                setNome('');
                navigate('/cidades/detalhe/nova');
            } catch (error) {
                // Não navega em caso de erro
            }
        })();
    };

    useEffect(() => {
    if (id !== 'nova') {
        setIsLoading(true);
        
        // Garante que o ID seja número
        const numericId = ensureNumberId(id);
        
        CidadesService.getById(numericId)
        .then((result) => {
            setIsLoading(false);
            if (result instanceof Error) {
                alert(result.message);
                navigate('/cidades');
            } else {
                setNome(result.nome);
                reset({
                    nome: result.nome,
                });
            }
        })
        .catch(() => {
            setIsLoading(false);
        });
    } else {
        reset({
            nome: '',
        });
    }
}, [id]);

    const handleDelete = (id: number) => {
        if (window.confirm('Realmente deseja apagar?')) {
            setIsLoading(true);
            CidadesService.deleteById(id)
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/cidades');
                    }
                })
                .catch(() => setIsLoading(false));
        }
    };

    return (
        <LayoutBaseDePagina 
            titulo={id === 'nova' ? 'Nova Cidade' : nome} 
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    textoBotaoNovo="Nova"
                    mostrarBotaoSalvarEVoltar
                    mostrarBotaoNovo={id !== 'nova'}
                    mostrarBotaoApagar={id !== 'nova'}
                    aoClicarEmApagar={() => handleDelete(Number(id))}
                    aoClicarEmNovo={() => navigate('/cidades/detalhe/nova')}
                    aoClicarEmSalvar={handleSave}
                    aoClicarEmVoltar={() => navigate('/cidades')}
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
                                name="nome" 
                                label="Nome"
                                disabled={isLoading} 
                                onChange={e => setNome(e.target.value)}
                            />
                        </Stack>
                    </Box>
                </Paper>
            </form>
        </LayoutBaseDePagina>
    );
};