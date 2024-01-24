import React from "react";
import { observer } from "mobx-react";
import ReleasesStore from "./ReleasesStore";

export default observer(function Releases({ store }: { store: ReleasesStore }) {
  React.useEffect(() => {
    store.fetch();
  });
  return (
    <div className="releases">
      {store.releases.map((r) => (
        <div>
          <div>{r.tag_name}</div>
        </div>
      ))}
    </div>
  );
});
