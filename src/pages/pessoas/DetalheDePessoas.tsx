import { useNavigate, useParams } from "react-router-dom";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { useEffect, useState } from "react";
import { IDetalhePessoa, PessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { useForm } from "react-hook-form";
import { VTextField, useVForm } from "../../shared/forms";
import { Box, Paper, Stack, Typography, LinearProgress } from "@mui/material";
import * as yup from 'yup';
import { AutoCompleteCidade } from "./components/AutoCompleteCidade";

interface IFormData {
    nomeCompleto: string;
    email: string;
    cidadeId: string;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    nomeCompleto: yup.string().required().min(3),
    email: yup.string().email().required(),
    cidadeId: yup.string().required()
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

    const handleSaveAction = (data: IFormData): Promise<void> => {
        return new Promise((resolve, reject) => {
            formValidationSchema
                .validate(data, { abortEarly: false })
                .then((dadosValidados) => {
                    setIsLoading(true);

                    // Converter cidadeId de string para number
                    const baseData = {
                        nomeCompleto: dadosValidados.nomeCompleto,
                        email: dadosValidados.email,
                        cidadeId: Number(dadosValidados.cidadeId)
                    };

                    if (id === 'nova') {
                        PessoasService
                            .create(baseData)
                            .then((result) => {
                                setIsLoading(false);

                                if (result instanceof Error) {
                                    alert(result.message);
                                    reject(result);
                                } else {
                                    alert('Pessoa criada com sucesso!');
                                    resolve();
                                }
                            })
                            .catch((error) => {
                                setIsLoading(false);
                                reject(error);
                            });
                    } else {
                        const dataToUpdate: IDetalhePessoa = {
                            id: Number(id),
                            ...baseData
                        };

                        PessoasService
                            .updateById(Number(id), dataToUpdate)
                            .then((result) => {
                                setIsLoading(false);

                                if (result instanceof Error) {
                                    alert(result.message);
                                    reject(result);
                                } else {
                                    alert('Pessoa atualizada com sucesso!');
                                    resolve();
                                }
                            })
                            .catch((error) => {
                                setIsLoading(false);
                                reject(error);
                            });
                    }
                })
                .catch((errors: yup.ValidationError) => {
                    const errorMessages = errors.inner.map(error => error.message).join('\n');
                    alert(errorMessages);
                    // Rejeita com um erro simples para evitar o ValidationError no console
                    reject(new Error('Erro de validação'));
                });
        });
    };

    const handleSaveAndNewAction = (data: IFormData): Promise<void> => {
        return handleSaveAction(data)
            .then(() => {
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
            });
    };

    const handleSaveAndCloseAction = (data: IFormData): Promise<void> => {
        return handleSaveAction(data)
            .then(() => {
                // Navega para a listagem independente de ser novo ou edição
                navigate('/pessoas');
            });
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
                            <AutoCompleteCidade/>
                        </Stack>
                    </Box>
                </Paper>
            </form>
        </LayoutBaseDePagina>
    );
};