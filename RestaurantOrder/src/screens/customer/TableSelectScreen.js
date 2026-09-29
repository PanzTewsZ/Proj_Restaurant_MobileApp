import { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { getTablesWithStatus } from '../../../db/tableQueries';
import { openOrGetBill } from '../../../db/billQueries';
import { COLORS } from '../../constants/colors';
import { S } from '../../constants/styles';

export default function TableSelectScreen({ onSelect }) {
  const db = useSQLiteContext();
  const [tables, setTables] = useState([]);
  useEffect(() => { getTablesWithStatus(db).then(setTables); }, [db]);

  const pick = useCallback(async (t) => {
    const billId = await openOrGetBill(db, t.id);
    onSelect({ billId, tableLabel: t.label });
  }, [db, onSelect]);

  return (
    <View style={S.screen}>
      <Text style={S.title}>เลือกโต๊ะ</Text>
      <FlatList data={tables} numColumns={3} keyExtractor={(t) => String(t.id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={[S.card, { flex: 1, margin: 4, alignItems: 'center',
            borderColor: item.open_bill_id ? COLORS.amber : COLORS.border }]} onPress={() => pick(item)}>
            <Text style={S.txt}>โต๊ะ {item.label}</Text>
            <Text style={S.dim}>{item.open_bill_id ? 'มีบิลค้าง' : 'ว่าง'}</Text>
          </TouchableOpacity>
        )} />
    </View>
  );
}
