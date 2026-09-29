import { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { getQueue, setItemStatus } from '../../../db/kitchenQueries';
import { COLORS } from '../../constants/colors';
import { S } from '../../constants/styles';

const NEXT = { pending: 'cooking', cooking: 'served' };
const LABEL = { pending: 'รอทำ', cooking: 'กำลังทำ' };
const COLOR = { pending: COLORS.amber, cooking: COLORS.cyan };

export default function KitchenQueueScreen() {
  const db = useSQLiteContext();
  const [rows, setRows] = useState([]);
  const load = useCallback(() => getQueue(db).then(setRows), [db]);
  useEffect(() => { load(); const t = setInterval(load, 3000); return () => clearInterval(t); }, [load]);

  const advance = async (r) => { await setItemStatus(db, r.id, NEXT[r.status]); load(); };

  return (
    <View style={S.screen}>
      <Text style={S.title}>คิวครัว</Text>
      <FlatList data={rows} keyExtractor={(r) => String(r.id)}
        ListEmptyComponent={<Text style={S.dim}>ไม่มีรายการค้าง</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={[S.card, S.row, { borderColor: COLOR[item.status] }]} onPress={() => advance(item)}>
            <View style={{ flex: 1 }}>
              <Text style={S.txt}>{item.item_name} × {item.qty}</Text>
              <Text style={S.dim}>โต๊ะ {item.table_label} · รอบที่ {item.round_no}{item.note ? ` · ${item.note}` : ''}</Text>
            </View>
            <Text style={{ color: COLOR[item.status], fontWeight: '700' }}>{LABEL[item.status]} ›</Text>
          </TouchableOpacity>
        )} />
    </View>
  );
}
