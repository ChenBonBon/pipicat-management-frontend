interface IconProps {
  children: JSX.Element;
}

export default function Icon(props: IconProps) {
  return <i className="icon cursor-pointer text-lg">{props.children}</i>;
}
