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

const ModalEditGrupoET = ({ isModalOpen, handleCloseModal, setGrupoET, dbConnection, etiquetas, valores }) => {

    const [etiqueta, setEtiqueta] = useState("");
    const [valor, setValor] = useState("");

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
            <div className="modal-content">
                <FlexBox
                    direction="Column"
                    justifyContent="Center"
                    alignItems="Center"
                    wrap="Nowrap"
                    className="modal-form-fields"
                    style={{ gap: '1rem', width: '100%' }}
                >
                    <div className="modal-field">
                        <Label required>Grupo ET - Etiqueta</Label>
                        <ComboBox
                            className="modal-combobox"
                            onChange={(e) => {
                                const value = e.target.value;
                                setEtiqueta(value);
                            }}
                            placeholder="Selecciona una etiqueta"
                            value={etiqueta}
                            filter="Contains"
                            style={{ width: '400px' }}
                        >
                            {etiquetas.map(item =>
                                <ComboBoxItem key={item.key} text={item.IDETIQUETA} />
                            )}
                        </ComboBox>
                    </div>
                    <div className="modal-field">
                        <Label required>Grupo ET - Valor</Label>
                        <ComboBox
                            className="modal-combobox"
                            onChange={(e) => {
                                const value = e.target.value;
                                setValor(value);
                            }}
                            placeholder="Selecciona un valor"
                            value={valor}
                            filter="Contains"
                            style={{ width: '400px' }}
                        >
                            {valores.map(item =>
                                <ComboBoxItem key={item.IDVALOR} text={item.IDVALOR} />
                            )}
                        </ComboBox>
                    </div>
                    <div className="modal-field">
                        <Label>Resultado (Etiqueta-Valor)</Label>
                        <div className="grupo-et-container">
                            <Input
                                icon={null}
                                type="Text"
                                valueState="None"
                                disabled={true}
                            //value=""
                            />
                        </div>
                    </div>
                </FlexBox>
            </div>
        </Dialog>
    );
};

export default ModalEditGrupoET;