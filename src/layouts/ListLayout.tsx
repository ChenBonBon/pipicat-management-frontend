import { Table } from 'antd';

interface Filter {}

interface Action {}

interface Table {}

interface ListLayout {
  title: JSX.Element | string;
  filters?: Filter[];
  actions?: Action[];
  table?: Table;
  children?: JSX.Element;
}

export default function ListLayout({ title, filters = [], actions = [], table = {}, children }: ListLayout) {
  return (
    <div className="my-4 mx-8">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="mb-4 flex justify-between">
        <div>
          {filters.map((filter, index) => {
            return (
              <div className={`inline-block${index > 0 ? ' ml-4' : ''}`} key={index}>
                {filter}
              </div>
            );
          })}
        </div>
        <div>
          {actions.map((action, index) => {
            return (
              <div className={`inline-block ${index > 0 ? ' ml-4' : ''}`} key={index}>
                {action}
              </div>
            );
          })}
        </div>
      </div>
      {table && <Table {...table} rowKey={(record) => record.id} />}
      {children}
    </div>
  );
}
