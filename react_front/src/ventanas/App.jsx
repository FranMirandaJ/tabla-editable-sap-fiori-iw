import React, { useEffect, useState } from "react";
import "./css/App.css";
import "./css/Modal.css";
import axios from "axios";
import {
  Avatar,
  ShellBar,
  Button,
  Input,
  Dialog,
  Label,
  ComboBox,
  ComboBoxItem,
  CheckBox,
  FlexBox,
  SideNavigation,
  SideNavigationItem,
  Switch,
  Icon,
  Search,
  SegmentedButton,
  SegmentedButtonItem,
  Table,
  TableHeaderRow,
  TableHeaderCell,
  TableRow,
  TableCell,
  Toast
} from "@ui5/webcomponents-react";
import ModalCrear from "../components/ModalCrear";
import ButtonDesign from "@ui5/webcomponents/dist/types/ButtonDesign.js";
import ModalEditGrupoET from "../components/ModalEditGrupoET.jsx";
// Importacion de iconos
import "@ui5/webcomponents-icons/dist/menu.js";
import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/settings.js";
import "@ui5/webcomponents-icons/dist/database.js";
import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/show.js";
import "@ui5/webcomponents-icons/dist/hide.js";
import "@ui5/webcomponents-icons/dist/refresh.js";
import "@ui5/webcomponents-icons/dist/navigation-down-arrow.js";
import "@ui5/webcomponents-icons/dist/navigation-up-arrow.js";
import "@ui5/webcomponents-icons/dist/filter.js";
import "@ui5/webcomponents-icons/dist/accept.js";
import "@ui5/webcomponents-icons/dist/decline.js";
import ModalFiltrosAvanzados from "../components/ModalFiltrosAvanzados.jsx";

const URL_BASE = "https://app-restful-sap-cds.onrender.com"; // http://localhost:4004
const URL_BASE_BACKEND_MIGUEL = "http://localhost:3034";

