import { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { getClosedBills } from '../../../db/billQueries';
import { baht } from '../../utils/money';
import { useTheme } from '../../contexts/ThemeContext';
import BillSummaryScreen from '../customer/BillSummaryScreen';

export default function BillHistoryScreen() {
  const db = useSQLiteContext();
  const { colors: COLORS, styles: S } = useTheme();
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  const load = useCallback(async () => {
    try {
      setBills(await getClosedBills(db));
    } catch (error) {
      console.warn('โหลดประวัติบิลล้มเหลว', error);
      Alert.alert('โหลดประวัติบิลไม่สำเร็จ', 'กรุณาลองใหม่');
    }
  }, [db]);

  useEffect(() => {
    load();
  }, [load]);

  if (selectedBill) {
    return (
      <BillSummaryScreen
        billId={selectedBill.id}
        tableLabel={selectedBill.table_label}
        readOnly
        onBack={() => setSelectedBill(null)}
      />
    );
  }

  return (
    <View style={S.screen}>
      <Text style={S.title}>ประวัติบิล</Text>
      <FlatList
        data={bills}
        keyExtractor={(bill) => String(bill.id)}
        ListEmptyComponent={<Text style={S.dim}>ยังไม่มีบิลที่ปิดแล้ว</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[S.card, S.row]}
            onPress={() => setSelectedBill(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={S.txt}>โต๊ะ {item.table_label} · บิล #{item.id}</Text>
              <Text style={S.dim}>
                ปิดเมื่อ {new Date(item.closed_at).toLocaleString('th-TH')}
              </Text>
            </View>
            <Text style={[S.txt, { color: COLORS.green }]}>{baht(item.total)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
