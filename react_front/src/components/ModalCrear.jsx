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
    Icon,
} from "@ui5/webcomponents-react";
import ModalEditGrupoET from "./ModalEditGrupoET.jsx";

// Constantes para consultar el backend del equipo de miguellopez corriendo en localhost
const URL_BASE = "http://localhost:3034/api/cat/crudLabelsValues";
const LOGGED_USER = "MIGUELLOPEZ";


const ModalCrear = ({ isModalOpen, handleCloseModal, dbConnection }) => {

    const [sociedadesCatalog, setSociedadesCatalog] = useState([]);
    const [cedisCatalog, setCedisCatalog] = useState([]);
    const [etiquetasCatalog, setEtiquetasCatalog] = useState([]);
    const [valoresCatalog, setValoresCatalog] = useState([]);

    // Estados para los campos del formulario
    const [sociedad, setSociedad] = useState("");
    const [cedis, setCedis] = useState("");
    const [etiqueta, setEtiqueta] = useState("");
    const [valor, setValor] = useState("");
    const [grupoET, setGrupoET] = useState("");
    const [id, setid] = useState("");
    const [infoAdicional, setInfoAdicional] = useState("");

    console.log(sociedadesCatalog, cedisCatalog, etiquetasCatalog, valoresCatalog);

    const [isModalEditGrupoETOpen, setIsModalEditGrupoETOpen] = useState(false);

    useEffect(() => {
        const fetchCatalogos = async () => {
            if (!isModalOpen) return;
            try {
                const url = `${URL_BASE}?ProcessType=GetAll&LoggedUser=${LOGGED_USER}&DBServer=${dbConnection}`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        operations: [
                            {
                                collection: "LabelsValues",
                                action: "GETALL",
                                payload: {}
                            }
                        ]
                    }),
                });

                if (!response.ok) {
                    console.log(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                const registros = data.data?.[0]?.dataRes || [];

                if (!Array.isArray(registros) || registros.length === 0) {
                    return;
                }

                const sociedades = [];
                const cedis = [];
                const etiquetas = [];
                const valores = [];

                registros.forEach((item) => {
                    // SOCIEDADES
                    if (item.IDSOCIEDAD && !sociedades.some((s) => s.key === item.IDSOCIEDAD)) {
                        sociedades.push({
                            key: item.IDSOCIEDAD,
                            text: `Sociedad ${item.IDSOCIEDAD}`,
                        });
                    }

                    // CEDIS
                    if (
                        item.IDCEDI &&
                        !cedis.some((c) => c.key === item.IDCEDI && c.parentSoc === item.IDSOCIEDAD)
                    ) {
                        cedis.push({
                            key: item.IDCEDI,
                            text: `Cedi ${item.IDCEDI}`,
                            parentSoc: item.IDSOCIEDAD,
                        });
                    }

                    // ETIQUETAS
                    // Guardar etiqueta COMPLETA en etiquetasAll
                    // ETIQUETAS (IDS reales + conservar COLECCION/SECCION para filtros)
                    if (item.IDETIQUETA && !etiquetas.some((e) => e.key === item.IDETIQUETA)) {
                        etiquetas.push({
                            key: item.IDETIQUETA,
                            text: item.IDETIQUETA,
                            IDETIQUETA: item.IDETIQUETA,
                            ETIQUETA: item.ETIQUETA,
                            IDSOCIEDAD: item.IDSOCIEDAD,
                            IDCEDI: item.IDCEDI,
                            COLECCION: item.COLECCION || "",
                            SECCION: item.SECCION || "",
                            _raw: item
                        });
                    }

                    const etiquetasSimplificadas = etiquetas.map(e => ({
                        key: e.IDETIQUETA,
                        text: e.ETIQUETA || e.IDETIQUETA,
                        IDSOCIEDAD: e.IDSOCIEDAD,
                        IDCEDI: e.IDCEDI
                    }));

                    // VALORES anidados
                    if (Array.isArray(item.valores)) {
                        item.valores.forEach((v) => {
                            valores.push({
                                key: v.IDVALOR,     // ID REAL
                                text: v.IDVALOR,
                                IDVALOR: v.IDVALOR,
                                VALOR: v.VALOR,
                                IDSOCIEDAD: v.IDSOCIEDAD,
                                IDCEDI: v.IDCEDI,
                                parentEtiqueta: item.IDETIQUETA
                            });
                        });
                    }
                });

                setCedisCatalog(cedis);
                setEtiquetasCatalog(etiquetas);
                setValoresCatalog(valores);
                setSociedadesCatalog(sociedades);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchCatalogos();
    }, [isModalOpen]);

    const handleGuardar = async () => {
        // try {
        //     const registro = {
        //         IDSOCIEDAD: Number(sociedad),
        //         IDCEDI: Number(sucursal),
        //         IDETIQUETA: etiqueta,
        //         IDVALOR: idValor,
        //         INFOAD: infoAdicional,
        //         IDGRUPOET: idGroupEt,
        //         ID: id,
        //         ACTIVO: true,
        //     };

        //     const processType = isEditing ? "UpdateOne" : "Create";
        //     const url = `${URL_BASE}/api/security/gruposet/crud?ProcessType=${processType}&DBServer=${dbConnection}`;



        //     console.log(`📤 Enviando ${processType} a:`, url);
        //     console.log("📦 Datos:", registro);

        //     const res = await axios.post(url, registro, {
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //     });

        //     if (res.data?.success || res.status === 200) {
        //         alert(`✅ Registro ${isEditing ? "actualizado" : "creado"} correctamente`);

        //         // Refrescar los datos después de guardar
        //         const resFetch = await axios.post(
        //             `${URL_BASE}/api/security/gruposet/crud?ProcessType=GetAll&DBServer=${dbConnection}`,
        //             {}
        //         );

        //         const records =
        //             resFetch.data?.data?.[0]?.dataRes?.map((item) => ({
        //                 sociedad: item.IDSOCIEDAD,
        //                 sucursal: item.IDCEDI,
        //                 etiqueta: item.IDETIQUETA,
        //                 valor: item.IDVALOR,
        //                 idgroup: item.IDGRUPOET,
        //                 idg: item.ID,
        //                 info: item.INFOAD,
        //                 fecha: item.FECHAREG,
        //                 hora: item.HORAREG,
        //                 estado: item.ACTIVO ? "Activo" : "Inactivo",
        //             })) || [];
        //         setData(records);
        //     } else {
        //         alert(`⚠️ Error al ${isEditing ? "actualizar" : "crear"} el registro`);
        //     }

        //     // Cerrar el modal y limpiar
        //     setIsModalOpen(false);
        //     setIsEditing(false);
        //     setSelectedRow(null);
        // } catch (error) {
        //     console.error("❌ Error al guardar:", error);
        //     alert("Error al guardar el registro: " + error.message);
        // }
    };

    return (
        <>
            <Dialog
                stretch={false}
                open={isModalOpen}
                onAfterClose={handleCloseModal}
                headerText="Registro"
                style={{
                    width: "600px",  // o el ancho que prefieras
                    maxWidth: "90vw" // mantiene responsive
                }}
                footer={
                    <Bar
                        endContent={
                            <>
                                <Button
                                    design="Emphasized"
                                    icon="add"
                                    onClick={handleGuardar}
                                    className="btn-guardar-modal"
                                >
                                    Guardar cambios
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
                            <Label required>Sociedad</Label>
                            <ComboBox
                                className="modal-combobox"
                                onChange={(e) => {
                                    const value = e.detail.value;
                                    setSociedad(value);
                                }}
                                placeholder="Selecciona una sociedad"
                                value={sociedad}
                                filter="Contains"
                                style={{ width: '400px' }}
                            >
                                {sociedadesCatalog.map(item =>
                                    <ComboBoxItem key={item.key} text={item.text} />
                                )}
                            </ComboBox>
                        </div>

                        <div className="modal-field">
                            <Label required>CEDI</Label>
                            <ComboBox
                                className="modal-combobox"
                                onChange={(e) => {
                                    const value = e.detail.value;
                                    setCedis(value);
                                }}
                                placeholder="Selecciona un CEDI"
                                value={cedis}
                                filter="Contains"
                                style={{ width: '400px' }}
                            >
                                {cedisCatalog.map(item =>
                                    <ComboBoxItem key={item.key} text={item.text} />
                                )}
                            </ComboBox>
                        </div>

                        <div className="modal-field">
                            <Label required>Etiqueta</Label>
                            <ComboBox
                                className="modal-combobox"
                                onChange={(e) => {
                                    const value = e.detail.value;
                                    setEtiqueta(value);
                                }}
                                placeholder="Selecciona una etiqueta"
                                value={etiqueta}
                                filter="Contains"
                                style={{ width: '400px' }}
                            >
                                {etiquetasCatalog.map(item =>
                                    <ComboBoxItem key={item.key} text={item.IDETIQUETA} />
                                )}
                            </ComboBox>
                        </div>

                        <div className="modal-field">
                            <Label required>Valor</Label>
                            <ComboBox
                                className="modal-combobox"
                                onChange={(e) => {
                                    const value = e.detail.value;
                                    setValor(value);
                                }}
                                placeholder="Seleccione un valor"
                                value={valor}
                                filter="Contains"
                                style={{ width: '400px' }}
                            >
                                {valoresCatalog.map(item =>
                                    <ComboBoxItem key={item.IDVALOR} text={item.IDVALOR} />
                                )}
                            </ComboBox>
                        </div>

                        <div className="modal-field">
                            <Label required>Grupo ET</Label>
                            <div className="grupo-et-container">
                                <Input
                                    icon={null}
                                    type="Text"
                                    valueState="None"
                                    disabled={true}
                                />
                                <Button
                                    icon="edit"
                                    onClick={() => setIsModalEditGrupoETOpen(true)}
                                    title="Editar Grupo ET"
                                    className="btn-editar-grupo"
                                />
                            </div>
                        </div>

                        <div className="modal-field">
                            <Label required>ID</Label>
                            <Input
                                className="modal-input"
                                value={id}
                                placeholder="id grupo"
                                onChange={(e) => setid(e.target.value)}
                                style={{ width: '400px' }}
                            />
                        </div>
                    </FlexBox>

                    <div className="modal-field">
                        <Label className="textarea-label">Información adicional</Label>
                        <TextArea
                            placeholder="Escriba información adicional..."
                            className="modal-textarea"
                            onChange={(e) => setInfoAdicional(e.target.value)}
                            value={infoAdicional}
                            style={{ width: '400px' }}
                        />
                    </div>
                </div>
            </Dialog>
            <ModalEditGrupoET
                isModalOpen={isModalEditGrupoETOpen}
                handleCloseModal={() => setIsModalEditGrupoETOpen(false)}
                setGrupoET={setGrupoET}
                dbConnection={dbConnection}
            />
        </>
    );
}

export default ModalCrear;