import * as React from "react";
import { TextField } from "@fluentui/react/lib/TextField";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { useState, useEffect,useRef } from "react";
import classes from "./ItTicketing.module.scss";
import { Icon } from "@fluentui/react/lib/Icon";
import { PrimaryButton } from "@fluentui/react";
import { graph } from "@pnp/graph/presets/all";
import _ from "lodash";
let allitems = [];
let curUserMail = "";
let siteUrl = `https://${window.location.href.split("/")[2]}/sites/${
  window.location.href.split("/")[4]
}`;

const DetailsTable = (props) => {
  const [items, setItems] = useState([]);
  const [columnsForTable, setcolumnsForTable] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [dashTitle, setDashTitle] = useState("");
  const handleColumnClick = (ev, col) => {
    _copyAndSort(allitems, col.fieldName,col.isSortedDescending)
    col.isSortedDescending?col.isSortedDescending=false:col.isSortedDescending=true;
    let oldColumns = columns.filter((colm)=>colm.key ==col.key);
    oldColumns[0].isSortedDescending == true?(oldColumns[0].isSortedDescending = false):(oldColumns[0].isSortedDescending = true);
    let newColumns = columns.filter((colm)=>colm.key !=col.key);
    columns = [...oldColumns,...newColumns];
    columns = _.sortBy(columns,'key');
    
    setcolumnsForTable(columns)
  };
  let columns: IColumn[] = [
    {
      key: "column1",
      name: "Title",
      fieldName: "Title",
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      data: "string",
      isPadded: true,
      onColumnClick: handleColumnClick,
      isSortedDescending: true
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
      onColumnClick: handleColumnClick,
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
      onColumnClick: handleColumnClick,
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
      onColumnClick: handleColumnClick,
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
      onColumnClick: handleColumnClick,
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
    graph
        .me()
        .then(async (userResult) => {
          curUserMail = userResult.userPrincipalName;
    await props.spcontext.web.lists
      .getByTitle("Tickets")
      .items.select(
        "*,Owner/EMail,Owner/Title,Status/Title,AssignedTo/Title,AssignedTo/EMail"
      )
      .expand("Owner", "Status", "AssignedTo")
      .filter(`Owner/EMail eq '${curUserMail}' or AssignedTo/EMail eq '${curUserMail}'`)
      .orderBy("Created", false)
      .get()
      .then(async (ticketData: any) => {
        allitems = [];
        ticketData = ticketData.filter((ticket)=>{
          if(props.tableFor =="ClosedIncidents"){
            return ticket.Status.Title == "Closed"
          }
          else if(props.tableFor =="CurrentIncidents"){
            return ticket.Status.Title != "Closed"
          }
        })
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
          console.log(tData);
          
          await allitems.push({
            Title:  <a className={classes.atag}
            href={`${siteUrl}/SitePages/${tData.Title}.aspx`}
            target="_blank"
          >
            {tData.Title}
          </a>,
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
        setItems(allitems))
      : props.tableFor == "CurrentIncidents"
      ? (setItems([]),
        setItems(allitems))
      : props.tableFor == "PopularPage"
      ? (setItems([]), setItems(allitems))
      : props.tableFor == "MyFeedBacks"
      ? (setItems([]), setItems(allitems))
      : "";
  }
  function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean) {
    const key = columnKey as keyof T;
     setItems(items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1)));
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
