import { useNavigate, useParams } from "react-router-dom";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { useEffect, useState } from "react";
import { IDetalheCidade, CidadesService } from "../../shared/services/api/cidades/CidadesService";
import { useForm } from "react-hook-form";
import { VTextField } from "../../shared/forms";
import { Box, Paper, Stack, Typography, LinearProgress } from "@mui/material";

interface IFormData {
    nome: string;
}

export const DetalheDeCidades: React.FC = () => {
    const { id = 'nova' } = useParams<'id'>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [cidadeId, setCidadeId] = useState<string | number>('');

    const { handleSubmit, control, reset } = useForm<IFormData>({
        defaultValues: {
            nome: '',
        }
    });

    // Salvar
    const onSave = async (data: IFormData) => {
        if (!data.nome.trim() || data.nome.length < 3) {
            alert('Nome deve ter pelo menos 3 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            if (id === 'nova') {
                // Criar
                const novoId = await CidadesService.create(data);
                if (novoId instanceof Error) {
                    alert(novoId.message);
                } else {
                    alert('Cidade criada com sucesso!');
                    navigate(`/cidades/detalhe/${novoId}`);
                }
            } else {
                // Atualizar - usa o ID REAL (string "f8e6")
                const result = await CidadesService.updateById(cidadeId, {
                    id: cidadeId,
                    nome: data.nome
                });
                
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    alert('Cidade atualizada com sucesso!');
                }
            }
        } catch (error) {
            alert('Erro ao salvar: ' + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    // Carregar para edição
    useEffect(() => {
        if (id !== 'nova') {
            setIsLoading(true);
            setCidadeId(id); // Mantém como string ("f8e6")
            
            console.log(`🔄 Carregando cidade ID: ${id} (tipo: ${typeof id})`);
            
            CidadesService.getById(id)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/cidades');
                    } else {
                        console.log('✅ Cidade carregada:', result);
                        setNome(result.nome);
                        setCidadeId(result.id); // Atualiza com ID real
                        reset({
                            nome: result.nome,
                        });
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    alert('Erro ao carregar cidade: ' + error.message);
                });
        } else {
            reset({ nome: '' });
        }
    }, [id]);

    // Deletar
    const onDelete = async () => {
        if (!window.confirm('Realmente deseja apagar esta cidade?')) {
            return;
        }

        setIsLoading(true);
        
        try {
            // Usa o ID REAL (string "f8e6")
            const result = await CidadesService.deleteById(cidadeId);
            if (result instanceof Error) {
                alert(result.message);
            } else {
                alert('Cidade apagada com sucesso!');
                navigate('/cidades');
            }
        } catch (error) {
            alert('Erro ao apagar: ' + (error as Error).message);
        } finally {
            setIsLoading(false);
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
                    aoClicarEmApagar={onDelete}
                    aoClicarEmNovo={() => navigate('/cidades/detalhe/nova')}
                    aoClicarEmSalvar={handleSubmit(onSave)}
                    aoClicarEmVoltar={() => navigate('/cidades')}
                    aoClicarEmSalvarEVoltar={handleSubmit((data) => {
                        onSave(data);
                        navigate('/cidades');
                    })}
                    aoClicarEmSalvarENovo={handleSubmit((data) => {
                        onSave(data);
                        if (id !== 'nova') {
                            reset({ nome: '' });
                            setNome('');
                            navigate('/cidades/detalhe/nova');
                        }
                    })}
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
                        {isLoading && (
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