import * as React from "react";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import Cards from "./Cards";
import Tiles from "./Tiles";
const stackTokens: Partial<IStackTokens> = { childrenGap: 20 };
const App = (props) => {
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
      <Cards />
      <Tiles spcontext={props.spcontext} graphcontext={props.graphcontext} />
    </div>
  );
};
export default App;
