import { useState, useEffect } from "react";
import {
    Button,
    Input,
    Dialog,
    Bar,
    Label,
    ComboBox,
    ComboBoxItem,
    FlexBox,
} from "@ui5/webcomponents-react";

const ModalEditGrupoET = ({ isModalOpen, handleCloseModal, setGrupoET, etiquetas, valores, sociedadSeleccionada, cediSeleccionado }) => {

    const [etiqueta, setEtiqueta] = useState("");
    const [valor, setValor] = useState("");

    const [filteredEtiquetas, setFilteredEtiquetas] = useState([]);
    const [filteredValores, setFilteredValores] = useState([]);

    // Función para obtener el texto a mostrar basado en el key
    const getDisplayText = (catalog, key) => {
        if (!key) return "";
        const item = catalog.find(item => item.key?.toString() === key?.toString());
        return item?.text || key;
    };

    const limpiarEstado = () => {
        setEtiqueta("");
        setValor("");
        setFilteredEtiquetas([]);
        setFilteredValores([]);
    };

    useEffect(() => {
        if (isModalOpen && sociedadSeleccionada && cediSeleccionado) {
            // Filtrar etiquetas por sociedad y cedi seleccionados
            const etiquetasFiltradas = etiquetas.filter(et =>
                et.IDSOCIEDAD?.toString() === sociedadSeleccionada?.toString() &&
                et.IDCEDI?.toString() === cediSeleccionado?.toString()
            );
            setFilteredEtiquetas(etiquetasFiltradas);
        } else {
            limpiarEstado();
        }
    }, [isModalOpen, sociedadSeleccionada, cediSeleccionado, etiquetas]);

    const handleAceptar = () => {
        if (etiqueta && valor) {
            // Construir Grupo ET con los IDs: "IDETIQUETA-IDVALOR"
            const grupoET = `${etiqueta}-${valor}`;
            setGrupoET(grupoET);
            handleCloseModal();
        } else {
            alert("Por favor, selecciona una etiqueta y un valor.");
        }
    };

    const handleCerrar = () => {
        limpiarEstado();
        handleCloseModal();
    };

    return (
        <Dialog
            stretch={false}
            open={isModalOpen}
            onAfterClose={handleCerrar}
            headerText="Definir Grupo ET"
            style={{
                width: "450px",
                maxWidth: "90vw"
            }}
            footer={
                <Bar
                    endContent={
                        <>
                            <Button
                                design="Emphasized"
                                onClick={handleAceptar}
                                className="btn-guardar-modal"
                                disabled={!etiqueta || !valor}
                            >
                                Aceptar
                            </Button>
                            <Button design="Transparent" onClick={handleCerrar}>
                                Cancelar
                            </Button>
                        </>
                    }
                />
            }
            className="modal-sku"
        >
            <div className="modal-content" style={{ padding: "1rem" }}>
                <FlexBox
                    direction="Column"
                    style={{ gap: '1rem', width: '100%' }}
                >

                    {/* Etiqueta */}
                    <div>
                        <Label required>Etiqueta:</Label>
                        <ComboBox
                            value={getDisplayText(filteredEtiquetas, etiqueta)}
                            onSelectionChange={(e) => {
                                const selectedItem = e.detail.item;
                                const selectedKey = selectedItem?.dataset.key;
                                setEtiqueta(selectedKey || "");
                                // Limpiar valor y filtrar valores para la etiqueta seleccionada
                                setValor("");
                                const valoresFiltrados = valores.filter(v => 
                                    v.parentEtiqueta === selectedKey
                                );
                                setFilteredValores(valoresFiltrados);
                            }}
                            placeholder={
                                filteredEtiquetas.length === 0 ? 
                                "No hay etiquetas disponibles para esta Sociedad/CEDI" : 
                                "Selecciona una etiqueta"
                            }
                            filter="Contains"
                            style={{ width: '100%' }}
                            disabled={!sociedadSeleccionada || !cediSeleccionado}
                        >
                            {filteredEtiquetas.map(item =>
                                <ComboBoxItem 
                                    key={item.key} 
                                    data-key={item.key} 
                                    text={item.text} 
                                />
                            )}
                        </ComboBox>
                    </div>

                    {/* Valor */}
                    <div>
                        <Label required>Valor:</Label>
                        <ComboBox
                            value={getDisplayText(filteredValores, valor)}
                            disabled={!etiqueta || filteredValores.length === 0}
                            onSelectionChange={(e) => {
                                const selectedItem = e.detail.item;
                                const selectedKey = selectedItem?.dataset.key;
                                setValor(selectedKey || "");
                            }}
                            placeholder={
                                !etiqueta ? "Selecciona una etiqueta primero" :
                                filteredValores.length === 0 ? "No hay valores disponibles para esta etiqueta" : 
                                "Selecciona un valor"
                            }
                            filter="Contains"
                            style={{ width: '100%' }}
                        >
                            {filteredValores.map(item =>
                                <ComboBoxItem 
                                    key={item.key} 
                                    data-key={item.key} 
                                    text={item.text || item.key} 
                                />
                            )}
                        </ComboBox>
                    </div>

                    {/* Vista previa del Grupo ET */}
                    <div>
                        <Label>Vista previa del Grupo ET:</Label>
                        <Input
                            value={etiqueta && valor ? `${etiqueta}-${valor}` : ""}
                            placeholder="Se mostrará el Grupo ET aquí"
                            readOnly
                            style={{ width: '100%', fontWeight: "bold" }}
                        />
                    </div>
                </FlexBox>
            </div>
        </Dialog>
    );
};

export default ModalEditGrupoET;