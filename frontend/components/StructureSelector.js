import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

export default function StructureSelector({ structures, onSelect }) {
  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel>Seleziona Struttura</InputLabel>
      <Select onChange={(e) => onSelect(structures.find(s => s.id === Number(e.target.value)))} defaultValue="">
        {structures.map((structure) => (
          <MenuItem key={structure.id} value={structure.id}>{structure.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
