import * as React from "react";
import Carousel from "nuka-carousel";
import { useState, useEffect } from "react";
import { useId, useBoolean } from "@fluentui/react-hooks";

import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  ContextualMenu,
  Toggle,
  Modal,
  IDragOptions,
  IIconProps,
  Stack,
  IStackProps,
} from "@fluentui/react";
import { hiddenContentStyle, mergeStyles } from "@fluentui/react/lib/Styling";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import styles from "./ItTicketing.module.scss";
import { Icon } from "@fluentui/react/lib/Icon";
import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownStyles,
  IDropdownOption,
} from "@fluentui/react/lib/Dropdown";
import { Label } from "@fluentui/react/lib/Label";
let items = [];
let selectedItem;
const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 200 },
};

const theme = getTheme();
const themeBoxShadow = { boxShadow: theme.effects.elevation8 };
const groupArr = (data, n) => {
  var group = [];
  for (var i = 0, j = 0; i < data.length; i++) {
    if (i >= n && i % n === 0) j++;
    group[j] = group[j] || [];
    group[j].push(data[i]);
  }
  return group;
};
const ApprovalCarousel = (props) => {
  const [groupedItems, setGroupedItems] = useState([]);
  const [oldStatus, setOldStatus] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const [sendRequest, setSendRequest] = useState(true);
  const [statusKey, setStatusKey] = useState("");
  const [modalItems, setModalItems] = useState({
    Subject: "",
    Priority: "",
    Owner: "",
    AssignedTo: "",
    ID: 0,
  });
  const [defaultOption, setDefaultOption] = useState(0);
  const [ddOptions, setDdOptions] = useState([]);
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  const labelId: string = useId("dialogLabel");
  const subTextId: string = useId("subTextLabel");
  useEffect(() => {
    if (sendRequest) {
      props.spcontext.web.lists
        .getByTitle("Tickets")
        .items.select(
          "*,Status/Title,Status/ID,AssignedTo/EMail,AssignedTo/Title,Owner/Title,Priority/Title"
        )
        .expand("Status", "AssignedTo", "Owner", "Priority")
        .orderBy("Created", false)
        .get()
        .then(async (listData: any) => {
          listData = listData.filter((li) => li.Status.Title !== "Closed");
          items = listData;

          await props.spcontext.web.lists
            .getByTitle("DropdownStatus")
            .items.get()
            .then((listItem) => {
              setDdOptions(listItem);
            });
          setGroupedItems(groupArr(items, 3));
        });
      setSendRequest(false);
    }
  }, [sendRequest]);

  const options: IDropdownOption[] = ddOptions.map((option) => {
    return {
      key: option.ID,
      text: option.Title,
    };
  });

  return (
    <Carousel
      defaultControlsConfig={{
        pagingDotsStyle: {
          display: "none",
        },
      }}
      renderCenterLeftControls={({ previousSlide }) => (
        <Icon
          onClick={previousSlide}
          iconName="ChevronLeft"
          className={styles.caroArrow}
          style={themeBoxShadow}
        />
      )}
      renderCenterRightControls={({ nextSlide }) => (
        <Icon
          onClick={nextSlide}
          iconName="ChevronRight"
          className={styles.caroArrow}
          style={themeBoxShadow}
        />
      )}
    >
      {/* <Icon
          onClick={previousSlide()}
          iconName="ChevronLeft"
          style={{ fontSize: "1.3rem", cursor: "pointer" }}
        /> */}
      {groupedItems.length > 0 ?
        groupedItems.map((liItems) => {
          return (
            <div>
              {liItems.map((liItem) => {
                return (
                  <div className={styles.carouselItem}>
                    <div
                      className={styles.carouselTitle}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "90%",
                      }}
                    >
                      <div>{liItem.Title}</div>
                      <div
                        style={{
                          fontWeight: "normal",
                          padding: "0 0.3rem",
                          border:
                            liItem.Status.Title == "New"
                              ? "2px solid #2844a7"
                              : liItem.Status.Title == "Closed"
                              ? "2px solid #28a745"
                              : liItem.Status.Title == "Escalated to Presidio"
                              ? "2px solid #dc3545"
                              : liItem.Status.Title == "In progress"
                              ? "2px solid #a728a3"
                              : liItem.Status.Title == "On hold"
                              ? "2px solid #a3a728"
                              : "2px solid #000",
                          color:
                            liItem.Status.Title == "New"
                              ? "#2844a7"
                              : liItem.Status.Title == "Closed"
                              ? "#28a745"
                              : liItem.Status.Title == "Escalated to Presidio"
                              ? "#dc3545"
                              : liItem.Status.Title == "In progress"
                              ? "#a728a3"
                              : liItem.Status.Title == "On hold"
                              ? "#a3a728"
                              : "#000",
                        }}
                      >
                        {liItem.Status.Title}
                      </div>
                    </div>
                    <div className="carouselIcon">
                      <Icon
                        onClick={() => {
                          showModal();
                          setDefaultOption(liItem.Status.ID);
                          setOldStatus(liItem.Status.Title);
                          selectedItem = items.filter(
                            (item) => item.ID == liItem.ID
                          )[0];
                          setModalItems({
                            Subject: selectedItem.Title,
                            Priority: selectedItem.Priority.Title,
                            Owner: selectedItem.Owner.Title,
                            ID: selectedItem.ID,
                            AssignedTo: selectedItem.AssignedTo
                              ? selectedItem.AssignedTo.Title
                              : "",
                          });
                          setStatusKey("");
                        }}
                        iconName="Edit"
                        className={`${liItem.ID}`}
                        style={{
                          fontSize: "1.1rem",
                          color: "#24299b",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              <Modal
                isOpen={isModalOpen}
                onDismiss={hideModal}
                isBlocking={false}
                containerClassName={styles.modalBox}
              >
                <h3
                  style={{ textAlign: "center", padding: "1rem 1rem 0 1rem" }}
                >
                  {modalItems.Subject}
                </h3>
                <div className={styles.modalContent}>
                  <div className={styles.dialogItems}>
                    <Label style={{ width: "120px" }}>Owner:</Label>
                    <Label style={{ fontWeight: "lighter" }}>
                      {modalItems.Owner}
                    </Label>
                  </div>
                  <div className={styles.dialogItems}>
                    <Label style={{ width: "120px" }}>Priority:</Label>
                    <Label style={{ fontWeight: "lighter" }}>
                      {modalItems.Priority}
                    </Label>
                  </div>
                  <div className={styles.dialogItems}>
                    <Label style={{ width: "120px" }}>Assigned To:</Label>
                    <Label style={{ fontWeight: "lighter" }}>
                      {modalItems.AssignedTo}
                    </Label>
                  </div>
                  <div className={styles.dialogItems}>
                    <Label style={{ width: "120px" }}>Status:</Label>
                    <Dropdown
                      placeholder="Select an option"
                      options={options}
                      styles={dropdownStyles}
                      defaultSelectedKey={defaultOption}
                      onChange={(e, selectedOption) => {
                        setDefaultOption(parseInt(`${selectedOption.key}`));
                        setStatusKey(`${selectedOption.key}`);
                        setNewStatus(selectedOption.text);
                      }}
                    />
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <PrimaryButton
                    onClick={() => {
                      if (
                        Object.keys(statusKey).length != 0 &&
                        oldStatus != newStatus
                      ) {
                        hideModal();
                        let updateData = {};
                        newStatus == "Escalated to Presidio"
                          ? (updateData = {
                              StatusId: defaultOption,
                              EscalatedOpenDate:
                                new Date().toLocaleDateString(),
                            })
                            : oldStatus == "Escalated to Presidio" && newStatus == "Closed"
                          ? (updateData = {
                              StatusId: defaultOption,
                              EscalatedClosedDate:
                                new Date().toLocaleDateString(),
                              DateClosed:
                                new Date().toLocaleDateString(),
                            })
                            : newStatus == "Closed"
                          ? (updateData = {
                              StatusId: defaultOption,
                              DateClosed:
                                new Date().toLocaleDateString(),
                            })
                          : oldStatus == "Escalated to Presidio"
                          ? (updateData = {
                              StatusId: defaultOption,
                              EscalatedClosedDate:
                                new Date().toLocaleDateString(),
                            })
                          : (updateData = {
                              StatusId: defaultOption,
                            });
                        try {
                          props.spcontext.web.lists
                            .getByTitle("Tickets")
                            .items.getById(modalItems.ID)
                            .update(updateData)
                            .then(() => {
                              setSendRequest(true);
                            });
                        } catch (error) {
                          console.log(error);
                        }
                      }
                      props.onStatusChangeHandler();
                    }}
                    text="Update"
                    style={{ marginRight: "1rem" }}
                  />
                  <DefaultButton onClick={hideModal} text="Cancel" />
                </div>
              </Modal>
            </div>
          );
        }):<div style={{textAlign: "center"}}>No data available</div>}
    </Carousel>
  );
};
export default ApprovalCarousel;
