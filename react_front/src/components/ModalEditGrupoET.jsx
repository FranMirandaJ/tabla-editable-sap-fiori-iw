import { useState, useEffect } from "react";
import {
    Button,
    Input,
    Dialog,
    Bar,
    Label,
    ComboBox,
    ComboBoxItem,
    TextArea,
    FlexBox,
    Icon,
} from "@ui5/webcomponents-react";

const ModalEditGrupoET = ({ isModalOpen, handleCloseModal, setGrupoET, dbConnection }) => {
    return (
        <Dialog
            stretch={false}
            open={isModalOpen}
            onAfterClose={handleCloseModal}
            headerText="Definir Grupo ET"
            style={{
                width: "500px",  // o el ancho que prefieras
                maxWidth: "90vw" // mantiene responsive
            }}
            footer={
                <Bar
                    endContent={
                        <>
                            <Button
                                design="Emphasized"
                                onClick={() => { }}
                                className="btn-guardar-modal"
                            >
                                Aceptar
                            </Button>
                            <Button design="Transparent" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                        </>
                    }
                />
            }
            className="modal-sku"
        >
            JOTO
        </Dialog>
    );
};

export default ModalEditGrupoET;