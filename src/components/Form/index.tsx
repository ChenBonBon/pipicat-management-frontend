import { Form as AForm, FormProps, Input as AInput, InputProps } from 'antd';

const Form = (props: FormProps) => {
  return <AForm {...props} />;
};

const Input = (props: InputProps) => {
  return <AInput {...props} allowClear autoComplete="off" />;
};

Form.Input = Input;
Form.Item = AForm.Item;
Form.List = AForm.List;
Form.ErrorList = AForm.ErrorList;
Form.useForm = AForm.useForm;
Form.Provider = AForm.Provider;

export default Form;
