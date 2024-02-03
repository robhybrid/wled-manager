import React from "react";
import { observer } from "mobx-react";
import ReleasesStore from "./ReleasesStore";
import DataTableView from "../DataTable/DataTable";
import ReleaseRow from "./ReleaseRow";

export default observer(function Releases({ store }: { store: ReleasesStore }) {
  React.useEffect(() => {
    store.fetch();
  }, []);
  return (
    <div className="releases">
      <DataTableView records={store.releases.map((r) => new ReleaseRow(r))} />
    </div>
  );
});
