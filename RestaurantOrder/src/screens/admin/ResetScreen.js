import { View, Text, TouchableOpacity, Alert, Switch } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { resetSales } from '../../../db/reset';
import { useTheme } from '../../contexts/ThemeContext';

export default function ResetScreen() {
  const db = useSQLiteContext();
  const { isDark, setIsDark, colors: COLORS, styles: S } = useTheme();
  const reset = () => Alert.alert('ล้างข้อมูลการขาย', 'ลบบิลและออร์เดอร์ทั้งหมด (เมนูและโต๊ะยังอยู่) กู้คืนไม่ได้', [
    { text: 'ยกเลิก', style: 'cancel' },
    { text: 'ล้าง', style: 'destructive', onPress: async () => {
      try { await resetSales(db); Alert.alert('ล้างข้อมูลเรียบร้อย'); }
      catch (e) { console.warn('resetSales ล้มเหลว', e); Alert.alert('ล้างข้อมูลไม่สำเร็จ'); }
    } },
  ]);
  return (
    <View style={S.screen}>
      <Text style={S.title}>ตั้งค่า</Text>
      <View style={[S.card, S.row]}>
        <Text style={S.txt}>โหมดมืด</Text>
        <Switch
          value={isDark}
          onValueChange={setIsDark}
          trackColor={{ false: COLORS.border, true: COLORS.cyan }}
          thumbColor={COLORS.card}
        />
      </View>
      <TouchableOpacity style={[S.btn, { backgroundColor: COLORS.red }]} onPress={reset}>
        <Text style={S.btnTxt}>ล้างข้อมูลการขายทั้งหมด</Text>
      </TouchableOpacity>
    </View>
  );
}
