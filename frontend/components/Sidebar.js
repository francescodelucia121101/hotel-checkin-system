import { Drawer, List, ListItem, ListItemText } from "@mui/material";

export default function Sidebar({ setTab }) {
  return (
    <Drawer variant="permanent" sx={{ width: 250, flexShrink: 0 }}>
      <List>
        <ListItem button onClick={() => setTab(0)}>
          <ListItemText primary="Gestione Struttura" />
        </ListItem>
        <ListItem button onClick={() => setTab(1)}>
          <ListItemText primary="Gestione Camere" />
        </ListItem>
        <ListItem button onClick={() => setTab(2)}>
          <ListItemText primary="Gestione Porte" />
        </ListItem>
        <ListItem button onClick={() => setTab(3)}>
          <ListItemText primary="Integrazioni API" />
        </ListItem>
      </List>
    </Drawer>
  );
}
