import styles from "./DragAndDrop.module.scss";
import React, { useCallback, useEffect, useRef } from "react";
import SearchTextInput from "../../components/SearchTextInput.tsx";
import PersonCard from "../../components/PersonCard.tsx";
import { Button } from "../../components/Button.tsx";
import { usePopup } from "../../context/popupContext.tsx";
import NewPersonFormRow from "../../components/admin/NewPersonFormRow.tsx";
import { useNavigation } from "../../context/navigationContext.tsx";
import Caregiver from "./DragAndDrop.tsx";
import addButtonIconPrimary from "../../assets/add-button-icon-primary.svg";
import TimeTableRow from "../../components/TimeTableRow.tsx";
import { IonItem, IonLabel, IonList, IonReorder, IonReorderGroup, ItemReorderEventDetail } from "@ionic/react";
import TodoItem from "../../components/TodoItem.tsx";
import IconButton from "../../components/IconButton.tsx";
import dragIndicator from "..//../assets/drag-indicator.svg";

const DragAndDrop: React.FC = () => {
    const { openPopup } = usePopup();
    const { addPageToStack } = useNavigation();
    function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
        // The `from` and `to` properties contain the index of the item
        // when the drag started and ended, respectively
        console.log("Dragged from index", event.detail.from, "to", event.detail.to);

        // Finish the reorder and position the item in the DOM based on
        // where the gesture ended. This method can also be called directly
        // by the reorder group
        event.detail.complete();
    }

    return (
        <IonList
            style={{
                backgroundColor: "transparent", // Make the background transparent
                width: "100%", // Ensure the list fills the entire width
            }}
        >
            {/* The reorder gesture is disabled by default, enable it to drag and drop items */}
            <IonReorderGroup style={{ gap: "10px" }} disabled={false} onIonItemReorder={handleReorder}>
                <IonItem
                    className="no-shadow-drag"
                    style={{
                        "background-color": "transparent",
                        "box-shadow": "none",
                        opacity: "1",
                        borderRadius: "10px",
                        "--inner-padding-end": "0",
                        padding: "0",
                        margin: "0 0 10px 0",
                        border: "none",
                    }}
                >
                    <TodoItem name="Főzés" selectedItem="Étkeztetés" options={["Étkeztetés"]} index={0} />
                    <IonReorder
                        style={{ "background-color": "transparent", height: "50px", padding: "0", margin: "0" }}
                        slot="start"
                    >
                        <div className={styles.drag}>
                            <IconButton svgContent={dragIndicator} isSmall />
                        </div>
                    </IonReorder>
                </IonItem>

                <IonItem
                    className="no-shadow-drag"
                    style={{
                        "background-color": "transparent",
                        "box-shadow": "none",
                        opacity: "1",
                        borderRadius: "10px",
                        "--inner-padding-end": "0",
                        padding: "0",
                        margin: "0 0 10px 0",
                        border: "none",
                    }}
                >
                    <TodoItem name="Főzés" selectedItem="Étkeztetés" options={["Étkeztetés"]} index={0} />
                    <IonReorder
                        style={{ "background-color": "transparent", height: "50px", padding: "0", margin: "0" }}
                        slot="start"
                    >
                        <div className={styles.drag}>
                            <IconButton svgContent={dragIndicator} isSmall />
                        </div>
                    </IonReorder>
                </IonItem>

                <IonItem
                    className="no-shadow-drag"
                    style={{
                        "background-color": "transparent",
                        "box-shadow": "none",
                        opacity: "1",
                        borderRadius: "10px",
                        "--inner-padding-end": "0",
                        padding: "0",
                        margin: "0 0 10px 0",
                        border: "none",
                    }}
                >
                    <TodoItem name="Főzés" selectedItem="Étkeztetés" options={["Étkeztetés"]} index={0} />
                    <IonReorder
                        style={{ "background-color": "transparent", height: "50px", padding: "0", margin: "0" }}
                        slot="start"
                    >
                        <div className={styles.drag}>
                            <IconButton svgContent={dragIndicator} isSmall />
                        </div>
                    </IonReorder>
                </IonItem>

                <IonItem
                    className="no-shadow-drag"
                    style={{
                        "background-color": "transparent",
                        "box-shadow": "none",
                        opacity: "1",
                        borderRadius: "10px",
                        "--inner-padding-end": "0",
                        padding: "0",
                        margin: "0 0 10px 0",
                        border: "none",
                    }}
                >
                    <TodoItem name="Főzés" selectedItem="Étkeztetés" options={["Étkeztetés"]} index={0} />
                    <IonReorder
                        style={{ "background-color": "transparent", height: "50px", padding: "0", margin: "0" }}
                        slot="start"
                    >
                        <div className={styles.drag}>
                            <IconButton svgContent={dragIndicator} isSmall />
                        </div>
                    </IonReorder>
                </IonItem>

                <IonItem
                    className="no-shadow-drag"
                    style={{
                        "background-color": "transparent",
                        "box-shadow": "none",
                        opacity: "1",
                        borderRadius: "10px",
                        "--inner-padding-end": "0",
                        padding: "0",
                        margin: "0 0 10px 0",
                        border: "none",
                    }}
                >
                    <TodoItem name="Főzés" selectedItem="Étkeztetés" options={["Étkeztetés"]} index={0} />
                    <IonReorder
                        style={{ "background-color": "transparent", height: "50px", padding: "0", margin: "0" }}
                        slot="start"
                    >
                        <div className={styles.drag}>
                            <IconButton svgContent={dragIndicator} isSmall />
                        </div>
                    </IonReorder>
                </IonItem>
            </IonReorderGroup>
        </IonList>
    );
};

export default DragAndDrop;
