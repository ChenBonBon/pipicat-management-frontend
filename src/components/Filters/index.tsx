import { Input as AInput, InputProps, Select as ASelect, SelectProps } from 'antd';
import { useRef } from 'react';

const Filters = () => {};

const Input = (props: InputProps) => {
  const isInputing = useRef(false);
  return (
    <AInput
      {...props}
      allowClear
      className="w-48"
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

const Select = (props: SelectProps) => {
  return (
    <ASelect {...props} allowClear dropdownMatchSelectWidth={false} className="w-48">
      {props.children}
    </ASelect>
  );
};

Filters.Input = Input;
Filters.Select = Select;

export default Filters;
