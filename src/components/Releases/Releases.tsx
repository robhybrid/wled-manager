import React from "react";
import { observer } from "mobx-react";
import ReleasesStore from "./ReleasesStore";
import DataTableView from "../DataTable/DataTable";

export default observer(function Releases({ store }: { store: ReleasesStore }) {
  React.useEffect(() => {
    store.fetch();
  }, []);
  return (
    <div className="releases">
      <DataTableView records={store.releases} />
      {store.releases.map((r) => (
        <div>
          <div>{r.tag_name}</div>
        </div>
      ))}
    </div>
  );
});
