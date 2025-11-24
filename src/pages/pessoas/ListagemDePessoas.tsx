import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useDebounce } from "../../shared/hooks";

import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { PessoasService } from "../../shared/services/api/pessoas/PessoasService";


export const ListagemDePessoas: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    useEffect(() => {

        debounce(() => {

        PessoasService.getAll(1, busca)
            .then((result) => {
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    console.log(result);
                }
                
            });
        }); 

    }, [busca]);

    return (
        <LayoutBaseDePagina 
        titulo='Listagem de pessoas'
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