import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";


export const ListagemDeCidade: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    return (
        <LayoutBaseDePagina 
        titulo='Listagem de cidades'
        barraDeFerramentas={<FerramentasDaListagem
            textoBotaoNovo="Nova"
            mostrarInputBusca
            textoDaBusca={busca}
            aoMudarTextoDaBusca={texto => setSearchParams({ busca: texto }, { replace: true })}
            />
        }

        >
            
        
        </LayoutBaseDePagina>
    );
};