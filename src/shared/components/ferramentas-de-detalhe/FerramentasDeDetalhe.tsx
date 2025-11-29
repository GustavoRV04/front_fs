
import { Box, Button, Divider, Icon, Paper, Skeleton, Theme, Typography, useMediaQuery, useTheme } from "@mui/material"



interface IFerramentasDeDetalheProps {
    textoBotaoNovo?: string;
    mostrarBotaoNovo?: boolean;
    mostrarBotaoVoltar?: boolean;
    mostrarBotaoApagar?: boolean;
    mostrarBotaoSalvar?: boolean;
    mostrarBotaoSalvarEVoltar?: boolean;
    mostrarBotaoSalvarENovo?: boolean;

    mostrarBotaoSalvarCarregando?: boolean;
    mostrarBotaoNovoCarregando?: boolean;
    mostrarBotaoVoltarCarregando?: boolean;
    mostrarBotaoApagarCarregando?: boolean;
    mostrarBotaoSalvarEVoltarCarregando?: boolean;

    aoClicarEmNovo?: () => void;
    aoClicarEmVoltar?: () => void;
    aoClicarEmApagar?: () => void;
    aoClicarEmSalvar?: () => void;
    aoClicarEmSalvarEVoltar?: () => void;
    aoClicarEmSalvarENovo?: () => void;

}
export const FerramentasDeDetalhe: React.FC<IFerramentasDeDetalheProps> = ({
    textoBotaoNovo = 'Nova',

    mostrarBotaoNovo = true,
    mostrarBotaoVoltar = true,
    mostrarBotaoApagar = true,
    mostrarBotaoSalvar = true,
    mostrarBotaoSalvarEVoltar = false,

    mostrarBotaoNovoCarregando = false,
    mostrarBotaoVoltarCarregando = false,
    mostrarBotaoApagarCarregando = false,
    mostrarBotaoSalvarCarregando = false,
    mostrarBotaoSalvarEVoltarCarregando = false,

    aoClicarEmNovo,
    aoClicarEmVoltar,
    aoClicarEmApagar,
    aoClicarEmSalvar,
    aoClicarEmSalvarEVoltar,
}) => {
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const theme = useTheme();

    return(
        <Box height={theme.spacing(5)} marginX={1} padding={1} paddingX={2} display="flex" gap={1} alignItems="center" component={Paper}>
            {(mostrarBotaoSalvar && !mostrarBotaoSalvarCarregando) &&(
                <Button 
                    variant='contained' 
                    disableElevation 
                    color="primary"
                    onClick={aoClicarEmSalvar}
                    startIcon={<Icon>save</Icon>}>
                    <Typography variant="button" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                        Salvar
                    </Typography>
            </Button>
            )}

            {mostrarBotaoSalvarCarregando && (
                <Skeleton width={110} height={60}/>
            )}

             {(mostrarBotaoSalvarEVoltar && !mostrarBotaoSalvarEVoltarCarregando && !smDown && !mdDown) &&(
                <Button 
                    variant='outlined' 
                    disableElevation 
                    color="primary"
                    onClick={aoClicarEmSalvarEVoltar}
                    startIcon={<Icon>save</Icon>}>
                    <Typography variant="button" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                        Salvar e Voltar
                    </Typography>
            </Button>
            )}

            {(mostrarBotaoSalvarEVoltarCarregando && !smDown && !mdDown) && (
                <Skeleton width={180} height={60}/>
            )}

             {(mostrarBotaoApagar && !mostrarBotaoApagarCarregando) &&(
                <Button 
                    variant='outlined' 
                    disableElevation 
                    color="primary"
                    onClick={aoClicarEmApagar}
                    endIcon={<Icon>delete</Icon>}>
                    <Typography variant="button" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                        Apagar
                    </Typography>
            </Button>
            )}

            {mostrarBotaoApagarCarregando && (
                <Skeleton width={110} height={60}/>
            )}

            {(mostrarBotaoNovo && !mostrarBotaoNovoCarregando && !smDown) &&(
                <Button 
                    variant='outlined' 
                    disableElevation 
                    color="primary"
                    onClick={aoClicarEmNovo}
                    endIcon={<Icon>add</Icon>}>
                    <Typography variant="button" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                        {textoBotaoNovo}
                    </Typography>
            </Button>
            )}

            {(mostrarBotaoNovoCarregando && !smDown) && (
                <Skeleton width={110} height={60}/>
            )}

            {(mostrarBotaoVoltar &&(mostrarBotaoNovo || mostrarBotaoApagar || mostrarBotaoSalvar || mostrarBotaoSalvarEVoltar)) &&(
                <Divider variant="middle" orientation="vertical"/>
            )}

            {(mostrarBotaoVoltar && !mostrarBotaoVoltarCarregando) &&(
                <Button 
                    variant='outlined' 
                    disableElevation 
                    color="primary"
                    onClick={aoClicarEmVoltar}
                    endIcon={<Icon>arrow_back</Icon>}>
                    <Typography variant="button" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">    
                        Voltar
                    </Typography>
            </Button>
            )}

            {mostrarBotaoVoltarCarregando &&(
                <Skeleton width={110} height={60}/>
            )}
        </Box>
    );
}