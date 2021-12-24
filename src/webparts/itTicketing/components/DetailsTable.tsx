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
  const [columnsForTable, setcolumnsForTable] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [dashTitle, setDashTitle] = useState("");

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
      isSortedDescending: true,
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
      isSortedDescending: true,
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
      isSortedDescending: true,
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
      isSortedDescending: true,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      data: "string",
      isPadded: true,
    },
  ];

  const columnsforPages: IColumn[] = [
    {
      key: "column1",
      name: "Title",
      fieldName: "Title",
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: true,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      data: "string",
      isPadded: true,
    },
  ];

  useEffect(() => {
    if (
      props.tableFor == "ClosedIncidents" ||
      props.tableFor == "CurrentIncidents"
    ) {
      setcolumnsForTable(columns);
      IncidentItems();
    } else if (props.tableFor == "PopularPage") {
      setcolumnsForTable(columnsforPages);
      PopularPages();
    } else if (props.tableFor == "MyFeedBacks") {
      setcolumnsForTable(columnsforPages);
      MyFeedBacks();
    }
    props.tableFor == "ClosedIncidents"
      ? setDashTitle("Closed Incidents")
      : props.tableFor == "CurrentIncidents"
      ? setDashTitle("Current Incidents")
      : props.tableFor == "PopularPage"
      ? setDashTitle("Top KB Article")
      : props.tableFor == "MyFeedBacks"
      ? setDashTitle("Feedback")
      : "";
  }, []);

  async function IncidentItems() {
    await props.spcontext.web.lists
      .getByTitle("Tickets")
      .items.select(
        "*,Owner/EMail,Owner/Title,Status/Title,AssignedTo/Title,AssignedTo/EMail"
      )
      .expand("Owner", "Status", "AssignedTo")
      .orderBy("Created", false)
      .get()
      .then(async (ticketData: any) => {
        allitems = [];
        await ticketData.forEach(async (tData) => {
          await allitems.push({
            Title: tData.Title,
            Owner: tData.Owner.Title,
            AssignedTo: tData.AssignedTo ? tData.AssignedTo.Title : "",
            Status: tData.Status.Title,
          });
        });

        AssignItems();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function PopularPages() {
    await props.spcontext.web.lists
      .getByTitle("Site Pages")
      .items.orderBy("Created", false)
      .getAll()
      .then(async (pages: any) => {
        allitems = [];
        var filteredPages = pages.filter((page) => page.isPopular == true);
        await filteredPages.forEach(async (tData) => {
          await allitems.push({
            Title: tData.Title,
          });
        });
        AssignItems();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function MyFeedBacks() {
    await props.spcontext.web.lists
      .getByTitle("Feedback")
      .items.orderBy("Created", false)
      .get()
      .then(async (feedbacks: any) => {
        allitems = [];
        await feedbacks.forEach(async (tData) => {
          await allitems.push({
            Title: tData.Title,
          });
        });
        AssignItems();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function AssignItems() {
    props.tableFor == "ClosedIncidents"
      ? (setItems([]),
        setItems(allitems.filter((item) => item.Status == "Closed")))
      : props.tableFor == "CurrentIncidents"
      ? (setItems([]),
        setItems(allitems.filter((item) => item.Status != "Closed")))
      : props.tableFor == "PopularPage"
      ? (setItems([]), setItems(allitems))
      : props.tableFor == "MyFeedBacks"
      ? (setItems([]), setItems(allitems))
      : "";
  }

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
        <h3 style={{ color: "#24299b", fontSize: "1.4rem" }}>
          {dashTitle} Dashboard
        </h3>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TextField
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target["value"]);
            }}
            styles={{
              root: {
                marginRight: "0.3rem",
                maxWidth: "300px",
              },
            }}
          />
          <PrimaryButton
            styles={{
              root: {
                marginRight: "0.3rem",
              },
            }}
            text="Search"
            onClick={() => {
              setItems([]);
              console.log(searchKey);
              searchKey.trim().length > 0
                ? setItems(
                    allitems.filter((item) =>
                      item.Title.toLowerCase().includes(
                        searchKey.toLocaleLowerCase()
                      )
                    )
                  )
                : AssignItems();
            }}
          />
          <Icon
            onClick={() => {
              setSearchKey(""), AssignItems();
            }}
            iconName="Cancel"
            style={{
              fontSize: "2rem",
              color: "tomato",
              cursor: "pointer",
            }}
          />
        </div>
        {items.length > 0 ? (
          <DetailsList
            items={items}
            columns={columnsForTable}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="select row"
          />
        ) : (
          <div style={{ textAlign: "center" }}>No Data To display</div>
        )}
      </div>
    </>
  );
};
export default DetailsTable;
