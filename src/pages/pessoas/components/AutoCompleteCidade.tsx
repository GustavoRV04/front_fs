import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { CidadesService } from "../../../shared/services/api/cidades/CidadesService";
import { useDebounce } from "../../../shared/hooks";

type TAutoCompleteOption = {
    id: string | number;
    label: string;
}

export const AutoCompleteCidade: React.FC = () => {
    const [todasCidades, setTodasCidades] = useState<TAutoCompleteOption[]>([]);
    const [opcoesFiltradas, setOpcoesFiltradas] = useState<TAutoCompleteOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedId, setSelectedId] = useState<number | string | undefined>(undefined);
    const [busca, setBusca] = useState('');

    const { debounce } = useDebounce();

    // 1. Carrega TODAS as cidades UMA VEZ (SEM PAGINAÇÃO)
    useEffect(() => {
        setIsLoading(true);
        
        const carregarTodasCidades = async () => {
            try {
                // **CORREÇÃO AQUI**: Passa `true` para `noPagination`
                const resultado = await CidadesService.getAll(1, '', true);
                
                if (resultado instanceof Error) {
                    console.error(resultado.message);
                    return;
                }
                
                const todas: TAutoCompleteOption[] = resultado.data.map(cidade => ({
                    id: cidade.id,
                    label: cidade.nome
                }));
                
                setTodasCidades(todas);
                setOpcoesFiltradas(todas);
                console.log(`✅ ${todas.length} cidades carregadas (sem paginação)`);
                
            } catch (error) {
                console.error('Erro ao carregar cidades:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        carregarTodasCidades();
    }, []);

    // 2. Filtra localmente quando o usuário digita
    useEffect(() => {
        if (busca.trim() === '') {
            setOpcoesFiltradas(todasCidades);
        } else {
            const filtradas = todasCidades.filter(cidade =>
                cidade.label.toLowerCase().includes(busca.toLowerCase())
            );
            setOpcoesFiltradas(filtradas);
        }
    }, [busca, todasCidades]);

    // 3. Encontra a opção selecionada
    const autoCompleteSelectedOption = useMemo(() => {
        if (!selectedId) return null;
        return todasCidades.find(opcao => String(opcao.id) === String(selectedId)) || null;
    }, [selectedId, todasCidades]);

    return (
        <Autocomplete
            openText='Abrir'
            closeText='Fechar'
            noOptionsText={busca ? 'Nenhuma cidade encontrada' : 'Nenhuma cidade disponível'}
            loadingText='Carregando...'
            disablePortal
            
            isOptionEqualToValue={(option, value) => 
                option && value ? String(option.id) === String(value.id) : false
            }
            
            options={opcoesFiltradas}
            loading={isLoading}
            disabled={isLoading}
            
            value={autoCompleteSelectedOption}
            
            onInputChange={(_, newValue) => {
                setBusca(newValue);
            }}
            
            onChange={(_, newValue) => { 
                setSelectedId(newValue?.id);
            }}
            
            popupIcon={isLoading ? <CircularProgress size={28}/> : undefined}
            getOptionLabel={(option) => option.label}
            
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Cidade"
                    variant="outlined"
                    helperText={isLoading ? "Carregando todas as cidades..." : `${opcoesFiltradas.length} cidades disponíveis`}
                />
            )}
        />
    );
};