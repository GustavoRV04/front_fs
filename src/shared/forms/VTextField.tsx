import { TextField, TextFieldProps } from "@mui/material";
import { Controller } from "react-hook-form";

type TVTextFieldProps = TextFieldProps & {
    name: string;
    control: any;
};

export const VTextField: React.FC<TVTextFieldProps> = ({ name, control, ...rest }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <TextField
                    {...rest}
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {field.onChange(e.target.value); rest.onChange?.(e);}}
                    onKeyDown={(e) => {rest.onKeyDown?.(e);}}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                />
            )}
        />
    );
};
