import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;
interface Nav {
  menus: NavMenu[];
}

interface NavMenu {
  key: string;
  path: string;
  title: string;
  children?: NavMenu[];
}

export default function Nav({ menus = [] }: Nav) {
  return (
    <Menu mode="horizontal">
      {menus.map((menu) => {
        const { key, path, title, children } = menu;
        if (children) {
          return (
            <SubMenu key={key} title={title}>
              {children.map((child) => {
                return (
                  <Menu.Item key={`${key}_${child.key}`}>
                    <Link to={`${path}${child.path}`}>{child.title}</Link>
                  </Menu.Item>
                );
              })}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item key={key}>
              <Link to={path}>{title}</Link>
            </Menu.Item>
          );
        }
      })}
    </Menu>
  );
}
