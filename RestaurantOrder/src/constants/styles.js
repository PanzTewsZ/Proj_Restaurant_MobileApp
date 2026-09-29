import { StyleSheet } from 'react-native';
import { COLORS } from './colors';
export const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 16 },
  title: { color: COLORS.text, fontSize: 24, fontWeight: '800', marginVertical: 10 },
  card: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, marginBottom: 8 },
  txt: { color: COLORS.text, fontSize: 16 },
  dim: { color: COLORS.textDim, fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  btn: { backgroundColor: COLORS.cyan, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, alignItems: 'center' },
  btnTxt: { color: '#0D1117', fontSize: 16, fontWeight: '700' },
  input: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 10, color: COLORS.text },
});
