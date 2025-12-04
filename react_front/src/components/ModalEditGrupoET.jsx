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

const ModalEditGrupoET = ({
    isModalOpen,
    handleCloseModal,
    setGrupoET,
    etiquetas,
    valores,
    sociedadSeleccionada,
    cediSeleccionado,
    currentGrupoET
}) => {

    const [etiqueta, setEtiqueta] = useState("");
    const [valor, setValor] = useState("");

    const [etiquetaInput, setEtiquetaInput] = useState("");
    const [valorInput, setValorInput] = useState("");

    const [filteredEtiquetas, setFilteredEtiquetas] = useState([]);
    const [filteredValores, setFilteredValores] = useState([]);

    // Función para obtener el texto a mostrar basado en el key
    const formatItemText = (text, key) => {
        if (!key) return "";
        return `${text || key} (${key})`;
    };

    const limpiarEstado = () => {
        setEtiqueta("");
        setValor("");
        setEtiquetaInput("");
        setValorInput("");
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
            // Lógica de Pre-selección basada en currentGrupoET
            if (currentGrupoET && currentGrupoET.includes("-")) {
                const partes = currentGrupoET.split("-");
                // Tomamos la primera parte como etiqueta y la segunda como valor
                const initEtiquetaKey = partes[0];
                const initValorKey = partes[1];

                if (initEtiquetaKey && initValorKey) {
                    // Setear claves lógicas
                    setEtiqueta(initEtiquetaKey);
                    setValor(initValorKey);

                    // Buscar objetos completos para obtener el Texto para los inputs visuales
                    const etObj = etiquetas.find(e => e.key.toString() === initEtiquetaKey.toString());
                    const valObj = valores.find(v => v.key.toString() === initValorKey.toString());

                    // Setear textos visuales formato "Texto (Key)"
                    setEtiquetaInput(formatItemText(etObj?.text, initEtiquetaKey));
                    setValorInput(formatItemText(valObj?.text, initValorKey));

                    // IMPORTANTE: Pre-calcular los valores filtrados para esa etiqueta
                    // Usando el filtrado estricto que corregimos anteriormente
                    const valoresFiltrados = valores.filter(v =>
                        v.parentEtiqueta?.toString() === initEtiquetaKey.toString() &&
                        v.IDSOCIEDAD?.toString() === sociedadSeleccionada?.toString() &&
                        v.IDCEDI?.toString() === cediSeleccionado?.toString()
                    );
                    setFilteredValores(valoresFiltrados);
                }
            } else {
                // Si no hay grupo actual o es inválido, limpiamos selección pero mantenemos etiquetas filtradas
                setEtiqueta("");
                setValor("");
                setEtiquetaInput("");
                setValorInput("");
                setFilteredValores([]);
            }
        } else {
            limpiarEstado();
        }
    }, [isModalOpen, sociedadSeleccionada, cediSeleccionado, etiquetas, currentGrupoET]);

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
            draggable={true}
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
                            value={etiquetaInput}
                            onInput={(e) => {
                                // Permitir escribir libremente para filtrar
                                setEtiquetaInput(e.target.value);
                            }}
                            onSelectionChange={(e) => {
                                const selectedItem = e.detail.item;
                                const selectedKey = selectedItem?.dataset.key;
                                const selectedText = selectedItem?.text;

                                if (selectedKey) {
                                    setEtiqueta(selectedKey);
                                    // Forzamos el texto del input al formato completo seleccionado
                                    setEtiquetaInput(selectedText);

                                    // Resetear valor dependiente
                                    setValor("");
                                    setValorInput("");
                                    const valoresFiltrados = valores.filter(v =>
                                        v.parentEtiqueta?.toString() === selectedKey?.toString() &&
                                        v.IDSOCIEDAD?.toString() === sociedadSeleccionada?.toString() &&
                                        v.IDCEDI?.toString() === cediSeleccionado?.toString()
                                    );
                                    setFilteredValores(valoresFiltrados);
                                } else {
                                    // Si el usuario borra o selecciona algo inválido
                                    setEtiqueta("");
                                    setFilteredValores([]);
                                }
                            }}
                            placeholder={
                                filteredEtiquetas.length === 0 ?
                                    "No hay etiquetas disponibles" : "Selecciona una etiqueta"
                            }
                            filter="Contains"
                            style={{ width: '100%' }}
                            disabled={!sociedadSeleccionada || !cediSeleccionado}
                        >
                            {filteredEtiquetas.map(item => (
                                <ComboBoxItem
                                    key={item.key}
                                    data-key={item.key}
                                    text={formatItemText(item.text, item.key)}
                                />
                            ))}
                        </ComboBox>
                    </div>

                    {/* Valor */}
                    <div>
                        <Label required>Valor:</Label>
                        <ComboBox
                            value={valorInput}
                            onInput={(e) => {
                                setValorInput(e.target.value);
                            }}
                            disabled={!etiqueta || filteredValores.length === 0}
                            onSelectionChange={(e) => {
                                const selectedItem = e.detail.item;
                                const selectedKey = selectedItem?.dataset.key;
                                const selectedText = selectedItem?.text;

                                if (selectedKey) {
                                    setValor(selectedKey);
                                    setValorInput(selectedText);
                                } else {
                                    setValor("");
                                }
                            }}
                            placeholder={
                                !etiqueta ? "Selecciona una etiqueta primero" :
                                    filteredValores.length === 0 ? "No hay valores disponibles" :
                                        "Selecciona un valor"
                            }
                            filter="Contains"
                            style={{ width: '100%' }}
                        >
                            {filteredValores.map(item => (
                                <ComboBoxItem
                                    key={item.key}
                                    data-key={item.key}
                                    text={formatItemText(item.text || item.key, item.key)}
                                />
                            ))}
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