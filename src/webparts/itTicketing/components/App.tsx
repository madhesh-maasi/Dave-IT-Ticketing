import * as React from "react";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { useState, useEffect } from "react";
import Cards from "./Cards";
import Tiles from "./Tiles";
import DetailsTable from "./DetailsTable";
import { loadTheme, createTheme, Theme } from '@fluentui/react';
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
  const myTheme = createTheme({
    palette: {
      themePrimary: '#2a3246',
      themeLighterAlt: '#f4f5f8',
      themeLighter: '#d3d7e1',
      themeLight: '#afb6c7',
      themeTertiary: '#6d778f',
      themeSecondary: '#3b445b',
      themeDarkAlt: '#252c3e',
      themeDark: '#1f2534',
      themeDarker: '#171c27',
      neutralLighterAlt: '#faf9f8',
      neutralLighter: '#f3f2f1',
      neutralLight: '#edebe9',
      neutralQuaternaryAlt: '#e1dfdd',
      neutralQuaternary: '#d0d0d0',
      neutralTertiaryAlt: '#c8c6c4',
      neutralTertiary: '#a19f9d',
      neutralSecondary: '#605e5c',
      neutralPrimaryAlt: '#3b3a39',
      neutralPrimary: '#323130',
      neutralDark: '#201f1e',
      black: '#000000',
      white: '#ffffff',
    }});
    loadTheme(myTheme);
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
