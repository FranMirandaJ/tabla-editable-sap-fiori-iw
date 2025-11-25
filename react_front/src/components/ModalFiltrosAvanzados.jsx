import { useState, useEffect } from "react";
import {
    Button,
    Input,
    Dialog,
    Bar,
    Label,
    DateRangePicker
} from "@ui5/webcomponents-react";
import ButtonDesign from "@ui5/webcomponents/dist/types/ButtonDesign.js";

const ModalFiltrosAvanzados = ({
    isModalOpen,
    handleCloseModal,
    filters,
    setFilters
}) => {
    const [localFilters, setLocalFilters] = useState({
        sociedad: "",
        cedis: "",
        etiqueta: "",
        valor: "",
        fechaInicio: "",
        fechaFin: "",
        // El estado se sincroniza con filters.status
    });

    // Función para convertir fecha de "24 nov 2025" a "2025-11-24"
    const convertirFechaAFormatoDB = (fechaTexto) => {
        if (!fechaTexto) return "";

        try {
            const date = new Date(fechaTexto);
            if (isNaN(date.getTime())) return fechaTexto; // Si no se puede convertir, devolver original

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error('Error convirtiendo fecha:', error);
            return fechaTexto;
        }
    };

    // Sincronizar con los filtros globales cuando se abre el modal
    useEffect(() => {
        if (isModalOpen) {
            setLocalFilters({
                sociedad: filters.sociedad || "",
                cedis: filters.cedis || "",
                etiqueta: filters.etiqueta || "",
                valor: filters.valor || "",
                fechaInicio: filters.fechaInicio || "",
                fechaFin: filters.fechaFin || ""
            });
        }
    }, [isModalOpen, filters]);

    const handleInputChange = (field, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDateRangeChange = (e) => {
        const dates = e.detail.value;

        if (dates) {
            const [startDate, endDate] = dates.split(" - ");

            // Convertir las fechas al formato de la base de datos
            const fechaInicioConvertida = convertirFechaAFormatoDB(startDate);
            const fechaFinConvertida = convertirFechaAFormatoDB(endDate);

            setLocalFilters(prev => ({
                ...prev,
                fechaInicio: fechaInicioConvertida,
                fechaFin: fechaFinConvertida
            }));
        } else {
            setLocalFilters(prev => ({
                ...prev,
                fechaInicio: "",
                fechaFin: ""
            }));
        }
    };

    const handleAplicar = () => {

        // Actualizar los filtros globales con los filtros avanzados
        setFilters(prev => ({
            ...prev,
            sociedad: localFilters.sociedad,
            cedis: localFilters.cedis,
            etiqueta: localFilters.etiqueta,
            valor: localFilters.valor,
            fechaInicio: localFilters.fechaInicio,
            fechaFin: localFilters.fechaFin
        }));

        // Cerrar el modal
        handleCloseModal();
    };
    const handleLimpiar = () => {
        // Limpiar solo los filtros avanzados, mantener el estado
        setLocalFilters({
            sociedad: "",
            cedis: "",
            etiqueta: "",
            valor: "",
            fechaInicio: "",
            fechaFin: "",
        });

        // También limpiar los filtros avanzados en el estado global
        setFilters(prev => ({
            ...prev,
            sociedad: "",
            cedis: "",
            etiqueta: "",
            valor: "",
            fechaInicio: "",
            fechaFin: "",
        }));
    };

    const getCurrentDateRangeValue = () => {
        if (localFilters.fechaInicio && localFilters.fechaFin) {
            return `${localFilters.fechaInicio} - ${localFilters.fechaFin}`;
        }
        return "";
    };

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
                                onClick={handleAplicar}
                            >
                                Aplicar
                            </Button>
                            <Button
                                design="Transparent"
                                onClick={handleLimpiar}
                            >
                                Limpiar
                            </Button>
                            <Button
                                design="Transparent"
                                onClick={() => handleCloseModal()}
                            >
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
                        value={localFilters.sociedad}
                        placeholder="Sociedad A"
                        style={{ width: "100%" }}
                        onInput={(e) => handleInputChange("sociedad", e.target.value)}
                    />
                </div>

                {/* CEDI */}
                <div>
                    <Label>CEDI:</Label>
                    <Input
                        value={localFilters.cedis}
                        placeholder="Cedis B"
                        style={{ width: "100%" }}
                        onInput={(e) => handleInputChange("cedis", e.target.value)}
                    />
                </div>

                {/* Etiqueta */}
                <div>
                    <Label>Etiqueta:</Label>
                    <Input
                        value={localFilters.etiqueta}
                        placeholder="Etiqueta C"
                        style={{ width: "100%" }}
                        onInput={(e) => handleInputChange("etiqueta", e.target.value)}
                    />
                </div>

                {/* Valor */}
                <div>
                    <Label>Valor:</Label>
                    <Input
                        value={localFilters.valor}
                        placeholder="Valor D"
                        style={{ width: "100%" }}
                        onInput={(e) => handleInputChange("valor", e.target.value)}
                    />
                </div>

                {/* Registro entre */}
                <div>
                    <Label>Registro entre:</Label>
                    <DateRangePicker
                        value={getCurrentDateRangeValue()}
                        placeholder="yyyy-MM-dd - yyyy-MM-dd"
                        style={{ width: "100%" }}
                        onChange={handleDateRangeChange}
                    />
                </div>


            </div>
        </Dialog>
    );
};

export default ModalFiltrosAvanzados;