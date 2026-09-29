import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, ScrollView, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { getCategories, getMenu } from '../../../db/menuQueries';
import { submitRound } from '../../../db/orderQueries';
import { baht } from '../../utils/money';
import { COLORS } from '../../constants/colors';
import { S } from '../../constants/styles';

export default function MenuScreen({ billId, tableLabel, onBill, onBack }) {
  const db = useSQLiteContext();
  const [cats, setCats] = useState([]);
  const [cat, setCat] = useState(null);
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({}); // menuItemId -> { name, price, qty, note }

  useEffect(() => { getCategories(db).then((c) => { setCats(c); setCat(c[0]?.id ?? null); }); }, [db]);
  useEffect(() => {
    getMenu(db, { categoryId: q ? null : cat, search: q }).then(setItems);
  }, [db, cat, q]);

  const change = (item, d) => setCart((prev) => {
    const qty = (prev[item.id]?.qty ?? 0) + d;
    const next = { ...prev };
    if (qty <= 0) delete next[item.id];
    else next[item.id] = { ...prev[item.id], name: item.name, price: item.price_satang, qty };
    return next;
  });
  const setNote = (id, note) => setCart((p) => ({ ...p, [id]: { ...p[id], note } }));

  const lines = Object.entries(cart);
  const confirm = async () => {
    try {
      await submitRound(db, billId, lines.map(([id, v]) => ({ menuItemId: Number(id), qty: v.qty, note: v.note })));
      setCart({});
      Alert.alert('ส่งเข้าครัวแล้ว', 'สั่งเพิ่มได้อีกในบิลเดียวกัน');
    } catch (e) {
      console.warn('submitRound ล้มเหลว', e);
      Alert.alert('ส่งออร์เดอร์ไม่สำเร็จ', 'กรุณาลองใหม่');
    }
  };

  return (
    <View style={S.screen}>
      <View style={S.row}>
        <TouchableOpacity onPress={onBack}><Text style={{ color: COLORS.cyan }}>‹ เปลี่ยนโต๊ะ</Text></TouchableOpacity>
        <Text style={S.title}>โต๊ะ {tableLabel}</Text>
        <TouchableOpacity onPress={onBill}><Text style={{ color: COLORS.cyan }}>ดูบิล ›</Text></TouchableOpacity>
      </View>
      <TextInput style={S.input} value={q} onChangeText={setQ} placeholder="ค้นหาเมนู" placeholderTextColor={COLORS.textDim} />
      <View style={{ height: 44 }}><ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cats.map((c) => (
          <TouchableOpacity key={c.id} onPress={() => { setQ(''); setCat(c.id); }}
            style={[S.card, { marginRight: 6, marginTop: 6, paddingVertical: 6, borderColor: c.id === cat && !q ? COLORS.cyan : COLORS.border }]}>
            <Text style={S.txt}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView></View>
      <FlatList data={items} keyExtractor={(i) => String(i.id)} style={{ marginTop: 8 }}
        renderItem={({ item }) => (
          <View style={[S.card, S.row]}>
            <View style={{ flex: 1 }}><Text style={S.txt}>{item.name}</Text><Text style={S.dim}>{baht(item.price_satang)}</Text></View>
            <TouchableOpacity onPress={() => change(item, -1)}><Text style={[S.txt, { fontSize: 26 }]}>−</Text></TouchableOpacity>
            <Text style={[S.txt, { width: 24, textAlign: 'center' }]}>{cart[item.id]?.qty ?? 0}</Text>
            <TouchableOpacity onPress={() => change(item, 1)}><Text style={[S.txt, { fontSize: 26, color: COLORS.green }]}>+</Text></TouchableOpacity>
          </View>
        )} />
      {lines.length > 0 && (
        <View style={{ maxHeight: 230, paddingBottom: 12 }}>
          <ScrollView>
            {lines.map(([id, v]) => (
              <View key={id} style={S.card}>
                <Text style={S.txt}>{v.name} × {v.qty}</Text>
                <TextInput style={[S.input, { marginTop: 4, paddingVertical: 6 }]} value={v.note ?? ''}
                  onChangeText={(t) => setNote(id, t)} placeholder="หมายเหตุ เช่น ไม่ใส่ผักชี" placeholderTextColor={COLORS.textDim} />
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={S.btn} onPress={confirm}>
            <Text style={S.btnTxt}>ยืนยันส่งเข้าครัว ({lines.reduce((s, [, v]) => s + v.qty, 0)} รายการ)</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
