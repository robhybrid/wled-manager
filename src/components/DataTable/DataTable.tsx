import React from "react";
import "./DataTable.scss";
import { ColumnProps } from "antd/lib/table";
import { Table } from "antd";

interface Props {
  records: any[];
  idKey?: string;
  searchFields?: any[];
}
export default function DataTableView({ idKey = "id", records = [] }: Props) {
  let columns: ColumnProps<any>[] = [];
  if (records[0]) {
    columns = Object.entries(records[0])
      .filter(([, val]) => !(val instanceof Object))
      .map(([key]) => ({
        key,
        title: key,
        dataIndex: key,
      }));
  }

  return (
    <Table
      rowKey={(record) => record[idKey].toString()}
      columns={columns}
      dataSource={records}
    />
  );
}
