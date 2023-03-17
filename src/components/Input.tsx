import { Input as NativeBaseInput, IInputProps, FormControl } from "native-base"

type Props = IInputProps & {
  errorMessage?: string | null
}

export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid

  return (
    <FormControl 
      isInvalid={invalid}      
      mb={4}
    >
      <NativeBaseInput
        bg="gray.700"
        h={14}
        px={4}
        borderWidth={1}
        borderColor="transparent"
        fontSize="md"
        color="white"
        fontFamily="body"
        placeholderTextColor="gray.300"
        _focus={{
          bg:"gray.700",
          borderColor: "green.500"
        }}
        isInvalid={invalid}
        _invalid={{
          borderColor: "red.500"
        }}
        {...rest}
      />

      <FormControl.ErrorMessage _text={{ color: "red.500" }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>

  )
}