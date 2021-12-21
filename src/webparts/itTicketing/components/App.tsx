import * as React from "react";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { useState, useEffect } from "react";
import Cards from "./Cards";
import Tiles from "./Tiles";
import DetailsTable from "./DetailsTable";
const stackTokens: Partial<IStackTokens> = { childrenGap: 20 };
const App = (props) => {
  const [showTable, setShowTable] = useState(false);
  const [tableFor, setTableFor] = useState("");
  const selectedItemHandler = (selectedItem) => {
    setTableFor(selectedItem);
    setShowTable(true);
  };
  const backBtnHandler = () => {
    setShowTable(false);
  };
  return (
    <div style={{ padding: "1rem" }}>
      {/* <Stack
        tokens={stackTokens}
        className="searchSection"
        style={{ margin: "1rem" }}
      >
        <SearchBox
          placeholder="Search"
          onSearch={(newValue) => console.log("value is " + newValue)}
        />
      </Stack> */}
      {showTable ? (
        <DetailsTable
          spcontext={props.spcontext}
          tableFor={tableFor}
          onClickBack={backBtnHandler}
        />
      ) : (
        <>
          <Cards spcontext={props.spcontext} />
          <Tiles
            onViewAllClicked={selectedItemHandler}
            spcontext={props.spcontext}
            graphcontext={props.graphcontext}
          />
        </>
      )}
    </div>
  );
};
export default App;
