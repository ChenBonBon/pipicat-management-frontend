import { Input as AInput, InputProps } from 'antd';
import { useRef } from 'react';

const Filters = () => {};

const Input = (props: InputProps) => {
  const isInputing = useRef(false);
  return (
    <AInput
      {...props}
      onCompositionStart={() => {
        isInputing.current = true;
      }}
      onCompositionEnd={(e) => {
        isInputing.current = false;
        if (props.onChange) {
          props.onChange(e as any);
        }
      }}
      onChange={(e) => {
        if (!isInputing.current) {
          if (props.onChange) {
            props.onChange(e);
          }
        }
      }}
    />
  );
};

Filters.Input = Input;

export default Filters;
