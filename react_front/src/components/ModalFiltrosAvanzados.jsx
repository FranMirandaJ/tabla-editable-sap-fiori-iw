import { useState, useEffect } from "react";
import {
    Button,
    Input,
    Dialog,
    Bar,
    Label,
    DateRangePicker,
    SegmentedButton,
    SegmentedButtonItem,
} from "@ui5/webcomponents-react";
import ButtonDesign from "@ui5/webcomponents/dist/types/ButtonDesign.js";

const ModalFiltrosAvanzados = ({ isModalOpen, handleCloseModal, filters, setFilters }) => {
    return (
        <Dialog
            stretch={false}
            open={isModalOpen}
            onAfterClose={() => handleCloseModal()}
            headerText="Filtros avanzados"
            style={{
                width: "450px",
                maxWidth: "90vw"
            }}
            footer={
                <Bar
                    endContent={
                        <>
                            <Button
                                design={ButtonDesign.Emphasized}
                                onClick={() => { }}
                            >
                                Aplicar
                            </Button>
                            <Button
                                design="Transparent"
                                onClick={() => { }}>
                                Limpiar
                            </Button>
                            <Button
                                design="Transparent"
                                onClick={() => { handleCloseModal() }}>
                                Cerrar
                            </Button>
                        </>
                    }
                />
            }
            className="modal-sku"
        >
            <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Sociedad */}
                <div>
                    <Label>Sociedad:</Label>
                    <Input
                        placeholder="100"
                        style={{ width: "100%" }}
                    />
                </div>

                {/* CEDI */}
                <div>
                    <Label>CEDI:</Label>
                    <Input
                        placeholder="Ej. 145"
                        style={{ width: "100%" }}
                    />
                </div>

                {/* Etiqueta */}
                <div>
                    <Label>Etiqueta:</Label>
                    <Input
                        placeholder="Ej. IDETIQUETA"
                        style={{ width: "100%" }}
                    />
                </div>

                {/* Valor */}
                <div>
                    <Label>Valor:</Label>
                    <Input
                        placeholder="Ej. IDVALOR"
                        style={{ width: "100%" }}
                    />
                </div>

                {/* Registro entre */}
                <div>
                    <Label>Registro entre:</Label>
                    <DateRangePicker
                        placeholder="yyyy-MM-dd - yyyy-MM-dd"
                        style={{ width: "100%" }}
                    />
                </div>

                {/* Estado */}
                <div>
                    <Label>Estado:</Label>
                    <div>
                        <SegmentedButton onSelectionChange={() => { }}>
                            <SegmentedButtonItem data-key="0" pressed={() => { }}>
                                Todos
                            </SegmentedButtonItem>
                            <SegmentedButtonItem data-key="1" pressed={() => { }}>
                                Activos
                            </SegmentedButtonItem>
                            <SegmentedButtonItem data-key="2" pressed={() => { }}>
                                Inactivos
                            </SegmentedButtonItem>
                        </SegmentedButton>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ModalFiltrosAvanzados;