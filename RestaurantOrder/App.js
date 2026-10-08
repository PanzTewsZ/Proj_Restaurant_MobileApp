import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { DB_NAME, initDatabase } from './db';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { TOP_INSET } from './src/constants/layout';
import TableSelectScreen from './src/screens/customer/TableSelectScreen';
import MenuScreen from './src/screens/customer/MenuScreen';
import BillSummaryScreen from './src/screens/customer/BillSummaryScreen';
import KitchenQueueScreen from './src/screens/kitchen/KitchenQueueScreen';
import ResetScreen from './src/screens/admin/ResetScreen';
import { registerRootComponent } from 'expo';

const TABS = [['customer', 'ลูกค้า'], ['kitchen', 'ครัว'], ['admin', 'ตั้งค่า']];

function Root() {
  const { colors: COLORS } = useTheme();
  const [tab, setTab] = useState('customer');
  const [bill, setBill] = useState(null);      // { billId, tableLabel }
  const [showBill, setShowBill] = useState(false);

  let body;
  if (tab === 'kitchen') body = <KitchenQueueScreen />;
  else if (tab === 'admin') body = <ResetScreen />;
  else if (!bill) body = <TableSelectScreen onSelect={(b) => { setBill(b); setShowBill(false); }} />;
  else if (showBill) body = <BillSummaryScreen {...bill} onBack={() => setShowBill(false)} onClosed={() => { setBill(null); setShowBill(false); }} />;
  else body = <MenuScreen {...bill} onBill={() => setShowBill(true)} onBack={() => setBill(null)} />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, paddingTop: TOP_INSET }}>
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8 }}>
        {TABS.map(([k, label]) => (
          <TouchableOpacity key={k} onPress={() => setTab(k)}
            style={{ flex: 1, padding: 8, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: tab === k ? COLORS.cyan : COLORS.border }}>
            <Text style={{ color: tab === k ? COLORS.cyan : COLORS.textDim, fontWeight: '700' }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {body}
    </View>
  );
}

function AppContent() {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Root />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SQLiteProvider databaseName={DB_NAME} onInit={initDatabase}>
        <AppContent />
      </SQLiteProvider>
    </ThemeProvider>
  );
}
registerRootComponent(App);