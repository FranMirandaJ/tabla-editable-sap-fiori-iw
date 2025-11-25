import axios from "axios";
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
} from "@ui5/webcomponents-react";
import ModalEditGrupoET from "./ModalEditGrupoET.jsx";
import ButtonDesign from "@ui5/webcomponents/dist/types/ButtonDesign.js";

const URL_BASE_BACKEND_CINNALOVERS = "https://app-restful-sap-cds.onrender.com";
const LOGGED_USER = "FMIRADAJ";

const ModalCrear = ({
    isModalOpen,
    handleCloseModal,
    dbConnection,
    refetchData,
    sociedadesCatalog,
    cedisCatalog,
    etiquetasCatalog,
    valoresCatalog,
    showToastMessage,
}) => {

    // console.log("catalogo sociedades ",sociedadesCatalog);
    // console.log("catalogo cedis ",cedisCatalog);
    // console.log("catalogo etiquetas ",etiquetasCatalog);
    // console.log("catalogo valores ",valoresCatalog);
    

    const [isLoading, setIsLoading] = useState(false);

    // Estados para los catálogos filtrados
    const [filteredCedisCatalog, setFilteredCedisCatalog] = useState([]);
    const [filteredEtiquetasCatalog, setFilteredEtiquetasCatalog] = useState([]);
    const [filteredValoresCatalog, setFilteredValoresCatalog] = useState([]);

    // Estados para los campos del formulario
    const [sociedad, setSociedad] = useState("");
    const [cedis, setCedis] = useState("");
    const [etiqueta, setEtiqueta] = useState("");
    const [valor, setValor] = useState("");
    const [grupoET, setGrupoET] = useState("");
    const [id, setId] = useState("");
    const [infoAdicional, setInfoAdicional] = useState("");

    const [isModalEditGrupoETOpen, setIsModalEditGrupoETOpen] = useState(false);

    // Limpiar formulario cuando se cierra el modal
    useEffect(() => {
        if (!isModalOpen) {
            limpiarFormulario();
        }
    }, [isModalOpen]);

    // Función para obtener el texto a mostrar en los ComboBox
    const getDisplayText = (catalog, key) => {
        if (!key) return "";
        const item = catalog.find(item => item.key.toString() === key.toString());
        return item?.text || key;
    };

    const handleGuardar = async () => {
        setIsLoading(true);
        if (!sociedad || !cedis || !etiqueta || !valor || !grupoET || !id) {
            showToastMessage("❌ Completa Sociedad, CEDI, Etiqueta, Valor, Grupo Etiqueta y ID.");
            setIsLoading(false);
            return;
        }
        try {
            const registro = {
                IDSOCIEDAD: sociedad,
                IDCEDI: cedis,
                IDETIQUETA: etiqueta,
                IDVALOR: valor,
                INFOAD: infoAdicional,
                IDGRUPOET: grupoET,
                ID: id,
                ACTIVO: true,
            };

            const processType = "Create";
            const url = `${URL_BASE_BACKEND_CINNALOVERS}/api/security/gruposet/crud?ProcessType=${processType}&DBServer=${dbConnection}&LoggedUser=${LOGGED_USER}`;

            const res = await axios.post(url, registro, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.data?.success || res.status === 200) {
                limpiarFormulario();
                refetchData();
                handleCloseModal();
                showToastMessage(`✅ Registro creado correctamente`);
            } else {
                showToastMessage(`⚠️ Error al crear el registro`);
            }

        } catch (error) {
            if (error.response?.status === 409) {
                showToastMessage("❌ Ya existe un registro con esos datos. No se puede crear.");
            } else {
                console.error("❌ Error al guardar:", error);
                showToastMessage("Error al guardar el registro: " + (error.response?.data?.message || error.message));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const limpiarFormulario = () => {
        setSociedad("");
        setCedis("");
        setEtiqueta("");
        setValor("");
        setGrupoET("");
        setId("");
        setInfoAdicional("");
        // Limpiar también los catálogos filtrados
        setFilteredCedisCatalog([]);
        setFilteredEtiquetasCatalog([]);
        setFilteredValoresCatalog([]);
    };

    const handleCancelar = () => {
        limpiarFormulario();
        handleCloseModal();
    };

    return (
        <>
            <Dialog
                stretch={false}
                open={isModalOpen}
                onAfterClose={handleCancelar}
                headerText="Crear Nuevo Registro"
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
                                    onClick={handleGuardar}
                                    className="btn-guardar-modal"
                                    loading={isLoading}
                                    disabled={isLoading}
                                    loadingText="Guardando..."
                                >
                                    Guardar
                                </Button>
                                <Button design="Transparent" onClick={handleCancelar}>
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
                        {/* Sociedad */}
                        <div>
                            <Label required>Sociedad:</Label>
                            <ComboBox
                                value={getDisplayText(sociedadesCatalog, sociedad)}
                                onSelectionChange={(e) => {
                                    const selectedItem = e.detail.item;
                                    const selectedKey = selectedItem?.dataset.key;
                                    console.log("Sociedad seleccionada:", selectedKey);
                                    setSociedad(selectedKey || "");
                                    // Limpiar selecciones dependientes
                                    setCedis("");
                                    setEtiqueta("");
                                    setValor("");
                                    setGrupoET("");
                                    // Filtrar CEDIS - asegurar comparación de strings
                                    const filtered = cedisCatalog.filter(c =>
                                        c.parentSoc?.toString() === selectedKey?.toString()
                                    );
                                    console.log("CEDIS filtrados:", filtered);
                                    setFilteredCedisCatalog(filtered);
                                    setFilteredEtiquetasCatalog([]);
                                    setFilteredValoresCatalog([]);
                                }}
                                placeholder="Selecciona una sociedad"
                                filter="Contains"
                                style={{ width: '100%' }}
                            >
                                {sociedadesCatalog.map(item =>
                                    <ComboBoxItem
                                        key={item.key}
                                        data-key={item.key}
                                        text={item.text}
                                    />
                                )}
                            </ComboBox>
                        </div>

                        {/* CEDI */}
                        <div>
                            <Label required>CEDI:</Label>
                            <ComboBox
                                value={getDisplayText(filteredCedisCatalog, cedis)}
                                disabled={!sociedad || filteredCedisCatalog.length === 0}
                                onSelectionChange={(e) => {
                                    const selectedItem = e.detail.item;
                                    const selectedKey = selectedItem?.dataset.key;
                                    console.log("CEDI seleccionado:", selectedKey);
                                    setCedis(selectedKey || "");
                                    // Limpiar selecciones dependientes
                                    setEtiqueta("");
                                    setValor("");
                                    setGrupoET("");
                                    // Filtrar Etiquetas - asegurar comparación de strings
                                    const filtered = etiquetasCatalog.filter(et =>
                                        et.IDSOCIEDAD?.toString() === sociedad?.toString() &&
                                        et.IDCEDI?.toString() === selectedKey?.toString()
                                    );
                                    console.log("Etiquetas filtradas:", filtered);
                                    setFilteredEtiquetasCatalog(filtered);
                                    setFilteredValoresCatalog([]);
                                }}
                                placeholder={filteredCedisCatalog.length === 0 ? "No hay CEDIS disponibles" : "Selecciona un CEDI"}
                                filter="Contains"
                                style={{ width: '100%' }}
                            >
                                {filteredCedisCatalog.map(item =>
                                    <ComboBoxItem
                                        key={item.key}
                                        data-key={item.key}
                                        text={item.text}
                                    />
                                )}
                            </ComboBox>
                        </div>

                        {/* Etiqueta */}
                        <div>
                            <Label required>Etiqueta:</Label>
                            <ComboBox
                                value={getDisplayText(filteredEtiquetasCatalog, etiqueta)}
                                disabled={!cedis || filteredEtiquetasCatalog.length === 0}
                                onSelectionChange={(e) => {
                                    const selectedItem = e.detail.item;
                                    const selectedKey = selectedItem?.dataset.key;
                                    console.log("Etiqueta seleccionada:", selectedKey);
                                    setEtiqueta(selectedKey || "");
                                    // Limpiar selección dependiente
                                    setValor("");
                                    setGrupoET("");
                                    // Filtrar Valores
                                    const filtered = valoresCatalog.filter(v =>
                                        v.parentEtiqueta === selectedKey
                                    );
                                    console.log("Valores filtrados:", filtered);
                                    setFilteredValoresCatalog(filtered);
                                }}
                                placeholder={filteredEtiquetasCatalog.length === 0 ? "No hay etiquetas disponibles" : "Selecciona una etiqueta"}
                                filter="Contains"
                                style={{ width: '100%' }}
                            >
                                {filteredEtiquetasCatalog.map(item =>
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
                                value={getDisplayText(filteredValoresCatalog, valor)}
                                disabled={!etiqueta || filteredValoresCatalog.length === 0}
                                onSelectionChange={(e) => {
                                    const selectedItem = e.detail.item;
                                    const selectedKey = selectedItem?.dataset.key;
                                    console.log("Valor seleccionado:", selectedKey);
                                    setValor(selectedKey || "");
                                }}
                                placeholder={filteredValoresCatalog.length === 0 ? "No hay valores disponibles" : "Selecciona un valor"}
                                filter="Contains"
                                style={{ width: '100%' }}
                            >
                                {filteredValoresCatalog.map(item =>
                                    <ComboBoxItem
                                        key={item.key}
                                        data-key={item.key}
                                        text={item.text || item.key}
                                    />
                                )}
                            </ComboBox>
                        </div>

                        {/* Grupo ET */}
                        <div>
                            <Label required>Grupo ET:</Label>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Input
                                    value={grupoET}
                                    onChange={(e) => setGrupoET(e.target.value)}
                                    placeholder="Grupo ET"
                                    style={{ flex: 1 }}
                                    disabled = {true}
                                />
                                <Button
                                    icon="edit"
                                    design="Transparent"
                                    onClick={() => setIsModalEditGrupoETOpen(true)}
                                    disabled={!sociedad || !cedis}
                                    title="Generar Grupo ET"
                                />
                            </div>
                        </div>

                        {/* ID */}
                        <div>
                            <Label required>ID:</Label>
                            <Input
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder="ID del grupo"
                                style={{ width: '100%' }}
                            />
                        </div>

                        {/* Información adicional */}
                        <div>
                            <Label>Información adicional:</Label>
                            <TextArea
                                value={infoAdicional}
                                onChange={(e) => setInfoAdicional(e.target.value)}
                                placeholder="Información adicional..."
                                style={{ width: '100%', minHeight: '80px' }}
                                growing
                                growingMaxLines={5}
                            />
                        </div>
                    </FlexBox>
                </div>
            </Dialog>

            {/* Modal para editar Grupo ET */}
            <ModalEditGrupoET
                isModalOpen={isModalEditGrupoETOpen}
                handleCloseModal={() => setIsModalEditGrupoETOpen(false)}
                setGrupoET={setGrupoET}
                dbConnection={dbConnection}
                etiquetas={etiquetasCatalog}
                valores={valoresCatalog}
                sociedadSeleccionada={sociedad}
                cediSeleccionado={cedis}
            />
        </>
    );
}

export default ModalCrear;