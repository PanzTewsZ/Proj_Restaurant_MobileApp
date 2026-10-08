import { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { getBillLines, getBillTotal, closeBill } from '../../../db/billQueries';
import { cancelItem } from '../../../db/orderQueries';
import { baht } from '../../utils/money';
import { useTheme } from '../../contexts/ThemeContext';

export default function BillSummaryScreen({ billId, tableLabel, onBack, onClosed, readOnly = false }) {
  const db = useSQLiteContext();
  const { colors: COLORS, styles: S } = useTheme();
  const [lines, setLines] = useState([]);
  const [total, setTotal] = useState(0);
  const load = useCallback(async () => {
    setLines(await getBillLines(db, billId));
    setTotal(await getBillTotal(db, billId));
  }, [db, billId]);
  useEffect(() => { load(); }, [load]);

  const close = () => Alert.alert('ปิดบิล', `ยอดรวม ${baht(total)}`, [
    { text: 'ยกเลิก', style: 'cancel' },
    { text: 'ปิดบิล', onPress: async () => { await closeBill(db, billId); onClosed(); } },
  ]);
  const cancel = async (id) => { await cancelItem(db, id); load(); };

  let lastRound = null;
  return (
    <View style={S.screen}>
      <View style={S.row}>
        <TouchableOpacity onPress={onBack}>
          <Text style={{ color: COLORS.cyan }}>{readOnly ? '‹ กลับไปประวัติบิล' : '‹ กลับไปสั่ง'}</Text>
        </TouchableOpacity>
        <Text style={S.title}>บิลโต๊ะ {tableLabel}</Text><View style={{ width: 60 }} />
      </View>
      <ScrollView>
        {lines.map((l) => {
          const header = l.round_no !== lastRound; lastRound = l.round_no;
          const gone = l.status === 'cancelled';
          return (
            <View key={l.id}>
              {header && <Text style={[S.dim, { marginTop: 8 }]}>รอบที่ {l.round_no}</Text>}
              <View style={[S.card, S.row]}>
                <View style={{ flex: 1 }}>
                  <Text style={[S.txt, gone && { textDecorationLine: 'line-through', color: COLORS.textDim }]}>{l.item_name}</Text>
                  <Text style={S.dim}>{l.qty} × {baht(l.unit_price_satang)}{l.note ? ` · ${l.note}` : ''} · {l.status}</Text>
                </View>
                <Text style={S.txt}>{baht(l.line_total_satang)}</Text>
                {!readOnly && l.status === 'pending' && (
                  <TouchableOpacity onPress={() => cancel(l.id)}><Text style={{ color: COLORS.red }}>ยกเลิก</Text></TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={[S.row, { paddingVertical: 12 }]}>
        <Text style={[S.title, { color: COLORS.green }]}>รวม {baht(total)}</Text>
        {!readOnly && (
          <TouchableOpacity style={S.btn} onPress={close}>
            <Text style={S.btnTxt}>ปิดบิล</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
