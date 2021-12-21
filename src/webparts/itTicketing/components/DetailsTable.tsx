import * as React from "react";
import { TextField } from "@fluentui/react/lib/TextField";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { useState, useEffect } from "react";
import classes from "./ItTicketing.module.scss";
import { Icon } from "@fluentui/react/lib/Icon";
import { PrimaryButton } from "@fluentui/react";
let allitems = [];
const DetailsTable = (props) => {
  const [items, setItems] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  useEffect(() => {
    props.spcontext.web.lists
      .getByTitle("Tickets")
      .items.select(
        "*,Owner/EMail,Owner/Title,Status/Title,AssignedTo/Title,AssignedTo/EMail"
      )
      .expand("Owner", "Status", "AssignedTo")
      .orderBy("Created", false)
      .get()
      .then((ticketData: any) => {
        allitems = [];
        ticketData.forEach((tData) => {
          allitems.push({
            Title: tData.Title,
            Owner: tData.Owner.Title,
            AssignedTo: tData.AssignedTo.Title,
            Status: tData.Status.Title,
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
    props.tableFor == "ClosedIncidents"
      ? (setItems([]),
        setItems(allitems.filter((item) => item.Status == "Closed")))
      : props.tableFor == "CurrentIncidents"
      ? (setItems([]),
        setItems(allitems.filter((item) => item.Status != "Closed")))
      : "";
  }, []);

  const columns: IColumn[] = [
    {
      key: "column1",
      name: "Title",
      fieldName: "Title",
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      data: "string",
      isPadded: true,
    },
    {
      key: "column2",
      name: "Owner",
      fieldName: "Owner",
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      data: "string",
      isPadded: true,
    },
    {
      key: "column3",
      name: "Assigned To",
      fieldName: "AssignedTo",
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      data: "string",
      isPadded: true,
    },
    {
      key: "column4",
      name: "Status",
      fieldName: "Status",
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      data: "string",
      isPadded: true,
    },
  ];

  return (
    <>
      <div className={classes.tableHeader}>
        <Icon
          onClick={() => {
            props.onClickBack();
          }}
          iconName="ChromeBack"
          style={{
            marginRight: "2rem",
            fontSize: "1.2rem",
            color: "#24299b",
            cursor: "pointer",
          }}
        />
        <h3 style={{ color: "#24299b", fontSize: "1.4rem" }}>Dashboard</h3>
      </div>

      {items.length > 0 ? (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <TextField
              value={searchKey}
              onChange={(e) => {
                setSearchKey(e.target["value"]);
              }}
              styles={{
                root: {
                  margin: "0 1rem 1rem 0",
                  maxWidth: "300px",
                },
              }}
            />
            <PrimaryButton
              text="Search"
              onClick={() => {
                setItems([]);
                setItems(
                  items.filter((item) =>
                    item.Title.toLowerCase().includes(
                      searchKey.toLocaleLowerCase()
                    )
                  )
                );
              }}
            />
          </div>
          <DetailsList
            items={items}
            columns={columns}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="select row"
          />
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>No Data To display</div>
      )}
    </>
  );
};
export default DetailsTable;
