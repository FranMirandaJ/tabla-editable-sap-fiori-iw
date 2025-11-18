import React from "react";
import {
  ThemeProvider,
  FlexBox,
  Title,
  Label,
  ComboBox,
  ComboBoxItem,
  TextArea,
  Button,
} from "@ui5/webcomponents-react";

export default function VentanaEmergente() {
  return (
    <ThemeProvider>
      <div
        style={{
          backgroundColor: "#1b1b1b",
          color: "white",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <Title level="H4">Agregar/Editar SKU</Title>

        <FlexBox
          direction="Row"
          justifyContent="Start"
          wrap="Wrap"
          style={{ gap: "2rem", marginTop: "2rem" }}
        >
          {/* Sociedad */}
          <div>
            <Label required>Sociedad</Label>
            <ComboBox style={{ width: "200px" }}>
              <ComboBoxItem text="S001" />
              <ComboBoxItem text="S002" />
              <ComboBoxItem text="S003" />
            </ComboBox>
          </div>

          {/* Sucursal */}
          <div>
            <Label required>Sucursal (CEDIS)</Label>
            <ComboBox style={{ width: "200px" }}>
              <ComboBoxItem text="CDMX" />
              <ComboBoxItem text="Guadalajara" />
              <ComboBoxItem text="Monterrey" />
            </ComboBox>
          </div>

          {/* Grupo Etiqueta */}
          <div>
            <Label required>Grupo Etiqueta</Label>
            <ComboBox style={{ width: "220px" }}>
              <ComboBoxItem text="ZLABELS_1" />
              <ComboBoxItem text="ZLABELS_2" />
              <ComboBoxItem text="ZLABELS_3" />
              <ComboBoxItem text="ZLABELS_4" />
            </ComboBox>
          </div>

          {/* Etiqueta */}
          <div>
            <Label required>Etiqueta</Label>
            <ComboBox style={{ width: "200px" }}>
              <ComboBoxItem text="Filtro1" />
              <ComboBoxItem text="Filtro2" />
            </ComboBox>
          </div>

          {/* Valor */}
          <div>
            <Label required>Valor</Label>
            <ComboBox style={{ width: "200px" }}>
              <ComboBoxItem text="Activo" />
              <ComboBoxItem text="Inactivo" />
            </ComboBox>
          </div>
        </FlexBox>

        {/* Información adicional */}
        <div style={{ marginTop: "2rem" }}>
          <Label>Información adicional</Label>
          <TextArea
            placeholder="Escriba información adicional..."
            style={{ width: "100%", minHeight: "100px", marginTop: "0.5rem" }}
          />
        </div>

        {/* Botón Guardar */}
        <div style={{ marginTop: "2rem", textAlign: "right" }}>
          <Button
            design="Emphasized"
            icon="add"
            style={{
              backgroundColor: "#27ae60",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Guardar
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}