export default function App() {
  // --- Estados originales ---
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalFiltersOpen, setIsModalFiltersOpen] = useState(false);
  const [isEditGrupoETModalOpen, setIsEditGrupoETModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [clickedRow, setClickedRow] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [editingRowData, setEditingRowData] = useState(null);
  const [originalRowData, setOriginalRowData] = useState(null);
  const [selectedRowsArray, setSelectedRowsArray] = useState([]);

  // --- Estados añadidos del menú ---
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [dbConnection, setDbConnection] = useState("MongoDB");

  // --- Estados para ComboBoxes en cascada de la fila expandida ---
  const [sociedadesCatalog, setSociedadesCatalog] = useState([]);
  const [cedisCatalog, setCedisCatalog] = useState([]);
  const [etiquetasCatalog, setEtiquetasCatalog] = useState([]);
  const [valoresCatalog, setValoresCatalog] = useState([]);

  // Estados para los catálogos filtrados
  const [filteredCedisCatalog, setFilteredCedisCatalog] = useState([]);
  const [filteredEtiquetasCatalog, setFilteredEtiquetasCatalog] = useState([]);
  const [filteredValoresCatalog, setFilteredValoresCatalog] = useState([]);

  // Para mensajes en el toast
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Para los filtrados
  const [filters, setFilters] = useState({
    status: "todos",
    search: "",
  });

  // Sistema de filtros general
  const updateFilter = (filterName, filterValue) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: filterValue
    }));
  };

  const applyFilters = (data) => {
    return data.filter(row => {
      // Filtro por estado
      if (filters.status !== "todos") {
        if (filters.status === "activos" && !row.estado) return false;
        if (filters.status === "inactivos" && row.estado) return false;
      }

      // Filtro de búsqueda
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          row.sociedad?.toString().toLowerCase().includes(searchLower) ||
          row.sucursal?.toString().toLowerCase().includes(searchLower) ||
          row.etiqueta?.toString().toLowerCase().includes(searchLower) ||
          row.valor?.toString().toLowerCase().includes(searchLower) ||
          row.idgroup?.toString().toLowerCase().includes(searchLower) ||
          row.idg?.toString().toLowerCase().includes(searchLower) ||
          row.info?.toString().toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      return true;
    });
  };

  // Handlers específicos
  const handleStatusFilterChange = (e) => {

    const selectedItems = e.detail.selectedItems;
    if (!selectedItems || selectedItems.length === 0) return;

    const selectedItem = selectedItems[0];

    const text = selectedItem.textContent;

    const selectedFilter = text.toString().toLowerCase();
    updateFilter("status", selectedFilter);
  };

  // --- Cambio de conexión ---
  const handleSwitchChange = () => {
    setDbConnection(dbConnection === "MongoDB" ? "Azure" : "MongoDB");
  };

  // Función reutilizable para mostrar toast
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);

    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${URL_BASE}/api/security/gruposet/crud?ProcessType=GetAll&DBServer=${dbConnection}`, {}
      );

      //console.log("SERVER RESPONSE ==============> ",res.data?.data?.[0]?.dataRes);

      const records =
        res.data?.data?.[0]?.dataRes?.map((item) => ({
          sociedad: item.IDSOCIEDAD,
          sucursal: item.IDCEDI,
          etiqueta: item.IDETIQUETA,
          valor: item.IDVALOR,
          idgroup: item.IDGRUPOET,
          idg: item.ID,
          info: item.INFOAD,
          registro: `${item.FECHAREG} ${item.HORAREG} (${item.USUARIOREG})`,
          ultMod: !item.FECHAULTMOD ? "Sin modificaciones" : `${item.FECHAULTMOD} ${item.HORAULTMOD} (${item.USUARIOMOD})`,
          estado: item.ACTIVO
        })) || [];

      setData(records);

    } catch (error) {
      console.error("Error al obtener datos:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };
  // Cargar datos del backend
  useEffect(() => {
    fetchData();
  }, [dbConnection]);

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const url = `${URL_BASE_BACKEND_MIGUEL}/api/cat/crudLabelsValues?ProcessType=GetAll&LoggedUser=MIGUELLOPEZ&DBServer=${dbConnection === "Azure" ? "CosmosDB" : "MongoDB"}`;
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
            item.IDSOCIEDAD &&
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
          if (item.IDETIQUETA && item.IDSOCIEDAD && item.IDCEDI && !etiquetas.some((e) => e.key === item.IDETIQUETA)) {
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
        setCedisCatalog([]);
        setEtiquetasCatalog([]);
        setValoresCatalog([]);
        setSociedadesCatalog([]);
      }
    }
    fetchCatalogos();
  }, [dbConnection]);

  const columns = [
    { accessor: "checkbox", Header: "" },
    { accessor: "expand" },
    { Header: "Sociedad", accessor: "sociedad" },
    { Header: "Sucursal (CEDIS)", accessor: "sucursal" },
    { Header: "Etiqueta", accessor: "etiqueta" },
    { Header: "Valor", accessor: "valor" },
    { Header: "Grupo Etiqueta", accessor: "idgroup" },
    { Header: "ID", accessor: "idg" },
    { Header: "Información adicional", accessor: "info" },
    { Header: "Registro", accessor: "registro" },
    { Header: "Última modificación", accessor: "ultMod" },
    { Header: "Estado", accessor: "estado" },
  ];

  const isRowSelected = (row) => {
    return selectedRowsArray.some(
      (r) =>
        r.sociedad === row.sociedad &&
        r.sucursal === row.sucursal &&
        r.etiqueta === row.etiqueta &&
        r.valor === row.valor &&
        r.idg === row.idg &&
        r.idgroup === row.idgroup
    );
  };

  const handleGuardarCambiosEdicion = async (editedData, originalData) => {
    if (!editedData.sociedad || !editedData.sucursal || !editedData.etiqueta || !editedData.valor || !editedData.idgroup || !editedData.idg) {
      showToastMessage("❌ Completa Sociedad, CEDI, Etiqueta, Valor, Grupo Etiqueta y ID.");
      return;
    }
    setLoading(true);
    try {
      const url = `${URL_BASE}/api/security/gruposet/crud?ProcessType=UpdateOne&DBServer=${dbConnection}&LoggedUser=FMIRANDAJ`;

      const payload = {
        // Llaves del registro ORIGINAL para que el backend lo encuentre
        IDSOCIEDAD: originalData.sociedad,
        IDCEDI: originalData.sucursal,
        IDETIQUETA: originalData.etiqueta,
        IDVALOR: originalData.valor,
        IDGRUPOET: originalData.idgroup,
        ID: originalData.idg,
        // 'data' contiene todos los campos con sus NUEVOS valores
        data: {
          IDSOCIEDAD: editedData.sociedad,
          IDCEDI: editedData.sucursal,
          IDETIQUETA: editedData.etiqueta,
          IDVALOR: editedData.valor,
          IDGRUPOET: editedData.idgroup,
          ID: editedData.idg,
          INFOAD: editedData.info,
          ACTIVO: editedData.estado !== false,
          BORRADO: editedData.estado || false
        }
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      console.log("Payload enviado a UpdateOne:", payload);

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 409) {
          showToastMessage("❌ Ya existe un registro con esa llave compuesta.");
          return;
        }
        // Para otros errores, lanzamos una excepción para que la capture el catch.
        throw new Error("Error HTTP " + res.status + (json.messageUSR ? " - " + json.messageUSR : ""));
      }


      setExpandedRowId(null); // Cierra la fila después de guardar
      showToastMessage("✅ Cambios guardados correctamente");

      // 🔄 Refrescar tabla
      fetchData();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      showToastMessage("❌ No se pudieron guardar los cambios");
    } finally {
      setLoading(false);
    }

  }

  const handleActivar = async () => {
    if (selectedRowsArray.lenght > 1) return;
    setLoading(true);

    try {

      /* CODIGO PARA CUANDO SE QUIERE ACTIVAR TODOS LOS REGISTRO SELECCIONADOS */

      // const numSelectedRows = selectedRowsArray.length;
      // // Verificar si hay filas seleccionadas
      // if (numSelectedRows === 0) {
      //   alert("⚠️ Selecciona un registro de la tabla primero");
      //   return;
      // }
      // const url = `${URL_BASE}/api/security/gruposet/crud?ProcessType=UpdateOne&DBServer=${dbConnection}&LoggedUser=FMIRANDAJ`;

      // const promises = selectedRowsArray.map(async (row) => {
      //   const payload = {
      //     // Llaves para identificar el registro
      //     IDSOCIEDAD: row.sociedad,
      //     IDCEDI: row.sucursal,
      //     IDETIQUETA: row.etiqueta,
      //     IDVALOR: row.valor,
      //     IDGRUPOET: row.idgroup,
      //     ID: row.idg,
      //     // Datos a actualizar
      //     data: {
      //       ACTIVO: true,
      //       BORRADO: false
      //     }
      //   };
      //   return axios.post(url, payload);
      // });

      // const response = await Promise.all(promises);

      // de momento solo se puede desactivar uno a la vez.

      const url = `${URL_BASE}/api/security/gruposet/crud?ProcessType=UpdateOne&DBServer=${dbConnection}&LoggedUser=FMIRANDAJ`;
      const selectedRow = selectedRowsArray[0];
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

      const response = await axios.post(url, payload);

      // 🔄 Refrescar la tabla
      fetchData();
      showToastMessage("✅ Registro activado correctamente");

    } catch (err) {
      console.error("❌ Error al activar:", err);
      console.error("❌ Detalles:", err.response?.data);
      showToastMessage("❌ No se pudo activar el registro");
    } finally {
      setLoading(false);
      setSelectedRowsArray([]);
    }
  };

  const handleDesactivar = async () => {
    //if (!clickedRow) { alert("Selecciona un registro"); return; }

    // de momento solo se puede desactivar uno a la vez.
    if (selectedRowsArray.lenght > 1) return;
    setLoading(true);

    try {
      const selectedRow = selectedRowsArray[0];
      const payload = {
        IDSOCIEDAD: selectedRow.sociedad,
        IDCEDI: selectedRow.sucursal,
        IDETIQUETA: selectedRow.etiqueta,
        IDVALOR: selectedRow.valor,
        IDGRUPOET: selectedRow.idgroup,
        ID: selectedRow.idg
      };

      const url = `${URL_BASE}/api/security/gruposet/crud?ProcessType=DeleteOne&DBServer=${dbConnection}`;
      const response = await axios.post(url, payload);

      // 🔄 Refrescar tabla
      fetchData();

      showToastMessage("✅ Registro desactivado");

    } catch (err) {
      console.error("Error al desactivar:", err);
      showToastMessage("❌ No se pudo desactivar el registro");
    } finally {
      setLoading(false);
      setSelectedRowsArray([]);
    }
  };

  const handleEliminarClick = async () => {
    if (selectedRowsArray.length === 0) { showToastMessage("ℹ️ No hay registros seleccionados."); return; }

    const confirmar = window.confirm(
      selectedRowsArray.length > 1
        ? `¿Eliminar registros?`
        : "¿Eliminar registro?"
    );

    if (!confirmar) return;

    try {
      const numSelectedRows = selectedRowsArray.length;

      setLoading(true);

      const url = `${URL_BASE}/api/security/gruposet/crud?ProcessType=DeleteHard&DBServer=${dbConnection}`;

      const promises = selectedRowsArray.map(async (row) => {
        const payload = {
          IDSOCIEDAD: row.sociedad,
          IDCEDI: row.sucursal,
          IDETIQUETA: row.etiqueta,
          IDVALOR: row.valor,
          IDGRUPOET: row.idgroup,
          ID: row.idg
        };
        return axios.post(url, payload);
      });

      const response = await Promise.all(promises);

      console.log("📥 Respuesta:", response);

      showToastMessage(
        selectedRowsArray.length > 1
          ? "✅ Registros eliminados correctamente."
          : "✅ Registro eliminado correctamente."
      );
      // 🔄 Refrescar tabla
      fetchData();

    } catch (err) {
      console.error("Error al eliminar:", err);
      const numSelectedRows = selectedRowsArray.length;
      showToastMessage("❌ Error al eliminar los registros");
    } finally {
      setLoading(false);
      setSelectedRowsArray([]);
    }
  };


  const handleRowClick = (row) => {
    const rowKey = {
      sociedad: row.sociedad,
      sucursal: row.sucursal,
      etiqueta: row.etiqueta,
      valor: row.valor,
      idg: row.idg,
      idgroup: row.idgroup,
      estado: row.estado,
      info: row.info,
      registro: row.registro,
      ultMod: row.ultMod
    };

    setSelectedRowsArray((prev) => {
      const isAlreadySelected = prev.some(
        (r) =>
          r.sociedad === rowKey.sociedad &&
          r.sucursal === rowKey.sucursal &&
          r.etiqueta === rowKey.etiqueta &&
          r.valor === rowKey.valor &&
          r.idg === rowKey.idg &&
          r.idgroup === rowKey.idgroup
      );

      if (isAlreadySelected) {
        // Si ya está seleccionado, quitarlo
        return prev.filter(
          (r) =>
            !(
              r.sociedad === rowKey.sociedad &&
              r.sucursal === rowKey.sucursal &&
              r.etiqueta === rowKey.etiqueta &&
              r.valor === rowKey.valor &&
              r.idg === rowKey.idg &&
              r.idgroup === rowKey.idgroup
            )
        );
      } else {
        // Si no está seleccionado, agregarlo
        return [...prev, rowKey];
      }
    });
  };

  const isSameRow = (row1, row2) => {
    if (!row1 || !row2) return false;

    return (
      row1.sociedad === row2.sociedad &&
      row1.sucursal === row2.sucursal &&
      row1.etiqueta === row2.etiqueta &&
      row1.valor === row2.valor &&
      row1.idg === row2.idg
    );
  };

  const handleToggleExpand = (rowKey) => {
    // rowKey ya es el objeto con {sociedad, sucursal, etiqueta, valor, idg}

    // Comparar si es la misma fila
    const isSame = isSameRow(expandedRowId, rowKey);
    const newExpandedRowId = isSame ? null : rowKey;

    setExpandedRowId(newExpandedRowId);

    if (newExpandedRowId) {
      // Buscar la fila completa en data usando idg
      const rowData = data.find(row => row.idg === rowKey.idg);

      if (!rowData) return;

      setEditingRowData({ ...rowData });
      setOriginalRowData({ ...rowData });

      // Pre-filtrar catálogos
      const cedis = cedisCatalog.filter(c =>
        c.parentSoc.toString() === rowData.sociedad.toString()
      );
      setFilteredCedisCatalog(cedis);

      const etiquetas = etiquetasCatalog.filter(et =>
        et.IDSOCIEDAD?.toString() === rowData.sociedad.toString() &&
        et.IDCEDI?.toString() === rowData.sucursal.toString()
      );
      setFilteredEtiquetasCatalog(etiquetas);

      const valores = valoresCatalog.filter(v =>
        v.parentEtiqueta === rowData.etiqueta
      );
      setFilteredValoresCatalog(valores);
    } else {
      setEditingRowData(null);
      setOriginalRowData(null);
    }
  };

  // Maneja los cambios en los inputs de la fila expandida
  const handleEditInputChange = (e) => {
    // Para ComboBox, el valor está en detail.item.text
    const name = e.target.name;
    const value = e.detail?.item?.text ?? e.target.value;

    setEditingRowData(prev => {
      const newState = { ...prev, [name]: value };
      // Limpiar campos dependientes al cambiar uno de la cascada
      if (name === 'sociedad') {
        newState.sucursal = '';
        newState.etiqueta = '';
        newState.valor = '';
      } else if (name === 'sucursal') {
        newState.etiqueta = '';
        newState.valor = '';
      } else if (name === 'etiqueta') {
        newState.valor = '';
      }
      return newState;
    });
  };

  const handleRefresh = async () => {
    try {
      await fetchData();
      showToastMessage("🔄 Información actualizada");
      setExpandedRowId(null);
      setEditingRowData(null);
      setOriginalRowData(null);
      setSelectedRowsArray([]);
    } catch (error) {
      showToastMessage("❌ Error al refrescar la información");
    }

  };

  // se calculan los datos filtrados:
  const filteredData = applyFilters(data);

  // Función para seleccionar/deseleccionar todas las filas
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      // Seleccionar todas las filas visibles (filtradas)
      const allRowKeys = filteredData.map(row => ({
        sociedad: row.sociedad,
        sucursal: row.sucursal,
        etiqueta: row.etiqueta,
        valor: row.valor,
        idg: row.idg,
        idgroup: row.idgroup,
        estado: row.estado,
        info: row.info,
        registro: row.registro,
        ultMod: row.ultMod
      }));
      setSelectedRowsArray(allRowKeys);
    } else {
      // Deseleccionar todas
      setSelectedRowsArray([]);
    }
  };

  // Verificar si todas las filas están seleccionadas
  const areAllRowsSelected = filteredData.length > 0 &&
    filteredData.every(row =>
      selectedRowsArray.some(
        selected =>
          selected.sociedad === row.sociedad &&
          selected.sucursal === row.sucursal &&
          selected.etiqueta === row.etiqueta &&
          selected.valor === row.valor &&
          selected.idg === row.idg &&
          selected.idgroup === row.idgroup
      )
    );

  // Verificar si algunas filas están seleccionadas (estado indeterminado)
  const areSomeRowsSelected = filteredData.length > 0 &&
    filteredData.some(row =>
      selectedRowsArray.some(
        selected =>
          selected.sociedad === row.sociedad &&
          selected.sucursal === row.sucursal &&
          selected.etiqueta === row.etiqueta &&
          selected.valor === row.valor &&
          selected.idg === row.idg &&
          selected.idgroup === row.idgroup
      )
    ) && !areAllRowsSelected;

  return (
    <>
      {/* 🔹 ShellBar con menú hamburguesa */}
      <ShellBar
        primaryTitle="Proyecto final"
        logo={<img alt="SAP Logo" src="https://ui5.github.io/webcomponents/images/sap-logo-svg.svg" />}
        profile={<Avatar><img alt="person-placeholder" src="https://ui5.github.io/webcomponents-react/v2/assets/Person-B7wHqdJw.png" /></Avatar>}
        startButton={
          <Button
            icon="menu"
            design="Transparent"
            onClick={() => setIsNavOpen(!isNavOpen)}
          />
        }
      />

      {/* 🔹 Menú lateral (SideNavigation) */}
      {isNavOpen && (
        <SideNavigation
          style={{
            width: "250px",
            height: "90vh",
            position: "fixed",
            top: "60px",
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
          background: "#F5F6F7",
          marginLeft: isNavOpen ? "260px" : "0",
          transition: "margin-left 0.3s ease",
          paddingLeft: "20px",
          paddingRight: "20px"
        }}
      >

        <h1 style={{ paddingTop: "10px", fontFamily: "system-ui" }}>Grupos y subgrupos de SKU</h1>

        <div className="barra-controles" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Button
              className="btn-crear"
              icon="add"
              design={ButtonDesign.Positive}
              onClick={() => setIsModalCreateOpen(true)}
              disabled={loading}
            >
              Crear
            </Button>
            <Button
              className="btn-eliminar"
              icon="delete"
              design={ButtonDesign.Negative}
              onClick={handleEliminarClick}
              disabled={selectedRowsArray.length === 0 || loading}
            >
              Eliminar {selectedRowsArray.length > 1 ? `(${selectedRowsArray.length})` : ''}
            </Button>
            <Button
              className="btn-desactivar"
              icon="hide"
              design={ButtonDesign.Attention}
              onClick={handleDesactivar}
              disabled={
                selectedRowsArray.length !== 1 ||  // Si no hay exactamente 1 selección
                !selectedRowsArray[0].estado ||   // O si no está activo
                loading
              }
            >
              Desactivar
            </Button>
            <Button
              className="btn-activar"
              icon="show"
              design={ButtonDesign.Positive}
              onClick={handleActivar}
              disabled={
                selectedRowsArray.length !== 1 ||  // Si no hay exactamente 1 selección  
                selectedRowsArray[0].estado ||    // O si está activo
                loading
              }
            >
              Activar
            </Button>
            <Button
              className="btn-refresh"
              icon="refresh"
              design={ButtonDesign.Default}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refrescar
            </Button>
          </div>

          <div className="search-bar" style={{ display: "flex", gap: 10 }}>
            <Search
              placeholder="Buscar..."
              value={filters.search}
              onInput={(e) => updateFilter("search", e.target.value)}
              onClear={() => updateFilter("search", "")}
              disabled={loading}
            />

            <SegmentedButton onSelectionChange={handleStatusFilterChange}>
              <SegmentedButtonItem disabled={loading} data-key="0" pressed={filters.status === "todos"}>
                Todos
              </SegmentedButtonItem>
              <SegmentedButtonItem disabled={loading} data-key="1" pressed={filters.status === "activos"}>
                Activos
              </SegmentedButtonItem>
              <SegmentedButtonItem disabled={loading} data-key="2" pressed={filters.status === "inactivos"}>
                Inactivos
              </SegmentedButtonItem>
            </SegmentedButton>

            <Button
              className="btn-filter"
              icon="filter"
              design={ButtonDesign.Default}
              onClick={() => {setIsModalFiltersOpen(true)}}
              disabled={loading}
            />
          </div>
        </div>

        <div style={{ overflowX: "auto", width: "100%" }}>
          <Table
            loading={loading}
            style={{ width: "1500px" }}
            headerRow={
              <TableHeaderRow sticky>
                {/* Checkbox general en el header */}
                <TableHeaderCell>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <CheckBox
                      checked={areAllRowsSelected}
                      indeterminate={areSomeRowsSelected}
                      onChange={handleSelectAll}
                    />
                  </div>
                </TableHeaderCell>
                {columns.slice(1).map((column, index) => (
                  <TableHeaderCell key={index}>{column.Header}</TableHeaderCell>
                ))}
              </TableHeaderRow>
            }
            // onRowClick={(ev) => {
            //   const r = ev?.row?.original ?? ev?.detail?.row?.original ?? null;
            //   if (r) setClickedRow(r);
            // }}
            overflowMode="Scroll"
            noData={
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <Icon name="search" style={{ fontSize: "3rem", marginBottom: "1rem" }} />
                <div style={{ fontSize: "1.1rem", color: "#6a6a6a" }}>
                  No se encontraron registros
                </div>
                <div style={{ fontSize: "0.9rem", color: "#8a8a8a", marginTop: "0.5rem" }}>
                  {filters.search ? `Para la búsqueda: "${filters.search}"` : "Intenta ajustar los filtros"}
                </div>
              </div>
            }
          >
            {filteredData.map((row) => {
              const isExpanded = isSameRow(expandedRowId, row);
              return (
                <React.Fragment key={`${row.sociedad}|${row.sucursal}|${row.etiqueta}|${row.valor}|${row.idgroup}|${row.idg}`}>
                  <TableRow
                    onClick={() => handleRowClick(row)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isRowSelected(row) ? '#d1eaff' : 'transparent',
                      borderLeft: isRowSelected(row) ? '4px solid #0070f0' : '4px solid transparent',
                      borderRight: isRowSelected(row) ? '1px solid #0070f0' : '1px solid transparent',
                      boxShadow: isRowSelected(row) ? '0 2px 8px rgba(0, 112, 240, 0.4)' : 'none',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <TableCell>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <CheckBox
                          checked={selectedRowsArray.some(
                            (r) =>
                              r.sociedad === row.sociedad &&
                              r.sucursal === row.sucursal &&
                              r.etiqueta === row.etiqueta &&
                              r.valor === row.valor &&
                              r.idg === row.idg &&
                              r.idgroup === row.idgroup
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            const isChecked = e.target.checked;

                            const rowKey = {
                              sociedad: row.sociedad,
                              sucursal: row.sucursal,
                              etiqueta: row.etiqueta,
                              valor: row.valor,
                              idg: row.idg,
                              idgroup: row.idgroup,
                              estado: row.estado,
                              info: row.info,
                              registro: row.registro,
                              ultMod: row.ultMod
                            };

                            setSelectedRowsArray((prev) => {
                              if (isChecked) {
                                return [...prev, rowKey];
                              } else {
                                return prev.filter(
                                  (r) =>
                                    !(
                                      r.sociedad === rowKey.sociedad &&
                                      r.sucursal === rowKey.sucursal &&
                                      r.etiqueta === rowKey.etiqueta &&
                                      r.valor === rowKey.valor &&
                                      r.idg === rowKey.idg &&
                                      r.idgroup === rowKey.idgroup
                                    )
                                );
                              }
                            });
                          }}
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <Button
                        icon={isExpanded ? "navigation-up-arrow" : "navigation-down-arrow"}
                        design="Transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExpand({
                            sociedad: row.sociedad,
                            sucursal: row.sucursal,
                            etiqueta: row.etiqueta,
                            valor: row.valor,
                            idgroup: row.idgroup,
                            idg: row.idg
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell><span>{row.sociedad}</span></TableCell>
                    <TableCell><span>{row.sucursal}</span></TableCell>
                    <TableCell><span>{row.etiqueta}</span></TableCell>
                    <TableCell><span>{row.valor}</span></TableCell>
                    <TableCell><span>{row.idgroup}</span></TableCell>
                    <TableCell><span>{row.idg}</span></TableCell>
                    <TableCell><span>{row.info}</span></TableCell>
                    <TableCell><span>{row.registro}</span></TableCell>
                    <TableCell><span>{row.ultMod}</span></TableCell>
                    <TableCell>
                      <Icon
                        name={row.estado ? "accept" : "decline"}
                        style={{
                          backgroundColor: row.estado ? "var(--sapPositiveColor, #107e3e)" : "var(--sapNegativeColor, #b00)", color: "white", borderRadius: "50%", padding: "3px", width: "12px", height: "12px", boxShadow: "0 1px 2px rgba(0,0,0,0.2)"
                        }}
                      />
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow className="expanded-row">
                      <TableCell />
                      <TableCell />
                      <TableCell>
                        <ComboBox
                          className="modal-combobox"
                          value={`Sociedad ${editingRowData.sociedad}`}
                          onSelectionChange={(e) => {
                            const selectedItem = e.detail.item;
                            const selectedKey = selectedItem?.dataset.key;
                            setEditingRowData(prev => ({
                              ...prev,
                              sociedad: selectedKey,
                              // Limpiar selecciones dependientes
                              sucursal: "",
                              etiqueta: "",
                              valor: "",
                            }));

                            setFilteredCedisCatalog([]);
                            setFilteredEtiquetasCatalog([]);
                            setFilteredValoresCatalog([]);
                            // Filtrar CEDIS
                            const filtered = cedisCatalog.filter(c => c.parentSoc.toString() === selectedKey);
                            setFilteredCedisCatalog(filtered);
                          }}
                          placeholder="Selecciona una sociedad"
                          filter="Contains"
                          style={{ width: '400px' }}
                          disabled={loading}
                        >
                          {sociedadesCatalog.map(item =>
                            <ComboBoxItem key={item.key} data-key={item.key} text={item.text} />
                          )}
                        </ComboBox>
                      </TableCell>
                      <TableCell>
                        <ComboBox
                          className="modal-combobox"
                          value={`Cedi ${editingRowData.sucursal}`}
                          disabled={!editingRowData.sociedad || loading}
                          onSelectionChange={(e) => {
                            const selectedItem = e.detail.item;
                            const selectedKey = selectedItem?.dataset.key;
                            setEditingRowData(prev => ({
                              ...prev,
                              sucursal: selectedKey,
                              // limpiar selecciones dependientes
                              etiqueta: "",
                              valor: "",
                            }));

                            setFilteredEtiquetasCatalog([]);
                            setFilteredValoresCatalog([]);
                            // Filtrar Etiquetas
                            const filtered = etiquetasCatalog.filter(et => et.IDSOCIEDAD?.toString() === editingRowData.sociedad.toString() && et.IDCEDI?.toString() === selectedKey);
                            setFilteredEtiquetasCatalog(filtered);
                          }}
                          placeholder="Selecciona un CEDI"
                          filter="Contains"
                          style={{ width: '400px' }}
                        >
                          {filteredCedisCatalog.map(item =>
                            <ComboBoxItem key={item.key} data-key={item.key} text={item.text} />
                          )}
                        </ComboBox>
                      </TableCell>
                      <TableCell>
                        <ComboBox
                          className="modal-combobox"
                          value={editingRowData.etiqueta}
                          disabled={!editingRowData.sucursal || loading}
                          onSelectionChange={(e) => {
                            const selectedItem = e.detail.item;
                            const selectedKey = selectedItem?.dataset.key;
                            setEditingRowData(prev => ({
                              ...prev,
                              etiqueta: selectedKey,
                              // Limpiar selección dependiente
                              valor: "",
                            }));

                            setFilteredValoresCatalog([]);
                            // Filtrar Valores
                            const filtered = valoresCatalog.filter(v => v.parentEtiqueta === selectedKey);
                            setFilteredValoresCatalog(filtered);
                          }}
                          placeholder="Selecciona una etiqueta"
                          filter="Contains"
                          style={{ width: '400px' }}
                        >
                          {filteredEtiquetasCatalog.map(item =>
                            <ComboBoxItem key={item.key} data-key={item.key} text={item.text} />
                          )}
                        </ComboBox>
                      </TableCell>
                      <TableCell>
                        <ComboBox
                          className="modal-combobox"
                          value={editingRowData.valor}
                          disabled={!editingRowData.etiqueta || loading}
                          onSelectionChange={(e) => {
                            const selectedItem = e.detail.item;
                            const selectedKey = selectedItem?.dataset.key;
                            setEditingRowData(prev => ({ ...prev, valor: selectedKey }));
                          }}
                          placeholder="Seleccione un valor"
                          filter="Contains"
                          style={{ width: '400px' }}
                        >
                          {filteredValoresCatalog.map(item =>
                            <ComboBoxItem key={item.key} data-key={item.key} text={item.text} />
                          )}
                        </ComboBox>
                      </TableCell>
                      <TableCell>
                        <FlexBox direction="Column" style={{ gap: '0.5rem' }}>
                          <Input name="idgroup" value={editingRowData?.idgroup || ''} disabled style={{ width: '100%' }} />
                          <Button
                            icon="edit"
                            design="Transparent"
                            onClick={() => setIsEditGrupoETModalOpen(true)}
                            disabled={!editingRowData?.sociedad || !editingRowData?.sucursal || loading}
                            title="Editar Grupo ET"
                            style={{ alignSelf: 'flex-start' }}
                          />
                        </FlexBox>
                      </TableCell>
                      <TableCell>
                        <Input name="idg" value={editingRowData?.idg || ''} onInput={handleEditInputChange} disabled={loading} />
                      </TableCell>
                      <TableCell>
                        <Input name="info" value={editingRowData?.info || ''} onInput={handleEditInputChange} disabled={loading} />
                      </TableCell>
                      <TableCell>
                        {/* El registro generalmente no es editable */}
                        <span>{row.registro}</span>
                      </TableCell>
                      <TableCell>
                        {/* La última modificación no es editable */}
                        <span>{row.ultMod}</span>
                      </TableCell>
                      <TableCell>
                        <FlexBox direction="Column" style={{ gap: '0.5rem' }}>
                          <Button
                            icon="accept"
                            design="Positive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGuardarCambiosEdicion(editingRowData, originalRowData);
                            }}
                            disabled={loading}
                          >
                            Guardar
                          </Button>
                          <Button
                            icon="decline"
                            design="Negative"
                            disabled={loading}
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedRowId(null); // Simplemente cierra la fila
                              setEditingRowData(null);
                            }}
                          >
                            Cancelar
                          </Button>
                        </FlexBox>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </Table>

        </div>

      </div>

      {/* Modal */}
      {isModalCreateOpen &&
        <ModalCrear
          isModalOpen={isModalCreateOpen}
          handleCloseModal={() => setIsModalCreateOpen(false)}
          dbConnection={dbConnection}
          refetchData={fetchData}
          sociedadesCatalog={sociedadesCatalog}
          valoresCatalog={valoresCatalog}
          cedisCatalog={cedisCatalog}
          etiquetasCatalog={etiquetasCatalog}
          showToastMessage={showToastMessage}
        />

      }

      {/* Modal para editar Grupo ET en la fila */}
      <ModalEditGrupoET
        isModalOpen={isEditGrupoETModalOpen}
        handleCloseModal={() => setIsEditGrupoETModalOpen(false)}
        setGrupoET={(newGrupoET) => {
          setEditingRowData(prev => ({ ...prev, idgroup: newGrupoET }));
        }}
        etiquetas={etiquetasCatalog} // Pasamos el catálogo completo
        valores={valoresCatalog}
        sociedadSeleccionada={editingRowData?.sociedad}
        cediSeleccionado={editingRowData?.sucursal}
      />




      {/* 🔹 Ventana de configuración para cambiar server de BD */}
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

      {isModalFiltersOpen && (
        <ModalFiltrosAvanzados
          isModalOpen={isModalFiltersOpen}
          handleCloseModal={() => setIsModalFiltersOpen(false)}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      {/* 🔹 TOAST GENERAL */}
      <Toast
        open={showToast}
        onClose={() => setShowToast(false)}
        placement="BottomCenter"
        duration={3000}
        style={{
          zIndex: 10000,
          position: 'fixed',
          bottom: '2rem',
          right: '2rem'
        }}
      >
        {toastMessage}
      </Toast>
    </>
  );
}
