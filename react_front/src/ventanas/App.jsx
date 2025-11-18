import React, { useEffect, useState } from "react";
import "./css/App.css";
import "./css/Modal.css";
import axios from "axios";
import {
  ShellBar,
  Button,
  Input,
  AnalyticalTable,
  Dialog,
  Bar,
  Label,
  ComboBox,
  ComboBoxItem,
  TextArea,
  FlexBox,
  SideNavigation,
  SideNavigationItem,
  SideNavigationSubItem,
  Switch
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/menu.js";
import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/settings.js";
import "@ui5/webcomponents-icons/dist/database.js";

export default function App() {
  // --- Estados originales ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- Estados añadidos del menú ---
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [dbConnection, setDbConnection] = useState("MongoDB");
  const [dbPost, setDbPost] = useState("MongoDB");

  // 🆕 Estados para el formulario del modal
  const [sociedad, setSociedad] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [etiqueta, setEtiqueta] = useState("");
  const [idValor, setIdValor] = useState("");
  const [idGroupEt, setidGroupEt] = useState("");
  const [id, setid] = useState("");
  const [infoAdicional, setInfoAdicional] = useState("");

  // --- Cambio de conexión ---
  const handleSwitchChange = () => {
    setDbConnection(dbConnection === "MongoDB" ? "Azure" : "MongoDB");
  };
  const CambioDbPost = () => {
    setDbPost(dbPost === "MongoDB" ? "Azure" : "MongoDB");
  };

  // Cargar datos del backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          `http://localhost:4004/api/security/gruposet/crud?ProcessType=GetAll&DBServer=${dbConnection}`,
          {}
        );

        const records =
          res.data?.data?.[0]?.dataRes?.map((item) => ({
            sociedad: item.IDSOCIEDAD,
            sucursal: item.IDCEDI,
            etiqueta: item.IDETIQUETA,
            valor: item.IDVALOR,
            idgroup: item.IDGRUPOET,
            idg: item.ID,
            info: item.INFOAD,
            fecha: item.FECHAREG,
            hora: item.HORAREG,
            estado: item.ACTIVO ? "Activo" : "Inactivo",
          })) || [];

        setData(records);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dbConnection]);

  const columns = [
    { Header: "Sociedad", accessor: "sociedad" },
    { Header: "Sucursal (CEDIS)", accessor: "sucursal" },
    { Header: "Etiqueta", accessor: "etiqueta" },
    { Header: "Valor", accessor: "valor" },
    { Header: "IDGRUPOET", accessor: "idgroup" },
    { Header: "ID", accessor: "idg" },
    { Header: "Informacion", accessor: "info" },
    { Header: "Fecha", accessor: "fecha" },
    { Header: "Hora", accessor: "hora" },
    { Header: "Estado", accessor: "estado" },
  ];

  const handleCrearClick = () => {
    setIsEditing(false);
    setSociedad("");
    setSucursal("");
    setEtiqueta("");
    setIdValor("");
    setInfoAdicional("");
    setidGroupEt("");
    setid("");
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleGuardar = async () => {
    try {
      const registro = {
        IDSOCIEDAD: Number(sociedad),
        IDCEDI: Number(sucursal),
        IDETIQUETA: etiqueta,
        IDVALOR: idValor,
        INFOAD: infoAdicional,
        IDGRUPOET: idGroupEt,
        ID: id,
        ACTIVO: true,
      };

      const processType = isEditing ? "UpdateOne" : "Create";
      const url = `http://localhost:4004/api/security/gruposet/crud?ProcessType=${processType}&DBServer=${dbConnection}`;



      console.log(`📤 Enviando ${processType} a:`, url);
      console.log("📦 Datos:", registro);

      const res = await axios.post(url, registro, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data?.success || res.status === 200) {
        alert(`✅ Registro ${isEditing ? "actualizado" : "creado"} correctamente`);

        // Refrescar los datos después de guardar
        const resFetch = await axios.post(
          `http://localhost:4004/api/security/gruposet/crud?ProcessType=GetAll&DBServer=${dbConnection}`,
          {}
        );
        const records =
          resFetch.data?.data?.[0]?.dataRes?.map((item) => ({
            sociedad: item.IDSOCIEDAD,
            sucursal: item.IDCEDI,
            etiqueta: item.IDETIQUETA,
            valor: item.IDVALOR,
            idgroup: item.IDGRUPOET,
            idg: item.ID,
            info: item.INFOAD,
            fecha: item.FECHAREG,
            hora: item.HORAREG,
            estado: item.ACTIVO ? "Activo" : "Inactivo",
          })) || [];
        setData(records);
      } else {
        alert(`⚠️ Error al ${isEditing ? "actualizar" : "crear"} el registro`);
      }

      // Cerrar el modal y limpiar
      setIsModalOpen(false);
      setIsEditing(false);
      setSelectedRow(null);
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      alert("Error al guardar el registro: " + error.message);
    }
  };


  const handleEditarClick = () => {
    if (!selectedRow) {
      alert("Selecciona una fila primero");
      return;
    }

    // Cargar los datos seleccionados al modal
    setSociedad(selectedRow.sociedad || "");
    setSucursal(selectedRow.sucursal || "");
    setEtiqueta(selectedRow.etiqueta || "");
    setIdValor(selectedRow.valor || "");
    setInfoAdicional(selectedRow.info || "");
    setidGroupEt(selectedRow.idgroup || "");
    setid(selectedRow.idg || "");

    setIsEditing(true);
    setIsModalOpen(true);

  };


  const handleActivar = async () => {
    // Verificar si hay una fila seleccionada
    if (!selectedRow) {
      alert("⚠️ Selecciona un registro de la tabla primero");
      return;
    }

    try {
      const url = `http://localhost:4004/api/security/gruposet/crud?ProcessType=UpdateOne&DBServer=${dbConnection}&LoggedUser=FMIRANDAJ`;

      const payload = {
        // Llaves para identificar el registro
        IDSOCIEDAD: selectedRow.sociedad,
        IDCEDI: selectedRow.sucursal,
        IDETIQUETA: selectedRow.etiqueta,
        IDVALOR: selectedRow.valor,
        IDGRUPOET: selectedRow.idgroup,
        ID: selectedRow.idg,
        // Datos a actualizar
        data: {
          ACTIVO: true,
          BORRADO: false
        }
      };

      console.log("📤 Activando registro:", payload);

      const response = await axios.post(url, payload);

      console.log("📥 Respuesta:", response.data);

      alert("✅ Registro activado correctamente");

      // 🔄 Refrescar la tabla
      const res = await axios.post(
        `http://localhost:4004/api/security/gruposet/crud?ProcessType=GetAll&DBServer=${dbConnection}`,
        {}
      );
      const records =
        res.data?.data?.[0]?.dataRes?.map((item) => ({
          sociedad: item.IDSOCIEDAD,
          sucursal: item.IDCEDI,
          etiqueta: item.IDETIQUETA,
          valor: item.IDVALOR,
          idgroup: item.IDGRUPOET,
          idg: item.ID,
          info: item.INFOAD,
          fecha: item.FECHAREG,
          hora: item.HORAREG,
          estado: item.ACTIVO ? "Activo" : "Inactivo",
        })) || [];
      setData(records);
      setSelectedRow(null);

    } catch (err) {
      console.error("❌ Error al activar:", err);
      console.error("❌ Detalles:", err.response?.data);
      alert(`❌ No se pudo activar: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDesactivar = async () => {
    if (!selectedRow) { alert("Selecciona un registro"); return; }

    try {
      const payload = {
        IDSOCIEDAD: selectedRow.sociedad,
        IDCEDI: selectedRow.sucursal,
        IDETIQUETA: selectedRow.etiqueta,
        IDVALOR: selectedRow.valor,
        IDGRUPOET: selectedRow.idgroup,
        ID: selectedRow.idg
      };

      const url = `http://localhost:4004/api/security/gruposet/crud?ProcessType=DeleteOne&DBServer=${dbConnection}`;
      await axios.post(url, payload);

      alert("🟡 Registro desactivado");
      // 🔄 Refrescar tabla
      const res = await axios.post(
        `http://localhost:4004/api/security/gruposet/crud?ProcessType=GetAll&DBServer=${dbConnection}`,
        {}
      );
      const records =
        res.data?.data?.[0]?.dataRes?.map((item) => ({
          sociedad: item.IDSOCIEDAD,
          sucursal: item.IDCEDI,
          etiqueta: item.IDETIQUETA,
          valor: item.IDVALOR,
          idgroup: item.IDGRUPOET,
          idg: item.ID,
          info: item.INFOAD,
          fecha: item.FECHAREG,
          hora: item.HORAREG,
          estado: item.ACTIVO ? "Activo" : "Inactivo",
        })) || [];
      setData(records);

    } catch (err) {
      console.error("Error al desactivar:", err);
      alert("❌ No se pudo desactivar el registro");
    }
  };

  const handleEliminarClick = async () => {
    if (!selectedRow) { alert("Selecciona un registro"); return; }

    try {
      const payload = {
        IDSOCIEDAD: selectedRow.sociedad,
        IDCEDI: selectedRow.sucursal,
        IDETIQUETA: selectedRow.etiqueta,
        IDVALOR: selectedRow.valor,
        IDGRUPOET: selectedRow.idgroup,
        ID: selectedRow.idg
      };

      const url = `http://localhost:4004/api/security/gruposet/crud?ProcessType=DeleteHard&DBServer=${dbConnection}`;
      await axios.post(url, payload);

      alert("🟡 Registro elimina");
      // 🔄 Refrescar tabla
      const res = await axios.post(
        `http://localhost:4004/api/security/gruposet/crud?ProcessType=GetAll&DBServer=${dbConnection}`,
        {}
      );
      const records =
        res.data?.data?.[0]?.dataRes?.map((item) => ({
          sociedad: item.IDSOCIEDAD,
          sucursal: item.IDCEDI,
          etiqueta: item.IDETIQUETA,
          valor: item.IDVALOR,
          idgroup: item.IDGRUPOET,
          idg: item.ID,
          info: item.INFOAD,
          fecha: item.FECHAREG,
          hora: item.HORAREG,
          estado: item.ACTIVO ? "Activo" : "Inactivo",
        })) || [];
      setData(records);

    } catch (err) {
      console.error("Error al eliminar :", err);
      alert("❌ No se pudo eliminar el registro");
    }
  };
  console.log("Registros cargados:", data.length, data);

  return (
    <>
      {/* 🔹 ShellBar con menú hamburguesa */}
      <ShellBar
        primaryTitle="CINNALOVERS"
        startButton={
          <Button
            icon="menu"
            design="Transparent"
            onClick={() => setIsNavOpen(!isNavOpen)}
          />
        }
        showNotifications
        showCoPilot
        showProductSwitch
      />

      {/* 🔹 Menú lateral (SideNavigation) */}
      {isNavOpen && (
        <SideNavigation
          style={{
            width: "250px",
            height: "100vh",
            position: "fixed",
            top: "45px",
            left: 0,
            backgroundColor: "#f7f7f7",
            boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <SideNavigationItem icon="home" text="Inicio" />
          <SideNavigationItem
            icon="database"
            text="Grupos de SKU"
            selected
          />
          <SideNavigationItem
            icon="settings"
            text="Configuración"
            onClick={() => setShowConfig(true)}
          />
        </SideNavigation>
      )}

      {/* 🔹 Contenido original sin modificar */}
      <div
        className="container-principal"
        style={{
          marginLeft: isNavOpen ? "260px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        <h2 className="titulo">Grupos y subgrupos de SKU</h2>

        <div className="barra-controles">
          <Button className="btn-crear" icon="add" onClick={handleCrearClick}>
            Crear
          </Button>
          <Button className="btn-editar" icon="edit" onClick={handleEditarClick}>
            Editar
          </Button>
          <Button className="btn-eliminar" icon="delete" onClick={handleEliminarClick}>
            Eliminar
          </Button>
          <Button className="btn-desactivar" icon="decline" onClick={handleDesactivar}>
            Desactivar
          </Button>
          <Button className="btn-activar" icon="accept" onClick={handleActivar}>
            Activar
          </Button>
          <div className="search-bar">
            <Input
              placeholder="Buscar..."
              icon="search"
              className="search-input"
            />
          </div>
        </div>

        <div className="tabla-fondo" style={{ cursor: "pointer" }}>
          {loading ? (
            <p className="loading-msg">Cargando datos...</p>
          ) : data.length > 0 ? (
            <AnalyticalTable
              data={data}
              columns={columns}
              className="ui5-table-root"
              style={{
                width: "100%",
                height: "auto",
                backgroundColor: "#1e1e1e",
                color: "white",
                borderRadius: "8px",
                maxHeight: "600px",
                overflowY: "auto",
              }}
              onRowClick={(ev) => {
                const r = ev?.row?.original ?? ev?.detail?.row?.original ?? null;
                if (r) setSelectedRow(r);
              }}
              reactTableOptions={{
                getRowProps: (row) => ({
                  style: row?.original?.borrado
                    ? {
                      opacity: 0.45,
                      filter: "grayscale(20%)",
                      backgroundColor: "#282828"
                    }
                    : {}
                })
              }}
            />
          ) : (
            <p className="no-data-msg">No hay datos disponibles</p>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onAfterClose={handleCloseModal}
        headerText="Agregar/Editar SKU"
        footer={
          <Bar
            endContent={
              <>
                <Button design="Transparent" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button
                  design="Emphasized"
                  icon="add"
                  onClick={handleGuardar}
                  className="btn-guardar-modal"
                >
                  Guardar
                </Button>
              </>
            }
          />
        }
        className="modal-sku"
      >
        <div className="modal-content">
          <FlexBox
            direction="Row"
            justifyContent="Start"
            wrap="Wrap"
            className="modal-form-fields"
          >
            <div className="modal-field">
              <Label required>Sociedad</Label>
              <ComboBox
                className="modal-combobox"
                onChange={(e) => {
                  const value = e.detail?.item?.text || e.target.value;
                  setSociedad(value);
                }}
                value={sociedad}
              >
                <ComboBoxItem text="111" />
                <ComboBoxItem text="222" />
                <ComboBoxItem text="333" />
              </ComboBox>
            </div>

            <div className="modal-field">
              <Label required>Sucursal (CEDIS)</Label>
              <ComboBox
                className="modal-combobox"
                onChange={(e) => {
                  const value = e.detail?.item?.text || e.target.value;
                  setSucursal(value);
                }}
                value={sucursal}
              >
                <ComboBoxItem text="100" />
                <ComboBoxItem text="101" />
                <ComboBoxItem text="102" />
              </ComboBox>
            </div>

            <div className="modal-field">
              <Label required>Etiqueta</Label>
              <ComboBox
                className="modal-combobox"
                onChange={(e) => {
                  const value = e.detail?.item?.text || e.target.value;
                  setEtiqueta(value);
                }}
                value={etiqueta}
              >
                <ComboBoxItem text="Filtro1" />
                <ComboBoxItem text="Filtro2" />
              </ComboBox>
            </div>

            <div className="modal-field">
              <Label required>IDValor</Label>
              <ComboBox
                className="modal-combobox"
                onChange={(e) => {
                  const value = e.detail?.item?.text || e.target.value;
                  setIdValor(value);
                }}
                value={idValor}
              >
                <ComboBoxItem text="idValor_01" />
                <ComboBoxItem text="idValor_02" />
                <ComboBoxItem text="idValor_03" />
              </ComboBox>
            </div>
            <div className="modal-field">
              <Label required>IDGROUPET</Label>
              <ComboBox
                className="modal-combobox"
                onChange={(e) => {
                  const value = e.detail?.item?.text || e.target.value;
                  setidGroupEt(value);
                }}
                value={idGroupEt}
              >
                <ComboBoxItem text="Grupo01" />
                <ComboBoxItem text="Grupo03" />
                <ComboBoxItem text="Grupo02" />
              </ComboBox>
            </div>
            <div className="modal-field">
              <Label required>ID</Label>
              <Input
                className="modal-input"
                value={id}
                placeholder="id grupo"
                onChange={(e) => setid(e.target.value)}
              />
            </div>
            <div className="switch_etiqueta">
              <Label>{dbPost}</Label>
              <Switch
                textOn="Cosmos "
                textOff="MongoDB"
                checked={dbPost === "Azure Cosmos"}
                onChange={CambioDbPost}
              />
            </div>
          </FlexBox>

          <div className="modal-textarea-container">
            <Label>Información adicional</Label>
            <TextArea
              placeholder="Escriba información adicional..."
              className="modal-textarea"
              onChange={(e) => setInfoAdicional(e.target.value)}
              value={infoAdicional}
            />
          </div>
        </div>
      </Dialog>

      {/* 🔹 Ventana de configuración (nueva) */}
      {showConfig && (
        <Dialog
          headerText="Configuración"
          open={showConfig}
          onAfterClose={() => setShowConfig(false)}
          footer={
            <Button design="Emphasized" onClick={() => setShowConfig(false)}>
              Cerrar
            </Button>
          }
        >
          <FlexBox direction="Column" style={{ padding: "1rem" }}>
            <Label>Conexión a base de datos</Label>
            <FlexBox alignItems="Center" justifyContent="SpaceBetween">
              <Label>{dbConnection}</Label>
              <Switch
                textOn="Cosmos"
                textOff="MongoDB"
                checked={dbConnection === "Azure Cosmos"}
                onChange={handleSwitchChange}
              />
            </FlexBox>
          </FlexBox>
        </Dialog>
      )}
    </>
  );
}
